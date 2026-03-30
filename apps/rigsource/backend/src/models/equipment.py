from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field

class EquipmentBase(BaseModel):
    serial_number: str = Field(..., min_length=1, max_length=100)
    make: str = Field(..., min_length=1, max_length=100)
    model: str = Field(..., min_length=1, max_length=100)
    year: int = Field(..., ge=1900)
    hours: int = Field(..., ge=0)
    condition: str = Field(...)
    weight_tons: float = Field(..., ge=0)
    engine_hp: int = Field(..., ge=0)
    country_of_origin: str = Field(...)
    asking_price_usd: float = Field(..., ge=0)

class EquipmentCreate(EquipmentBase):
    pass

class Equipment(EquipmentBase):
    id: str
    class Config:
        from_attributes = True
