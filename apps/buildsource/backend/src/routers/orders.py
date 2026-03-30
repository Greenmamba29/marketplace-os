"""Orders router."""

from datetime import datetime
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from fastapi.security import HTTPBearer

from models.orders import (
    Order,
    OrderCreate,
    OrderUpdate,
    OrderResponse,
    TrackingInfo,
    DeliveryScheduleItem,
    OrderIssue,
)
from models.common import ApiResponse, PaginatedResponse
from services.baserow import get_baserow_service
from services.medusa import get_medusa_service

router = APIRouter(prefix="/orders", tags=["Orders"])
security = HTTPBearer()


def generate_order_number() -> str:
    """Generate a unique order number."""
    timestamp = datetime.utcnow().strftime("%Y%m%d")
    return f"ORD-{timestamp}-001"


@router.get("", response_model=ApiResponse[PaginatedResponse[OrderResponse]])
async def list_orders(
    status: Optional[str] = None,
    project_id: Optional[str] = None,
    supplier_id: Optional[str] = None,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    baserow=Depends(get_baserow_service),
) -> ApiResponse[PaginatedResponse[OrderResponse]]:
    """List orders with filters."""
    filters = {}
    if status:
        filters["status"] = status
    if project_id:
        filters["project_id"] = project_id
    if supplier_id:
        filters["supplier_id"] = supplier_id
    
    result = await baserow.list_rows(
        "orders",
        filters=filters if filters else None,
        page=page,
        size=page_size,
    )
    
    orders = [OrderResponse(**item) for item in result.get("results", [])]
    total = result.get("count", 0)
    
    return ApiResponse.success_response(
        PaginatedResponse.create(
            items=orders,
            total=total,
            page=page,
            page_size=page_size,
        )
    )


@router.post("", response_model=ApiResponse[OrderResponse])
async def create_order(
    order: OrderCreate,
    baserow=Depends(get_baserow_service),
    medusa=Depends(get_medusa_service),
) -> ApiResponse[OrderResponse]:
    """Create a new order from a quote."""
    # Get quote details
    quote = await baserow.get_row("quotes", order.quote_id)
    if not quote:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Quote not found",
        )
    
    # Check if quote is accepted
    if quote.get("status") != "accepted":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Quote must be accepted before creating order",
        )
    
    # Get quote items
    items_result = await baserow.list_rows(
        "quote_items",
        filters={"quote_id": order.quote_id},
    )
    items = items_result.get("results", [])
    
    # Get RFQ for project info
    rfq = await baserow.get_row("rfq_submissions", quote.get("rfq_id"))
    
    # Create order
    order_data = {
        "order_number": generate_order_number(),
        "quote_id": order.quote_id,
        "project_id": rfq.get("project_id") if rfq else None,
        "buyer_id": rfq.get("buyer_id") if rfq else None,
        "supplier_id": quote.get("supplier_id"),
        "items": items,
        "subtotal": quote.get("subtotal"),
        "tax_amount": quote.get("tax_amount"),
        "delivery_fee": quote.get("delivery_fee"),
        "total_amount": quote.get("total_price"),
        "delivery_type": "standard",
        "delivery_address": rfq.get("delivery_address") if rfq else {},
        "delivery_date": quote.get("delivery_date"),
        "status": "pending_confirmation",
        "po_number": order.po_number,
        "notes": order.notes,
    }
    
    created = await baserow.create_row("orders", order_data)
    
    # Create order items
    for item in items:
        item["order_id"] = created.get("id")
        item["line_total"] = item.get("quantity", 0) * item.get("unit_price", 0)
        await baserow.create_row("order_items", item)
    
    # Sync with Medusa for fulfillment
    await medusa.create_order(order_data)
    
    return ApiResponse.success_response(
        OrderResponse(**created),
        message="Order created successfully",
    )


@router.get("/{order_id}", response_model=ApiResponse[OrderResponse])
async def get_order(
    order_id: str,
    baserow=Depends(get_baserow_service),
) -> ApiResponse[OrderResponse]:
    """Get a single order by ID."""
    order = await baserow.get_row("orders", order_id)
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found",
        )
    
    # Get order items
    items_result = await baserow.list_rows(
        "order_items",
        filters={"order_id": order_id},
    )
    order["items"] = items_result.get("results", [])
    
    return ApiResponse.success_response(OrderResponse(**order))


@router.patch("/{order_id}", response_model=ApiResponse[OrderResponse])
async def update_order(
    order_id: str,
    update: OrderUpdate,
    baserow=Depends(get_baserow_service),
) -> ApiResponse[OrderResponse]:
    """Update an order."""
    # Check if order exists
    existing = await baserow.get_row("orders", order_id)
    if not existing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found",
        )
    
    updated = await baserow.update_row(
        "orders",
        order_id,
        update.model_dump(exclude_unset=True),
    )
    
    return ApiResponse.success_response(OrderResponse(**updated))


