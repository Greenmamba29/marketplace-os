"""Product/Input router."""

from decimal import Decimal
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status

from src.models.auth import User, get_current_active_user
from src.models.inputs import AgInput, AgInputFilter, PaginatedInputs, StateRegistration
from src.services.baserow import BaserowService

router = APIRouter(prefix="/inputs", tags=["Inputs"])


# Mock data for demo
MOCK_INPUTS = [
    AgInput(
        id="input_1",
        name="Roundup PowerMax 3",
        category="crop_protection",
        subcategory="herbicide",
        description="Glyphosate-based herbicide for broad-spectrum weed control",
        brand="Bayer",
        manufacturer="Bayer CropScience",
        sku="RPM-3-2.5G",
        active_ingredients=[{"name": "Glyphosate", "percentage": 48.7}],
        epa_registration_number="524-529",
        formulation_type="liquid",
        application_timing=[],
        crop_compatibility=["Corn", "Soybean", "Cotton"],
        target_pests=["Grasses", "Broadleaf weeds"],
        phi_days=14,
        rei_hours=12,
        base_price=Decimal("45.99"),
        unit="gallon",
        min_order_quantity=2.5,
        bulk_pricing=[],
        images=[],
        supplier_id="supplier_1",
        supplier_name="AgriSupply LLC",
        state_registrations=[StateRegistration(state="IA", status="registered"), StateRegistration(state="IL", status="registered")],
        stock_quantity=500.0,
        stock_status="in_stock",
        rating=4.5,
        review_count=23,
        status="approved",
        created_at="2024-01-01T00:00:00Z",
        updated_at="2024-01-01T00:00:00Z",
    ),
    AgInput(
        id="input_2",
        name="Pioneer P1197AM",
        category="seed",
        subcategory="corn",
        description="High-yielding corn hybrid with excellent standability",
        brand="Pioneer",
        manufacturer="Corteva Agriscience",
        sku="P1197AM-80M",
        active_ingredients=[],
        formulation_type="pellet",
        application_timing=[],
        crop_compatibility=["Corn"],
        target_pests=[],
        phi_days=None,
        rei_hours=None,
        base_price=Decimal("320.00"),
        unit="bag",
        min_order_quantity=1.0,
        bulk_pricing=[{"min_quantity": 10, "price_per_unit": Decimal("310.00")}],
        images=[],
        supplier_id="supplier_2",
        supplier_name="Midwest Seeds",
        state_registrations=[],
        stock_quantity=200.0,
        stock_status="in_stock",
        rating=4.8,
        review_count=45,
        status="approved",
        created_at="2024-01-01T00:00:00Z",
        updated_at="2024-01-01T00:00:00Z",
    ),
    AgInput(
        id="input_3",
        name="28% UAN Solution",
        category="fertilizer",
        subcategory="nitrogen",
        description="Liquid nitrogen fertilizer solution",
        brand="Generic",
        manufacturer="Various",
        sku="UAN-28- Bulk",
        active_ingredients=[],
        epa_registration_number=None,
        formulation_type="liquid",
        application_timing=[],
        crop_compatibility=["Corn", "Wheat", "Sorghum"],
        target_pests=[],
        phi_days=None,
        rei_hours=None,
        npk_ratio={"nitrogen": 28.0, "phosphorus": 0.0, "potassium": 0.0},
        base_price=Decimal("0.45"),
        unit="lb N",
        min_order_quantity=1000.0,
        bulk_pricing=[{"min_quantity": 5000, "price_per_unit": Decimal("0.42")}],
        images=[],
        supplier_id="supplier_1",
        supplier_name="AgriSupply LLC",
        state_registrations=[],
        stock_quantity=10000.0,
        stock_status="in_stock",
        rating=4.2,
        review_count=12,
        status="approved",
        created_at="2024-01-01T00:00:00Z",
        updated_at="2024-01-01T00:00:00Z",
    ),
]


