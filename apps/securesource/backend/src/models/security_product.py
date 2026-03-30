from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field

class SecurityProductBase(BaseModel):
    sku: str = Field(..., min_length=1, max_length=50)
    name: str = Field(..., min_length=1, max_length=200)
    category: str = Field(..., min_length=1)
    brand: str = Field(..., min_length=1, max_length=100)
    ul_listed: bool = Field(default=False)
    ndaa_compliant: bool = Field(default=False)
    fips_140_compliant: bool = Field(default=False)
    price_usd: float = Field(..., ge=0)

class SecurityProductCreate(SecurityProductBase):
    pass

class SecurityProduct(SecurityProductBase):
    id: str
    class Config:
        from_attributes = True
