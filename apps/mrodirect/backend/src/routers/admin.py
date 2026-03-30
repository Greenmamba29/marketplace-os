"""Admin router."""

from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status

from config import get_settings
from models.user import User, UserUpdate
from models.supplier import Supplier, SupplierCreate, SupplierUpdate
from models.common import APIResponse, PaginatedResponse
from routers.auth import get_current_admin, get_baserow_service
from services.baserow import BaserowService, BaserowError
from services.intelligence import IntelligenceService

router = APIRouter()


def get_intelligence_service() -> IntelligenceService:
    """Get intelligence service instance."""
    return IntelligenceService()


@router.get("/dashboard-stats")
async def get_dashboard_stats(
    current_user: User = Depends(get_current_admin),
    baserow_service: BaserowService = Depends(get_baserow_service),
):
    """Get admin dashboard statistics."""
    settings = get_settings()
    
    stats = {
        "total_users": 0,
        "total_suppliers": 0,
        "total_parts": 0,
        "total_orders": 0,
        "pending_verifications": 0,
        "monthly_gmv": 0,
    }
    
    # Get counts from Baserow
    try:
        if settings.BASEROW_USERS_TABLE_ID:
            result = await baserow_service.list_rows(
                settings.BASEROW_USERS_TABLE_ID,
                size=1,
            )
            stats["total_users"] = result.get("count", 0)
        
        if settings.BASEROW_SUPPLIERS_TABLE_ID:
            result = await baserow_service.list_rows(
                settings.BASEROW_SUPPLIERS_TABLE_ID,
                size=1,
            )
            stats["total_suppliers"] = result.get("count", 0)
            
            # Count pending verifications
            result = await baserow_service.list_rows(
                settings.BASEROW_SUPPLIERS_TABLE_ID,
                filters={"is_verified": "false"},
                size=1,
            )
            stats["pending_verifications"] = result.get("count", 0)
        
        if settings.BASEROW_PARTS_TABLE_ID:
            result = await baserow_service.list_rows(
                settings.BASEROW_PARTS_TABLE_ID,
                size=1,
            )
            stats["total_parts"] = result.get("count", 0)
        
        if settings.BASEROW_ORDERS_TABLE_ID:
            result = await baserow_service.list_rows(
                settings.BASEROW_ORDERS_TABLE_ID,
                size=1,
            )
            stats["total_orders"] = result.get("count", 0)
        
    except BaserowError:
        pass
    
    return APIResponse.success_response(stats)


@router.get("/users", response_model=APIResponse[PaginatedResponse[User]])
async def list_users(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    search: Optional[str] = None,
    current_user: User = Depends(get_current_admin),
    baserow_service: BaserowService = Depends(get_baserow_service),
):
    """List all users (admin only)."""
    settings = get_settings()
    
    if not settings.BASEROW_USERS_TABLE_ID:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="User service unavailable",
        )
    
    try:
        if search:
            result = await baserow_service.search_rows(
                settings.BASEROW_USERS_TABLE_ID,
                search=search,
                page=page,
                size=page_size,
            )
        else:
            result = await baserow_service.list_rows(
                settings.BASEROW_USERS_TABLE_ID,
                page=page,
                size=page_size,
                order_by="-created_at",
            )
    except BaserowError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch users: {str(e)}",
        )
    
    users = [User(**item) for item in result.get("results", [])]
    total = result.get("count", 0)
    
    return APIResponse.success_response(
        PaginatedResponse.create(users, total, page, page_size)
    )


@router.patch("/users/{user_id}")
async def update_user(
    user_id: str,
    updates: UserUpdate,
    current_user: User = Depends(get_current_admin),
    baserow_service: BaserowService = Depends(get_baserow_service),
):
    """Update a user (admin only)."""
    settings = get_settings()
    
    if not settings.BASEROW_USERS_TABLE_ID:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="User service unavailable",
        )
    
    update_data = updates.model_dump(exclude_unset=True)
    
    try:
        updated = await baserow_service.update_row(
            settings.BASEROW_USERS_TABLE_ID,
            user_id,
            update_data
        )
    except BaserowError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update user: {str(e)}",
        )
    
    return APIResponse.success_response(User(**updated))


