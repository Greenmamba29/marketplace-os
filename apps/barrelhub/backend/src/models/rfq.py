"""RFQ, Quote, and Order models."""

from datetime import date, datetime
from decimal import Decimal
from typing import List, Optional
from enum import Enum

from pydantic import BaseModel, Field, ConfigDict

from .barrel import SpiritType


class RFQStatus(str, Enum):
    """RFQ status enumeration."""
    DRAFT = "draft"
    SUBMITTED = "submitted"
    REVIEWING = "reviewing"
    QUOTED = "quoted"
    ACCEPTED = "accepted"
    REJECTED = "rejected"
    EXPIRED = "expired"


class QuoteStatus(str, Enum):
    """Quote status enumeration."""
    PENDING = "pending"
    ACCEPTED = "accepted"
    REJECTED = "rejected"
    EXPIRED = "expired"


class OrderStatus(str, Enum):
    """Order status enumeration."""
    PENDING = "pending"
    CONFIRMED = "confirmed"
    IN_TRANSIT = "in_transit"
    DELIVERED = "delivered"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class AgePreference(BaseModel):
    """Age preference for RFQ."""
    min_age: Optional[int] = Field(None, ge=0)
    max_age: Optional[int] = Field(None, ge=0)
    specific_age: Optional[int] = Field(None, ge=0)


class ProofRequirements(BaseModel):
    """Proof requirements for RFQ."""
    min_proof: Decimal = Field(..., ge=80, le=200)
    max_proof: Decimal = Field(..., ge=80, le=200)
    target_proof: Optional[Decimal] = None


class BudgetRange(BaseModel):
    """Budget range for RFQ."""
    min: Optional[Decimal] = Field(None, ge=0, decimal_places=2)
    max: Optional[Decimal] = Field(None, ge=0, decimal_places=2)


class RFQBase(BaseModel):
    """Base RFQ model."""
    spirit_type: SpiritType
    age_preference: AgePreference
    proof_requirements: ProofRequirements
    volume_required: Decimal = Field(..., gt=0, decimal_places=2)
    delivery_timeline: str
    budget_range: Optional[BudgetRange] = None
    special_requirements: Optional[str] = None
    ttb_compliance_required: bool = True
    sensory_preferences: Optional[str] = None


class RFQCreate(RFQBase):
    """RFQ creation model."""
    pass


class RFQUpdate(BaseModel):
    """RFQ update model."""
    age_preference: Optional[AgePreference] = None
    proof_requirements: Optional[ProofRequirements] = None
    volume_required: Optional[Decimal] = None
    delivery_timeline: Optional[str] = None
    budget_range: Optional[BudgetRange] = None
    special_requirements: Optional[str] = None
    sensory_preferences: Optional[str] = None


class RFQ(RFQBase):
    """Full RFQ model."""
    model_config = ConfigDict(from_attributes=True)
    
    id: str
    rfq_number: str
    buyer_id: str
    buyer_company: str
    status: RFQStatus
    submitted_at: Optional[datetime] = None
    expires_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime
    quotes: Optional[List["Quote"]] = None


class QuoteBase(BaseModel):
    """Base quote model."""
    barrel_ids: List[str]
    price_per_proof_gallon: Decimal = Field(..., gt=0, decimal_places=2)
    total_price: Decimal = Field(..., gt=0, decimal_places=2)
    delivery_terms: str
    payment_terms: str
    validity_period: int = Field(..., ge=1, description="Days quote is valid")
    notes: Optional[str] = None


class QuoteCreate(QuoteBase):
    """Quote creation model."""
    rfq_id: str


class Quote(QuoteBase):
    """Full quote model."""
    model_config = ConfigDict(from_attributes=True)
    
    id: str
    quote_number: str
    rfq_id: str
    supplier_id: str
    supplier_name: str
    status: QuoteStatus
    submitted_at: datetime
    expires_at: datetime
    created_at: datetime
    updated_at: datetime


class OrderBase(BaseModel):
    """Base order model."""
    shipping_address: str
    tracking_number: Optional[str] = None
    carrier: Optional[str] = None
    estimated_delivery: Optional[date] = None


class OrderCreate(OrderBase):
    """Order creation model."""
    quote_id: str


class Order(OrderBase):
    """Full order model."""
    model_config = ConfigDict(from_attributes=True)
    
    id: str
    order_number: str
    quote_id: str
    buyer_id: str
    supplier_id: str
    barrel_ids: List[str]
    total_volume: Decimal
    total_price: Decimal
    status: OrderStatus
    actual_delivery: Optional[date] = None
    created_at: datetime
    updated_at: datetime
