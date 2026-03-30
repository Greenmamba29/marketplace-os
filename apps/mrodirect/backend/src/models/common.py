"""Common models used across the application."""

from typing import Generic, List, Optional, TypeVar
from pydantic import BaseModel, Field


T = TypeVar("T")


class PaginationParams(BaseModel):
    """Pagination query parameters."""
    page: int = Field(1, ge=1, description="Page number")
    page_size: int = Field(20, ge=1, le=100, description="Items per page")
    
    @property
    def offset(self) -> int:
        """Calculate offset for database queries."""
        return (self.page - 1) * self.page_size


class PaginatedResponse(BaseModel, Generic[T]):
    """Paginated response wrapper."""
    items: List[T]
    total: int
    page: int
    page_size: int
    total_pages: int
    
    @classmethod
    def create(
        cls,
        items: List[T],
        total: int,
        page: int,
        page_size: int
    ) -> "PaginatedResponse[T]":
        """Create a paginated response."""
        total_pages = (total + page_size - 1) // page_size
        return cls(
            items=items,
            total=total,
            page=page,
            page_size=page_size,
            total_pages=total_pages
        )


class APIError(BaseModel):
    """API error details."""
    code: str
    message: str
    details: Optional[dict] = None


class APIResponse(BaseModel, Generic[T]):
    """Standard API response wrapper."""
    success: bool = True
    data: Optional[T] = None
    error: Optional[APIError] = None
    meta: Optional[dict] = None
    
    @classmethod
    def success_response(cls, data: T, meta: Optional[dict] = None) -> "APIResponse[T]":
        """Create a successful response."""
        return cls(success=True, data=data, meta=meta)
    
    @classmethod
    def error_response(
        cls,
        code: str,
        message: str,
        details: Optional[dict] = None
    ) -> "APIResponse[T]":
        """Create an error response."""
        return cls(
            success=False,
            error=APIError(code=code, message=message, details=details)
        )


class PriceRange(BaseModel):
    """Price range filter."""
    min: Optional[float] = None
    max: Optional[float] = None


class DateRange(BaseModel):
    """Date range filter."""
    from_date: Optional[str] = None
    to_date: Optional[str] = None
