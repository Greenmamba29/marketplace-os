"""Payer authorization models."""

from datetime import datetime
from enum import Enum
from typing import List, Optional

from pydantic import BaseModel, Field


class PayerType(str, Enum):
    """Payer type enum."""

    INSURANCE = "insurance"
    MEDICAID = "medicaid"
    MEDICARE = "medicare"
    VA = "va"
    PRIVATE_PAY = "private_pay"


class AuthorizationStatus(str, Enum):
    """Authorization status enum."""

    PENDING = "pending"
    APPROVED = "approved"
    DENIED = "denied"
    EXPIRED = "expired"
    PENDING_RENEWAL = "pending_renewal"


class DocumentType(str, Enum):
    """Authorization document type."""

    REFERRAL = "referral"
    PHYSICIAN_ORDER = "physician_order"
    ASSESSMENT = "assessment"
    AUTHORIZATION_LETTER = "authorization_letter"
    OTHER = "other"


class AuthorizationDocument(BaseModel):
    """Authorization document model."""

    id: str
    type: DocumentType
    name: str
    url: str
    uploaded_at: datetime


class PayerAuthorizationBase(BaseModel):
    """Base payer authorization model."""

    care_plan_id: str
    payer_type: PayerType
    payer_name: str
    policy_number: Optional[str] = None
    authorization_number: Optional[str] = None
    authorized_hours: int = Field(..., ge=1, le=168)
    authorized_services: List[str] = Field(default_factory=list)
    start_date: str = Field(..., description="ISO date string")
    end_date: str = Field(..., description="ISO date string")


class PayerAuthorizationCreate(PayerAuthorizationBase):
    """Payer authorization creation model."""

    pass


class PayerAuthorizationUpdate(BaseModel):
    """Payer authorization update model."""

    status: Optional[AuthorizationStatus] = None
    authorized_hours: Optional[int] = Field(None, ge=1, le=168)
    authorized_hours_used: Optional[int] = Field(None, ge=0)
    authorization_number: Optional[str] = None
    end_date: Optional[str] = None
    notes: Optional[str] = None


class PayerAuthorization(PayerAuthorizationBase):
    """Payer authorization response model."""

    id: str
    status: AuthorizationStatus = AuthorizationStatus.PENDING
    authorized_hours_used: int = Field(default=0, ge=0)
    submitted_at: datetime
    approved_at: Optional[datetime] = None
    documents: List[AuthorizationDocument] = Field(default_factory=list)
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

    @property
    def hours_remaining(self) -> int:
        """Calculate remaining authorized hours."""
        return max(0, self.authorized_hours - self.authorized_hours_used)

    @property
    def utilization_percentage(self) -> float:
        """Calculate utilization percentage."""
        if self.authorized_hours == 0:
            return 0.0
        return (self.authorized_hours_used / self.authorized_hours) * 100


class PayerAuthorizationSummary(BaseModel):
    """Payer authorization summary for listings."""

    id: str
    care_plan_id: str
    patient_name: str
    payer_name: str
    status: AuthorizationStatus
    authorized_hours: int
    hours_used: int
    hours_remaining: int
    end_date: str
