"""Pydantic models for the LithiumBuy API."""

from .auth import (
    User,
    UserCreate,
    UserLogin,
    Token,
    TokenPayload,
    UserRole,
)
from .materials import (
    Material,
    MaterialCreate,
    MaterialForm,
    PurityGrade,
    DeliveryTerm,
    Mine,
    MineCreate,
)
from .pricing import (
    SpotPrice,
    PriceIndex,
    PriceHistory,
    Currency,
)
from .contracts import (
    Contract,
    ContractCreate,
    ContractType,
    ContractStatus,
    DeliverySchedule,
    QualitySpec,
    PaymentTerms,
)
from .rfq import (
    RFQ,
    RFQCreate,
    RFQStatus,
    Quote,
    QuoteCreate,
    QuoteStatus,
)
from .orders import (
    Order,
    OrderCreate,
    OrderStatus,
)
from .intelligence import (
    SupplyAlert,
    GeopoliticalRisk,
    AlertSeverity,
    AlertType,
)
from .common import (
    ApiResponse,
    PaginatedResponse,
    MaterialFilters,
)

__all__ = [
    # Auth
    "User",
    "UserCreate",
    "UserLogin",
    "Token",
    "TokenPayload",
    "UserRole",
    # Materials
    "Material",
    "MaterialCreate",
    "MaterialForm",
    "PurityGrade",
    "DeliveryTerm",
    "Mine",
    "MineCreate",
    # Pricing
    "SpotPrice",
    "PriceIndex",
    "PriceHistory",
    "Currency",
    # Contracts
    "Contract",
    "ContractCreate",
    "ContractType",
    "ContractStatus",
    "DeliverySchedule",
    "QualitySpec",
    "PaymentTerms",
    # RFQ
    "RFQ",
    "RFQCreate",
    "RFQStatus",
    "Quote",
    "QuoteCreate",
    "QuoteStatus",
    # Orders
    "Order",
    "OrderCreate",
    "OrderStatus",
    # Intelligence
    "SupplyAlert",
    "GeopoliticalRisk",
    "AlertSeverity",
    "AlertType",
    # Common
    "ApiResponse",
    "PaginatedResponse",
    "MaterialFilters",
]
