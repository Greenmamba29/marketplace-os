"""Quote models."""

from datetime import datetime
from enum import Enum
from typing import List, Optional

from pydantic import BaseModel, Field


class QuoteStatus(str, Enum):
    """Quote statuses."""
    DRAFT = "draft"
    SUBMITTED = "submitted"
    UNDER_REVIEW = "under_review"
    ACCEPTED = "accepted"
    REJECTED = "rejected"
    EXPIRED = "expired"


class QuoteItemBase(BaseModel):
    """Base quote item model."""
    rfq_item_id: str
    unit_price: float = Field(..., gt=0)
    quantity: float = Field(..., gt=0)
    unit: str
    availability_date: datetime
    notes: Optional[str] = None


class QuoteItemCreate(QuoteItemBase):
    """Quote item creation model."""
    pass


class QuoteItem(QuoteItemBase):
    """Quote item response model."""
    id: str
    quote_id: str
    subtotal: float

    class Config:
        from_attributes = True


class QuoteBase(BaseModel):
    """Base quote model."""
    rfq_id: str
    validity_days: int = Field(30, ge=1)
    incoterm: str
    payment_terms: str
    lead_time_days: int = Field(..., ge=1)
    shipping_cost: float = Field(0, ge=0)
    currency: str = "USD"
    notes: Optional[str] = None
    terms_conditions: Optional[str] = None


class QuoteCreate(QuoteBase):
    """Quote creation model."""
    items: List[QuoteItemCreate] = Field(..., min_length=1)


class QuoteUpdate(BaseModel):
    """Quote update model."""
    status: Optional[QuoteStatus] = None
    validity_days: Optional[int] = None
    lead_time_days: Optional[int] = None
    shipping_cost: Optional[float] = None
    notes: Optional[str] = None


class Quote(QuoteBase):
    """Quote response model."""
    id: str
    supplier_id: str
    status: QuoteStatus
    items: List[QuoteItem]
    total_amount: float
    expires_at: datetime
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class QuoteListResponse(BaseModel):
    """Quote list response."""
    items: List[Quote]
    total: int
    page: int
    size: int


class QuoteAcceptRequest(BaseModel):
    """Quote accept request."""
    po_number: Optional[str] = None
