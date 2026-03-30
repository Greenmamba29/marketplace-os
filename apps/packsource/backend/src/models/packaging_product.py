from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field

class PackagingProductBase(BaseModel):
    sku: str = Field(..., min_length=1, max_length=50)
    name: str = Field(..., min_length=1, max_length=200)
    category: str = Field(..., min_length=1)
    material_type: str = Field(...)
    dimensions_cm: str = Field(...)
    moq: int = Field(default=1, ge=1)
    lead_time_days: int = Field(default=7, ge=0)
    print_options: str = Field(...)
    price_per_unit: float = Field(..., ge=0)

class PackagingProductCreate(PackagingProductBase):
    pass

class PackagingProduct(PackagingProductBase):
    id: str
    class Config:
        from_attributes = True
