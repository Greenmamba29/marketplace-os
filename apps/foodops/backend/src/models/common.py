"""Common models used across the API."""

from typing import Generic, List, Optional, TypeVar
from pydantic import BaseModel, Field
from datetime import datetime


T = TypeVar("T")


class PaginationParams(BaseModel):
    """Pagination query parameters."""
    page: int = Field(1, ge=1, description="Page number")
    limit: int = Field(20, ge=1, le=100, description="Items per page")
    sort_by: Optional[str] = Field(None, description="Field to sort by")
    sort_order: str = Field("desc", pattern="^(asc|desc)$")


class PaginationMeta(BaseModel):
    """Pagination metadata."""
    page: int
    limit: int
    total: int
    total_pages: int
    has_next: bool
    has_prev: bool


class PaginatedResponse(BaseModel, Generic[T]):
    """Generic paginated response."""
    data: List[T]
    pagination: PaginationMeta


class ApiError(BaseModel):
    """API error details."""
    code: str
    message: str
    details: Optional[dict] = None


class ApiMeta(BaseModel):
    """API response metadata."""
    timestamp: datetime
    request_id: str


class ApiResponse(BaseModel, Generic[T]):
    """Generic API response wrapper."""
    success: bool
    data: Optional[T] = None
    error: Optional[ApiError] = None
    meta: Optional[ApiMeta] = None


class DashboardStats(BaseModel):
    """Dashboard statistics."""
    total_orders: int
    pending_orders: int
    orders_this_week: int
    orders_change_percent: float
    total_spend: float
    spend_this_month: float
    spend_change_percent: float
    low_stock_items: int
    expiring_items: int
    active_excursions: int
    temperature_compliance: float
    pending_lots: int
    compliance_score: float
