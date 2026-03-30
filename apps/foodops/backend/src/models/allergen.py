"""Allergen registry models."""

from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel


class AllergenRegistryEntryBase(BaseModel):
    """Base allergen registry entry model."""
    contains: List[str] = []
    may_contain: List[str] = []
    processed_on_equipment_with: List[str] = []
    risk_level: str = "low"  # low, medium, high


class AllergenRegistryEntryCreate(AllergenRegistryEntryBase):
    """Allergen registry entry creation model."""
    ingredient_id: str
    supplier_id: str


class AllergenRegistryEntry(AllergenRegistryEntryBase):
    """Full allergen registry entry model."""
    id: str
    ingredient_id: str
    ingredient_name: str
    supplier_id: str
    supplier_name: str
    allergen_statement_url: Optional[str] = None
    last_verified_at: datetime
    verified_by: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class AllergenMatrix(BaseModel):
    """Allergen matrix for an ingredient."""
    ingredient_id: str
    ingredient_name: str
    allergens: dict  # allergen -> boolean
    cross_contamination_risk: List[str]
    last_updated: datetime
