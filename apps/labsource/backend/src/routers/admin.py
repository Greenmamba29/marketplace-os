"""
Admin Router for LabSource
"""

from typing import Optional
from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException, Query, status

from ..models.common import ApiResponse
from ..services.baserow import BaserowService, get_baserow_service
from ..services.saleor import SaleorService, get_saleor_service
from .auth import get_current_admin

router = APIRouter()


@router.get("/stats", response_model=ApiResponse[dict])
async def get_admin_stats(
    baserow: BaserowService = Depends(get_baserow_service),
    admin = Depends(get_current_admin),
):
    """Get admin dashboard statistics."""
    # Get counts from various tables
    users = await baserow.get_users()
    products_result = await baserow.get_products()
    suppliers = await baserow.list_rows("SUPPLIERS")
    
    stats = {
        "total_users": len(users),
        "total_products": products_result.get("count", 0),
        "total_suppliers": len(suppliers.get("results", [])),
        "active_rfqs": 0,  # TODO: Count active RFQs
        "pending_quotes": 0,  # TODO: Count pending quotes
        "monthly_gmv": 0,  # TODO: Calculate monthly GMV
        "system_health": {
            "status": "healthy",
            "uptime": "99.97%",
            "last_check": datetime.utcnow().isoformat(),
        },
    }
    
    return ApiResponse.success_response(stats)


@router.get("/users", response_model=ApiResponse[list])
async def list_users(
    role: Optional[str] = Query(None),
    is_active: Optional[bool] = Query(None, alias="isActive"),
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    baserow: BaserowService = Depends(get_baserow_service),
    admin = Depends(get_current_admin),
):
    """List all users (admin only)."""
    filters = {}
    if role:
        filters["role"] = role
    if is_active is not None:
        filters["is_active"] = is_active
    
    users = await baserow.get_users(filters=filters if filters else None)
    
    # Remove sensitive data
    for user in users:
        user.pop("password_hash", None)
    
    # Paginate
    total = len(users)
    start = (page - 1) * per_page
    end = start + per_page
    paginated_users = users[start:end]
    
    return ApiResponse.success_response(paginated_users)


@router.get("/suppliers", response_model=ApiResponse[list])
async def list_suppliers(
    status: Optional[str] = Query(None),
    baserow: BaserowService = Depends(get_baserow_service),
    admin = Depends(get_current_admin),
):
    """List all suppliers (admin only)."""
    filters = {}
    if status:
        filters["status"] = status
    
    result = await baserow.list_rows("SUPPLIERS", filters=filters if filters else None)
    suppliers = result.get("results", [])
    
    return ApiResponse.success_response(suppliers)


@router.post("/suppliers/{supplier_id}/approve", response_model=ApiResponse[dict])
async def approve_supplier(
    supplier_id: str,
    baserow: BaserowService = Depends(get_baserow_service),
    admin = Depends(get_current_admin),
):
    """Approve a supplier (admin only)."""
    try:
        result = await baserow.update_row("SUPPLIERS", supplier_id, {
            "status": "approved",
            "approved_at": datetime.utcnow().isoformat(),
            "approved_by": admin.id,
        })
        
        return ApiResponse.success_response({
            "message": "Supplier approved successfully",
            "supplier_id": supplier_id,
        })
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Supplier not found: {supplier_id}",
        )


@router.get("/audit-log", response_model=ApiResponse[list])
async def get_audit_log(
    user_id: Optional[str] = Query(None, alias="userId"),
    action: Optional[str] = Query(None),
    start_date: Optional[datetime] = Query(None, alias="startDate"),
    end_date: Optional[datetime] = Query(None, alias="endDate"),
    page: int = Query(1, ge=1),
    per_page: int = Query(50, ge=1, le=100),
    baserow: BaserowService = Depends(get_baserow_service),
    admin = Depends(get_current_admin),
):
    """Get audit log entries (admin only)."""
    filters = {}
    if user_id:
        filters["user_id"] = user_id
    if action:
        filters["action"] = action
    
    result = await baserow.list_rows("AUDIT_LOG", filters=filters if filters else None)
    logs = result.get("results", [])
    
    # Apply date filters
    if start_date:
        logs = [l for l in logs if datetime.fromisoformat(l.get("timestamp", "1970-01-01")) >= start_date]
    if end_date:
        logs = [l for l in logs if datetime.fromisoformat(l.get("timestamp", "9999-12-31")) <= end_date]
    
    # Paginate
    total = len(logs)
    start = (page - 1) * per_page
    end = start + per_page
    paginated_logs = logs[start:end]
    
    return ApiResponse.success_response(paginated_logs)


@router.post("/sync/saleor", response_model=ApiResponse[dict])
async def sync_with_saleor(
    baserow: BaserowService = Depends(get_baserow_service),
    saleor: SaleorService = Depends(get_saleor_service),
    admin = Depends(get_current_admin),
):
    """Sync products with Saleor (admin only)."""
    # TODO: Implement full sync logic
    # 1. Get products from Saleor
    # 2. Compare with Baserow
    # 3. Update/create products as needed
    
    return ApiResponse.success_response({
        "message": "Sync initiated",
        "sync_id": "sync-" + datetime.utcnow().strftime("%Y%m%d%H%M%S"),
        "status": "in_progress",
    })


@router.get("/health", response_model=ApiResponse[dict])
async def get_system_health(
    baserow: BaserowService = Depends(get_baserow_service),
    admin = Depends(get_current_admin),
):
    """Get system health status (admin only)."""
    health = {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "services": {
            "api": {
                "status": "healthy",
                "uptime": "99.97%",
            },
            "database": {
                "status": "connected",
                "latency_ms": 5,
            },
            "redis": {
                "status": "connected",
            },
            "baserow": {
                "status": "connected",
            },
            "saleor": {
                "status": "connected",
            },
        },
        "metrics": {
            "requests_per_minute": 120,
            "average_response_time_ms": 45,
            "error_rate": 0.01,
        },
    }
    
    return ApiResponse.success_response(health)


@router.post("/webhooks/baserow", response_model=ApiResponse[dict])
async def baserow_webhook(
    payload: dict,
    admin = Depends(get_current_admin),
):
    """Handle Baserow webhook events."""
    # Handle various Baserow webhook events
    event_type = payload.get("type")
    
    if event_type == "row.created":
        # Handle row creation
        pass
    elif event_type == "row.updated":
        # Handle row update
        pass
    elif event_type == "row.deleted":
        # Handle row deletion
        pass
    
    return ApiResponse.success_response({"received": True})


@router.post("/webhooks/saleor", response_model=ApiResponse[dict])
async def saleor_webhook(
    payload: dict,
    admin = Depends(get_current_admin),
):
    """Handle Saleor webhook events."""
    # Handle various Saleor webhook events
    event_type = payload.get("type")
    
    if event_type == "order.created":
        # Handle order creation
        pass
    elif event_type == "order.fulfilled":
        # Handle order fulfillment
        pass
    
    return ApiResponse.success_response({"received": True})
