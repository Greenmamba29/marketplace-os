"""Ingredient and product models."""

from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field


class NutritionFacts(BaseModel):
    """Nutrition facts for an ingredient."""
    serving_size: str
    servings_per_container: int
    calories: float
    total_fat: float
    saturated_fat: float
    trans_fat: float
    cholesterol: float
    sodium: float
    total_carbohydrates: float
    dietary_fiber: float
    total_sugars: float
    added_sugars: float
    protein: float
    vitamin_d: Optional[float] = None
    calcium: Optional[float] = None
    iron: Optional[float] = None
    potassium: Optional[float] = None


class PriceBreak(BaseModel):
    """Price break for bulk orders."""
    quantity: int
    price: float


class Document(BaseModel):
    """Document attached to an ingredient."""
    id: str
    name: str
    type: str = Field(..., pattern="^(spec_sheet|safety_data|certification|allergen_statement|nutrition_label)$")
    url: str
    uploaded_at: datetime


class IngredientBase(BaseModel):
    """Base ingredient model."""
    name: str
    description: str
    category: str
    subcategory: Optional[str] = None
    temperature_zone: str = Field(..., pattern="^(frozen|refrigerated|ambient)$")
    food_safety_category: str = Field(..., pattern="^(RTE|raw|processed)$")
    allergens: List[str] = []
    may_contain: List[str] = []
    certifications: List[str] = []
    shelf_life_days: int = Field(..., ge=1)
    min_days_to_expiry: int = Field(..., ge=0)
    country_of_origin: str
    region_of_origin: Optional[str] = None
    unit_price: float = Field(..., ge=0)
    unit_of_measure: str
    min_order_quantity: int = Field(..., ge=1)


class IngredientCreate(IngredientBase):
    """Ingredient creation model."""
    sku: str
    gtin: Optional[str] = None
    upc: Optional[str] = None
    supplier_id: str
    nutrition_facts: Optional[NutritionFacts] = None
    ingredients_list: Optional[List[str]] = None
    price_breaks: Optional[List[PriceBreak]] = None


class IngredientUpdate(BaseModel):
    """Ingredient update model."""
    name: Optional[str] = None
    description: Optional[str] = None
    unit_price: Optional[float] = None
    available_quantity: Optional[int] = None
    status: Optional[str] = Field(None, pattern="^(active|inactive|discontinued)$")
    is_available: Optional[bool] = None


class IngredientFilter(BaseModel):
    """Ingredient filter parameters."""
    search: Optional[str] = None
    category: Optional[str] = None
    temperature_zone: Optional[str] = None
    supplier: Optional[str] = None
    status: Optional[str] = None
    min_price: Optional[float] = None
    max_price: Optional[float] = None
    certifications: Optional[List[str]] = None
    allergens: Optional[List[str]] = None
    food_safety_category: Optional[str] = None


class Ingredient(IngredientBase):
    """Full ingredient model."""
    id: str
    sku: str
    gtin: Optional[str] = None
    upc: Optional[str] = None
    supplier_id: str
    supplier_name: str
    nutrition_facts: Optional[NutritionFacts] = None
    ingredients_list: Optional[List[str]] = None
    price_breaks: Optional[List[PriceBreak]] = None
    available_quantity: int = 0
    images: List[str] = []
    documents: List[Document] = []
    status: str = "active"
    is_available: bool = True
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
