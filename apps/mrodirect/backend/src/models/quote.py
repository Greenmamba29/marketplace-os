"""Quote models."""

from typing import Optional, List
from pydantic import BaseModel, Field


class QuoteItem(BaseModel):
    """Quote line item."""
    rfq_item_id: str
    part_id: str
    unit_price: float = Field(..., ge=0)
    quantity: int = Field(..., ge=1)
    lead_time_days: int = Field(..., ge=0)
    availability: str = Field(..., pattern="^(stock|order|discontinued)$")
    warranty_months: int = Field(default=12, ge=0)
    notes: Optional[str] = None


class QuoteItemCreate(BaseModel):
    """Quote item creation."""
    rfq_item_id: str
    part_id: str
    unit_price: float = Field(..., ge=0)
    quantity: int = Field(..., ge=1)
    lead_time_days: int = Field(..., ge=0)
    availability: str = "stock"
    warranty_months: int = 12
    notes: Optional[str] = None


class QuoteBase(BaseModel):
    """Base quote model."""
    items: List[QuoteItemCreate]
    subtotal: float = Field(..., ge=0)
    tax_amount: float = Field(default=0, ge=0)
    shipping_cost: float = Field(default=0, ge=0)
    total: float = Field(..., ge=0)
    currency: str = Field(default="USD")
    validity_days: int = Field(default=7, ge=1)
    terms: Optional[str] = None


class QuoteCreate(QuoteBase):
    """Quote creation model."""
    rfq_id: str
    supplier_id: str


class Quote(QuoteBase):
    """Quote response model."""
    id: str
    rfq_id: str
    supplier_id: str
    supplier_name: str
    status: str
    expires_at: str
    created_at: str
    items: List[QuoteItem]
    
    class Config:
        from_attributes = True


class QuoteSummary(BaseModel):
    """Quote summary for listings."""
    id: str
    rfq_id: str
    supplier_name: str
    total: float
    status: str
    expires_at: str
    item_count: int