@router.get("", response_model=PaginatedInputs)
async def list_inputs(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    category: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    state: Optional[str] = Query(None),
    crop: Optional[str] = Query(None),
    formulation: Optional[str] = Query(None),
    min_price: Optional[Decimal] = Query(None),
    max_price: Optional[Decimal] = Query(None),
    in_stock: Optional[bool] = Query(None),
):
    """List agricultural inputs with optional filters."""
    # Filter inputs
    filtered = MOCK_INPUTS.copy()
    
    if category:
        cats = category.split(",")
        filtered = [i for i in filtered if i.category in cats]
    
    if search:
        search_lower = search.lower()
        filtered = [i for i in filtered if search_lower in i.name.lower()]
    
    if state:
        filtered = [i for i in filtered if any(r.state == state and r.status == "registered" for r in i.state_registrations)]
    
    if crop:
        crops = crop.split(",")
        filtered = [i for i in filtered if any(c in i.crop_compatibility for c in crops)]
    
    if formulation:
        formulations = formulation.split(",")
        filtered = [i for i in filtered if i.formulation_type in formulations]
    
    if min_price is not None:
        filtered = [i for i in filtered if i.base_price >= min_price]
    
    if max_price is not None:
        filtered = [i for i in filtered if i.base_price <= max_price]
    
    if in_stock:
        filtered = [i for i in filtered if i.stock_status == "in_stock"]
    
    # Paginate
    total = len(filtered)
    start = (page - 1) * per_page
    end = start + per_page
    paginated = filtered[start:end]
    
    return PaginatedInputs(
        items=paginated,
        total=total,
        page=page,
        per_page=per_page,
        total_pages=(total + per_page - 1) // per_page,
    )


@router.get("/featured", response_model=PaginatedInputs)
async def get_featured_inputs(
    page: int = Query(1, ge=1),
    per_page: int = Query(10, ge=1, le=20),
):
    """Get featured inputs."""
    featured = [i for i in MOCK_INPUTS if i.rating >= 4.0]
    
    total = len(featured)
    start = (page - 1) * per_page
    end = start + per_page
    paginated = featured[start:end]
    
    return PaginatedInputs(
        items=paginated,
        total=total,
        page=page,
        per_page=per_page,
        total_pages=(total + per_page - 1) // per_page,
    )


@router.get("/category/{category}", response_model=PaginatedInputs)
async def get_inputs_by_category(
    category: str,
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
):
    """Get inputs by category."""
    filtered = [i for i in MOCK_INPUTS if i.category == category]
    
    total = len(filtered)
    start = (page - 1) * per_page
    end = start + per_page
    paginated = filtered[start:end]
    
    return PaginatedInputs(
        items=paginated,
        total=total,
        page=page,
        per_page=per_page,
        total_pages=(total + per_page - 1) // per_page,
    )


@router.get("/{input_id}", response_model=AgInput)
async def get_input(input_id: str):
    """Get input by ID."""
    for input_item in MOCK_INPUTS:
        if input_item.id == input_id:
            return input_item
    
    raise HTTPException(status_code=404, detail="Input not found")


@router.get("/{input_id}/related")
async def get_related_inputs(
    input_id: str,
    crop_type: Optional[str] = None,
):
    """Get related inputs."""
    input_item = await get_input(input_id)
    
    # Find related by category and crop compatibility
    related = [i for i in MOCK_INPUTS if i.id != input_id and i.category == input_item.category]
    
    if crop_type:
        related = [i for i in related if crop_type in i.crop_compatibility]
    
    return {"items": related[:4]}


@router.get("/{input_id}/registration/{state}")
async def check_state_registration(
    input_id: str,
    state: str,
):
    """Check EPA registration status for a state."""
    input_item = await get_input(input_id)
    
    for reg in input_item.state_registrations:
        if reg.state == state.upper():
            return {
                "input_id": input_id,
                "state": state.upper(),
                "status": reg.status,
                "expiration_date": reg.expiration_date,
            }
    
    return {
        "input_id": input_id,
        "state": state.upper(),
        "status": "not_registered",
        "expiration_date": None,
    }
