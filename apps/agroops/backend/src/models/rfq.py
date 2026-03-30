"""RFQ (Request for Quote) models."""

from datetime import datetime
from decimal import Decimal
from typing import List, Optional

from pydantic import BaseModel, Field


class RFQStatus(str):
    """RFQ statuses."""
    DRAFT = "draft"
    PUBLISHED = "published"
    BIDDING = "bidding"
    EVALUATING = "evaluating"
    AWARDED = "awarded"
    CLOSED = "closed"
    CANCELLED = "cancelled"


class RFQItem(BaseModel):
    """RFQ item model."""
    id: str
    input_category: str
    product_name: Optional[str] = None
    description: str
    quantity: float = Field(..., gt=0.0)
    unit: str
    specifications: Optional[str] = None
    preferred_brands: List[str] = []


class RFQItemCreate(BaseModel):
    """RFQ item creation model."""
    input_category: str
    product_name: Optional[str] = None
    description: str
    quantity: float = Field(..., gt=0.0)
    unit: str
    specifications: Optional[str] = None
    preferred_brands: List[str] = []


class RFQBase(BaseModel):
    """Base RFQ model."""
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=2000)
    
    # Crop context
    crop_type: str
    acres: Optional[float] = None
    planting_date: Optional[datetime] = None
    target_application_date: Optional[datetime] = None
    
    # Delivery
    delivery_location: str = Field(..., min_length=1, max_length=500)
    delivery_state: str = Field(..., min_length=2, max_length=2)
    delivery_date_start: datetime
    delivery_date_end: datetime
    
    # Terms
    payment_terms: str = "Net 30"
    credit_terms_requested: bool = False
    
    # Bidding
    bid_deadline: datetime
    min_supplier_rating: Optional[float] = Field(None, ge=0.0, le=5.0)


class RFQCreate(RFQBase):
    """RFQ creation model."""
    items: List[RFQItemCreate] = Field(..., min_length=1)


class RFQ(RFQBase):
    """RFQ response model."""
    id: str
    buyer_id: str
    buyer_name: str
    status: str = "draft"
    
    # Items
    items: List[RFQItem]
    
    # Responses
    quote_count: int = 0
    
    # Award
    awarded_quote_id: Optional[str] = None
    awarded_amount: Optional[Decimal] = None
    
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class RFQUpdate(BaseModel):
    """RFQ update model."""
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=2000)
    delivery_date_start: Optional[datetime] = None
    delivery_date_end: Optional[datetime] = None
    bid_deadline: Optional[datetime] = None
    status: Optional[str] = None


class RFQListParams(BaseModel):
    """RFQ list parameters."""
    page: int = Field(default=1, ge=1)
    per_page: int = Field(default=20, ge=1, le=100)
    status: Optional[str] = None
    my_rfqs: Optional[bool] = None


class PaginatedRFQs(BaseModel):
    """Paginated RFQs response."""
    items: List[RFQ]
    total: int
    page: int
    per_page: int
    total_pages: int
