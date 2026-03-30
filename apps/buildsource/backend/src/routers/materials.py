"""Materials router."""

from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from fastapi.security import HTTPBearer

from models.materials import (
    Material,
    MaterialCreate,
    MaterialUpdate,
    MaterialResponse,
    RegionalAvailability,
    SpecSheet,
    MaterialType,
)
from models.common import ApiResponse, PaginatedResponse
from services.baserow import get_baserow_service
from services.regional import get_regional_service

router = APIRouter(prefix="/materials", tags=["Materials"])
security = HTTPBearer()


@router.get("", response_model=ApiResponse[PaginatedResponse[MaterialResponse]])
async def list_materials(
    material_type: Optional[MaterialType] = None,
    search: Optional[str] = None,
    zip_code: Optional[str] = None,
    radius_miles: Optional[int] = Query(None, ge=0, le=500),
    min_recycled_content: Optional[float] = Query(None, ge=0, le=100),
    leed_eligible: Optional[bool] = None,
    in_stock: Optional[bool] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    supplier_id: Optional[str] = None,
    astm_standard: Optional[str] = None,
    page: int = Query(1, ge=1),
    page_size: int = Query(24, ge=1, le=100),
    baserow=Depends(get_baserow_service),
) -> ApiResponse[PaginatedResponse[MaterialResponse]]:
    """List materials with filters."""
    filters = {}
    if material_type:
        filters["material_type"] = material_type.value
    if min_recycled_content is not None:
        filters["recycled_content_percent__gte"] = min_recycled_content
    if leed_eligible:
        filters["leed_points__gt"] = 0
    if supplier_id:
        filters["supplier_id"] = supplier_id
    if astm_standard:
        filters["astm_standard"] = astm_standard
    
    result = await baserow.list_rows(
        "products",
        filters=filters if filters else None,
        page=page,
        size=page_size,
    )
    
    materials = [MaterialResponse(**item) for item in result.get("results", [])]
    total = result.get("count", 0)
    
    return ApiResponse.success_response(
        PaginatedResponse.create(
            items=materials,
            total=total,
            page=page,
            page_size=page_size,
        )
    )


@router.get("/types", response_model=ApiResponse[List[str]])
async def get_material_types() -> ApiResponse[List[str]]:
    """Get all material types."""
    types = [t.value for t in MaterialType]
    return ApiResponse.success_response(types)


@router.get("/astm-standards", response_model=ApiResponse[List[str]])
async def get_astm_standards(
    baserow=Depends(get_baserow_service),
) -> ApiResponse[List[str]]:
    """Get all ASTM standards used in materials."""
    # Get unique ASTM standards from materials
    result = await baserow.list_rows("products", size=1000)
    standards = set()
    for item in result.get("results", []):
        if item.get("astm_standard"):
            standards.add(item.get("astm_standard"))
    
    return ApiResponse.success_response(sorted(list(standards)))


@router.get("/leed", response_model=ApiResponse[PaginatedResponse[MaterialResponse]])
async def get_leed_materials(
    page: int = Query(1, ge=1),
    page_size: int = Query(24, ge=1, le=100),
    baserow=Depends(get_baserow_service),
) -> ApiResponse[PaginatedResponse[MaterialResponse]]:
    """Get LEED-eligible materials."""
    result = await baserow.list_rows(
        "products",
        filters={"leed_points__gt": 0},
        page=page,
        size=page_size,
    )
    
    materials = [MaterialResponse(**item) for item in result.get("results", [])]
    total = result.get("count", 0)
    
    return ApiResponse.success_response(
        PaginatedResponse.create(
            items=materials,
            total=total,
            page=page,
            page_size=page_size,
        )
    )


@router.get("/search-by-spec", response_model=ApiResponse[List[MaterialResponse]])
async def search_by_spec(
    astm: str,
    grade: Optional[str] = None,
    baserow=Depends(get_baserow_service),
) -> ApiResponse[List[MaterialResponse]]:
    """Search materials by specification."""
    filters = {"astm_standard": astm}
    if grade:
        filters["grade_specification__contains"] = grade
    
    result = await baserow.list_rows("products", filters=filters, size=100)
    materials = [MaterialResponse(**item) for item in result.get("results", [])]
    
    return ApiResponse.success_response(materials)


@router.get("/{material_id}", response_model=ApiResponse[MaterialResponse])
async def get_material(
    material_id: str,
    baserow=Depends(get_baserow_service),
) -> ApiResponse[MaterialResponse]:
    """Get a single material by ID."""
    material = await baserow.get_row("products", material_id)
    if not material:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Material not found",
        )
    
    return ApiResponse.success_response(MaterialResponse(**material))


@router.get("/{material_id}/availability", response_model=ApiResponse[List[RegionalAvailability]])
async def get_regional_availability(
    material_id: str,
    zip_code: str,
    radius: int = Query(50, ge=0, le=500),
    baserow=Depends(get_baserow_service),
    regional=Depends(get_regional_service),
) -> ApiResponse[List[RegionalAvailability]]:
    """Get regional availability for a material."""
    # Get availability data
    result = await baserow.list_rows(
        "regional_availability",
        filters={"material_id": material_id},
    )
    
    availabilities = []
    for item in result.get("results", []):
        # Calculate distance
        distance = 0  # Would calculate actual distance
        if distance <= radius:
            availabilities.append(RegionalAvailability(**item))
    
    return ApiResponse.success_response(availabilities)


@router.get("/{material_id}/spec-sheets", response_model=ApiResponse[List[SpecSheet]])
async def get_spec_sheets(
    material_id: str,
    baserow=Depends(get_baserow_service),
) -> ApiResponse[List[SpecSheet]]:
    """Get spec sheets for a material."""
    result = await baserow.list_rows(
        "spec_sheets",
        filters={"material_id": material_id},
    )
    
    sheets = [SpecSheet(**item) for item in result.get("results", [])]
    return ApiResponse.success_response(sheets)


@router.post("/compare", response_model=ApiResponse[List[MaterialResponse]])
async def compare_materials(
    material_ids: List[str],
    baserow=Depends(get_baserow_service),
) -> ApiResponse[List[MaterialResponse]]:
    """Compare multiple materials."""
    materials = []
    for material_id in material_ids:
        material = await baserow.get_row("products", material_id)
        if material:
            materials.append(MaterialResponse(**material))
    
    return ApiResponse.success_response(materials)


@router.get("/{material_id}/related", response_model=ApiResponse[List[MaterialResponse]])
async def get_related_materials(
    material_id: str,
    limit: int = Query(5, ge=1, le=20),
    baserow=Depends(get_baserow_service),
) -> ApiResponse[List[MaterialResponse]]:
    """Get related materials."""
    # Get the material first
    material = await baserow.get_row("products", material_id)
    if not material:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Material not found",
        )
    
    # Find related materials (same type, different supplier)
    result = await baserow.list_rows(
        "products",
        filters={
            "material_type": material.get("material_type"),
        },
        size=limit + 1,  # +1 to account for excluding self
    )
    
    related = []
    for item in result.get("results", []):
        if str(item.get("id")) != material_id:
            related.append(MaterialResponse(**item))
        if len(related) >= limit:
            break
    
    return ApiResponse.success_response(related)
