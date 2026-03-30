"""Order models."""

from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field


class Address(BaseModel):
    """Delivery address model."""
    name: str
    line1: str
    line2: Optional[str] = None
    city: str
    state: str
    postal_code: str
    country: str = "USA"
    phone: Optional[str] = None
    delivery_instructions: Optional[str] = None


class OrderItemBase(BaseModel):
    """Base order item model."""
    ingredient_id: str
    ingredient_name: str
    quantity: float = Field(..., gt=0)
    unit_of_measure: str
    unit_price: float
    line_total: float
    lot_number: Optional[str] = None
    lot_id: Optional[str] = None


class OrderItemCreate(BaseModel):
    """Order item creation model."""
    ingredient_id: str
    quantity: float
    unit_price: float


class OrderItem(OrderItemBase):
    """Full order item model."""
    id: str
    quantity_shipped: float = 0
    quantity_received: float = 0


class OrderBase(BaseModel):
    """Base order model."""
    delivery_date: datetime
    delivery_window_earliest: str
    delivery_window_latest: str
    delivery_address: Address


class OrderCreate(OrderBase):
    """Order creation model."""
    quote_id: Optional[str] = None
    rfq_id: Optional[str] = None
    items: List[OrderItemCreate]


class OrderUpdate(BaseModel):
    """Order update model."""
    status: Optional[str] = Field(None, pattern="^(pending|confirmed|processing|shipped|delivered|cancelled)$")
    fulfillment_status: Optional[str] = Field(None, pattern="^(pending|picking|packed|shipped|in_transit|delivered)$")
    payment_status: Optional[str] = Field(None, pattern="^(pending|invoiced|paid|overdue)$")


class Order(OrderBase):
    """Full order model."""
    id: str
    order_number: str
    buyer_id: str
    buyer_name: str
    supplier_id: str
    supplier_name: str
    quote_id: Optional[str] = None
    rfq_id: Optional[str] = None
    items: List[OrderItem]
    subtotal: float
    tax_amount: float
    shipping_cost: float
    total: float
    status: str = "pending"
    fulfillment_status: str = "pending"
    payment_status: str = "pending"
    temperature_readings: Optional[List[dict]] = None
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class OrderSummary(BaseModel):
    """Simplified order for lists."""
    id: str
    order_number: str
    supplier_name: str
    total: float
    status: str
    fulfillment_status: str
    delivery_date: datetime
    created_at: datetime