@router.post("/{order_id}/cancel", response_model=ApiResponse[dict])
async def cancel_order(
    order_id: str,
    reason: str,
    baserow=Depends(get_baserow_service),
) -> ApiResponse[dict]:
    """Cancel an order."""
    # Check if order exists
    existing = await baserow.get_row("orders", order_id)
    if not existing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found",
        )
    
    # Can only cancel orders not yet in transit
    if existing.get("status") in ["in_transit", "delivered", "completed"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot cancel order in current status",
        )
    
    await baserow.update_row(
        "orders",
        order_id,
        {
            "status": "cancelled",
            "cancellation_reason": reason,
        },
    )
    
    return ApiResponse.success_response(
        {},
        message="Order cancelled successfully",
    )


@router.get("/{order_id}/tracking", response_model=ApiResponse[TrackingInfo])
async def get_tracking(
    order_id: str,
    baserow=Depends(get_baserow_service),
) -> ApiResponse[TrackingInfo]:
    """Get order tracking information."""
    order = await baserow.get_row("orders", order_id)
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found",
        )
    
    tracking = order.get("tracking_info")
    if not tracking:
        # Return default tracking info
        tracking = {
            "carrier": "TBD",
            "tracking_number": "",
            "estimated_arrival": order.get("delivery_date"),
            "status_updates": [
                {
                    "timestamp": order.get("created_at"),
                    "status": "Order created",
                }
            ],
        }
    
    return ApiResponse.success_response(TrackingInfo(**tracking))


@router.post("/{order_id}/confirm-delivery", response_model=ApiResponse[dict])
async def confirm_delivery(
    order_id: str,
    notes: Optional[str] = None,
    baserow=Depends(get_baserow_service),
) -> ApiResponse[dict]:
    """Confirm order delivery."""
    # Check if order exists
    existing = await baserow.get_row("orders", order_id)
    if not existing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found",
        )
    
    await baserow.update_row(
        "orders",
        order_id,
        {
            "status": "delivered",
            "delivery_confirmation_notes": notes,
        },
    )
    
    return ApiResponse.success_response(
        {},
        message="Delivery confirmed",
    )


@router.post("/{order_id}/issues", response_model=ApiResponse[dict])
async def report_issue(
    order_id: str,
    issue: OrderIssue,
    baserow=Depends(get_baserow_service),
) -> ApiResponse[dict]:
    """Report an issue with an order."""
    # Create issue record
    issue_data = {
        "order_id": order_id,
        "type": issue.type,
        "description": issue.description,
        "severity": issue.severity,
        "status": "open",
        "created_at": datetime.utcnow().isoformat(),
    }
    
    await baserow.create_row("order_issues", issue_data)
    
    # Update order status if critical
    if issue.severity == "critical":
        await baserow.update_row(
            "orders",
            order_id,
            {"status": "disputed"},
        )
    
    return ApiResponse.success_response(
        {},
        message="Issue reported successfully",
    )


@router.get("/{order_id}/documents", response_model=ApiResponse[list])
async def get_documents(
    order_id: str,
    baserow=Depends(get_baserow_service),
) -> ApiResponse[list]:
    """Get order documents."""
    result = await baserow.list_rows(
        "order_documents",
        filters={"order_id": order_id},
    )
    
    return ApiResponse.success_response(result.get("results", []))


@router.get("/schedule", response_model=ApiResponse[list[DeliveryScheduleItem]])
async def get_delivery_schedule(
    project_id: str,
    baserow=Depends(get_baserow_service),
) -> ApiResponse[list[DeliveryScheduleItem]]:
    """Get delivery schedule for a project."""
    # Get orders for project
    result = await baserow.list_rows(
        "orders",
        filters={"project_id": project_id},
    )
    orders = result.get("results", [])
    
    schedule = []
    for order in orders:
        # Get order items
        items_result = await baserow.list_rows(
            "order_items",
            filters={"order_id": order.get("id")},
        )
        items = items_result.get("results", [])
        
        # Get supplier
        supplier = await baserow.get_row("suppliers", order.get("supplier_id"))
        
        schedule.append(DeliveryScheduleItem(
            order_id=order.get("id"),
            order_number=order.get("order_number"),
            delivery_date=order.get("delivery_date"),
            delivery_window=order.get("delivery_window", "9AM-5PM"),
            materials=[i.get("description") for i in items],
            supplier_name=supplier.get("company_name") if supplier else "Unknown",
            status=order.get("status"),
        ))
    
    # Sort by delivery date
    schedule.sort(key=lambda x: x.delivery_date)
    
    return ApiResponse.success_response(schedule)
