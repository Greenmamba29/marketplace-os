"""Quote models."""

from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field


class QuoteItemBase(BaseModel):
    """Base quote item model."""
    rfq_item_id: str
    ingredient_name: str
    unit_price: float = Field(..., ge=0)
    quantity: float = Field(..., gt=0)
    unit_of_measure: str
    line_total: float
    lot_number: Optional[str] = None
    expiry_date: Optional[datetime] = None
    available_quantity: int
    is_substitute: bool = False
    original_ingredient_id: Optional[str] = None
    original_ingredient_name: Optional[str] = None


class QuoteItemCreate(BaseModel):
    """Quote item creation model."""
    rfq_item_id: str
    ingredient_id: Optional[str] = None
    ingredient_name: str
    unit_price: float
    quantity: float
    unit_of_measure: str
    lot_number: Optional[str] = None
    expiry_date: Optional[datetime] = None
    available_quantity: int
    is_substitute: bool = False


class QuoteItem(QuoteItemBase):
    """Full quote item model."""
    id: str
    ingredient_id: Optional[str] = None


class QuoteBase(BaseModel):
    """Base quote model."""
    subtotal: float
    tax_amount: float
    shipping_cost: float
    total: float
    payment_terms: str
    lead_time: int = Field(..., ge=0)
    validity_date: datetime
    delivery_date: datetime


class QuoteCreate(QuoteBase):
    """Quote creation model."""
    rfq_id: str
    items: List[QuoteItemCreate]


class QuoteUpdate(BaseModel):
    """Quote update model."""
    status: Optional[str] = Field(None, pattern="^(draft|submitted|under_review|accepted|rejected|expired)$")
    is_selected: Optional[bool] = None


class Quote(QuoteBase):
    """Full quote model."""
    id: str
    quote_number: str
    rfq_id: str
    supplier_id: str
    supplier_name: str
    items: List[QuoteItem]
    status: str = "draft"
    is_selected: bool = False
    selected_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class QuoteSummary(BaseModel):
    """Simplified quote for lists."""
    id: str
    quote_number: str
    supplier_name: str
    total: float
    status: str
    is_selected: bool
    created_at: datetime
