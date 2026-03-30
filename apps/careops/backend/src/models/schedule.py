"""Schedule and shift models."""

from datetime import date, datetime
from enum import Enum
from typing import List, Optional

from pydantic import BaseModel, Field


class ShiftStatus(str, Enum):
    """Shift status enum."""

    SCHEDULED = "scheduled"
    CONFIRMED = "confirmed"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    NO_SHOW = "no_show"


class GeoLocation(BaseModel):
    """Geographic location model."""

    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)
    accuracy: Optional[float] = None


class IncidentReport(BaseModel):
    """Incident report model."""

    id: str
    type: str
    description: str
    severity: str
    reported_at: datetime
    reported_by: str
    resolved_at: Optional[datetime] = None
    resolution: Optional[str] = None


class ShiftBase(BaseModel):
    """Base shift model."""

    care_plan_id: str
    caregiver_id: str
    family_id: str
    scheduled_date: date
    start_time: str = Field(..., description="HH:MM format")
    end_time: str = Field(..., description="HH:MM format")
    notes: Optional[str] = Field(None, max_length=2000)


class ShiftCreate(ShiftBase):
    """Shift creation model."""

    pass


class ShiftUpdate(BaseModel):
    """Shift update model."""

    scheduled_date: Optional[date] = None
    start_time: Optional[str] = Field(None, description="HH:MM format")
    end_time: Optional[str] = Field(None, description="HH:MM format")
    status: Optional[ShiftStatus] = None
    notes: Optional[str] = Field(None, max_length=2000)
    caregiver_notes: Optional[str] = Field(None, max_length=2000)
    tasks_completed: Optional[List[str]] = None


class Shift(ShiftBase):
    """Shift response model."""

    id: str
    status: ShiftStatus = ShiftStatus.SCHEDULED
    clock_in_time: Optional[datetime] = None
    clock_out_time: Optional[datetime] = None
    clock_in_location: Optional[GeoLocation] = None
    clock_out_location: Optional[GeoLocation] = None
    caregiver_notes: Optional[str] = None
    tasks_completed: List[str] = Field(default_factory=list)
    incident_report: Optional[IncidentReport] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ClockInOutRequest(BaseModel):
    """Clock in/out request model."""

    location: GeoLocation
    notes: Optional[str] = Field(None, max_length=1000)


class ShiftSummary(BaseModel):
    """Shift summary for calendar views."""

    id: str
    scheduled_date: date
    start_time: str
    end_time: str
    status: ShiftStatus
    caregiver_name: str
    patient_name: str


class WeeklySchedule(BaseModel):
    """Weekly schedule model."""

    week_start: date
    week_end: date
    shifts: List[ShiftSummary]
    total_hours: int
    total_shifts: int
