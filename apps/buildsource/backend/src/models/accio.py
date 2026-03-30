"""ACCIO emergency sourcing models."""

from datetime import datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field

from .common import Address
from .materials import MaterialType, UnitOfMeasure


class AccioStatus(str, Enum):
    """ACCIO request status."""
    
    SEARCHING = "searching"
    FOUND = "found"
    IN_TRANSIT = "in_transit"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"


class AccioRequestBase(BaseModel):
    """Base ACCIO request model."""
    
    material_type: MaterialType
    specification: str
    quantity_needed: float = Field(..., gt=0)
    unit_of_measure: UnitOfMeasure
    needed_by: datetime
    delivery_address: Address
    contact_phone: str
    contact_name: str
    urgency_reason: str
    max_budget: Optional[float] = Field(None, ge=0)


class AccioRequestCreate(AccioRequestBase):
    """ACCIO request creation model."""
    
    project_id: str


class AccioRequest(AccioRequestBase):
    """Full ACCIO request model."""
    
    id: str
    request_number: str
    project_id: str
    status: AccioStatus
    matched_supplier_id: Optional[str] = None
    matched_supplier_name: Optional[str] = None
    estimated_arrival: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class AccioEstimateRequest(BaseModel):
    """Request for ACCIO delivery estimate."""
    
    material_type: MaterialType
    zip_code: str
    quantity: float = Field(..., gt=0)


class AccioEstimateResponse(BaseModel):
    """ACCIO delivery estimate response."""
    
    estimated_time_hours: float
    estimated_cost_range: dict[str, float]  # {min: float, max: float}
    available_suppliers: int


class AccioStatusUpdate(BaseModel):
    """ACCIO status update."""
    
    status: AccioStatus
    matched_supplier_id: Optional[str] = None
    estimated_arrival: Optional[datetime] = None
    notes: Optional[str] = None
