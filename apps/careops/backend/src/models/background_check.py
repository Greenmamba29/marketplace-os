"""Background check models."""

from datetime import datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field


class BackgroundCheckStatus(str, Enum):
    """Background check status."""

    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    FAILED = "failed"
    EXPIRED = "expired"


class CheckStatus(str, Enum):
    """Individual check status."""

    PENDING = "pending"
    CLEAR = "clear"
    CONSIDER = "consider"
    REVIEW = "review"


class BackgroundCheckProvider(str, Enum):
    """Background check provider."""

    CHECKR = "checkr"
    STERLING = "sterling"


class CheckResult(BaseModel):
    """Individual check result."""

    status: CheckStatus = CheckStatus.PENDING
    completed_at: Optional[datetime] = None
    findings: Optional[str] = None


class BackgroundCheckChecks(BaseModel):
    """All background check components."""

    ssn_trace: CheckResult = Field(default_factory=CheckResult)
    sex_offender: CheckResult = Field(default_factory=CheckResult)
    county_criminal: CheckResult = Field(default_factory=CheckResult)
    national_criminal: CheckResult = Field(default_factory=CheckResult)
    motor_vehicle: Optional[CheckResult] = None
    employment_verification: Optional[CheckResult] = None


class BackgroundCheckBase(BaseModel):
    """Base background check model."""

    caregiver_id: str
    provider: BackgroundCheckProvider


class BackgroundCheckCreate(BackgroundCheckBase):
    """Background check creation model."""

    pass


class BackgroundCheck(BackgroundCheckBase):
    """Background check response model."""

    id: str
    status: BackgroundCheckStatus = BackgroundCheckStatus.PENDING
    report_id: Optional[str] = None
    report_url: Optional[str] = None
    checks: BackgroundCheckChecks = Field(default_factory=BackgroundCheckChecks)
    initiated_at: datetime
    completed_at: Optional[datetime] = None
    expires_at: Optional[datetime] = None
    notes: Optional[str] = None

    class Config:
        from_attributes = True


class BackgroundCheckWebhook(BaseModel):
    """Background check webhook payload."""

    event_type: str
    report_id: str
    candidate_id: Optional[str] = None
    status: Optional[str] = None
    result: Optional[str] = None
    completed_at: Optional[datetime] = None


class BackgroundCheckSummary(BaseModel):
    """Background check summary for listings."""

    id: str
    caregiver_name: str
    provider: BackgroundCheckProvider
    status: BackgroundCheckStatus
    initiated_at: datetime
    completed_at: Optional[datetime] = None
