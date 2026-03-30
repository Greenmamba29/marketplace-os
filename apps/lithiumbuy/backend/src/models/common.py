"""Common models and response types."""

from typing import Generic, List, Optional, TypeVar

from pydantic import BaseModel

T = TypeVar("T")


class ApiResponse(BaseModel, Generic[T]):
    """Standard API response wrapper."""
    success: bool = True
    data: Optional[T] = None
    message: Optional[str] = None
    error: Optional[str] = None


class PaginatedResponse(BaseModel, Generic[T]):
    """Paginated response wrapper."""
    items: List[T]
    total: int
    page: int
    per_page: int
    total_pages: int


class PaginationParams(BaseModel):
    """Pagination query parameters."""
    page: int = 1
    per_page: int = 20


class MaterialFilters(BaseModel):
    """Material filter parameters."""
    form: Optional[str] = None
    grade: Optional[str] = None
    ira_compliant: Optional[bool] = None
    origin_country: Optional[str] = None
    min_quantity: Optional[float] = None
    max_price: Optional[float] = None
    delivery_term: Optional[str] = None


class PriceHistoryFilters(BaseModel):
    """Price history filter parameters."""
    material_form: str
    grade: Optional[str] = None
    start_date: str
    end_date: str
    currency: Optional[str] = "USD"


class DateRangeFilter(BaseModel):
    """Date range filter."""
    start_date: Optional[str] = None
    end_date: Optional[str] = None
