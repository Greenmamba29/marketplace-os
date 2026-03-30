"""Care plan models."""

from datetime import datetime
from enum import Enum
from typing import List, Optional

from pydantic import BaseModel, Field


class CareType(str, Enum):
    """Type of care needed."""

    COMPANIONSHIP = "companionship"
    PERSONAL_CARE = "personal_care"
    SKILLED_NURSING = "skilled_nursing"
    RESPITE = "respite"
    HOSPICE = "hospice"
    POST_SURGICAL = "post_surgical"


class CarePlanStatus(str, Enum):
    """Care plan status."""

    DRAFT = "draft"
    SUBMITTED = "submitted"
    MATCHED = "matched"
    ACTIVE = "active"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class Flexibility(str, Enum):
    """Schedule flexibility."""

    STRICT = "strict"
    MODERATE = "moderate"
    FLEXIBLE = "flexible"


class Address(BaseModel):
    """Address model."""

    street: str = Field(..., min_length=5)
    city: str = Field(..., min_length=2)
    state: str = Field(..., min_length=2, max_length=2)
    zip_code: str = Field(..., pattern=r"^\d{5}(-\d{4})?$")


class ScheduleRequirements(BaseModel):
    """Schedule requirements model."""

    start_date: str = Field(..., description="ISO date string")
    duration_weeks: Optional[int] = Field(None, ge=1, le=52)
    ongoing: bool = True
    preferred_days: List[str] = Field(default_factory=list)
    preferred_start_time: str = Field(..., description="HH:MM format")
    preferred_end_time: str = Field(..., description="HH:MM format")
    flexibility: Flexibility = Flexibility.MODERATE


class CareNeeds(BaseModel):
    """Care needs model."""

    mobility_assistance: bool = False
    medication_reminders: bool = False
    meal_preparation: bool = False
    light_housekeeping: bool = False
    bathing_dressing: bool = False
    toileting_incontinence: bool = False
    transportation: bool = False
    specialized_care: List[str] = Field(default_factory=list)
    additional_notes: Optional[str] = Field(None, max_length=2000)


class EmergencyContact(BaseModel):
    """Emergency contact model."""

    name: str = Field(..., min_length=2)
    relationship: str = Field(..., min_length=2)
    phone: str = Field(..., min_length=10)
    alternate_phone: Optional[str] = None


class CarePlanBase(BaseModel):
    """Base care plan model."""

    patient_name: str = Field(..., min_length=2, max_length=200)
    patient_age: Optional[int] = Field(None, ge=0, le=120)
    care_type: CareType
    address: Address
    schedule_requirements: ScheduleRequirements
    care_needs: CareNeeds
    emergency_contact: EmergencyContact
    hourly_budget: Optional[float] = Field(None, ge=15, le=200)
    estimated_hours_per_week: int = Field(..., ge=1, le=168)


class CarePlanCreate(CarePlanBase):
    """Care plan creation model."""

    family_id: str


class CarePlanUpdate(BaseModel):
    """Care plan update model."""

    patient_name: Optional[str] = Field(None, min_length=2, max_length=200)
    patient_age: Optional[int] = Field(None, ge=0, le=120)
    care_type: Optional[CareType] = None
    address: Optional[Address] = None
    schedule_requirements: Optional[ScheduleRequirements] = None
    care_needs: Optional[CareNeeds] = None
    emergency_contact: Optional[EmergencyContact] = None
    hourly_budget: Optional[float] = Field(None, ge=15, le=200)
    estimated_hours_per_week: Optional[int] = Field(None, ge=1, le=168)
    status: Optional[CarePlanStatus] = None
    assigned_caregiver_id: Optional[str] = None
    preferred_caregiver_ids: Optional[List[str]] = None


class CarePlan(CarePlanBase):
    """Care plan response model."""

    id: str
    family_id: str
    status: CarePlanStatus = CarePlanStatus.DRAFT
    assigned_caregiver_id: Optional[str] = None
    preferred_caregiver_ids: List[str] = Field(default_factory=list)
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class CarePlanSummary(BaseModel):
    """Care plan summary for listings."""

    id: str
    patient_name: str
    care_type: CareType
    status: CarePlanStatus
    city: str
    state: str
    estimated_hours_per_week: int
    assigned_caregiver_name: Optional[str] = None
    created_at: datetime
