"""Quote models."""

from datetime import datetime
from enum import Enum
from typing import List, Optional

from pydantic import BaseModel, Field


class QuoteStatus(str, Enum):
    """Quote status enumeration."""
    
    DRAFT = "draft"
    SUBMITTED = "submitted"
    UNDER_REVIEW = "under_review"
    ACCEPTED = "accepted"
    REJECTED = "rejected"
    EXPIRED = "expired"


class QuoteItemBase(BaseModel):
    """Base quote item model."""
    
    rfq_item_id: str
    material_id: Optional[str] = None
    description: str
    quantity: float = Field(..., gt=0)
    unit_price: float = Field(..., ge=0)
    availability_date: datetime


class QuoteItemCreate(QuoteItemBase):
    """Quote item creation model."""
    
    pass


class QuoteItem(QuoteItemBase):
    """Full quote item model."""
    
    id: str
    quote_id: str
    line_total: float
    
    class Config:
        from_attributes = True


class QuoteBase(BaseModel):
    """Base quote model."""
    
    delivery_fee: float = Field(default=0, ge=0)
    delivery_date: datetime
    payment_terms: str = Field(default="Net 30")
    validity_days: int = Field(default=30, ge=1)
    notes: Optional[str] = None


class QuoteCreate(QuoteBase):
    """Quote creation model."""
    
    rfq_id: str
    items: List[QuoteItemCreate] = Field(..., min_length=1)


class QuoteUpdate(BaseModel):
    """Quote update model."""
    
    items: Optional[List[QuoteItemCreate]] = None
    delivery_fee: Optional[float] = Field(None, ge=0)
    delivery_date: Optional[datetime] = None
    payment_terms: Optional[str] = None
    validity_days: Optional[int] = Field(None, ge=1)
    notes: Optional[str] = None


class Quote(QuoteBase):
    """Full quote model."""
    
    id: str
    quote_number: str
    rfq_id: str
    supplier_id: str
    items: List[QuoteItem]
    subtotal: float
    tax_amount: float
    total_price: float
    valid_until: datetime
    status: QuoteStatus
    is_lowest: bool = False
    price_difference_percent: Optional[float] = None
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class QuoteResponse(Quote):
    """Quote response with additional computed fields."""
    
    supplier_name: Optional[str] = None
    rfq_title: Optional[str] = None
    project_name: Optional[str] = None


class QuoteComparisonItem(BaseModel):
    """Item in quote comparison."""
    
    item_description: str
    prices: dict[str, float]  # quote_id -> price


class QuoteComparison(BaseModel):
    """Quote comparison result."""
    
    quotes: List[Quote]
    comparison_matrix: List[QuoteComparisonItem]
    savings_analysis: dict[str, float]
