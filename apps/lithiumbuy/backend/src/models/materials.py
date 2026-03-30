"""Material and mine models."""

from datetime import datetime
from enum import Enum
from typing import List, Optional

from pydantic import BaseModel, Field


class MaterialForm(str, Enum):
    """Material form enumeration."""
    CARBONATE = "carbonate"
    HYDROXIDE = "hydroxide"
    SPODUMENE = "spodumene"
    METAL = "metal"
    CHLORIDE = "chloride"


class PurityGrade(str, Enum):
    """Purity grade enumeration."""
    BATTERY = "battery"
    TECHNICAL = "technical"
    INDUSTRIAL = "industrial"


class DeliveryTerm(str, Enum):
    """Delivery term enumeration."""
    CIF = "CIF"
    FOB = "FOB"
    DDP = "DDP"
    EXW = "EXW"
    CFR = "CFR"


class MaterialBase(BaseModel):
    """Base material model."""
    name: str = Field(..., min_length=2, max_length=100)
    form: MaterialForm
    grade: PurityGrade
    li2co3_equivalent: float = Field(..., ge=0, le=100)
    moisture_content: float = Field(..., ge=0, le=100)
    particle_size_d50: float = Field(..., gt=0)
    particle_size_d90: Optional[float] = None
    origin_mine_id: Optional[str] = None
    supplier_id: str
    certifications: List[str] = Field(default_factory=list)
    ira_compliant: bool = False
    available_quantity: float = Field(..., ge=0)
    unit: str = Field(default="mt")
    price_per_unit: float = Field(..., ge=0)
    currency: str = Field(default="USD")
    delivery_terms: List[DeliveryTerm] = Field(default_factory=list)


class MaterialCreate(MaterialBase):
    """Material creation model."""
    pass


class Material(MaterialBase):
    """Full material model."""
    id: str
    created_at: datetime
    updated_at: datetime
    supplier: Optional[dict] = None
    mine: Optional[dict] = None
    
    class Config:
        from_attributes = True


class MineBase(BaseModel):
    """Base mine model."""
    name: str = Field(..., min_length=2, max_length=100)
    country: str = Field(..., min_length=2)
    region: Optional[str] = None
    operator: str = Field(..., min_length=2)
    production_capacity: float = Field(..., ge=0)
    extraction_method: Optional[str] = None
    environmental_cert: List[str] = Field(default_factory=list)
    ira_eligible: bool = False
    geopolitical_risk_score: float = Field(default=50, ge=0, le=100)


class MineCreate(MineBase):
    """Mine creation model."""
    pass


class Mine(MineBase):
    """Full mine model."""
    id: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
