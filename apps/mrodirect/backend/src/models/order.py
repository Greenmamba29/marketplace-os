"""Order models."""

from typing import Optional, List
from pydantic import BaseModel, Field


class Address(BaseModel):
    """Shipping address."""
    name: str
    company: str
    street1: str
    street2: Optional[str] = None
    city: str
    state: str
    postal_code: str
    country: str = "US"
    phone: Optional[str] = None


class OrderItem(BaseModel):
    """Order line item."""
    part_id: str
    part_sku: str
    part_name: str
    quantity: int = Field(..., ge=1)
    unit_price: float = Field(..., ge=0)
    total: float = Field(..., ge=0)


class OrderItemCreate(BaseModel):
    """Order item creation."""
    part_id: str
    quantity: int = Field(..., ge=1)


class OrderBase(BaseModel):
    """Base order model."""
    shipping_address: Address
    po_number: Optional[str] = None
    notes: Optional[str] = None


class OrderCreate(OrderBase):
    """Order creation model."""
    quote_id: Optional[str] = None
    items: Optional[List[OrderItemCreate]] = None


class Order(OrderBase):
    """Order response model."""
    id: str
    buyer_id: str
    buyer_company: str
    supplier_id: str
    supplier_name: str
    quote_id: Optional[str] = None
    items: List[OrderItem]
    subtotal: float
    tax_amount: float
    shipping_cost: float
    total: float
    currency: str
    status: str
    tracking_number: Optional[str] = None
    carrier: Optional[str] = None
    estimated_delivery: Optional[str] = None
    actual_delivery: Optional[str] = None
    created_at: str
    updated_at: str
    
    class Config:
        from_attributes = True


class OrderSummary(BaseModel):
    """Order summary for listings."""
    id: str
    supplier_name: str
    total: float
    status: str
    item_count: int
    created_at: str
    estimated_delivery: Optional[str] = None


class OrderStatusUpdate(BaseModel):
    """Order status update."""
    status: str = Field(..., pattern="^(pending|confirmed|shipped|delivered|cancelled|disputed)$")
    tracking_number: Optional[str] = None
    carrier: Optional[str] = None
    estimated_delivery: Optional[str] = None
