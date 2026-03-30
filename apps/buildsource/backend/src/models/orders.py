"""Order models."""

from datetime import datetime
from enum import Enum
from typing import List, Optional

from pydantic import BaseModel, Field

from .common import Address


class OrderStatus(str, Enum):
    """Order status enumeration."""
    
    PENDING_CONFIRMATION = "pending_confirmation"
    CONFIRMED = "confirmed"
    PROCESSING = "processing"
    READY_FOR_PICKUP = "ready_for_pickup"
    IN_TRANSIT = "in_transit"
    DELIVERED = "delivered"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    DISPUTED = "disputed"


class DeliveryType(str, Enum):
    """Delivery type enumeration."""
    
    STANDARD = "standard"
    EXPEDITED = "expedited"
    EMERGENCY = "emergency"


class OrderItemBase(BaseModel):
    """Base order item model."""
    
    material_id: str
    description: str
    quantity: float = Field(..., gt=0)
    unit_price: float = Field(..., ge=0)


class OrderItem(OrderItemBase):
    """Full order item model."""
    
    id: str
    order_id: str
    line_total: float
    
    class Config:
        from_attributes = True


class StatusUpdate(BaseModel):
    """Order status update."""
    
    timestamp: datetime
    status: str
    location: Optional[str] = None
    notes: Optional[str] = None


class TrackingInfo(BaseModel):
    """Order tracking information."""
    
    carrier: str
    tracking_number: str
    current_location: Optional[str] = None
    estimated_arrival: datetime
    status_updates: List[StatusUpdate]


class OrderBase(BaseModel):
    """Base order model."""
    
    delivery_type: DeliveryType = DeliveryType.STANDARD
    delivery_address: Address
    delivery_date: datetime
    delivery_window: Optional[str] = None
    po_number: Optional[str] = None
    notes: Optional[str] = None


class OrderCreate(BaseModel):
    """Order creation model."""
    
    quote_id: str
    po_number: Optional[str] = None
    notes: Optional[str] = None


class OrderUpdate(BaseModel):
    """Order update model."""
    
    po_number: Optional[str] = None
    notes: Optional[str] = None
    delivery_date: Optional[datetime] = None
    delivery_window: Optional[str] = None


class Order(BaseModel):
    """Full order model."""
    
    id: str
    order_number: str
    quote_id: str
    project_id: str
    buyer_id: str
    supplier_id: str
    items: List[OrderItem]
    subtotal: float
    tax_amount: float
    delivery_fee: float
    total_amount: float
    delivery_type: DeliveryType
    delivery_address: Address
    delivery_date: datetime
    delivery_window: Optional[str] = None
    status: OrderStatus
    tracking_info: Optional[TrackingInfo] = None
    po_number: Optional[str] = None
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class OrderResponse(Order):
    """Order response with additional computed fields."""
    
    buyer_name: Optional[str] = None
    supplier_name: Optional[str] = None
    project_name: Optional[str] = None


class OrderDocument(BaseModel):
    """Order document."""
    
    id: str
    name: str
    type: str
    url: str
    uploaded_at: datetime


class DeliveryScheduleItem(BaseModel):
    """Delivery schedule item."""
    
    order_id: str
    order_number: str
    delivery_date: datetime
    delivery_window: str
    materials: List[str]
    supplier_name: str
    status: str


class OrderIssue(BaseModel):
    """Order issue report."""
    
    type: str
    description: str
    severity: str  # 'low', 'medium', 'high', 'critical'
