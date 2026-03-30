"""Request for Quote (RFQ) models."""

from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field

from .common import Address


class RFQItemBase(BaseModel):
    """Base RFQ item model."""
    ingredient_name: str
    description: Optional[str] = None
    quantity: float = Field(..., gt=0)
    unit_of_measure: str
    preferred_brands: Optional[List[str]] = None
    certifications_required: Optional[List[str]] = None
    min_days_to_expiry: Optional[int] = None
    allow_substitutes: bool = True
    substitute_preferences: Optional[List[str]] = None


class RFQItemCreate(RFQItemBase):
    """RFQ item creation model."""
    ingredient_id: Optional[str] = None


class RFQItem(RFQItemBase):
    """Full RFQ item model."""
    id: str
    ingredient_id: Optional[str] = None


class RFQBase(BaseModel):
    """Base RFQ model."""
    delivery_date: datetime
    delivery_window_earliest: str
    delivery_window_latest: str
    delivery_address: Address
    temperature_requirements: List[str]
    special_instructions: Optional[str] = None
    submission_deadline: datetime


class RFQCreate(RFQBase):
    """RFQ creation model."""
    items: List[RFQItemCreate]


class RFQUpdate(BaseModel):
    """RFQ update model."""
    status: Optional[str] = Field(None, pattern="^(draft|published|bidding|closed|awarded|cancelled)$")
    delivery_date: Optional[datetime] = None
    submission_deadline: Optional[datetime] = None


class RFQ(RFQBase):
    """Full RFQ model."""
    id: str
    rfq_number: str
    buyer_id: str
    buyer_name: str
    organization_id: str
    organization_name: str
    items: List[RFQItem]
    status: str = "draft"
    quotes_received: int = 0
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class RFQSummary(BaseModel):
    """Simplified RFQ for lists."""
    id: str
    rfq_number: str
    organization_name: str
    items_count: int
    status: str
    delivery_date: datetime
    quotes_received: int
    created_at: datetime
