"""Order models."""

from datetime import datetime
from decimal import Decimal
from enum import Enum
from typing import List, Optional

from pydantic import BaseModel, Field


class OrderStatus(str, Enum):
    """Order status enumeration."""
    PENDING = "pending"
    CONFIRMED = "confirmed"
    PROCESSING = "processing"
    SHIPPED = "shipped"
    IN_TRANSIT = "in_transit"
    DELIVERED = "delivered"
    PARTIALLY_DELIVERED = "partially_delivered"
    RECEIVED = "received"
    INSPECTED = "inspected"
    ACCEPTED = "accepted"
    REJECTED = "rejected"
    CANCELLED = "cancelled"
    RETURNED = "returned"


class OrderItem(BaseModel):
    """Order line item."""
    id: str
    equipment_id: str
    description: str
    quantity: int
    unit_price: Decimal
    total_price: Decimal
    lot_number: Optional[str] = None
    serial_numbers: List[str] = Field(default_factory=list)
    expiration_date: Optional[datetime] = None
    udi_numbers: List[str] = Field(default_factory=list)
    received_quantity: Optional[int] = None
    accepted_quantity: Optional[int] = None
    rejected_quantity: Optional[int] = None
    rejection_reason: Optional[str] = None


class OrderTotals(BaseModel):
    """Order totals."""
    subtotal: Decimal
    tax: Decimal
    shipping: Decimal
    discount: Decimal
    total: Decimal
    currency: str = "USD"


class ShippingInfo(BaseModel):
    """Shipping information."""
    method: str
    carrier: Optional[str] = None
    tracking_number: Optional[str] = None
    estimated_delivery: Optional[datetime] = None
    actual_delivery: Optional[datetime] = None
    special_instructions: Optional[str] = None
    cold_chain: bool = False


class TrackingEvent(BaseModel):
    """Tracking event."""
    timestamp: datetime
    status: str
    location: Optional[str] = None
    description: str


class OrderTracking(BaseModel):
    """Order tracking information."""
    current_status: OrderStatus
    current_location: Optional[str] = None
    events: List[TrackingEvent]


class OrderCompliance(BaseModel):
    """Order compliance information."""
    fda_verified: bool = False
    udi_recorded: bool = False
    lot_tracked: bool = False
    temperature_maintained: Optional[bool] = None
    inspection_passed: Optional[bool] = None
    certificates_received: List[str] = Field(default_factory=list)


class OrderBase(BaseModel):
    """Base order model."""
    po_number: str = Field(..., min_length=1, max_length=100)
    notes: Optional[str] = None


class OrderCreate(OrderBase):
    """Order creation model."""
    quote_id: Optional[str] = None
    rfq_id: Optional[str] = None
    supplier_id: str
    facility_id: str
    department_id: Optional[str] = None
    items: List[OrderItem]
    shipping: ShippingInfo


class OrderUpdate(BaseModel):
    """Order update model."""
    status: Optional[OrderStatus] = None
    notes: Optional[str] = None
    shipping: Optional[ShippingInfo] = None


class Order(OrderBase):
    """Full order model."""
    id: str
    order_number: str
    quote_id: Optional[str]
    rfq_id: Optional[str]
    buyer_id: str
    supplier_id: str
    organization_id: str
    facility_id: str
    department_id: Optional[str]
    status: OrderStatus
    items: List[OrderItem]
    totals: OrderTotals
    shipping: ShippingInfo
    tracking: OrderTracking
    udi_tracking: List[dict] = Field(default_factory=list)
    compliance: OrderCompliance
    created_at: datetime
    updated_at: datetime
    
    model_config = {"from_attributes": True}


class ReceiveItemsRequest(BaseModel):
    """Request to receive order items."""
    items: List[dict]


class OrderFilter(BaseModel):
    """Order filter parameters."""
    status: Optional[List[OrderStatus]] = None
    supplier_id: Optional[str] = None
    facility_id: Optional[str] = None
    date_from: Optional[datetime] = None
    date_to: Optional[datetime] = None
