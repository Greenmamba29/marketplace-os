"""Supplier models."""

from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field


class SupplierLocation(BaseModel):
    """Supplier location model."""
    id: str
    type: str  # headquarters, manufacturing, warehouse, office
    address: str
    city: str
    country: str
    postal_code: str
    is_primary: bool = False


class SupplierBase(BaseModel):
    """Base supplier model."""
    name: str = Field(..., min_length=1, max_length=200)
    legal_name: str = Field(..., min_length=1, max_length=200)
    description: str = ""
    website: Optional[str] = None
    year_established: int = Field(..., ge=1800, le=2100)
    employee_count: str = "1-50"
    annual_revenue: Optional[str] = None
    certifications: List[str] = []
    specialties: List[str] = []
    moq_kg: float = Field(1, ge=0)
    lead_time_days: int = Field(7, ge=1)
    payment_terms: List[str] = ["NET_30"]


class SupplierCreate(SupplierBase):
    """Supplier creation model."""
    locations: List[SupplierLocation] = []


class SupplierUpdate(BaseModel):
    """Supplier update model."""
    name: Optional[str] = None
    legal_name: Optional[str] = None
    description: Optional[str] = None
    website: Optional[str] = None
    year_established: Optional[int] = None
    employee_count: Optional[str] = None
    annual_revenue: Optional[str] = None
    certifications: Optional[List[str]] = None
    specialties: Optional[List[str]] = None
    moq_kg: Optional[float] = None
    lead_time_days: Optional[int] = None
    payment_terms: Optional[List[str]] = None
    is_active: Optional[bool] = None


class Supplier(SupplierBase):
    """Supplier response model."""
    id: str
    logo_url: Optional[str] = None
    locations: List[SupplierLocation]
    is_verified: bool = False
    verification_date: Optional[datetime] = None
    rating: float = Field(0, ge=0, le=5)
    review_count: int = 0
    is_active: bool = True
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class SupplierListResponse(BaseModel):
    """Supplier list response."""
    items: List[Supplier]
    total: int
    page: int
    size: int
