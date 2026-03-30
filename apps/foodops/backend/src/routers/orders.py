"""Orders router."""

from datetime import datetime, timedelta
from typing import List, Optional
from fastapi import APIRouter, Depends, Query, HTTPException, status

from ..models.orders import Order, OrderCreate, OrderUpdate, OrderItem
from ..models.common import ApiResponse, PaginatedResponse
from ..routers.auth import get_current_active_user
from ..models.auth import User


router = APIRouter()


# Mock orders
MOCK_ORDERS = [
    Order(
        id="1",
        order_number="ORD-2024-001",
        buyer_id="user-1",
        buyer_name="Executive Chef",
        supplier_id="sup-1",
        supplier_name="Premium Poultry Farms",
        quote_id="1",
        items=[
            OrderItem(
                id="oitem-1",
                ingredient_id="1",
                ingredient_name="Organic Chicken Breast",
                quantity=50,
                unit_of_measure="lb",
                unit_price=8.50,
                line_total=425.00,
                quantity_shipped=50,
                quantity_received=50,
            ),
        ],
        subtotal=425.00,
        tax_amount=35.06,
        shipping_cost=25.00,
        total=485.06,
        delivery_date=datetime.utcnow() - timedelta(days=2),
        delivery_window_earliest="08:00",
        delivery_window_latest="12:00",
        delivery_address={
            "name": "Gourmet Bistro",
            "line1": "123 Main St",
            "city": "New York",
            "state": "NY",
            "postal_code": "10001",
            "country": "USA",
        },
        status="delivered",
        fulfillment_status="delivered",
        payment_status="paid",
        created_at=datetime.utcnow() - timedelta(days=5),
        updated_at=datetime.utcnow() - timedelta(days=2),
    ),
    Order(
        id="2",
        order_number="ORD-2024-002",
        buyer_id="user-1",
        buyer_name="Executive Chef",
        supplier_id="sup-2",
        supplier_name="Ocean Fresh Seafood",
        rfq_id="1",
        items=[
            OrderItem(
                id="oitem-2",
                ingredient_id="2",
                ingredient_name="Atlantic Salmon Fillet",
                quantity=25,
                unit_of_measure="lb",
                unit_price=16.99,
                line_total=424.75,
                quantity_shipped=25,
                quantity_received=0,
            ),
        ],
        subtotal=424.75,
        tax_amount=34.03,
        shipping_cost=30.00,
        total=488.78,
        delivery_date=datetime.utcnow() + timedelta(days=1),
        delivery_window_earliest="10:00",
        delivery_window_latest="14:00",
        delivery_address={
            "name": "Gourmet Bistro",
            "line1": "123 Main St",
            "city": "New York",
            "state": "NY",
            "postal_code": "10001",
            "country": "USA",
        },
        status="shipped",
        fulfillment_status="in_transit",
        payment_status="invoiced",
        created_at=datetime.utcnow() - timedelta(days=3),
        updated_at=datetime.utcnow() - timedelta(days=1),
    ),
]


@router.get("", response_model=ApiResponse[PaginatedResponse[Order]])
async def list_orders(
    status: Optional[str] = Query(None),
    fulfillment_status: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_active_user),
):
    """List all orders for the current user."""
    filtered = MOCK_ORDERS.copy()
    
    if status:
        filtered = [o for o in filtered if o.status == status]
    
    if fulfillment_status:
        filtered = [o for o in filtered if o.fulfillment_status == fulfillment_status]
    
    total = len(filtered)
    start = (page - 1) * limit
    end = start + limit
    paginated = filtered[start:end]
    
    return ApiResponse(
        success=True,
        data=PaginatedResponse(
            data=paginated,
            pagination={
                "page": page,
                "limit": limit,
                "total": total,
                "total_pages": (total + limit - 1) // limit,
                "has_next": end < total,
                "has_prev": page > 1,
            },
        ),
        meta={"timestamp": datetime.utcnow().isoformat(), "request_id": "req-1"},
    )


@router.get("/{order_id}", response_model=ApiResponse[Order])
async def get_order(
    order_id: str,
    current_user: User = Depends(get_current_active_user),
):
    """Get a single order by ID."""
    order = next((o for o in MOCK_ORDERS if o.id == order_id), None)
    
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found",
        )
    
    return ApiResponse(
        success=True,
        data=order,
        meta={"timestamp": datetime.utcnow().isoformat(), "request_id": "req-1"},
    )


