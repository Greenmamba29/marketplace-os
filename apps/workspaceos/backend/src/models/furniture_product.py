from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field

class FurnitureProductBase(BaseModel):
    sku: str = Field(..., min_length=1, max_length=50)
    name: str = Field(..., min_length=1, max_length=200)
    category: str = Field(..., min_length=1)
    material: str = Field(...)
    dimensions_cm: str = Field(...)
    weight_capacity_kg: float = Field(..., ge=0)
    bifma_certified: bool = Field(default=False)
    greenguard_certified: bool = Field(default=False)
    lead_time_days: int = Field(default=7, ge=0)
    price_usd: float = Field(..., ge=0)

class FurnitureProductCreate(FurnitureProductBase):
    pass

class FurnitureProduct(FurnitureProductBase):
    id: str
    class Config:
        from_attributes = True
