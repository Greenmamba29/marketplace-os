"""Orders router."""

from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status

from config import get_settings, OrderStatus
from models.order import Order, OrderSummary, OrderStatusUpdate
from models.common import APIResponse, PaginatedResponse
from models.user import User
from routers.auth import get_current_user, get_baserow_service
from services.baserow import BaserowService, BaserowError

router = APIRouter()


@router.get("", response_model=APIResponse[PaginatedResponse[OrderSummary]])
async def list_orders(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=50),
    status: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    baserow_service: BaserowService = Depends(get_baserow_service),
):
    """List orders for the current user."""
    settings = get_settings()
    
    if not settings.BASEROW_ORDERS_TABLE_ID:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Orders service unavailable",
        )
    
    filters = {"buyer_id": current_user.id}
    if status:
        filters["status"] = status
    
    try:
        result = await baserow_service.list_rows(
            settings.BASEROW_ORDERS_TABLE_ID,
            filters=filters,
            page=page,
            size=page_size,
            order_by="-created_at",
        )
    except BaserowError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch orders: {str(e)}",
        )
    
    orders = [OrderSummary(**item) for item in result.get("results", [])]
    total = result.get("count", 0)
    
    return APIResponse.success_response(
        PaginatedResponse.create(orders, total, page, page_size)
    )


@router.get("/{order_id}", response_model=APIResponse[Order])
async def get_order(
    order_id: str,
    current_user: User = Depends(get_current_user),
    baserow_service: BaserowService = Depends(get_baserow_service),
):
    """Get a specific order."""
    settings = get_settings()
    
    if not settings.BASEROW_ORDERS_TABLE_ID:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Orders service unavailable",
        )
    
    try:
        order_data = await baserow_service.get_row(
            settings.BASEROW_ORDERS_TABLE_ID,
            order_id
        )
    except BaserowError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found",
        )
    
    # Check ownership
    if order_data.get("buyer_id") != current_user.id and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied",
        )
    
    return APIResponse.success_response(Order(**order_data))


@router.patch("/{order_id}/status")
async def update_order_status(
    order_id: str,
    status_update: OrderStatusUpdate,
    current_user: User = Depends(get_current_user),
    baserow_service: BaserowService = Depends(get_baserow_service),
):
    """Update order status (admin/supplier only)."""
    settings = get_settings()
    
    if not settings.BASEROW_ORDERS_TABLE_ID:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Orders service unavailable",
        )
    
    # Get order
    try:
        order = await baserow_service.get_row(
            settings.BASEROW_ORDERS_TABLE_ID,
            order_id
        )
    except BaserowError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found",
        )
    
    # Check permissions (only admin or supplier can update status)
    if current_user.role != "admin" and order.get("supplier_id") != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admin or supplier can update order status",
        )
    
    # Update order
    update_data = {
        "status": status_update.status,
        "updated_at": __import__('datetime').datetime.utcnow().isoformat(),
    }
    
    if status_update.tracking_number:
        update_data["tracking_number"] = status_update.tracking_number
    if status_update.carrier:
        update_data["carrier"] = status_update.carrier
    if status_update.estimated_delivery:
        update_data["estimated_delivery"] = status_update.estimated_delivery
    
    try:
        updated = await baserow_service.update_row(
            settings.BASEROW_ORDERS_TABLE_ID,
            order_id,
            update_data
        )
    except BaserowError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update order: {str(e)}",
        )
    
    return APIResponse.success_response(Order(**updated))


@router.post("/{order_id}/cancel")
async def cancel_order(
    order_id: str,
    current_user: User = Depends(get_current_user),
    baserow_service: BaserowService = Depends(get_baserow_service),
):
    """Cancel an order (buyer only, before shipment)."""
    settings = get_settings()
    
    if not settings.BASEROW_ORDERS_TABLE_ID:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Orders service unavailable",
        )
    
    # Get order
    try:
        order = await baserow_service.get_row(
            settings.BASEROW_ORDERS_TABLE_ID,
            order_id
        )
    except BaserowError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found",
        )
    
    # Check ownership
    if order.get("buyer_id") != current_user.id and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied",
        )
    
    # Check if order can be cancelled
    if order.get("status") in [OrderStatus.SHIPPED, OrderStatus.DELIVERED]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot cancel shipped or delivered orders",
        )
    
    # Cancel order
    try:
        await baserow_service.update_row(
            settings.BASEROW_ORDERS_TABLE_ID,
            order_id,
            {
                "status": OrderStatus.CANCELLED,
                "updated_at": __import__('datetime').datetime.utcnow().isoformat(),
            }
        )
    except BaserowError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to cancel order: {str(e)}",
        )
    
    return APIResponse.success_response({"message": "Order cancelled successfully"})
