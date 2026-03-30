from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field

class NetworkProductBase(BaseModel):
    sku: str = Field(..., min_length=1, max_length=50)
    part_number: str = Field(..., min_length=1, max_length=100)
    brand: str = Field(..., min_length=1, max_length=100)
    category: str = Field(..., min_length=1)
    condition: str = Field(...)
    taa_compliant: bool = Field(default=False)
    warranty_months: int = Field(default=12, ge=0)
    price_usd: float = Field(..., ge=0)

class NetworkProductCreate(NetworkProductBase):
    pass

class NetworkProduct(NetworkProductBase):
    id: str
    class Config:
        from_attributes = True