@router.post("", response_model=ApiResponse[Order])
async def create_order(
    order_data: OrderCreate,
    current_user: User = Depends(get_current_active_user),
):
    """Create a new order from a quote."""
    order_number = f"ORD-{datetime.utcnow().strftime('%Y%m%d')}-{len(MOCK_ORDERS) + 1:03d}"
    
    # Calculate totals
    subtotal = sum(item.unit_price * item.quantity for item in order_data.items)
    tax_amount = subtotal * 0.0825  # 8.25% tax
    shipping_cost = 25.00
    total = subtotal + tax_amount + shipping_cost
    
    order = Order(
        id=f"order-{datetime.utcnow().timestamp()}",
        order_number=order_number,
        buyer_id=current_user.id,
        buyer_name=current_user.name,
        supplier_id="sup-1",  # Would come from quote
        supplier_name="Test Supplier",
        items=[OrderItem(id=f"oitem-{i}", quantity_shipped=0, quantity_received=0, **item.model_dump()) for i, item in enumerate(order_data.items)],
        subtotal=subtotal,
        tax_amount=tax_amount,
        shipping_cost=shipping_cost,
        total=total,
        status="pending",
        fulfillment_status="pending",
        payment_status="pending",
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
        **order_data.model_dump(exclude={"items"}),
    )
    
    MOCK_ORDERS.append(order)
    
    return ApiResponse(
        success=True,
        data=order,
        meta={"timestamp": datetime.utcnow().isoformat(), "request_id": "req-1"},
    )


@router.patch("/{order_id}", response_model=ApiResponse[Order])
async def update_order(
    order_id: str,
    order_data: OrderUpdate,
    current_user: User = Depends(get_current_active_user),
):
    """Update an order status."""
    order = next((o for o in MOCK_ORDERS if o.id == order_id), None)
    
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found",
        )
    
    update_data = order_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(order, field, value)
    
    order.updated_at = datetime.utcnow()
    
    return ApiResponse(
        success=True,
        data=order,
        meta={"timestamp": datetime.utcnow().isoformat(), "request_id": "req-1"},
    )


@router.post("/{order_id}/confirm", response_model=ApiResponse[Order])
async def confirm_order(
    order_id: str,
    current_user: User = Depends(get_current_active_user),
):
    """Confirm an order."""
    order = next((o for o in MOCK_ORDERS if o.id == order_id), None)
    
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found",
        )
    
    if order.status != "pending":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only pending orders can be confirmed",
        )
    
    order.status = "confirmed"
    order.updated_at = datetime.utcnow()
    
    return ApiResponse(
        success=True,
        data=order,
        meta={"timestamp": datetime.utcnow().isoformat(), "request_id": "req-1"},
    )


@router.post("/{order_id}/receive", response_model=ApiResponse[Order])
async def receive_order(
    order_id: str,
    received_items: List[dict],
    current_user: User = Depends(get_current_active_user),
):
    """Mark items as received."""
    order = next((o for o in MOCK_ORDERS if o.id == order_id), None)
    
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found",
        )
    
    # Update received quantities
    for item_data in received_items:
        item = next((i for i in order.items if i.id == item_data["item_id"]), None)
        if item:
            item.quantity_received = item_data["quantity_received"]
    
    # Check if all items received
    all_received = all(i.quantity_received >= i.quantity_shipped for i in order.items)
    if all_received:
        order.status = "delivered"
        order.fulfillment_status = "delivered"
    
    order.updated_at = datetime.utcnow()
    
    return ApiResponse(
        success=True,
        data=order,
        meta={"timestamp": datetime.utcnow().isoformat(), "request_id": "req-1"},
    )


@router.post("/{order_id}/cancel", response_model=ApiResponse[Order])
async def cancel_order(
    order_id: str,
    current_user: User = Depends(get_current_active_user),
):
    """Cancel an order."""
    order = next((o for o in MOCK_ORDERS if o.id == order_id), None)
    
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found",
        )
    
    if order.status in ["delivered", "cancelled"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot cancel delivered or already cancelled orders",
        )
    
    order.status = "cancelled"
    order.updated_at = datetime.utcnow()
    
    return ApiResponse(
        success=True,
        data=order,
        meta={"timestamp": datetime.utcnow().isoformat(), "request_id": "req-1"},
    )
