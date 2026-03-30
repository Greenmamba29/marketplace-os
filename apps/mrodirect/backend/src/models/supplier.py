"""Supplier models."""

from typing import Optional, List
from pydantic import BaseModel, Field


class DiscountTier(BaseModel):
    """Contract discount tier."""
    min_quantity: int = Field(..., ge=1)
    discount_percent: float = Field(..., ge=0, le=100)


class SupplierContract(BaseModel):
    """Supplier contract with tiered pricing."""
    id: str
    supplier_id: str
    buyer_id: str
    contract_number: str
    start_date: str
    end_date: str
    discount_tiers: List[DiscountTier]
    payment_terms: str
    shipping_terms: str
    min_order_value: float = Field(default=0, ge=0)
    is_active: bool = True
    
    class Config:
        from_attributes = True


class SupplierBase(BaseModel):
    """Base supplier model."""
    name: str = Field(..., min_length=2, max_length=100)
    slug: str = Field(..., min_length=2, max_length=100)
    description: Optional[str] = None
    website: Optional[str] = None
    email: str
    phone: Optional[str] = None
    categories: List[str] = Field(default_factory=list)
    certifications: List[str] = Field(default_factory=list)
    years_in_business: int = Field(default=0, ge=0)
    annual_revenue: Optional[float] = None
    employee_count: Optional[int] = None


class SupplierCreate(SupplierBase):
    """Supplier creation model."""
    address: Optional[dict] = None


class SupplierUpdate(BaseModel):
    """Supplier update model."""
    name: Optional[str] = None
    description: Optional[str] = None
    website: Optional[str] = None
    phone: Optional[str] = None
    categories: Optional[List[str]] = None
    certifications: Optional[List[str]] = None
    is_verified: Optional[bool] = None
    is_authorized: Optional[bool] = None


class Supplier(SupplierBase):
    """Supplier response model."""
    id: str
    logo: Optional[str] = None
    address: Optional[dict] = None
    rating: float = Field(default=0, ge=0, le=5)
    review_count: int = Field(default=0, ge=0)
    is_verified: bool = False
    is_authorized: bool = False
    created_at: str
    
    class Config:
        from_attributes = True


class SupplierSummary(BaseModel):
    """Supplier summary for listings."""
    id: str
    name: str
    slug: str
    categories: List[str]
    rating: float
    review_count: int
    is_verified: bool
    is_authorized: bool
    years_in_business: int
