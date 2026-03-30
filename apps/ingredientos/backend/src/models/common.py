"""
Common models used across the API
"""

from typing import Generic, TypeVar, Optional, List
from pydantic import BaseModel, Field


T = TypeVar("T")


class StatusMessage(BaseModel):
    """Simple status message response"""
    message: str
    success: bool = True


class ApiResponse(BaseModel, Generic[T]):
    """Generic API response wrapper"""
    success: bool = True
    data: Optional[T] = None
    message: Optional[str] = None
    error: Optional[str] = None


class PaginationParams(BaseModel):
    """Pagination parameters"""
    page: int = Field(default=1, ge=1)
    per_page: int = Field(default=20, ge=1, le=100)


class PaginatedResponse(BaseModel, Generic[T]):
    """Paginated response with items and metadata"""
    items: List[T]
    total: int
    page: int
    per_page: int
    total_pages: int
    
    @classmethod
    def create(
        cls,
        items: List[T],
        total: int,
        page: int,
        per_page: int,
    ) -> "PaginatedResponse[T]":
        """Create a paginated response"""
        total_pages = (total + per_page - 1) // per_page
        return cls(
            items=items,
            total=total,
            page=page,
            per_page=per_page,
            total_pages=total_pages,
        )


class Address(BaseModel):
    """Physical address model"""
    street: str
    city: str
    state: Optional[str] = None
    postal_code: str
    country: str


class TimestampMixin(BaseModel):
    """Mixin for timestamp fields"""
    created_at: Optional[str] = None
    updated_at: Optional[str] = None


class IDMixin(BaseModel):
    """Mixin for ID field"""
    id: Optional[str] = None
