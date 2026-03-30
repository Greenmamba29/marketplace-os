"""Products/Parts router."""

from typing import Optional, List

from fastapi import APIRouter, Depends, HTTPException, Query, status

from config import get_settings
from models.part import Part, PartSearchResult, SupplierPart, SubstituteRecommendation
from models.common import APIResponse, PaginationParams, PaginatedResponse
from models.user import User
from routers.auth import get_current_user, get_baserow_service
from services.baserow import BaserowService, BaserowError
from services.intelligence import IntelligenceService

router = APIRouter()


def get_intelligence_service() -> IntelligenceService:
    """Get intelligence service instance."""
    return IntelligenceService()


@router.get("", response_model=APIResponse[PaginatedResponse[Part]])
async def list_parts(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    search: Optional[str] = None,
    category: Optional[str] = None,
    manufacturer: Optional[str] = None,
    in_stock: Optional[bool] = None,
    baserow_service: BaserowService = Depends(get_baserow_service),
):
    """List parts with optional filtering."""
    settings = get_settings()
    
    if not settings.BASEROW_PARTS_TABLE_ID:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Parts service unavailable",
        )
    
    filters = {}
    if category:
        filters["category"] = category
    if manufacturer:
        filters["manufacturer"] = manufacturer
    
    try:
        if search:
            result = await baserow_service.search_rows(
                settings.BASEROW_PARTS_TABLE_ID,
                search=search,
                page=page,
                size=page_size,
            )
        else:
            result = await baserow_service.list_rows(
                settings.BASEROW_PARTS_TABLE_ID,
                filters=filters if filters else None,
                page=page,
                size=page_size,
            )
    except BaserowError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch parts: {str(e)}",
        )
    
    parts = [Part(**item) for item in result.get("results", [])]
    total = result.get("count", 0)
    
    return APIResponse.success_response(
        PaginatedResponse.create(parts, total, page, page_size)
    )


@router.get("/search", response_model=APIResponse[List[Part]])
async def search_parts(
    part_number: str = Query(..., min_length=1),
    baserow_service: BaserowService = Depends(get_baserow_service),
):
    """Search parts by part number (SKU or MPN)."""
    settings = get_settings()
    
    if not settings.BASEROW_PARTS_TABLE_ID:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Parts service unavailable",
        )
    
    try:
        # Search by SKU
        result = await baserow_service.list_rows(
            settings.BASEROW_PARTS_TABLE_ID,
            filters={"sku": part_number},
            size=10,
        )
        
        parts = [Part(**item) for item in result.get("results", [])]
        
        # If no results, search by manufacturer part number
        if not parts:
            result = await baserow_service.list_rows(
                settings.BASEROW_PARTS_TABLE_ID,
                filters={"manufacturer_part_number": part_number},
                size=10,
            )
            parts = [Part(**item) for item in result.get("results", [])]
        
        # If still no results, use general search
        if not parts:
            result = await baserow_service.search_rows(
                settings.BASEROW_PARTS_TABLE_ID,
                search=part_number,
                size=10,
            )
            parts = [Part(**item) for item in result.get("results", [])]
        
    except BaserowError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to search parts: {str(e)}",
        )
    
    return APIResponse.success_response(parts)


@router.get("/by-machine", response_model=APIResponse[List[Part]])
async def get_parts_by_machine(
    machine_id: str = Query(..., min_length=1),
    query: Optional[str] = None,
    baserow_service: BaserowService = Depends(get_baserow_service),
):
    """Get parts compatible with a specific machine."""
    settings = get_settings()
    
    if not settings.BASEROW_PARTS_TABLE_ID:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Parts service unavailable",
        )
    
    try:
        parts = await baserow_service.get_parts_by_machine(machine_id)
        
        # Filter by query if provided
        if query:
            parts = [
                p for p in parts
                if query.lower() in p.get("name", "").lower() or
                   query.lower() in p.get("sku", "").lower()
            ]
        
    except BaserowError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch parts: {str(e)}",
        )
    
    return APIResponse.success_response([Part(**p) for p in parts])


