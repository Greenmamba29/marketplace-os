"""
Common Models for LabSource
"""

from typing import Any, Dict, Generic, List, Optional, TypeVar
from datetime import datetime
from enum import Enum

from pydantic import BaseModel, Field, ConfigDict


class Address(BaseModel):
    """Physical address model."""
    model_config = ConfigDict(populate_by_name=True)
    
    street: str
    city: str
    state: str
    zip_code: str = Field(alias="zipCode")
    country: str = "USA"


class OrganizationType(str, Enum):
    """Organization types."""
    ACADEMIC = "academic"
    PHARMA = "pharma"
    BIOTECH = "biotech"
    CRO = "cRO"
    DIAGNOSTIC = "diagnostic"
    GOVERNMENT = "government"


class Organization(BaseModel):
    """Organization model."""
    model_config = ConfigDict(populate_by_name=True)
    
    id: Optional[str] = None
    name: str
    type: OrganizationType
    address: Address
    tax_id: Optional[str] = Field(default=None, alias="taxId")
    grant_numbers: List[str] = Field(default_factory=list, alias="grantNumbers")
    clia_number: Optional[str] = Field(default=None, alias="cliaNumber")
    cap_accredited: bool = Field(default=False, alias="capAccredited")


class LabCertificationType(str, Enum):
    """Lab certification types."""
    CLIA = "CLIA"
    CAP = "CAP"
    GLP = "GLP"
    GMP = "GMP"
    ISO17025 = "ISO17025"


class LabCertification(BaseModel):
    """Lab certification model."""
    model_config = ConfigDict(populate_by_name=True)
    
    type: LabCertificationType
    number: str
    valid_until: datetime = Field(alias="validUntil")
    document_url: Optional[str] = Field(default=None, alias="documentUrl")


T = TypeVar("T")


class PaginationParams(BaseModel):
    """Pagination parameters."""
    page: int = Field(default=1, ge=1)
    per_page: int = Field(default=20, ge=1, le=100)
    
    @property
    def offset(self) -> int:
        return (self.page - 1) * self.per_page


class PaginationMeta(BaseModel):
    """Pagination metadata."""
    page: int
    per_page: int = Field(alias="perPage")
    total: int
    total_pages: int = Field(alias="totalPages")


class ApiError(BaseModel):
    """API error response."""
    code: str
    message: str
    details: Optional[Dict[str, List[str]]] = None


class ApiResponse(BaseModel, Generic[T]):
    """Generic API response wrapper."""
    model_config = ConfigDict(populate_by_name=True)
    
    success: bool = True
    data: Optional[T] = None
    error: Optional[ApiError] = None
    meta: Optional[PaginationMeta] = None
    
    @classmethod
    def success_response(cls, data: T, meta: Optional[PaginationMeta] = None) -> "ApiResponse[T]":
        return cls(success=True, data=data, meta=meta)
    
    @classmethod
    def error_response(cls, code: str, message: str, details: Optional[Dict[str, List[str]]] = None) -> "ApiResponse[T]":
        return cls(success=False, error=ApiError(code=code, message=message, details=details))


class AuditLogEntry(BaseModel):
    """Audit log entry model."""
    model_config = ConfigDict(populate_by_name=True)
    
    id: Optional[str] = None
    action: str
    user_id: str = Field(alias="userId")
    user_email: str = Field(alias="userEmail")
    resource_type: str = Field(alias="resourceType")
    resource_id: Optional[str] = Field(default=None, alias="resourceId")
    details: Optional[Dict[str, Any]] = None
    ip_address: Optional[str] = Field(default=None, alias="ipAddress")
    user_agent: Optional[str] = Field(default=None, alias="userAgent")
    timestamp: datetime = Field(default_factory=datetime.utcnow)
