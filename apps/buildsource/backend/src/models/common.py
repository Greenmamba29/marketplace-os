"""Common models used across the application."""

from typing import Any, Generic, List, Optional, TypeVar

from pydantic import BaseModel, Field


class Address(BaseModel):
    """Physical address model."""
    
    street: str
    city: str
    state: str
    zip: str = Field(..., pattern=r"^\d{5}(-\d{4})?$")
    country: str = "USA"
    
    class Config:
        json_schema_extra = {
            "example": {
                "street": "123 Main St",
                "city": "New York",
                "state": "NY",
                "zip": "10001",
                "country": "USA",
            }
        }


T = TypeVar("T")


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
        page_size: int,
    ) -> "PaginatedResponse[T]":
        """Create a paginated response."""
        total_pages = (total + page_size - 1) // page_size
        return cls(
            items=items,
            total=total,
            page=page,
            page_size=page_size,
            total_pages=total_pages,
        )


class ApiResponse(BaseModel, Generic[T]):
    """Standard API response wrapper."""
    
    success: bool = True
    data: Optional[T] = None
    error: Optional[str] = None
    message: Optional[str] = None
    
    @classmethod
    def success_response(cls, data: T, message: Optional[str] = None) -> "ApiResponse[T]":
        """Create a successful response."""
        return cls(success=True, data=data, message=message)
    
    @classmethod
    def error_response(cls, error: str, message: Optional[str] = None) -> "ApiResponse[Any]":
        """Create an error response."""
        return cls(success=False, error=error, message=message)


class DashboardStats(BaseModel):
    """Dashboard statistics."""
    
    active_projects: int
    materials_sourced: int
    total_spend: float
    pending_rfqs: int
    leed_points_earned: int
    co2_saved_tons: float