@router.get("/categories", response_model=APIResponse[List[str]])
async def list_categories(
    baserow_service: BaserowService = Depends(get_baserow_service),
):
    """List all part categories."""
    settings = get_settings()
    
    if not settings.BASEROW_PARTS_TABLE_ID:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Parts service unavailable",
        )
    
    try:
        result = await baserow_service.list_rows(
            settings.BASEROW_PARTS_TABLE_ID,
            size=1000,
        )
        
        categories = list(set(
            item.get("category", "") 
            for item in result.get("results", [])
            if item.get("category")
        ))
        
    except BaserowError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch categories: {str(e)}",
        )
    
    return APIResponse.success_response(sorted(categories))


@router.get("/manufacturers", response_model=APIResponse[List[str]])
async def list_manufacturers(
    baserow_service: BaserowService = Depends(get_baserow_service),
):
    """List all manufacturers."""
    settings = get_settings()
    
    if not settings.BASEROW_PARTS_TABLE_ID:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Parts service unavailable",
        )
    
    try:
        result = await baserow_service.list_rows(
            settings.BASEROW_PARTS_TABLE_ID,
            size=1000,
        )
        
        manufacturers = list(set(
            item.get("manufacturer", "") 
            for item in result.get("results", [])
            if item.get("manufacturer")
        ))
        
    except BaserowError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch manufacturers: {str(e)}",
        )
    
    return APIResponse.success_response(sorted(manufacturers))


@router.get("/{part_id}", response_model=APIResponse[Part])
async def get_part(
    part_id: str,
    baserow_service: BaserowService = Depends(get_baserow_service),
):
    """Get a specific part by ID."""
    settings = get_settings()
    
    if not settings.BASEROW_PARTS_TABLE_ID:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Parts service unavailable",
        )
    
    try:
        part_data = await baserow_service.get_row(
            settings.BASEROW_PARTS_TABLE_ID,
            part_id
        )
    except BaserowError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Part not found",
        )
    
    return APIResponse.success_response(Part(**part_data))


@router.get("/{part_id}/suppliers", response_model=APIResponse[List[SupplierPart]])
async def get_part_suppliers(
    part_id: str,
    baserow_service: BaserowService = Depends(get_baserow_service),
):
    """Get suppliers for a specific part."""
    # This would query a supplier_parts table
    # For now, return mock data
    
    mock_suppliers = [
        SupplierPart(
            id="sup-1",
            part_id=part_id,
            supplier_id="vendor-1",
            supplier_name="SKF Authorized Distributor",
            supplier_sku="SKF-6204-2RS",
            price=24.99,
            moq=1,
            stock_quantity=150,
            stock_location="Chicago, IL",
            lead_time_days=3,
            warranty_months=12,
            is_authorized=True,
            rating=4.8,
        ),
        SupplierPart(
            id="sup-2",
            part_id=part_id,
            supplier_id="vendor-2",
            supplier_name="Bearing Solutions Ltd",
            supplier_sku="BS-6204-2RS",
            price=22.50,
            moq=5,
            stock_quantity=75,
            stock_location="Detroit, MI",
            lead_time_days=5,
            warranty_months=12,
            is_authorized=False,
            rating=4.5,
        ),
    ]
    
    return APIResponse.success_response(mock_suppliers)


@router.get("/{part_id}/substitutes", response_model=APIResponse[List[SubstituteRecommendation]])
async def get_part_substitutes(
    part_id: str,
    intelligence_service: IntelligenceService = Depends(get_intelligence_service),
):
    """Get substitute recommendations for a part."""
    substitutes = await intelligence_service.get_substitute_recommendations(part_id)
    return APIResponse.success_response([
        SubstituteRecommendation(**s) for s in substitutes
    ])
