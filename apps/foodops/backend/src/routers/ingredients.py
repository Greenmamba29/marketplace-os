"""Ingredients router."""

from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, Query, HTTPException, status

from ..models.ingredients import Ingredient, IngredientCreate, IngredientUpdate, IngredientFilter
from ..models.common import ApiResponse, PaginatedResponse, PaginationParams
from ..routers.auth import get_current_active_user, require_permissions
from ..models.auth import User


router = APIRouter()


# Mock data
MOCK_INGREDIENTS = [
    Ingredient(
        id="1",
        name="Organic Chicken Breast",
        description="Premium organic chicken breast, boneless and skinless.",
        sku="CHX-BR-ORG-001",
        gtin="00856000001234",
        category="Poultry",
        subcategory="Chicken",
        supplier_id="sup-1",
        supplier_name="Premium Poultry Farms",
        temperature_zone="refrigerated",
        food_safety_category="raw",
        allergens=[],
        may_contain=[],
        certifications=["organic", "non_gmo"],
        shelf_life_days=5,
        min_days_to_expiry=3,
        country_of_origin="USA",
        unit_price=8.99,
        unit_of_measure="lb",
        min_order_quantity=10,
        available_quantity=500,
        images=[],
        documents=[],
        status="active",
        is_available=True,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
    ),
    Ingredient(
        id="2",
        name="Atlantic Salmon Fillet",
        description="Fresh Atlantic salmon fillets, sustainably sourced.",
        sku="SAL-FIL-ATL-001",
        gtin="00856000001235",
        category="Seafood",
        subcategory="Salmon",
        supplier_id="sup-2",
        supplier_name="Ocean Fresh Seafood",
        temperature_zone="refrigerated",
        food_safety_category="raw",
        allergens=["fish"],
        may_contain=["shellfish"],
        certifications=["non_gmo"],
        shelf_life_days=3,
        min_days_to_expiry=2,
        country_of_origin="Norway",
        unit_price=16.99,
        unit_of_measure="lb",
        min_order_quantity=5,
        available_quantity=200,
        images=[],
        documents=[],
        status="active",
        is_available=True,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
    ),
    Ingredient(
        id="3",
        name="Frozen Green Beans",
        description="IQF green beans, flash-frozen at peak freshness.",
        sku="VEG-GB-IQF-001",
        gtin="00856000001236",
        category="Vegetables",
        subcategory="Frozen Vegetables",
        supplier_id="sup-3",
        supplier_name="Valley Fresh Produce",
        temperature_zone="frozen",
        food_safety_category="RTE",
        allergens=[],
        may_contain=[],
        certifications=["organic", "non_gmo"],
        shelf_life_days=365,
        min_days_to_expiry=300,
        country_of_origin="USA",
        unit_price=3.49,
        unit_of_measure="lb",
        min_order_quantity=20,
        available_quantity=1000,
        images=[],
        documents=[],
        status="active",
        is_available=True,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
    ),
]


@router.get("", response_model=ApiResponse[PaginatedResponse[Ingredient]])
async def list_ingredients(
    search: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    temperature_zone: Optional[str] = Query(None),
    supplier: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_active_user),
):
    """List all ingredients with optional filtering."""
    # Filter ingredients
    filtered = MOCK_INGREDIENTS.copy()
    
    if search:
        search_lower = search.lower()
        filtered = [
            i for i in filtered
            if search_lower in i.name.lower()
            or search_lower in i.description.lower()
            or search_lower in i.sku.lower()
        ]
    
    if category:
        filtered = [i for i in filtered if i.category == category]
    
    if temperature_zone:
        filtered = [i for i in filtered if i.temperature_zone == temperature_zone]
    
    if supplier:
        filtered = [i for i in filtered if i.supplier_name == supplier]
    
    # Paginate
    total = len(filtered)
    start = (page - 1) * limit
    end = start + limit
    paginated = filtered[start:end]
    
    return ApiResponse(
        success=True,
        data=PaginatedResponse(
            data=paginated,
            pagination={
                "page": page,
                "limit": limit,
                "total": total,
                "total_pages": (total + limit - 1) // limit,
                "has_next": end < total,
                "has_prev": page > 1,
            },
        ),
        meta={"timestamp": datetime.utcnow().isoformat(), "request_id": "req-1"},
    )


@router.get("/{ingredient_id}", response_model=ApiResponse[Ingredient])
async def get_ingredient(
    ingredient_id: str,
    current_user: User = Depends(get_current_active_user),
):
    """Get a single ingredient by ID."""
    ingredient = next((i for i in MOCK_INGREDIENTS if i.id == ingredient_id), None)
    
    if not ingredient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ingredient not found",
        )
    
    return ApiResponse(
        success=True,
        data=ingredient,
        meta={"timestamp": datetime.utcnow().isoformat(), "request_id": "req-1"},
    )


@router.post("", response_model=ApiResponse[Ingredient])
async def create_ingredient(
    ingredient_data: IngredientCreate,
    current_user: User = Depends(require_permissions(["admin:products"])),
):
    """Create a new ingredient."""
    # In production, save to database
    ingredient = Ingredient(
        id=f"ing-{datetime.utcnow().timestamp()}",
        supplier_name="Test Supplier",
        available_quantity=0,
        images=[],
        documents=[],
        status="active",
        is_available=True,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
        **ingredient_data.model_dump(),
    )
    
    return ApiResponse(
        success=True,
        data=ingredient,
        meta={"timestamp": datetime.utcnow().isoformat(), "request_id": "req-1"},
    )


@router.patch("/{ingredient_id}", response_model=ApiResponse[Ingredient])
async def update_ingredient(
    ingredient_id: str,
    ingredient_data: IngredientUpdate,
    current_user: User = Depends(require_permissions(["admin:products"])),
):
    """Update an existing ingredient."""
    ingredient = next((i for i in MOCK_INGREDIENTS if i.id == ingredient_id), None)
    
    if not ingredient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ingredient not found",
        )
    
    # Update fields
    update_data = ingredient_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(ingredient, field, value)
    
    ingredient.updated_at = datetime.utcnow()
    
    return ApiResponse(
        success=True,
        data=ingredient,
        meta={"timestamp": datetime.utcnow().isoformat(), "request_id": "req-1"},
    )


@router.delete("/{ingredient_id}")
async def delete_ingredient(
    ingredient_id: str,
    current_user: User = Depends(require_permissions(["admin:products"])),
):
    """Delete an ingredient."""
    ingredient = next((i for i in MOCK_INGREDIENTS if i.id == ingredient_id), None)
    
    if not ingredient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ingredient not found",
        )
    
    # In production, delete from database
    
    return ApiResponse(
        success=True,
        data={"message": "Ingredient deleted successfully"},
        meta={"timestamp": datetime.utcnow().isoformat(), "request_id": "req-1"},
    )


@router.get("/categories", response_model=ApiResponse[List[str]])
async def get_categories(
    current_user: User = Depends(get_current_active_user),
):
    """Get all ingredient categories."""
    categories = list(set(i.category for i in MOCK_INGREDIENTS))
    
    return ApiResponse(
        success=True,
        data=categories,
        meta={"timestamp": datetime.utcnow().isoformat(), "request_id": "req-1"},
    )
