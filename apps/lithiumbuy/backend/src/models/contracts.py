"""Contract and delivery schedule models."""

from datetime import datetime, date
from enum import Enum
from typing import List, Optional, Dict, Any

from pydantic import BaseModel, Field


class ContractType(str, Enum):
    """Contract type enumeration."""
    SPOT = "spot"
    QUARTERLY = "quarterly"
    ANNUAL = "annual"
    MULTI_YEAR = "multi_year"


class ContractStatus(str, Enum):
    """Contract status enumeration."""
    DRAFT = "draft"
    ACTIVE = "active"
    COMPLETED = "completed"
    TERMINATED = "terminated"


class QualitySpec(BaseModel):
    """Quality specification model."""
    li2co3_min: float = Field(..., ge=0, le=100)
    moisture_max: float = Field(..., ge=0, le=100)
    particle_size_d50_min: float = Field(..., gt=0)
    particle_size_d50_max: float = Field(..., gt=0)
    impurities: Dict[str, float] = Field(default_factory=dict)


class PaymentTerms(BaseModel):
    """Payment terms model."""
    method: str
    days: int = Field(..., ge=0)
    currency: str = Field(default="USD")
    advance_percentage: float = Field(default=0, ge=0, le=100)


class DeliverySchedule(BaseModel):
    """Delivery schedule model."""
    id: str
    contract_id: str
    scheduled_date: date
    quantity: float = Field(..., gt=0)
    delivery_location: str
    delivery_term: str
    status: str = Field(default="scheduled")


class ContractBase(BaseModel):
    """Base contract model."""
    contract_number: str
    buyer_id: str
    supplier_id: str
    material_id: str
    contract_type: ContractType
    quantity: float = Field(..., gt=0)
    unit: str = Field(default="mt")
    base_price: float = Field(..., ge=0)
    price_formula: Optional[str] = None
    currency: str = Field(default="USD")
    start_date: date
    end_date: date
    delivery_schedule: List[DeliverySchedule] = Field(default_factory=list)
    quality_specifications: Optional[QualitySpec] = None
    payment_terms: Optional[PaymentTerms] = None
    ira_compliance_required: bool = False


class ContractCreate(ContractBase):
    """Contract creation model."""
    pass


class Contract(ContractBase):
    """Full contract model."""
    id: str
    status: ContractStatus = ContractStatus.DRAFT
    total_amount: Optional[float] = None
    created_at: datetime
    updated_at: datetime
    buyer: Optional[Dict[str, Any]] = None
    supplier: Optional[Dict[str, Any]] = None
    material: Optional[Dict[str, Any]] = None
    
    class Config:
        from_attributes = True


class ContractUpdate(BaseModel):
    """Contract update model."""
    status: Optional[ContractStatus] = None
    base_price: Optional[float] = Field(None, ge=0)
    price_formula: Optional[str] = None
    end_date: Optional[date] = None
    delivery_schedule: Optional[List[DeliverySchedule]] = None
