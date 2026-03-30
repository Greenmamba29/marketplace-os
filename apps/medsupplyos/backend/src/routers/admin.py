"""Admin router."""

from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query

from ..models.auth import User, UserRole, get_current_active_user
from ..services.baserow import BaserowService

router = APIRouter()


async def get_admin_user(current_user: User = Depends(get_current_active_user)) -> User:
    """Verify user is admin."""
    if current_user.role != UserRole.SYSTEM_ADMIN:
        raise HTTPException(
            status_code=403,
            detail="Admin access required",
        )
    return current_user


@router.get("/users", response_model=dict)
async def list_users(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    admin: User = Depends(get_admin_user),
):
    """List all users (admin only)."""
    baserow = BaserowService()
    result = await baserow.list_users(page=page, per_page=per_page)
    
    return {
        "success": True,
        "data": result["data"],
        "meta": {
            "page": page,
            "per_page": per_page,
            "total": result["total"],
        },
    }


@router.post("/users", response_model=dict)
async def create_user(
    user_data: dict,
    admin: User = Depends(get_admin_user),
):
    """Create new user (admin only)."""
    baserow = BaserowService()
    created = await baserow.create_user(user_data)
    
    return {
        "success": True,
        "data": created,
    }


@router.patch("/users/{user_id}", response_model=dict)
async def update_user(
    user_id: str,
    updates: dict,
    admin: User = Depends(get_admin_user),
):
    """Update user (admin only)."""
    baserow = BaserowService()
    updated = await baserow.update_user(user_id, updates)
    
    return {
        "success": True,
        "data": updated,
    }


@router.get("/suppliers", response_model=dict)
async def list_suppliers(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    admin: User = Depends(get_admin_user),
):
    """List all suppliers (admin only)."""
    baserow = BaserowService()
    result = await baserow.list_suppliers(page=page, per_page=per_page)
    
    return {
        "success": True,
        "data": result["data"],
        "meta": {
            "page": page,
            "per_page": per_page,
            "total": result["total"],
        },
    }


@router.post("/suppliers/{supplier_id}/verify", response_model=dict)
async def verify_supplier(
    supplier_id: str,
    admin: User = Depends(get_admin_user),
):
    """Verify a supplier (admin only)."""
    baserow = BaserowService()
    updated = await baserow.update_supplier(supplier_id, {"is_verified": True})
    
    return {
        "success": True,
        "data": updated,
    }


@router.get("/audit-log", response_model=dict)
async def get_audit_log(
    page: int = Query(1, ge=1),
    per_page: int = Query(50, ge=1, le=100),
    entity_type: Optional[str] = None,
    admin: User = Depends(get_admin_user),
):
    """Get audit log (admin only)."""
    baserow = BaserowService()
    
    filters = {}
    if entity_type:
        filters["entity_type"] = entity_type
    
    result = await baserow.get_audit_log(
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
        },
    }


@router.get("/stats", response_model=dict)
async def get_system_stats(
    admin: User = Depends(get_admin_user),
):
    """Get system statistics (admin only)."""
    baserow = BaserowService()
    
    # Get counts
    users_count = await baserow.count_users()
    suppliers_count = await baserow.count_suppliers()
    equipment_count = await baserow.count_equipment()
    orders_count = await baserow.count_orders()
    rfqs_count = await baserow.count_rfqs()
    
    stats = {
        "users": {
            "total": users_count,
            "active": users_count - 5,  # Mock data
            "inactive": 5,
        },
        "suppliers": {
            "total": suppliers_count,
            "verified": suppliers_count - 3,
            "pending": 3,
        },
        "equipment": {
            "total": equipment_count,
            "active": equipment_count,
            "inactive": 0,
        },
        "orders": {
            "total": orders_count,
            "this_month": 45,
            "pending": 12,
        },
        "rfqs": {
            "total": rfqs_count,
            "pending_approval": 8,
            "awarded": 23,
        },
    }
    
    return {
        "success": True,
        "data": stats,
    }
