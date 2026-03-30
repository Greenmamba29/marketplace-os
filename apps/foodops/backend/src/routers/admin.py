"""Admin router."""

from datetime import datetime, timedelta
from typing import List, Optional
from fastapi import APIRouter, Depends, Query, HTTPException, status

from ..models.auth import User
from ..models.common import ApiResponse, DashboardStats
from ..routers.auth import get_current_active_user, require_permissions


router = APIRouter()


# Mock admin data
MOCK_USERS = [
    User(
        id="1",
        email="admin@foodops.io",
        name="System Administrator",
        role="admin",
        organization_id="org-admin",
        organization_name="FoodOps",
        organization_type="supplier",
        permissions=["admin:users", "admin:settings", "admin:products"],
        is_active=True,
        created_at=datetime.utcnow() - timedelta(days=365),
        updated_at=datetime.utcnow(),
    ),
    User(
        id="2",
        email="chef@restaurant.com",
        name="Executive Chef",
        role="buyer",
        organization_id="org-1",
        organization_name="Gourmet Bistro",
        organization_type="restaurant",
        permissions=["read:ingredients", "write:rfq", "read:orders"],
        is_active=True,
        created_at=datetime.utcnow() - timedelta(days=30),
        updated_at=datetime.utcnow(),
    ),
]

MOCK_PENDING_APPROVALS = [
    {
        "id": "1",
        "name": "Coastal Seafood Co.",
        "type": "supplier",
        "submitted": "2024-01-14",
        "documents": 5,
    },
    {
        "id": "2",
        "name": "Mountain Dairy",
        "type": "supplier",
        "submitted": "2024-01-13",
        "documents": 4,
    },
]


@router.get("/dashboard", response_model=ApiResponse[DashboardStats])
async def get_dashboard_stats(
    current_user: User = Depends(require_permissions(["admin:users"])),
):
    """Get admin dashboard statistics."""
    stats = DashboardStats(
        total_orders=45678,
        pending_orders=23,
        orders_this_week=342,
        orders_change_percent=12.5,
        total_spend=2450000.00,
        spend_this_month=485000.00,
        spend_change_percent=8.3,
        low_stock_items=15,
        expiring_items=8,
        active_excursions=0,
        temperature_compliance=99.7,
        pending_lots=3,
        compliance_score=99.7,
    )
    
    return ApiResponse(
        success=True,
        data=stats,
        meta={"timestamp": datetime.utcnow().isoformat(), "request_id": "req-1"},
    )


@router.get("/users", response_model=ApiResponse[List[User]])
async def list_users(
    search: Optional[str] = Query(None),
    role: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    current_user: User = Depends(require_permissions(["admin:users"])),
):
    """List all users."""
    filtered = MOCK_USERS.copy()
    
    if search:
        search_lower = search.lower()
        filtered = [u for u in filtered if search_lower in u.name.lower() or search_lower in u.email.lower()]
    
    if role:
        filtered = [u for u in filtered if u.role == role]
    
    if status:
        is_active = status == "active"
        filtered = [u for u in filtered if u.is_active == is_active]
    
    return ApiResponse(
        success=True,
        data=filtered,
        meta={"timestamp": datetime.utcnow().isoformat(), "request_id": "req-1"},
    )


@router.get("/users/{user_id}", response_model=ApiResponse[User])
async def get_user(
    user_id: str,
    current_user: User = Depends(require_permissions(["admin:users"])),
):
    """Get a single user by ID."""
    user = next((u for u in MOCK_USERS if u.id == user_id), None)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    
    return ApiResponse(
        success=True,
        data=user,
        meta={"timestamp": datetime.utcnow().isoformat(), "request_id": "req-1"},
    )


@router.patch("/users/{user_id}")
async def update_user(
    user_id: str,
    updates: dict,
    current_user: User = Depends(require_permissions(["admin:users"])),
):
    """Update a user."""
    user = next((u for u in MOCK_USERS if u.id == user_id), None)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    
    # Update fields
    for field, value in updates.items():
        if hasattr(user, field):
            setattr(user, field, value)
    
    user.updated_at = datetime.utcnow()
    
    return ApiResponse(
        success=True,
        data=user,
        meta={"timestamp": datetime.utcnow().isoformat(), "request_id": "req-1"},
    )


@router.delete("/users/{user_id}")
async def delete_user(
    user_id: str,
    current_user: User = Depends(require_permissions(["admin:users"])),
):
    """Delete (deactivate) a user."""
    user = next((u for u in MOCK_USERS if u.id == user_id), None)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    
    # Soft delete - deactivate user
    user.is_active = False
    user.updated_at = datetime.utcnow()
    
    return ApiResponse(
        success=True,
        data={"message": "User deactivated successfully"},
        meta={"timestamp": datetime.utcnow().isoformat(), "request_id": "req-1"},
    )


@router.get("/approvals/pending")
async def get_pending_approvals(
    current_user: User = Depends(require_permissions(["admin:users"])),
):
    """Get pending user approvals."""
    return ApiResponse(
        success=True,
        data=MOCK_PENDING_APPROVALS,
        meta={"timestamp": datetime.utcnow().isoformat(), "request_id": "req-1"},
    )


@router.post("/approvals/{approval_id}/approve")
async def approve_user(
    approval_id: str,
    current_user: User = Depends(require_permissions(["admin:users"])),
):
    """Approve a pending user registration."""
    approval = next((a for a in MOCK_PENDING_APPROVALS if a["id"] == approval_id), None)
    
    if not approval:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Approval request not found",
        )
    
    # Remove from pending
    MOCK_PENDING_APPROVALS.remove(approval)
    
    return ApiResponse(
        success=True,
        data={"message": "User approved successfully"},
        meta={"timestamp": datetime.utcnow().isoformat(), "request_id": "req-1"},
    )


@router.post("/approvals/{approval_id}/reject")
async def reject_user(
    approval_id: str,
    current_user: User = Depends(require_permissions(["admin:users"])),
):
    """Reject a pending user registration."""
    approval = next((a for a in MOCK_PENDING_APPROVALS if a["id"] == approval_id), None)
    
    if not approval:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Approval request not found",
        )
    
    # Remove from pending
    MOCK_PENDING_APPROVALS.remove(approval)
    
    return ApiResponse(
        success=True,
        data={"message": "User rejected"},
        meta={"timestamp": datetime.utcnow().isoformat(), "request_id": "req-1"},
    )


@router.get("/system/health")
async def get_system_health(
    current_user: User = Depends(require_permissions(["admin:settings"])),
):
    """Get system health status."""
    return ApiResponse(
        success=True,
        data={
            "status": "healthy",
            "services": {
                "api": {"status": "operational", "uptime": "99.99%"},
                "database": {"status": "operational", "uptime": "99.98%"},
                "redis": {"status": "operational", "uptime": "100%"},
                "celery": {"status": "operational", "uptime": "99.95%"},
            },
            "metrics": {
                "avg_response_time_ms": 45,
                "requests_per_minute": 1200,
                "error_rate": 0.02,
            },
        },
        meta={"timestamp": datetime.utcnow().isoformat(), "request_id": "req-1"},
    )
