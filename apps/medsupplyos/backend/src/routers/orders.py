"""Orders router."""

from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status

from ..models.auth import User, get_current_active_user
from ..models.orders import Order, OrderCreate, OrderUpdate, ReceiveItemsRequest
from ..services.baserow import BaserowService

router = APIRouter()


@router.get("", response_model=dict)
async def list_orders(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    status: Optional[str] = None,
    current_user: User = Depends(get_current_active_user),
):
    """List orders for current user."""
    baserow = BaserowService()
    
    filters = {}
    if status:
        filters["status"] = status
    
    # Filter by user's organization
    filters["organization_id"] = current_user.organization_id
    
    result = await baserow.list_orders(
        page=page,
        per_page=per_page,
        filters=filters,
    )
    
    return {
        "success": True,
        "data": result["data"],
        "meta": {
            "page": page,
            "per_page": per_page,
            "total": result["total"],
            "total_pages": (result["total"] + per_page - 1) // per_page,
        },
    }


@router.get("/{order_id}", response_model=dict)
async def get_order(
    order_id: str,
    current_user: User = Depends(get_current_active_user),
):
    """Get order by ID."""
    baserow = BaserowService()
    order = await baserow.get_order_by_id(order_id)
    
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found",
        )
    
    # Check authorization
    if order.get("organization_id") != current_user.organization_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view this order",
        )
    
    return {
        "success": True,
        "data": order,
    }


@router.post("/from-quote/{quote_id}", response_model=dict, status_code=status.HTTP_201_CREATED)
async def create_order_from_quote(
    quote_id: str,
    data: Optional[dict] = None,
    current_user: User = Depends(get_current_active_user),
):
    """Create order from accepted quote."""
    baserow = BaserowService()
    
    # Get quote
    quote = await baserow.get_quote_by_id(quote_id)
    if not quote:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Quote not found",
        )
    
    if quote.get("status") != "accepted":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Quote must be accepted before creating order",
        )
    
    # Get RFQ for order details
    rfq = await baserow.get_rfq_by_id(quote.get("rfq_id"))
    
    # Generate order number
    import uuid
    order_number = f"PO-{uuid.uuid4().hex[:8].upper()}"
    
    # Calculate totals
    items = quote.get("items", [])
    subtotal = sum(item.get("total_price", 0) for item in items)
    tax = subtotal * 0.08  # 8% tax
    shipping = 50.00  # Flat shipping
    discount = 0
    total = subtotal + tax + shipping - discount
    
    order_data = {
        "order_number": order_number,
        "po_number": data.get("po_number") if data else order_number,
        "quote_id": quote_id,
        "rfq_id": quote.get("rfq_id"),
        "buyer_id": current_user.id,
        "supplier_id": quote.get("supplier_id"),
        "organization_id": current_user.organization_id,
        "facility_id": rfq.get("facility_id"),
        "department_id": rfq.get("department_id"),
        "status": "pending",
        "items": items,
        "totals": {
            "subtotal": subtotal,
            "tax": tax,
            "shipping": shipping,
            "discount": discount,
            "total": total,
            "currency": "USD",
        },
        "shipping": data.get("shipping", {}) if data else {},
        "tracking": {
            "current_status": "pending",
            "events": [],
        },
        "compliance": {
            "fda_verified": False,
            "udi_recorded": False,
            "lot_tracked": False,
        },
    }
    
    created = await baserow.create_order(order_data)
    
    return {
        "success": True,
        "data": created,
    }


@router.patch("/{order_id}/status", response_model=dict)
async def update_order_status(
    order_id: str,
    data: dict,
    current_user: User = Depends(get_current_active_user),
):
    """Update order status."""
    baserow = BaserowService()
    
    order = await baserow.get_order_by_id(order_id)
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found",
        )
    
    # Check authorization
    if order.get("buyer_id") != current_user.id and current_user.role != "system_admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this order",
        )
    
    new_status = data.get("status")
    update_data = {"status": new_status}
    
    # Add tracking event
    from datetime import datetime
    event = {
        "timestamp": datetime.utcnow().isoformat(),
        "status": new_status,
        "location": data.get("location"),
        "description": data.get("description", f"Status updated to {new_status}"),
    }
    
    # Get existing tracking and append event
    tracking = order.get("tracking", {})
    events = tracking.get("events", [])
    events.append(event)
    tracking["events"] = events
    tracking["current_status"] = new_status
    update_data["tracking"] = tracking
    
    updated = await baserow.update_order(order_id, update_data)
    
    return {
        "success": True,
        "data": updated,
    }


@router.post("/{order_id}/receive", response_model=dict)
async def receive_order_items(
    order_id: str,
    data: ReceiveItemsRequest,
    current_user: User = Depends(get_current_active_user),
):
    """Receive and inspect order items."""
    baserow = BaserowService()
    
    order = await baserow.get_order_by_id(order_id)
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found",
        )
    
    # Check authorization
    if order.get("buyer_id") != current_user.id and current_user.role != "system_admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to receive this order",
        )
    
    # Update items with received quantities
    items = order.get("items", [])
    for received_item in data.items:
        for item in items:
            if item.get("id") == received_item.get("id"):
                item["received_quantity"] = received_item.get("received_quantity")
                item["accepted_quantity"] = received_item.get("accepted_quantity")
                item["rejected_quantity"] = received_item.get("rejected_quantity")
                item["rejection_reason"] = received_item.get("rejection_reason")
    
    # Update order
    update_data = {
        "items": items,
        "status": "received",
    }
    
    # Update compliance
    compliance = order.get("compliance", {})
    compliance["udi_recorded"] = all(
        item.get("udi_numbers") for item in items
    )
    compliance["lot_tracked"] = all(
        item.get("lot_number") for item in items
    )
    update_data["compliance"] = compliance
    
    updated = await baserow.update_order(order_id, update_data)
    
    return {
        "success": True,
        "data": updated,
    }


@router.get("/{order_id}/tracking", response_model=dict)
async def get_order_tracking(
    order_id: str,
    current_user: User = Depends(get_current_active_user),
):
    """Get order tracking information."""
    baserow = BaserowService()
    order = await baserow.get_order_by_id(order_id)
    
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found",
        )
    
    # Check authorization
    if order.get("organization_id") != current_user.organization_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view this order",
        )
    
    return {
        "success": True,
        "data": order.get("tracking", {}),
    }


@router.get("/{order_id}/compliance", response_model=dict)
async def get_order_compliance(
    order_id: str,
    current_user: User = Depends(get_current_active_user),
):
    """Get order compliance information."""
    baserow = BaserowService()
    order = await baserow.get_order_by_id(order_id)
    
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found",
        )
    
    # Check authorization
    if order.get("organization_id") != current_user.organization_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view this order",
        )
    
    return {
        "success": True,
        "data": order.get("compliance", {}),
    }
