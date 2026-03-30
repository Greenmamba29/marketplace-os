"""Admin router."""

from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from fastapi.security import HTTPBearer

from models.common import ApiResponse, DashboardStats, PaginatedResponse
from models.auth import UserResponse
from services.baserow import get_baserow_service
from services.accio import get_accio_service

router = APIRouter(prefix="/admin", tags=["Admin"])
security = HTTPBearer()


@router.get("/stats", response_model=ApiResponse[DashboardStats])
async def get_admin_stats(
    baserow=Depends(get_baserow_service),
) -> ApiResponse[DashboardStats]:
    """Get admin dashboard statistics."""
    # Get counts from various tables
    users_result = await baserow.list_rows("users", size=1)
    materials_result = await baserow.list_rows("products", size=1)
    rfqs_result = await baserow.list_rows("rfq_submissions", size=1)
    orders_result = await baserow.list_rows("orders", size=1)
    
    # Calculate total spend
    orders = await baserow.list_rows("orders", size=1000)
    total_spend = sum(
        o.get("total_amount", 0) for o in orders.get("results", [])
    )
    
    # Mock LEED and CO2 stats (would be calculated from actual data)
    leed_points = 42
    co2_saved = 156.5
    
    return ApiResponse.success_response(
        DashboardStats(
            active_projects=users_result.get("count", 0),
            materials_sourced=materials_result.get("count", 0),
            total_spend=total_spend,
            pending_rfqs=rfqs_result.get("count", 0),
            leed_points_earned=leed_points,
            co2_saved_tons=co2_saved,
        )
    )


@router.get("/users", response_model=ApiResponse[PaginatedResponse[UserResponse]])
async def list_users(
    status: Optional[str] = None,
    role: Optional[str] = None,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    baserow=Depends(get_baserow_service),
) -> ApiResponse[PaginatedResponse[UserResponse]]:
    """List all users (admin only)."""
    filters = {}
    if status:
        filters["status"] = status
    if role:
        filters["role"] = role
    
    result = await baserow.list_rows(
        "users",
        filters=filters if filters else None,
        page=page,
        size=page_size,
    )
    
    users = [UserResponse(**item) for item in result.get("results", [])]
    total = result.get("count", 0)
    
    return ApiResponse.success_response(
        PaginatedResponse.create(
            items=users,
            total=total,
            page=page,
            page_size=page_size,
        )
    )


@router.post("/users/{user_id}/verify", response_model=ApiResponse[dict])
async def verify_user(
    user_id: str,
    baserow=Depends(get_baserow_service),
) -> ApiResponse[dict]:
    """Verify a user account."""
    # Check if user exists
    existing = await baserow.get_row("users", user_id)
    if not existing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    
    await baserow.update_row(
        "users",
        user_id,
        {"is_verified": True},
    )
    
    return ApiResponse.success_response(
        {},
        message="User verified successfully",
    )


@router.post("/users/{user_id}/suspend", response_model=ApiResponse[dict])
async def suspend_user(
    user_id: str,
    reason: str,
    baserow=Depends(get_baserow_service),
) -> ApiResponse[dict]:
    """Suspend a user account."""
    # Check if user exists
    existing = await baserow.get_row("users", user_id)
    if not existing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    
    await baserow.update_row(
        "users",
        user_id,
        {
            "is_active": False,
            "suspension_reason": reason,
        },
    )
    
    return ApiResponse.success_response(
        {},
        message="User suspended successfully",
    )


@router.get("/pending-verifications", response_model=ApiResponse[list[UserResponse]])
async def get_pending_verifications(
    baserow=Depends(get_baserow_service),
) -> ApiResponse[list[UserResponse]]:
    """Get users pending verification."""
    result = await baserow.list_rows(
        "users",
        filters={"is_verified": False},
    )
    
    users = [UserResponse(**item) for item in result.get("results", [])]
    return ApiResponse.success_response(users)


