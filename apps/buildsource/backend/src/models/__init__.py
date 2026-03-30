"""Pydantic models for API requests and responses."""

from .auth import (
    User,
    UserCreate,
    UserUpdate,
    UserResponse,
    LoginRequest,
    LoginResponse,
    TokenPayload,
)
from .materials import (
    Material,
    MaterialCreate,
    MaterialUpdate,
    MaterialFilters,
    MaterialResponse,
    RegionalAvailability,
    SpecSheet,
)
from .projects import (
    Project,
    ProjectCreate,
    ProjectUpdate,
    ProjectMaterial,
    ProjectMaterialCreate,
    ProjectResponse,
)
from .rfq import (
    RFQSubmission,
    RFQItem,
    RFQItemCreate,
    RFQCreate,
    RFQUpdate,
    RFQResponse,
)
from .quotes import (
    Quote,
    QuoteItem,
    QuoteItemCreate,
    QuoteCreate,
    QuoteUpdate,
    QuoteResponse,
)
from .orders import (
    Order,
    OrderItem,
    OrderCreate,
    OrderUpdate,
    OrderResponse,
    TrackingInfo,
)
from .leed import (
    LEEDTracking,
    MRCredit,
    LEEDCreditDetail,
    RecycledContentSummary,
    RegionalMaterialsSummary,
)
from .accio import (
    AccioRequest,
    AccioRequestCreate,
    AccioEstimateRequest,
    AccioEstimateResponse,
)
from .common import (
    Address,
    PaginatedResponse,
    ApiResponse,
    DashboardStats,
)

__all__ = [
    # Auth
    "User",
    "UserCreate",
    "UserUpdate",
    "UserResponse",
    "LoginRequest",
    "LoginResponse",
    "TokenPayload",
    # Materials
    "Material",
    "MaterialCreate",
    "MaterialUpdate",
    "MaterialFilters",
    "MaterialResponse",
    "RegionalAvailability",
    "SpecSheet",
    # Projects
    "Project",
    "ProjectCreate",
    "ProjectUpdate",
    "ProjectMaterial",
    "ProjectMaterialCreate",
    "ProjectResponse",
    # RFQ
    "RFQSubmission",
    "RFQItem",
    "RFQItemCreate",
    "RFQCreate",
    "RFQUpdate",
    "RFQResponse",
    # Quotes
    "Quote",
    "QuoteItem",
    "QuoteItemCreate",
    "QuoteCreate",
    "QuoteUpdate",
    "QuoteResponse",
    # Orders
    "Order",
    "OrderItem",
    "OrderCreate",
    "OrderUpdate",
    "OrderResponse",
    "TrackingInfo",
    # LEED
    "LEEDTracking",
    "MRCredit",
    "LEEDCreditDetail",
    "RecycledContentSummary",
    "RegionalMaterialsSummary",
    # ACCIO
    "AccioRequest",
    "AccioRequestCreate",
    "AccioEstimateRequest",
    "AccioEstimateResponse",
    # Common
    "Address",
    "PaginatedResponse",
    "ApiResponse",
    "DashboardStats",
]
