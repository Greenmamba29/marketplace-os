"""RFQ and Quote models."""

from datetime import datetime, date
from enum import Enum
from typing import List, Optional, Dict, Any

from pydantic import BaseModel, Field


class RFQStatus(str, Enum):
    """RFQ status enumeration."""
    DRAFT = "draft"
    SUBMITTED = "submitted"
    UNDER_REVIEW = "under_review"
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


class RFQBase(BaseModel):
    """Base RFQ model."""
    title: str = Field(..., min_length=3, max_length=200)
    description: Optional[str] = None
    material_form: str
    grade: str
    quantity: float = Field(..., gt=0)
    unit: str = Field(default="mt")
    target_price: Optional[float] = Field(None, ge=0)
    currency: str = Field(default="USD")
    delivery_term: str
    delivery_location: str
    delivery_date: date
    ira_compliance_required: bool = False
    certifications_required: List[str] = Field(default_factory=list)
    validity_days: int = Field(default=7, ge=1, le=30)


class RFQCreate(RFQBase):
    """RFQ creation model."""
    pass


class RFQ(RFQBase):
    """Full RFQ model."""
    id: str
    rfq_number: str
    buyer_id: str
    status: RFQStatus = RFQStatus.DRAFT
    created_at: datetime
    expires_at: datetime
    buyer: Optional[Dict[str, Any]] = None
    quotes_count: int = Field(default=0)
    
    class Config:
        from_attributes = True


class QuoteBase(BaseModel):
    """Base quote model."""
    rfq_id: str
    supplier_id: str
    material_id: str
    unit_price: float = Field(..., gt=0)
    total_price: float = Field(..., gt=0)
    currency: str = Field(default="USD")
    delivery_term: str
    delivery_date: date
    validity_days: int = Field(default=7, ge=1)
    notes: Optional[str] = None


class QuoteCreate(QuoteBase):
    """Quote creation model."""
    pass


class Quote(QuoteBase):
    """Full quote model."""
    id: str
    quote_number: str
    status: QuoteStatus = QuoteStatus.PENDING
    created_at: datetime
    expires_at: datetime
    supplier: Optional[Dict[str, Any]] = None
    material: Optional[Dict[str, Any]] = None
    rfq: Optional[Dict[str, Any]] = None
    
    class Config:
        from_attributes = True


class QuoteResponse(BaseModel):
    """Quote response action model."""
    action: str = Field(..., pattern="^(accept|reject)$")
    reason: Optional[str] = None
