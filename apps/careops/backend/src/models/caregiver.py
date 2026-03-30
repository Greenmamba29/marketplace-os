"""Caregiver profile models."""

from datetime import datetime
from enum import Enum
from typing import List, Optional

from pydantic import BaseModel, Field, field_validator


class Certification(str, Enum):
    """Caregiver certification types."""

    HHA = "HHA"
    CNA = "CNA"
    LPN = "LPN"
    RN = "RN"
    LVN = "LVN"
    PCA = "PCA"


class Specialization(str, Enum):
    """Caregiver specialization types."""

    DEMENTIA = "dementia"
    PEDIATRIC = "pediatric"
    POST_SURGICAL = "post-surgical"
    MOBILITY = "mobility"
    MEDICATION = "medication"
    HOSPICE = "hospice"
    AUTISM = "autism"
    DIABETES = "diabetes"


class BackgroundCheckStatus(str, Enum):
    """Background check status."""

    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    FAILED = "failed"
    EXPIRED = "expired"


class CaregiverStatus(str, Enum):
    """Caregiver availability status."""

    AVAILABLE = "available"
    ASSIGNED = "assigned"
    UNAVAILABLE = "unavailable"
    ON_LEAVE = "on_leave"


class DayAvailability(BaseModel):
    """Day availability model."""

    available: bool = False
    start_time: Optional[str] = None
    end_time: Optional[str] = None


class WeeklyAvailability(BaseModel):
    """Weekly availability model."""

    monday: DayAvailability = Field(default_factory=lambda: DayAvailability(available=False))
    tuesday: DayAvailability = Field(default_factory=lambda: DayAvailability(available=False))
    wednesday: DayAvailability = Field(default_factory=lambda: DayAvailability(available=False))
    thursday: DayAvailability = Field(default_factory=lambda: DayAvailability(available=False))
    friday: DayAvailability = Field(default_factory=lambda: DayAvailability(available=False))
    saturday: DayAvailability = Field(default_factory=lambda: DayAvailability(available=False))
    sunday: DayAvailability = Field(default_factory=lambda: DayAvailability(available=False))


class ServiceArea(BaseModel):
    """Service area model."""

    zip_codes: List[str] = Field(default_factory=list)
    radius: int = Field(default=10, ge=1, le=100)
    city: str
    state: str = Field(..., min_length=2, max_length=2)


class CaregiverProfileBase(BaseModel):
    """Base caregiver profile model."""

    certifications: List[Certification] = Field(default_factory=list)
    languages: List[str] = Field(default_factory=list)
    specializations: List[Specialization] = Field(default_factory=list)
    years_experience: int = Field(default=0, ge=0, le=50)
    hourly_rate: float = Field(..., ge=15, le=200)
    bio: Optional[str] = Field(None, max_length=2000)
    service_area: ServiceArea
    availability: WeeklyAvailability


class CaregiverProfileCreate(CaregiverProfileBase):
    """Caregiver profile creation model."""

    user_id: str


class CaregiverProfileUpdate(BaseModel):
    """Caregiver profile update model."""

    certifications: Optional[List[Certification]] = None
    languages: Optional[List[str]] = None
    specializations: Optional[List[Specialization]] = None
    years_experience: Optional[int] = Field(None, ge=0, le=50)
    hourly_rate: Optional[float] = Field(None, ge=15, le=200)
    bio: Optional[str] = Field(None, max_length=2000)
    service_area: Optional[ServiceArea] = None
    availability: Optional[WeeklyAvailability] = None
    status: Optional[CaregiverStatus] = None


class CaregiverProfile(CaregiverProfileBase):
    """Caregiver profile response model."""

    id: str
    user_id: str
    first_name: str
    last_name: str
    email: str
    phone: Optional[str]
    status: CaregiverStatus = CaregiverStatus.AVAILABLE
    photo_url: Optional[str] = None
    background_check_status: BackgroundCheckStatus = BackgroundCheckStatus.PENDING
    background_check_completed_at: Optional[datetime] = None
    background_check_provider: Optional[str] = None
    rating: float = Field(default=0.0, ge=0, le=5)
    review_count: int = Field(default=0, ge=0)
    completed_shifts: int = Field(default=0, ge=0)
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class CaregiverFilter(BaseModel):
    """Caregiver search filter model."""

    certifications: Optional[List[Certification]] = None
    languages: Optional[List[str]] = None
    specializations: Optional[List[Specialization]] = None
    min_rating: Optional[float] = Field(None, ge=0, le=5)
    max_hourly_rate: Optional[float] = Field(None, ge=15, le=200)
    zip_code: Optional[str] = None
    available_only: Optional[bool] = None
    background_checked: Optional[bool] = None
    search_query: Optional[str] = None


class CaregiverSearchResponse(BaseModel):
    """Caregiver search response model."""

    caregivers: List[CaregiverProfile]
    total: int
    page: int
    per_page: int
    total_pages: int
