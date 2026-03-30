"""Materials and mines router."""

from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status

from src.models import (
    ApiResponse,
    Material,
    MaterialFilters,
    Mine,
    PaginatedResponse,
    PaginationParams,
)
from src.models.materials import MaterialForm, PurityGrade
from src.routers.auth import get_current_active_user
from src.services.baserow import baserow_service

router = APIRouter(prefix="/materials", tags=["Materials"])


@router.get("", response_model=ApiResponse[PaginatedResponse[Material]])
async def list_materials(
    form: Optional[MaterialForm] = None,
    grade: Optional[PurityGrade] = None,
    ira_compliant: Optional[bool] = None,
    min_quantity: Optional[float] = None,
    max_price: Optional[float] = None,
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    current_user: dict = Depends(get_current_active_user),
):
    """List materials with optional filters."""
    filters = {}
    
    if form:
        filters["filter__field_form__equal"] = form.value
    if grade:
        filters["filter__field_grade__equal"] = grade.value
    if ira_compliant is not None:
        filters["filter__field_ira_compliant__boolean"] = str(ira_compliant).lower()
    if min_quantity:
        filters["filter__field_available_quantity__higher_than"] = str(min_quantity)
    if max_price:
        filters["filter__field_price_per_unit__lower_than"] = str(max_price)
    
    result = await baserow_service.get_materials(
        filters=filters if filters else None,
        page=page,
        size=per_page,
    )
    
    items = result.get("results", [])
    total = result.get("count", 0)
    
    return ApiResponse(
        success=True,
        data=PaginatedResponse(
            items=items,
            total=total,
            page=page,
            per_page=per_page,
            total_pages=(total + per_page - 1) // per_page,
        ),
    )


@router.get("/{material_id}", response_model=ApiResponse[Material])
async def get_material(
    material_id: str,
    current_user: dict = Depends(get_current_active_user),
):
    """Get a single material by ID."""
    try:
        material = await baserow_service.get_material(material_id)
        return ApiResponse(success=True, data=material)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Material not found",
        )


@router.get("/mines", response_model=ApiResponse[PaginatedResponse[Mine]])
async def list_mines(
    country: Optional[str] = None,
    ira_eligible: Optional[bool] = None,
    page: int = Query(1, ge=1),
    per_page: int = Query(50, ge=1, le=100),
    current_user: dict = Depends(get_current_active_user),
):
    """List mines with optional filters."""
    filters = {}
    
    if country:
        filters["filter__field_country__equal"] = country
    if ira_eligible is not None:
        filters["filter__field_ira_eligible__boolean"] = str(ira_eligible).lower()
    
    result = await baserow_service.get_mines(
        filters=filters if filters else None,
        page=page,
        size=per_page,
    )
    
    items = result.get("results", [])
    total = result.get("count", 0)
    
    return ApiResponse(
        success=True,
        data=PaginatedResponse(
            items=items,
            total=total,
            page=page,
            per_page=per_page,
            total_pages=(total + per_page - 1) // per_page,
        ),
    )


@router.get("/mines/{mine_id}", response_model=ApiResponse[Mine])
async def get_mine(
    mine_id: str,
    current_user: dict = Depends(get_current_active_user),
):
    """Get a single mine by ID."""
    try:
        mine = await baserow_service.get_row(
            baserow_service.settings.mines_table_id,
            mine_id,
        )
        return ApiResponse(success=True, data=mine)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Mine not found",
        )
