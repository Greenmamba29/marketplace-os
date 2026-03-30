"""
GovSource Backend Models
"""

from .auth import User, UserCreate, UserLogin, Token, TokenData
from .vendor import (
    Vendor, 
    VendorCreate, 
    VendorUpdate, 
    SAMRegistration,
    NAICSCode,
    PSCCode,
    VendorQualification,
    PastPerformance,
    Certification,
    ComplianceStatus,
    VendorContactInfo,
    VendorFinancialInfo,
)
from .rfp import (
    RFP,
    RFPCreate,
    RFPUpdate,
    FARClause,
    EvaluationCriteria,
    RFPAttachment,
)
from .rfq import (
    RFQ,
    RFQCreate,
    RFQUpdate,
    RFQLineItem,
    Quote,
    LineItemQuote,
    ApprovalStep,
)
from .compliance import (
    FARCompliance,
    DFARSCompliance,
    ComplianceRecord,
    SetAsideTracking,
)
from .common import (
    ApiResponse,
    ApiError,
    PaginationMeta,
    Address,
    GovernmentAgency,
)

__all__ = [
    # Auth
    "User",
    "UserCreate",
    "UserLogin",
    "Token",
    "TokenData",
    # Vendor
    "Vendor",
    "VendorCreate",
    "VendorUpdate",
    "SAMRegistration",
    "NAICSCode",
    "PSCCode",
    "VendorQualification",
    "PastPerformance",
    "Certification",
    "ComplianceStatus",
    "VendorContactInfo",
    "VendorFinancialInfo",
    # RFP
    "RFP",
    "RFPCreate",
    "RFPUpdate",
    "FARClause",
    "EvaluationCriteria",
    "RFPAttachment",
    # RFQ
    "RFQ",
    "RFQCreate",
    "RFQUpdate",
    "RFQLineItem",
    "Quote",
    "LineItemQuote",
    "ApprovalStep",
    # Compliance
    "FARCompliance",
    "DFARSCompliance",
    "ComplianceRecord",
    "SetAsideTracking",
    # Common
    "ApiResponse",
    "ApiError",
    "PaginationMeta",
    "Address",
    "GovernmentAgency",
]
