"""Order models."""

from datetime import datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field


class OrderStatus(str, Enum):
    """Order statuses."""
    PENDING_PAYMENT = "pending_payment"
    PAYMENT_RECEIVED = "payment_received"
    PROCESSING = "processing"
    SHIPPED = "shipped"
    DELIVERED = "delivered"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    DISPUTED = "disputed"


class PaymentStatus(str, Enum):
    """Payment statuses."""
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"
    REFUNDED = "refunded"


class OrderBase(BaseModel):
    """Base order model."""
    quote_id: str
    shipping_address: str
    po_number: Optional[str] = None


class OrderCreate(OrderBase):
    """Order creation model."""
    pass


class OrderUpdate(BaseModel):
    """Order update model."""
    status: Optional[OrderStatus] = None
    po_number: Optional[str] = None
    tracking_number: Optional[str] = None
    carrier: Optional[str] = None
    expected_delivery: Optional[datetime] = None
    actual_delivery: Optional[datetime] = None


class Order(OrderBase):
    """Order response model."""
    id: str
    buyer_id: str
    supplier_id: str
    status: OrderStatus
    tracking_number: Optional[str] = None
    carrier: Optional[str] = None
    total_amount: float
    currency: str
    payment_status: PaymentStatus
    payment_method: Optional[str] = None
    payment_date: Optional[datetime] = None
    expected_delivery: Optional[datetime] = None
    actual_delivery: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class OrderListResponse(BaseModel):
    """Order list response."""
    items: List[Order]
    total: int
    page: int
    size: int


class PaymentIntentRequest(BaseModel):
    """Payment intent request."""
    order_id: str
    payment_method_id: Optional[str] = None


class PaymentIntentResponse(BaseModel):
    """Payment intent response."""
    client_secret: str
    publishable_key: str
