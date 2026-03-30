"""
Ingredients router
"""

from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query, status

from ..models.ingredients import Ingredient, IngredientCreate, IngredientUpdate, IngredientFilter
from ..models.common import ApiResponse, PaginatedResponse, PaginationParams
from ..routers.auth import get_current_active_user, require_admin
from ..models.auth import User

router = APIRouter()


# Mock data for demonstration
MOCK_INGREDIENTS = [
    {
        "id": "ing_001",
        "name": "Organic Stevia Extract Reb-A 97%",
        "description": "High-purity stevia extract with 97% Rebaudioside A content",
        "category": "sweeteners",
        "supplier_id": "sup_001",
        "supplier": {
            "id": "sup_001",
            "name": "PureSweet Naturals",
            "description": "Leading supplier of natural sweeteners",
            "country": "United States",
            "certifications": ["USDA Organic", "Non-GMO Project"],
            "years_in_business": 15,
            "verified": True,
            "rating": 4.8,
            "review_count": 127,
            "contact_email": "sales@puresweet.com",
        },
        "price_per_kg": 85.50,
        "moq_kg": 25,
        "price_tier": "premium",
        "specifications": {
            "moisture_percent": 5,
            "shelf_life_months": 36,
            "storage_conditions": "Cool, dry place",
        },
        "regulatory_status": {
            "us_fda_status": "approved",
            "eu_efsa_status": "approved",
            "fda_regulation_number": "21 CFR 182.20",
        },
        "country_of_origin": "United States",
        "lot_traceable": True,
        "coa_available": True,
        "status": "active",
        "featured": True,
    },
    {
        "id": "ing_002",
        "name": "Pea Protein Isolate 80%",
        "description": "Plant-based protein isolate from yellow peas",
        "category": "proteins",
        "supplier_id": "sup_002",
        "supplier": {
            "id": "sup_002",
            "name": "PlantPro Ingredients",
            "description": "Specialist in plant-based proteins",
            "country": "Canada",
            "certifications": ["Non-GMO Project", "Kosher"],
            "years_in_business": 8,
            "verified": True,
            "rating": 4.6,
            "review_count": 89,
            "contact_email": "info@plantpro.com",
        },
        "price_per_kg": 12.75,
        "moq_kg": 500,
        "price_tier": "standard",
        "specifications": {
            "moisture_percent": 8,
            "protein_content": 80,
            "shelf_life_months": 24,
            "storage_conditions": "Cool, dry place",
        },
        "regulatory_status": {
            "us_fda_status": "approved",
            "eu_efsa_status": "approved",
        },
        "country_of_origin": "Canada",
        "lot_traceable": True,
        "coa_available": True,
        "status": "active",
        "featured": False,
    },
]


@router.get("", response_model=ApiResponse[PaginatedResponse[Ingredient]])
async def list_ingredients(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    category: Optional[str] = None,
    search: Optional[str] = None,
    organic_only: bool = False,
    non_gmo_only: bool = False,
    current_user: Optional[User] = Depends(get_current_active_user),
):
    """List all ingredients with filtering"""
    # Filter ingredients
    filtered = MOCK_INGREDIENTS.copy()
    
    if category:
        filtered = [i for i in filtered if i["category"] == category]
    
    if search:
        search_lower = search.lower()
        filtered = [
            i for i in filtered 
            if search_lower in i["name"].lower() or search_lower in i["description"].lower()
        ]
    
    # Calculate pagination
    total = len(filtered)
    start = (page - 1) * per_page
    end = start + per_page
    items = filtered[start:end]
    
    pagination = PaginatedResponse.create(
        items=items,
        total=total,
        page=page,
        per_page=per_page,
    )
    
    return ApiResponse(success=True, data=pagination)


@router.get("/categories", response_model=ApiResponse[List[str]])
async def get_categories():
    """Get all ingredient categories"""
    categories = [
        "sweeteners",
        "flavors",
        "colors",
        "preservatives",
        "emulsifiers",
        "stabilizers",
        "proteins",
        "probiotics",
        "extracts",
        "vitamins_minerals",
    ]
    return ApiResponse(success=True, data=categories)


