"""Quote models."""

from datetime import datetime
from decimal import Decimal
from typing import List, Optional

from pydantic import BaseModel, Field


class QuoteStatus(str):
    """Quote statuses."""
    DRAFT = "draft"
    SUBMITTED = "submitted"
    UNDER_REVIEW = "under_review"
    ACCEPTED = "accepted"
    REJECTED = "rejected"
    EXPIRED = "expired"


class QuoteLineItem(BaseModel):
    """Quote line item model."""
    id: str
    rfq_item_id: str
    input_id: Optional[str] = None
    product_name: str
    description: str
    quantity: float
    unit: str
    unit_price: Decimal
    line_total: Decimal
    availability: str = "in_stock"  # in_stock, limited, backorder
    lead_time_days: Optional[int] = None


class QuoteLineItemCreate(BaseModel):
    """Quote line item creation model."""
    rfq_item_id: str
    input_id: Optional[str] = None
    product_name: str
    description: str
    quantity: float = Field(..., gt=0.0)
    unit: str
    unit_price: Decimal = Field(..., gt=0.0)
    availability: str = "in_stock"
    lead_time_days: Optional[int] = None


class QuoteBase(BaseModel):
    """Base quote model."""
    # Pricing
    subtotal: Decimal
    tax_amount: Decimal = Decimal("0.00")
    shipping_amount: Decimal = Decimal("0.00")
    total_amount: Decimal
    
    # Terms
    payment_terms: str
    delivery_date: datetime
    delivery_method: str
    
    # Validity
    valid_until: datetime
    
    # Notes
    notes: Optional[str] = Field(None, max_length=2000)


class QuoteCreate(QuoteBase):
    """Quote creation model."""
    rfq_id: str
    line_items: List[QuoteLineItemCreate] = Field(..., min_length=1)


class Quote(QuoteBase):
    """Quote response model."""
    id: str
    rfq_id: str
    supplier_id: str
    supplier_name: str
    supplier_rating: float
    
    status: str = "draft"
    
    line_items: List[QuoteLineItem]
    
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class QuoteUpdate(BaseModel):
    """Quote update model."""
    status: Optional[str] = None
    notes: Optional[str] = Field(None, max_length=2000)


class QuoteAward(BaseModel):
    """Quote award model."""
    rfq_id: str
    quote_id: str


class PaginatedQuotes(BaseModel):
    """Paginated quotes response."""
    items: List[Quote]
    total: int
    page: int
    per_page: int
    total_pages: int
