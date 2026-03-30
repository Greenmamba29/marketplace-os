"""Pydantic models for request/response validation."""

from .auth import Token, TokenData, UserLogin, UserRegister, UserResponse
from .caregiver import (
    CaregiverProfile,
    CaregiverProfileCreate,
    CaregiverProfileUpdate,
    CaregiverFilter,
    CaregiverSearchResponse,
)
from .careplan import (
    CarePlan,
    CarePlanCreate,
    CarePlanUpdate,
    CarePlanStatus,
    CareType,
    ScheduleRequirements,
    CareNeeds,
    EmergencyContact,
    Address,
)
from .schedule import (
    Shift,
    ShiftCreate,
    ShiftUpdate,
    ShiftStatus,
    ClockInOutRequest,
)
from .background_check import (
    BackgroundCheck,
    BackgroundCheckCreate,
    BackgroundCheckStatus,
    CheckResult,
)
from .payer_auth import (
    PayerAuthorization,
    PayerAuthorizationCreate,
    AuthorizationStatus,
    AuthorizationDocument,
)
from .common import (
    ApiResponse,
    PaginatedResponse,
    PaginationParams,
)

__all__ = [
    # Auth
    "Token",
    "TokenData",
    "UserLogin",
    "UserRegister",
    "UserResponse",
    # Caregiver
    "CaregiverProfile",
    "CaregiverProfileCreate",
    "CaregiverProfileUpdate",
    "CaregiverFilter",
    "CaregiverSearchResponse",
    # Care Plan
    "CarePlan",
    "CarePlanCreate",
    "CarePlanUpdate",
    "CarePlanStatus",
    "CareType",
    "ScheduleRequirements",
    "CareNeeds",
    "EmergencyContact",
    "Address",
    # Schedule
    "Shift",
    "ShiftCreate",
    "ShiftUpdate",
    "ShiftStatus",
    "ClockInOutRequest",
    # Background Check
    "BackgroundCheck",
    "BackgroundCheckCreate",
    "BackgroundCheckStatus",
    "CheckResult",
    # Payer Auth
    "PayerAuthorization",
    "PayerAuthorizationCreate",
    "AuthorizationStatus",
    "AuthorizationDocument",
    # Common
    "ApiResponse",
    "PaginatedResponse",
    "PaginationParams",
]
