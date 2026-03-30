"""
Common Models for GovSource Backend
"""

from typing import Optional, Generic, TypeVar
from pydantic import BaseModel, Field
from datetime import datetime


T = TypeVar('T')


class ApiResponse(BaseModel, Generic[T]):
    """Standard API response wrapper."""
    success: bool = True
    data: Optional[T] = None
    error: Optional["ApiError"] = None
    meta: Optional["PaginationMeta"] = None


class ApiError(BaseModel):
    """API error details."""
    code: str
    message: str
    details: Optional[dict] = None


class PaginationMeta(BaseModel):
    """Pagination metadata."""
    page: int
    per_page: int
    total: int
    total_pages: int


class Address(BaseModel):
    """Physical address model."""
    street: str
    city: str
    state: str
    zip_code: str = Field(..., alias="zipCode")
    country: str = "USA"

    class Config:
        populate_by_name = True


class GovernmentAgency(BaseModel):
    """Government agency model."""
    id: str
    name: str
    code: str
    department: str
    contracting_officer_name: Optional[str] = Field(None, alias="contractingOfficerName")
    contracting_officer_email: Optional[str] = Field(None, alias="contractingOfficerEmail")

    class Config:
        populate_by_name = True


class TimestampMixin(BaseModel):
    """Mixin for timestamp fields."""
    created_at: datetime = Field(default_factory=datetime.utcnow, alias="createdAt")
    updated_at: datetime = Field(default_factory=datetime.utcnow, alias="updatedAt")

    class Config:
        populate_by_name = True


# Set-aside types
SET_ASIDE_TYPES = [
    "8(a)",
    "HUBZone",
    "SDVOSB",
    "WOSB",
    "EDWOSB",
    "VOSB",
    "SDB",
    "NONE",
]

# Security clearance levels
SECURITY_CLEARANCE_LEVELS = [
    "TS/SCI",
    "Top Secret",
    "Secret",
    "Confidential",
    "Public Trust",
    "None",
]

# SAM registration statuses
SAM_STATUSES = [
    "ACTIVE",
    "INACTIVE",
    "EXPIRED",
    "PENDING",
    "SUSPENDED",
]

# RFP statuses
RFP_STATUSES = [
    "DRAFT",
    "PUBLISHED",
    "OPEN",
    "CLOSED",
    "AWARDED",
    "CANCELLED",
]

# RFQ statuses
RFQ_STATUSES = [
    "DRAFT",
    "PENDING_APPROVAL",
    "APPROVED",
    "SENT",
    "OPEN",
    "CLOSED",
    "AWARDED",
    "CANCELLED",
]

# Contract types
CONTRACT_TYPES = [
    "FIRM_FIXED_PRICE",
    "COST_PLUS",
    "TIME_MATERIALS",
    "IDIQ",
    "BPA",
    "SINGLE_AWARD",
]

# User roles
USER_ROLES = [
    "BUYER",
    "VENDOR",
    "ADMIN",
    "CONTRACTING_OFFICER",
    "COMPLIANCE_OFFICER",
]