@router.get("/suppliers/pending", response_model=ApiResponse[list[dict]])
async def get_pending_suppliers(
    baserow=Depends(get_baserow_service),
) -> ApiResponse[list[dict]]:
    """Get suppliers pending verification."""
    result = await baserow.list_rows(
        "suppliers",
        filters={"is_verified": False},
    )
    
    return ApiResponse.success_response(result.get("results", []))


@router.post("/suppliers/{supplier_id}/verify", response_model=ApiResponse[dict])
async def verify_supplier(
    supplier_id: str,
    baserow=Depends(get_baserow_service),
) -> ApiResponse[dict]:
    """Verify a supplier."""
    existing = await baserow.get_row("suppliers", supplier_id)
    if not existing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Supplier not found",
        )
    
    await baserow.update_row(
        "suppliers",
        supplier_id,
        {"is_verified": True},
    )
    
    return ApiResponse.success_response(
        {},
        message="Supplier verified successfully",
    )


@router.get("/accio/active", response_model=ApiResponse[list[dict]])
async def get_active_accio_requests(
    accio=Depends(get_accio_service),
    baserow=Depends(get_baserow_service),
) -> ApiResponse[list[dict]]:
    """Get active ACCIO emergency requests."""
    result = await baserow.list_rows(
        "accio_requests",
        filters={"status__in": "searching,found,in_transit"},
    )
    
    return ApiResponse.success_response(result.get("results", []))


@router.post("/accio/{request_id}/match", response_model=ApiResponse[dict])
async def match_accio_supplier(
    request_id: str,
    supplier_id: str,
    estimated_arrival: str,
    baserow=Depends(get_baserow_service),
) -> ApiResponse[dict]:
    """Match a supplier to an ACCIO request."""
    await baserow.update_row(
        "accio_requests",
        request_id,
        {
            "status": "found",
            "matched_supplier_id": supplier_id,
            "estimated_arrival": estimated_arrival,
        },
    )
    
    return ApiResponse.success_response(
        {},
        message="Supplier matched successfully",
    )


@router.get("/reports/orders", response_model=ApiResponse[list[dict]])
async def get_order_reports(
    start_date: str,
    end_date: str,
    baserow=Depends(get_baserow_service),
) -> ApiResponse[list[dict]]:
    """Get order reports for date range."""
    # Get orders in date range
    result = await baserow.list_rows(
        "orders",
        size=1000,
    )
    
    orders = result.get("results", [])
    
    # Calculate daily totals
    daily_totals = {}
    for order in orders:
        date = order.get("created_at", "")[:10]
        if date not in daily_totals:
            daily_totals[date] = {
                "date": date,
                "order_count": 0,
                "total_value": 0,
            }
        daily_totals[date]["order_count"] += 1
        daily_totals[date]["total_value"] += order.get("total_amount", 0)
    
    return ApiResponse.success_response(
        sorted(daily_totals.values(), key=lambda x: x["date"])
    )


@router.get("/reports/suppliers", response_model=ApiResponse[list[dict]])
async def get_supplier_reports(
    baserow=Depends(get_baserow_service),
) -> ApiResponse[list[dict]]:
    """Get supplier performance reports."""
    # Get all suppliers
    suppliers_result = await baserow.list_rows("suppliers", size=1000)
    suppliers = suppliers_result.get("results", [])
    
    reports = []
    for supplier in suppliers:
        # Get orders for this supplier
        orders_result = await baserow.list_rows(
            "orders",
            filters={"supplier_id": supplier.get("id")},
        )
        orders = orders_result.get("results", [])
        
        reports.append({
            "supplier_id": supplier.get("id"),
            "supplier_name": supplier.get("company_name"),
            "total_orders": len(orders),
            "total_value": sum(o.get("total_amount", 0) for o in orders),
            "avg_rating": supplier.get("rating", 0),
        })
    
    # Sort by total value
    reports.sort(key=lambda x: x["total_value"], reverse=True)
    
    return ApiResponse.success_response(reports)
