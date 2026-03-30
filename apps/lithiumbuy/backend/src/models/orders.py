"""Order models."""

from datetime import datetime, date
from enum import Enum
from typing import Optional, Dict, Any

from pydantic import BaseModel, Field


class OrderStatus(str, Enum):
    """Order status enumeration."""
    PENDING = "pending"
    CONFIRMED = "confirmed"
    IN_TRANSIT = "in_transit"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"


class OrderBase(BaseModel):
    """Base order model."""
    buyer_id: str
    supplier_id: str
    quote_id: str
    material_id: str
    quantity: float = Field(..., gt=0)
    unit: str = Field(default="mt")
    unit_price: float = Field(..., gt=0)
    total_amount: float = Field(..., gt=0)
    currency: str = Field(default="USD")
    delivery_term: str
    delivery_location: str
    delivery_date: date


class OrderCreate(OrderBase):
    """Order creation model."""
    pass


class Order(OrderBase):
    """Full order model."""
    id: str
    order_number: str
    status: OrderStatus = OrderStatus.PENDING
    tracking_number: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    buyer: Optional[Dict[str, Any]] = None
    supplier: Optional[Dict[str, Any]] = None
    material: Optional[Dict[str, Any]] = None
    
    class Config:
        from_attributes = True


class OrderStatusUpdate(BaseModel):
    """Order status update model."""
    status: OrderStatus
    tracking_number: Optional[str] = None
    notes: Optional[str] = None
