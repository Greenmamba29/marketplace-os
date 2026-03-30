"""Temperature monitoring models."""

from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field


class TemperatureReading(BaseModel):
    """Temperature reading from a sensor."""
    id: str
    lot_id: Optional[str] = None
    lot_number: Optional[str] = None
    sensor_id: str
    sensor_location: str
    temperature: float
    humidity: Optional[float] = None
    timestamp: datetime
    is_excursion: bool = False
    excursion_duration: Optional[int] = None  # minutes
    corrected_by: Optional[str] = None
    notes: Optional[str] = None
    
    class Config:
        from_attributes = True


class TemperatureExcursionBase(BaseModel):
    """Base temperature excursion model."""
    sensor_id: str
    sensor_location: str
    temperature_zone: str = Field(..., pattern="^(frozen|refrigerated|ambient)$")
    start_time: datetime
    min_temperature: float
    max_temperature: float
    severity: str = Field(..., pattern="^(minor|major|critical)$")


class TemperatureExcursionCreate(TemperatureExcursionBase):
    """Temperature excursion creation model."""
    affected_lots: Optional[List[str]] = None


class TemperatureExcursion(TemperatureExcursionBase):
    """Full temperature excursion model."""
    id: str
    end_time: Optional[datetime] = None
    duration: int = 0  # minutes
    affected_lots: Optional[List[str]] = None
    status: str = Field(..., pattern="^(open|investigating|resolved)$")
    corrective_action: Optional[str] = None
    investigated_by: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class TemperatureSensor(BaseModel):
    """Temperature sensor configuration."""
    id: str
    location: str
    temperature_zone: str
    min_temp: float
    max_temp: float
    current_temp: Optional[float] = None
    last_reading_at: Optional[datetime] = None
    is_active: bool = True
    alert_threshold_minutes: int = 15