@router.get("/search", response_model=ApiResponse[PaginatedResponse[Ingredient]])
async def search_ingredients(
    q: str = Query(..., min_length=2),
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
):
    """Search ingredients by query"""
    query_lower = q.lower()
    filtered = [
        i for i in MOCK_INGREDIENTS
        if query_lower in i["name"].lower() 
        or query_lower in i["description"].lower()
        or query_lower in i["category"]
    ]
    
    total = len(filtered)
    start = (page - 1) * per_page
    end = start + per_page
    items = filtered[start:end]
    
    pagination = PaginatedResponse.create(
        items=items,
        total=total,
        page=page,
        per_page=per_page,
    )
    
    return ApiResponse(success=True, data=pagination)


@router.get("/{ingredient_id}", response_model=ApiResponse[Ingredient])
async def get_ingredient(
    ingredient_id: str,
    current_user: Optional[User] = Depends(get_current_active_user),
):
    """Get a specific ingredient by ID"""
    ingredient = next((i for i in MOCK_INGREDIENTS if i["id"] == ingredient_id), None)
    
    if not ingredient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ingredient not found",
        )
    
    return ApiResponse(success=True, data=ingredient)


@router.post("", response_model=ApiResponse[Ingredient], status_code=status.HTTP_201_CREATED)
async def create_ingredient(
    ingredient_data: IngredientCreate,
    current_user: User = Depends(require_admin),
):
    """Create a new ingredient (admin only)"""
    # In production, save to database
    new_ingredient = {
        "id": f"ing_{len(MOCK_INGREDIENTS) + 1:03d}",
        **ingredient_data.model_dump(),
        "status": "pending_approval",
        "featured": False,
    }
    
    return ApiResponse(
        success=True,
        data=new_ingredient,
        message="Ingredient created successfully",
    )


@router.put("/{ingredient_id}", response_model=ApiResponse[Ingredient])
async def update_ingredient(
    ingredient_id: str,
    ingredient_data: IngredientUpdate,
    current_user: User = Depends(require_admin),
):
    """Update an ingredient (admin only)"""
    ingredient = next((i for i in MOCK_INGREDIENTS if i["id"] == ingredient_id), None)
    
    if not ingredient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ingredient not found",
        )
    
    # Update fields
    update_data = ingredient_data.model_dump(exclude_unset=True)
    ingredient.update(update_data)
    
    return ApiResponse(
        success=True,
        data=ingredient,
        message="Ingredient updated successfully",
    )


@router.delete("/{ingredient_id}", response_model=ApiResponse[dict])
async def delete_ingredient(
    ingredient_id: str,
    current_user: User = Depends(require_admin),
):
    """Delete an ingredient (admin only)"""
    ingredient = next((i for i in MOCK_INGREDIENTS if i["id"] == ingredient_id), None)
    
    if not ingredient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ingredient not found",
        )
    
    return ApiResponse(
        success=True,
        data={},
        message="Ingredient deleted successfully",
    )


@router.get("/{ingredient_id}/regulatory", response_model=ApiResponse[dict])
async def get_ingredient_regulatory(
    ingredient_id: str,
    current_user: Optional[User] = Depends(get_current_active_user),
):
    """Get regulatory information for an ingredient"""
    ingredient = next((i for i in MOCK_INGREDIENTS if i["id"] == ingredient_id), None)
    
    if not ingredient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ingredient not found",
        )
    
    return ApiResponse(success=True, data=ingredient.get("regulatory_status", {}))


@router.get("/{ingredient_id}/certifications", response_model=ApiResponse[List[dict]])
async def get_ingredient_certifications(
    ingredient_id: str,
    current_user: Optional[User] = Depends(get_current_active_user),
):
    """Get certifications for an ingredient"""
    # Mock certifications data
    certifications = [
        {
            "id": "cert_001",
            "ingredient_id": ingredient_id,
            "name": "USDA Organic",
            "type": "organic",
            "issuer": "USDA",
            "certificate_number": "ORG-2024-001",
            "status": "active",
            "verified": True,
        }
    ]
    
    return ApiResponse(success=True, data=certifications)


@router.get("/{ingredient_id}/allergens", response_model=ApiResponse[dict])
async def get_ingredient_allergens(
    ingredient_id: str,
    current_user: Optional[User] = Depends(get_current_active_user),
):
    """Get allergen profile for an ingredient"""
    allergen_profile = {
        "id": "all_001",
        "ingredient_id": ingredient_id,
        "contains_major_allergens": False,
        "major_allergens": [],
        "may_contain": [],
        "processed_on_shared_equipment": False,
        "allergen_statement": "This product does not contain any major food allergens.",
        "fda_compliant": True,
    }
    
    return ApiResponse(success=True, data=allergen_profile)
