from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field

class EnergyComponentBase(BaseModel):
    sku: str = Field(..., min_length=1, max_length=50)
    name: str = Field(..., min_length=1, max_length=200)
    category: str = Field(..., min_length=1)
    voltage_rating: str = Field(...)
    watt_rating: str = Field(...)
    certification_ul: bool = Field(default=False)
    certification_ce: bool = Field(default=False)
    certification_iec: bool = Field(default=False)
    compatibility_vehicles: str = Field(...)
    price_usd: float = Field(..., ge=0)

class EnergyComponentCreate(EnergyComponentBase):
    pass

class EnergyComponent(EnergyComponentBase):
    id: str
    class Config:
        from_attributes = True
