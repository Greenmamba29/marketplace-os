"""Menu engineering router."""

from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, Query, HTTPException, status

from ..models.menu import MenuItem, MenuItemCreate, MenuItemUpdate, GeneratedOrderItem, DemandForecast
from ..models.common import ApiResponse, PaginatedResponse
from ..routers.auth import get_current_active_user
from ..models.auth import User
from ..services.forecasting import forecasting_service


router = APIRouter()


# Mock menu items
MOCK_MENU_ITEMS = [
    MenuItem(
        id="1",
        name="Grilled Salmon with Asparagus",
        description="Atlantic salmon fillet grilled to perfection, served with roasted asparagus.",
        category="Entrees",
        price=28.99,
        cost=12.50,
        recipe=[
            {"ingredient_id": "2", "ingredient_name": "Atlantic Salmon Fillet", "quantity": 0.5, "unit_of_measure": "lb", "unit_cost": 8.50, "is_optional": False},
            {"ingredient_id": "7", "ingredient_name": "Asparagus", "quantity": 0.25, "unit_of_measure": "lb", "unit_cost": 2.00, "is_optional": False},
            {"ingredient_id": "8", "ingredient_name": "Butter", "quantity": 0.05, "unit_of_measure": "lb", "unit_cost": 1.00, "is_optional": False},
        ],
        profit_margin=56.9,
        food_cost_percentage=43.1,
        is_vegetarian=False,
        is_vegan=False,
        is_gluten_free=True,
        allergens=["fish"],
        status="active",
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
    ),
    MenuItem(
        id="2",
        name="Chicken Piccata",
        description="Pan-seared chicken breast in a lemon-caper sauce.",
        category="Entrees",
        price=24.99,
        cost=9.75,
        recipe=[
            {"ingredient_id": "1", "ingredient_name": "Organic Chicken Breast", "quantity": 0.5, "unit_of_measure": "lb", "unit_cost": 4.50, "is_optional": False},
            {"ingredient_id": "10", "ingredient_name": "Potatoes", "quantity": 0.3, "unit_of_measure": "lb", "unit_cost": 1.25, "is_optional": False},
            {"ingredient_id": "8", "ingredient_name": "Butter", "quantity": 0.1, "unit_of_measure": "lb", "unit_cost": 2.00, "is_optional": False},
        ],
        profit_margin=61.0,
        food_cost_percentage=39.0,
        is_vegetarian=False,
        is_vegan=False,
        is_gluten_free=False,
        allergens=["wheat"],
        status="active",
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
    ),
]


@router.get("/items", response_model=ApiResponse[PaginatedResponse[MenuItem]])
async def list_menu_items(
    search: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_active_user),
):
    """List all menu items."""
    filtered = MOCK_MENU_ITEMS.copy()
    
    if search:
        search_lower = search.lower()
        filtered = [m for m in filtered if search_lower in m.name.lower()]
    
    if category:
        filtered = [m for m in filtered if m.category == category]
    
    if status:
        filtered = [m for m in filtered if m.status == status]
    
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


@router.get("/items/{menu_item_id}", response_model=ApiResponse[MenuItem])
async def get_menu_item(
    menu_item_id: str,
    current_user: User = Depends(get_current_active_user),
):
    """Get a single menu item by ID."""
    item = next((m for m in MOCK_MENU_ITEMS if m.id == menu_item_id), None)
    
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Menu item not found",
        )
    
    return ApiResponse(
        success=True,
        data=item,
        meta={"timestamp": datetime.utcnow().isoformat(), "request_id": "req-1"},
    )


@router.post("/items", response_model=ApiResponse[MenuItem])
async def create_menu_item(
    item_data: MenuItemCreate,
    current_user: User = Depends(get_current_active_user),
):
    """Create a new menu item."""
    # Calculate cost and margins
    cost = sum(r["quantity"] * r["unit_cost"] for r in item_data.recipe)
    profit_margin = ((item_data.price - cost) / item_data.price) * 100
    food_cost_percentage = (cost / item_data.price) * 100
    
    item = MenuItem(
        id=f"menu-{datetime.utcnow().timestamp()}",
        cost=cost,
        profit_margin=profit_margin,
        food_cost_percentage=food_cost_percentage,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
        **item_data.model_dump(),
    )
    
    return ApiResponse(
        success=True,
        data=item,
        meta={"timestamp": datetime.utcnow().isoformat(), "request_id": "req-1"},
    )


@router.post("/generate-order", response_model=ApiResponse[List[GeneratedOrderItem]])
async def generate_order_from_menu(
    menu_item_ids: List[str],
    forecast_days: int = Query(7, ge=1, le=30),
    current_user: User = Depends(get_current_active_user),
):
    """Generate a purchase order from selected menu items."""
    selected_items = [m for m in MOCK_MENU_ITEMS if m.id in menu_item_ids]
    
    if not selected_items:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No valid menu items selected",
        )
    
    # Aggregate ingredients
    ingredient_totals = {}
    
    for item in selected_items:
        for component in item.recipe:
            ing_id = component["ingredient_id"]
            if ing_id not in ingredient_totals:
                ingredient_totals[ing_id] = {
                    "ingredient_id": ing_id,
                    "ingredient_name": component["ingredient_name"],
                    "quantity": 0,
                    "unit_of_measure": component["unit_of_measure"],
                }
            ingredient_totals[ing_id]["quantity"] += component["quantity"] * forecast_days * 30  # 30 servings per day
    
    order_items = list(ingredient_totals.values())
    
    return ApiResponse(
        success=True,
        data=order_items,
        meta={"timestamp": datetime.utcnow().isoformat(), "request_id": "req-1"},
    )


@router.get("/forecast/{ingredient_id}", response_model=ApiResponse[DemandForecast])
async def get_demand_forecast(
    ingredient_id: str,
    horizon_days: int = Query(14, ge=1, le=90),
    current_user: User = Depends(get_current_active_user),
):
    """Get AI demand forecast for an ingredient."""
    forecast = await forecasting_service.generate_forecast(
        ingredient_id=ingredient_id,
        ingredient_name="Test Ingredient",
        historical_data=[],
        horizon_days=horizon_days,
    )
    
    return ApiResponse(
        success=True,
        data=forecast,
        meta={"timestamp": datetime.utcnow().isoformat(), "request_id": "req-1"},
    )
