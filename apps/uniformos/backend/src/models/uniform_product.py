from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field

class UniformProductBase(BaseModel):
    sku: str = Field(..., min_length=1, max_length=50)
    name: str = Field(..., min_length=1, max_length=200)
    category: str = Field(..., min_length=1)
    industry: str = Field(...)
    fabric_composition: str = Field(...)
    sizes_available: str = Field(...)
    moq: int = Field(default=1, ge=1)
    customization_options: str = Field(...)
    lead_time_days: int = Field(default=7, ge=0)
    price_per_unit: float = Field(..., ge=0)

class UniformProductCreate(UniformProductBase):
    pass

class UniformProduct(UniformProductBase):
    id: str
    class Config:
        from_attributes = True
