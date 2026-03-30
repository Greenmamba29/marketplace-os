"""Menu engineering models."""

from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field


class RecipeComponent(BaseModel):
    """Recipe component (ingredient in a menu item)."""
    ingredient_id: str
    ingredient_name: str
    quantity: float = Field(..., gt=0)
    unit_of_measure: str
    unit_cost: float
    notes: Optional[str] = None
    is_optional: bool = False


class MenuItemBase(BaseModel):
    """Base menu item model."""
    name: str
    description: str
    category: str
    price: float = Field(..., ge=0)
    is_vegetarian: bool = False
    is_vegan: bool = False
    is_gluten_free: bool = False
    allergens: List[str] = []
    status: str = Field(..., pattern="^(active|seasonal|inactive)$")


class MenuItemCreate(MenuItemBase):
    """Menu item creation model."""
    recipe: List[RecipeComponent]


class MenuItemUpdate(BaseModel):
    """Menu item update model."""
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    recipe: Optional[List[RecipeComponent]] = None
    status: Optional[str] = None


class MenuItem(MenuItemBase):
    """Full menu item model."""
    id: str
    recipe: List[RecipeComponent]
    cost: float
    profit_margin: float
    food_cost_percentage: float
    popularity_score: Optional[float] = None
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class MenuItemSummary(BaseModel):
    """Simplified menu item for lists."""
    id: str
    name: str
    category: str
    price: float
    cost: float
    profit_margin: float
    status: str


class GeneratedOrderItem(BaseModel):
    """Item in a generated order from menu selection."""
    ingredient_id: str
    ingredient_name: str
    quantity: float
    unit_of_measure: str


class DemandForecast(BaseModel):
    """AI demand forecast for an ingredient."""
    id: str
    ingredient_id: str
    ingredient_name: str
    forecast_period_start: datetime
    forecast_period_end: datetime
    predicted_quantity: float
    confidence_interval_lower: float
    confidence_interval_upper: float
    confidence: float
    model_version: str
    influencing_factors: List[dict]
    created_at: datetime
