"""Common models used across the application."""

from typing import Any, Generic, List, Optional, TypeVar

from pydantic import BaseModel, Field


T = TypeVar("T")


class ApiResponse(BaseModel):
    """Standard API response wrapper."""

    success: bool = True
    message: Optional[str] = None
    data: Optional[Any] = None


class PaginatedResponse(BaseModel, Generic[T]):
    """Paginated response wrapper."""

    success: bool = True
    data: List[T] = Field(default_factory=list)
    pagination: "PaginationMeta"


class PaginationMeta(BaseModel):
    """Pagination metadata."""

    page: int = 1
    per_page: int = 20
    total: int = 0
    total_pages: int = 0
    has_next: bool = False
    has_prev: bool = False


class PaginationParams(BaseModel):
    """Pagination query parameters."""

    page: int = Field(default=1, ge=1)
    per_page: int = Field(default=20, ge=1, le=100)

    @property
    def offset(self) -> int:
        """Calculate offset for database queries."""
        return (self.page - 1) * self.per_page


class ErrorResponse(BaseModel):
    """Error response model."""

    success: bool = False
    message: str
    error_code: Optional[str] = None
    details: Optional[dict] = None


class SuccessResponse(BaseModel):
    """Success response model."""

    success: bool = True
    message: str
    data: Optional[Any] = None
