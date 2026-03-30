"""
Pydantic models for IngredientOS API
"""

from .auth import User, UserCreate, UserLogin, Token, TokenData
from .ingredients import (
    Ingredient,
    IngredientCreate,
    IngredientUpdate,
    IngredientFilter,
    Supplier,
    SupplierCreate,
    IngredientSpecs,
    RegulatoryStatus,
)
from .regulatory import (
    Certification,
    CertificationCreate,
    GRASStatus,
    GRASStatusCreate,
    AllergenProfile,
    AllergenProfileCreate,
    FunctionalClaim,
    FunctionalClaimCreate,
    ComplianceDocument,
)
from .rfq import (
    RFQSubmission,
    RFQSubmissionCreate,
    RFQSubmissionUpdate,
    Quote,
    QuoteCreate,
    QuoteUpdate,
    AllergenRequirement,
)
from .orders import Order, OrderCreate, OrderUpdate, Address
from .common import ApiResponse, PaginatedResponse, StatusMessage

__all__ = [
    # Auth
    "User",
    "UserCreate",
    "UserLogin",
    "Token",
    "TokenData",
    # Ingredients
    "Ingredient",
    "IngredientCreate",
    "IngredientUpdate",
    "IngredientFilter",
    "Supplier",
    "SupplierCreate",
    "IngredientSpecs",
    "RegulatoryStatus",
    # Regulatory
    "Certification",
    "CertificationCreate",
    "GRASStatus",
    "GRASStatusCreate",
    "AllergenProfile",
    "AllergenProfileCreate",
    "FunctionalClaim",
    "FunctionalClaimCreate",
    "ComplianceDocument",
    # RFQ
    "RFQSubmission",
    "RFQSubmissionCreate",
    "RFQSubmissionUpdate",
    "Quote",
    "QuoteCreate",
    "QuoteUpdate",
    "AllergenRequirement",
    # Orders
    "Order",
    "OrderCreate",
    "OrderUpdate",
    "Address",
    # Common
    "ApiResponse",
    "PaginatedResponse",
    "StatusMessage",
]
