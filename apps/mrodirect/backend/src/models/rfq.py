"""RFQ (Request for Quote) models."""

from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, Field


class RFQItem(BaseModel):
    """RFQ line item."""
    part_id: str
    part_sku: Optional[str] = None
    part_name: Optional[str] = None
    manufacturer_part_number: Optional[str] = None
    quantity: int = Field(..., ge=1)
    target_price: Optional[float] = Field(None, ge=0)
    notes: Optional[str] = None
    is_substitute_allowed: bool = True


class RFQItemCreate(BaseModel):
    """RFQ item creation."""
    part_id: str
    quantity: int = Field(..., ge=1)
    target_price: Optional[float] = None
    notes: Optional[str] = None
    is_substitute_allowed: bool = True


class RFQBase(BaseModel):
    """Base RFQ model."""
    title: str = Field(..., min_length=3, max_length=200)
    description: Optional[str] = None
    delivery_location: str = Field(..., min_length=5)
    required_delivery_date: str
    is_emergency: bool = False
    emergency_reason: Optional[str] = None


class RFQCreate(RFQBase):
    """RFQ creation model."""
    items: List[RFQItemCreate] = Field(..., min_length=1)


class RFQUpdate(BaseModel):
    """RFQ update model."""
    title: Optional[str] = None
    description: Optional[str] = None
    delivery_location: Optional[str] = None
    required_delivery_date: Optional[str] = None
    status: Optional[str] = None


class RFQSubmission(RFQBase):
    """RFQ response model."""
    id: str
    buyer_id: str
    buyer_company: str
    items: List[RFQItem]
    status: str
    quotes_count: int = 0
    created_at: str
    updated_at: str
    expires_at: Optional[str] = None
    
    class Config:
        from_attributes = True


class RFQSummary(BaseModel):
    """RFQ summary for listings."""
    id: str
    title: str
    buyer_company: str
    item_count: int
    status: str
    is_emergency: bool
    created_at: str
    expires_at: Optional[str] = None


class EmergencySourcingRequest(BaseModel):
    """Emergency sourcing request."""
    part_number: str = Field(..., min_length=1)
    quantity: int = Field(..., ge=1)
    needed_by: str
    location: str = Field(..., min_length=5)
    contact_phone: str = Field(..., min_length=10)
