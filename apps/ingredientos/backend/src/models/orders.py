"""
Order models
"""

from typing import Optional
from pydantic import BaseModel, Field

from .common import TimestampMixin, Address


class OrderBase(BaseModel):
    """Base order model"""
    quantity_kg: int = Field(..., ge=1)
    unit_price: float = Field(..., ge=0)
    total_amount: float = Field(..., ge=0)


class OrderCreate(OrderBase):
    """Order creation model"""
    quote_id: str
    shipping_address: Address


class OrderUpdate(BaseModel):
    """Order update model"""
    status: Optional[str] = Field(None, pattern="^(pending_confirmation|confirmed|processing|shipped|delivered|cancelled|disputed)$")
    tracking_number: Optional[str] = None
    estimated_delivery: Optional[str] = None


class Order(OrderBase, TimestampMixin):
    """Complete order model"""
    id: str
    quote_id: str
    rfq_id: str
    buyer_id: str
    supplier_id: str
    ingredient_id: str
    ingredient_name: str
    shipping_address: Address
    status: str = "pending_confirmation"
    tracking_number: Optional[str] = None
    estimated_delivery: Optional[str] = None
    coa_url: Optional[str] = None
    batch_number: Optional[str] = None
    payment_status: str = Field(default="pending", pattern="^(pending|processing|completed|failed|refunded)$")
