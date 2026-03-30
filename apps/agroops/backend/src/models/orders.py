"""Order models."""

from datetime import datetime
from decimal import Decimal
from typing import List, Optional

from pydantic import BaseModel, Field


class OrderStatus(str):
    """Order statuses."""
    PENDING = "pending"
    CONFIRMED = "confirmed"
    PROCESSING = "processing"
    SHIPPED = "shipped"
    DELIVERED = "delivered"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class Address(BaseModel):
    """Address model."""
    street: str
    city: str
    state: str
    zip: str
    country: str = "USA"


class OrderLineItem(BaseModel):
    """Order line item model."""
    id: str
    product_id: str
    product_name: str
    quantity: float
    unit: str
    unit_price: Decimal
    line_total: Decimal
    lot_number: Optional[str] = None
    epa_number: Optional[str] = None


class OrderLineItemCreate(BaseModel):
    """Order line item creation model."""
    product_id: str
    product_name: str
    quantity: float = Field(..., gt=0.0)
    unit: str
    unit_price: Decimal = Field(..., gt=0.0)
    lot_number: Optional[str] = None
    epa_number: Optional[str] = None


class OrderBase(BaseModel):
    """Base order model."""
    # Financial
    subtotal: Decimal
    tax_amount: Decimal = Decimal("0.00")
    shipping_amount: Decimal = Decimal("0.00")
    total_amount: Decimal
    
    # Payment terms
    payment_terms: str
    due_date: Optional[datetime] = None
    
    # Delivery
    delivery_address: Address
    expected_delivery_date: datetime


class OrderCreate(BaseModel):
    """Order creation model."""
    quote_id: str


class Order(OrderBase):
    """Order response model."""
    id: str
    quote_id: str
    rfq_id: str
    buyer_id: str
    buyer_name: str
    supplier_id: str
    supplier_name: str
    
    status: str = "pending"
    
    line_items: List[OrderLineItem]
    
    # Financial tracking
    amount_paid: Decimal = Decimal("0.00")
    balance_due: Decimal
    
    # Delivery tracking
    actual_delivery_date: Optional[datetime] = None
    tracking_number: Optional[str] = None
    
    # Compliance
    epa_docs_received: bool = False
    sds_included: bool = False
    
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class OrderUpdate(BaseModel):
    """Order update model."""
    status: Optional[str] = None
    tracking_number: Optional[str] = None
    actual_delivery_date: Optional[datetime] = None
    epa_docs_received: Optional[bool] = None
    sds_included: Optional[bool] = None


class OrderPayment(BaseModel):
    """Order payment model."""
    order_id: str
    amount: Decimal = Field(..., gt=0.0)
    payment_method: str
    reference: Optional[str] = None


class PaginatedOrders(BaseModel):
    """Paginated orders response."""
    items: List[Order]
    total: int
    page: int
    per_page: int
    total_pages: int
