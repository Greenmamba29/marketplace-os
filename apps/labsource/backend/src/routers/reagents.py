"""
Reagents Router for LabSource
"""

from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status

from ..models.reagent import Reagent, ReagentFilter
from ..models.common import ApiResponse, PaginationParams, PaginationMeta
from ..services.baserow import BaserowService, get_baserow_service
from ..services.saleor import SaleorService, get_saleor_service
from .auth import get_current_user, get_current_admin

router = APIRouter()


@router.get("", response_model=ApiResponse[list])
async def list_reagents(
    category: Optional[str] = Query(None),
    manufacturer: Optional[str] = Query(None),
    storage_temp: Optional[str] = Query(None, alias="storageTemp"),
    clia_status: Optional[str] = Query(None, alias="cliaStatus"),
    animal_free: Optional[bool] = Query(None, alias="animalFree"),
    min_purity: Optional[float] = Query(None, alias="minPurity"),
    in_stock: Optional[bool] = Query(None, alias="inStock"),
    search: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    baserow: BaserowService = Depends(get_baserow_service),
    saleor: SaleorService = Depends(get_saleor_service),
    current_user = Depends(get_current_user),
):
    """List reagents with optional filtering."""
    # Build filters for Baserow
    filters = {}
    
    if category:
        filters["category"] = category
    if manufacturer:
        filters["manufacturer"] = manufacturer
    if storage_temp:
        filters["storage_temperature"] = storage_temp
    if clia_status:
        filters["clia_status"] = clia_status
    if animal_free is not None:
        filters["animal_free"] = animal_free
    
    # Get products from Baserow
    result = await baserow.get_products(filters=filters if filters else None, page=page)
    
    products = result.get("results", [])
    total = result.get("count", 0)
    
    # Apply search filter if provided
    if search:
        search_lower = search.lower()
        products = [
            p for p in products
            if search_lower in p.get("name", "").lower()
            or search_lower in p.get("catalog_number", "").lower()
            or search_lower in p.get("cas_number", "")
        ]
    
    # Apply purity filter
    if min_purity:
        products = [
            p for p in products
            if p.get("purity", 0) >= min_purity
        ]
    
    # Calculate pagination
    total_pages = (total + per_page - 1) // per_page
    
    return ApiResponse.success_response(
        data=products,
        meta=PaginationMeta(
            page=page,
            per_page=per_page,
            total=total,
            total_pages=total_pages,
        ),
    )


@router.get("/search", response_model=ApiResponse[list])
async def search_reagents(
    q: str = Query(..., min_length=2),
    category: Optional[str] = Query(None),
    baserow: BaserowService = Depends(get_baserow_service),
    current_user = Depends(get_current_user),
):
    """Search reagents by query string."""
    # Build filters
    filters = {}
    if category:
        filters["category"] = category
    
    # Get products and filter by search
    result = await baserow.get_products(filters=filters if filters else None)
    products = result.get("results", [])
    
    search_lower = q.lower()
    matches = [
        p for p in products
        if search_lower in p.get("name", "").lower()
        or search_lower in p.get("description", "").lower()
        or search_lower in p.get("catalog_number", "").lower()
        or search_lower in p.get("cas_number", "")
    ]
    
    return ApiResponse.success_response(matches)


@router.get("/category/{category}", response_model=ApiResponse[list])
async def get_reagents_by_category(
    category: str,
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    baserow: BaserowService = Depends(get_baserow_service),
    current_user = Depends(get_current_user),
):
    """Get reagents by category."""
    filters = {"category": category}
    result = await baserow.get_products(filters=filters, page=page)
    
    products = result.get("results", [])
    total = result.get("count", 0)
    total_pages = (total + per_page - 1) // per_page
    
    return ApiResponse.success_response(
        data=products,
        meta=PaginationMeta(
            page=page,
            per_page=per_page,
            total=total,
            total_pages=total_pages,
        ),
    )


@router.get("/{reagent_id}", response_model=ApiResponse[dict])
async def get_reagent(
    reagent_id: str,
    baserow: BaserowService = Depends(get_baserow_service),
    current_user = Depends(get_current_user),
):
    """Get a single reagent by ID."""
    try:
        product = await baserow.get_product(reagent_id)
        
        # Get lots for this product
        lots_filter = {"reagent_id": reagent_id}
        lots = await baserow.get_lots(filters=lots_filter)
        product["lots"] = lots
        
        return ApiResponse.success_response(product)
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Reagent not found: {reagent_id}",
        )


@router.get("/{reagent_id}/substitutes", response_model=ApiResponse[list])
async def get_reagent_substitutes(
    reagent_id: str,
    baserow: BaserowService = Depends(get_baserow_service),
    current_user = Depends(get_current_user),
):
    """Get substitute recommendations for a reagent."""
    # Get the reagent
    try:
        product = await baserow.get_product(reagent_id)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Reagent not found: {reagent_id}",
        )
    
    # Find substitutes (same category, similar specs)
    category = product.get("category")
    if not category:
        return ApiResponse.success_response([])
    
    filters = {"category": category}
    result = await baserow.get_products(filters=filters)
    all_products = result.get("results", [])
    
    # Filter out the current product and return substitutes
    substitutes = [
        p for p in all_products
        if p["id"] != reagent_id
        and p.get("is_active", True)
    ][:5]  # Limit to 5 substitutes
    
    return ApiResponse.success_response(substitutes)


@router.post("", response_model=ApiResponse[dict])
async def create_reagent(
    reagent_data: dict,
    baserow: BaserowService = Depends(get_baserow_service),
    admin = Depends(get_current_admin),
):
    """Create a new reagent (admin only)."""
    # TODO: Implement reagent creation
    return ApiResponse.success_response({"id": "new-reagent-id", **reagent_data})


@router.put("/{reagent_id}", response_model=ApiResponse[dict])
async def update_reagent(
    reagent_id: str,
    reagent_data: dict,
    baserow: BaserowService = Depends(get_baserow_service),
    admin = Depends(get_current_admin),
):
    """Update a reagent (admin only)."""
    # TODO: Implement reagent update
    return ApiResponse.success_response({"id": reagent_id, **reagent_data})


@router.delete("/{reagent_id}", response_model=ApiResponse[dict])
async def delete_reagent(
    reagent_id: str,
    baserow: BaserowService = Depends(get_baserow_service),
    admin = Depends(get_current_admin),
):
    """Delete a reagent (admin only)."""
    # TODO: Implement reagent deletion
    return ApiResponse.success_response({"message": "Reagent deleted successfully"})
