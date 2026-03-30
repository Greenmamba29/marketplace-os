"""RFQ (Request for Quote) models."""

from datetime import datetime
from enum import Enum
from typing import List, Optional

from pydantic import BaseModel, Field

from .common import Address
from .materials import MaterialType, UnitOfMeasure


class RFQStatus(str, Enum):
    """RFQ status enumeration."""
    
    DRAFT = "draft"
    SUBMITTED = "submitted"
    OPEN = "open"
    CLOSING_SOON = "closing_soon"
    CLOSED = "closed"
    AWARDED = "awarded"
    CANCELLED = "cancelled"


class RFQItemBase(BaseModel):
    """Base RFQ item model."""
    
    material_type: MaterialType
    specification: str
    quantity: float = Field(..., gt=0)
    unit_of_measure: UnitOfMeasure
    grade_requirement: Optional[str] = None
    astm_requirement: Optional[str] = None
    notes: Optional[str] = None


class RFQItemCreate(RFQItemBase):
    """RFQ item creation model."""
    
    pass


class RFQItem(RFQItemBase):
    """Full RFQ item model."""
    
    id: str
    rfq_id: str
    
    class Config:
        from_attributes = True


class RFQSubmissionBase(BaseModel):
    """Base RFQ submission model."""
    
    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    delivery_address: Address
    delivery_instructions: Optional[str] = None
    delivery_date: datetime
    acceptance_deadline: datetime


class RFQCreate(RFQSubmissionBase):
    """RFQ creation model."""
    
    project_id: str
    items: List[RFQItemCreate] = Field(..., min_length=1)
    invited_suppliers: Optional[List[str]] = None


class RFQUpdate(BaseModel):
    """RFQ update model."""
    
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    delivery_date: Optional[datetime] = None
    acceptance_deadline: Optional[datetime] = None
    status: Optional[RFQStatus] = None


class RFQSubmission(RFQSubmissionBase):
    """Full RFQ submission model."""
    
    id: str
    rfq_number: str
    project_id: str
    buyer_id: str
    items: List[RFQItem]
    status: RFQStatus
    invited_suppliers: List[str] = []
    quotes_received: int = 0
    best_quote_id: Optional[str] = None
    best_price: Optional[float] = None
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class RFQResponse(RFQSubmission):
    """RFQ response with additional computed fields."""
    
    project_name: Optional[str] = None
    time_remaining_hours: Optional[float] = None
    is_closing_soon: bool = False


class RecommendedSupplier(BaseModel):
    """Recommended supplier for an RFQ."""
    
    supplier_id: str
    supplier_name: str
    match_score: float = Field(..., ge=0, le=100)
    distance_miles: float
    estimated_price: float
    material_types: List[str]