@router.get("/suppliers", response_model=APIResponse[PaginatedResponse[Supplier]])
async def list_suppliers(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    is_verified: Optional[bool] = None,
    current_user: User = Depends(get_current_admin),
    baserow_service: BaserowService = Depends(get_baserow_service),
):
    """List all suppliers (admin only)."""
    settings = get_settings()
    
    if not settings.BASEROW_SUPPLIERS_TABLE_ID:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Supplier service unavailable",
        )
    
    filters = {}
    if is_verified is not None:
        filters["is_verified"] = str(is_verified).lower()
    
    try:
        result = await baserow_service.list_rows(
            settings.BASEROW_SUPPLIERS_TABLE_ID,
            filters=filters if filters else None,
            page=page,
            size=page_size,
            order_by="-created_at",
        )
    except BaserowError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch suppliers: {str(e)}",
        )
    
    suppliers = [Supplier(**item) for item in result.get("results", [])]
    total = result.get("count", 0)
    
    return APIResponse.success_response(
        PaginatedResponse.create(suppliers, total, page, page_size)
    )


@router.post("/suppliers")
async def create_supplier(
    supplier_data: SupplierCreate,
    current_user: User = Depends(get_current_admin),
    baserow_service: BaserowService = Depends(get_baserow_service),
):
    """Create a new supplier (admin only)."""
    settings = get_settings()
    
    if not settings.BASEROW_SUPPLIERS_TABLE_ID:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Supplier service unavailable",
        )
    
    supplier_dict = supplier_data.model_dump()
    supplier_dict["is_verified"] = False
    supplier_dict["is_authorized"] = False
    supplier_dict["rating"] = 0
    supplier_dict["review_count"] = 0
    supplier_dict["created_at"] = __import__('datetime').datetime.utcnow().isoformat()
    
    try:
        created = await baserow_service.create_row(
            settings.BASEROW_SUPPLIERS_TABLE_ID,
            supplier_dict
        )
    except BaserowError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create supplier: {str(e)}",
        )
    
    return APIResponse.success_response(Supplier(**created))


@router.patch("/suppliers/{supplier_id}")
async def update_supplier(
    supplier_id: str,
    updates: SupplierUpdate,
    current_user: User = Depends(get_current_admin),
    baserow_service: BaserowService = Depends(get_baserow_service),
):
    """Update a supplier (admin only)."""
    settings = get_settings()
    
    if not settings.BASEROW_SUPPLIERS_TABLE_ID:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Supplier service unavailable",
        )
    
    update_data = updates.model_dump(exclude_unset=True)
    
    try:
        updated = await baserow_service.update_row(
            settings.BASEROW_SUPPLIERS_TABLE_ID,
            supplier_id,
            update_data
        )
    except BaserowError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update supplier: {str(e)}",
        )
    
    return APIResponse.success_response(Supplier(**updated))


@router.post("/suppliers/{supplier_id}/verify")
async def verify_supplier(
    supplier_id: str,
    current_user: User = Depends(get_current_admin),
    baserow_service: BaserowService = Depends(get_baserow_service),
):
    """Verify a supplier (admin only)."""
    settings = get_settings()
    
    if not settings.BASEROW_SUPPLIERS_TABLE_ID:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Supplier service unavailable",
        )
    
    try:
        updated = await baserow_service.update_row(
            settings.BASEROW_SUPPLIERS_TABLE_ID,
            supplier_id,
            {"is_verified": True}
        )
    except BaserowError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to verify supplier: {str(e)}",
        )
    
    return APIResponse.success_response({
        "message": "Supplier verified successfully",
        "supplier": Supplier(**updated),
    })


@router.get("/market-intel/price-trends")
async def get_price_trends(
    part_id: str,
    days: int = Query(90, ge=7, le=365),
    current_user: User = Depends(get_current_admin),
    intelligence_service: IntelligenceService = Depends(get_intelligence_service),
):
    """Get price trends for a part (admin only)."""
    trends = await intelligence_service.get_price_trends(part_id, days)
    return APIResponse.success_response(trends)


@router.get("/market-intel/insights")
async def get_market_insights(
    category: Optional[str] = None,
    current_user: User = Depends(get_current_admin),
    intelligence_service: IntelligenceService = Depends(get_intelligence_service),
):
    """Get market insights (admin only)."""
    insights = await intelligence_service.get_market_insights(category)
    return APIResponse.success_response(insights)
