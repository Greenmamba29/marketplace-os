"""
Cold Chain Monitoring Models for LabSource
"""

from datetime import datetime
from typing import List, Optional
from enum import Enum

from pydantic import BaseModel, Field, ConfigDict


class ShipmentStatus(str, Enum):
    """Shipment status values."""
    IN_TRANSIT = "in-transit"
    DELIVERED = "delivered"
    BREACHED = "breached"


class ExcursionSeverity(str, Enum):
    """Temperature excursion severity levels."""
    MINOR = "minor"
    MAJOR = "major"
    CRITICAL = "critical"


class AlertType(str, Enum):
    """Cold chain alert types."""
    EXCURSION = "excursion"
    DELAY = "delay"
    DEVICE_FAILURE = "device-failure"
    APPROACHING_LIMIT = "approaching-limit"


class AlertSeverity(str, Enum):
    """Alert severity levels."""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class GPSLocation(BaseModel):
    """GPS location coordinates."""
    latitude: float
    longitude: float


class TemperatureReading(BaseModel):
    """Individual temperature reading."""
    model_config = ConfigDict(populate_by_name=True)
    
    timestamp: datetime
    temperature: float
    humidity: Optional[float] = None
    location: Optional[GPSLocation] = None


class TemperatureExcursion(BaseModel):
    """Temperature excursion event."""
    model_config = ConfigDict(populate_by_name=True)
    
    id: str
    started_at: datetime = Field(alias="startedAt")
    ended_at: Optional[datetime] = Field(default=None, alias="endedAt")
    min_temperature: float = Field(alias="minTemperature")
    max_temperature: float = Field(alias="maxTemperature")
    duration: int  # in minutes
    severity: ExcursionSeverity
    impact: Optional[str] = None
    corrective_action: Optional[str] = Field(default=None, alias="correctiveAction")


class MonitoringDevice(BaseModel):
    """Temperature monitoring device information."""
    model_config = ConfigDict(populate_by_name=True)
    
    device_id: str = Field(alias="deviceId")
    device_type: str = Field(alias="deviceType")
    calibration_date: datetime = Field(alias="calibrationDate")
    calibration_due: datetime = Field(alias="calibrationDue")


class ColdChainLog(BaseModel):
    """Cold chain monitoring log."""
    model_config = ConfigDict(populate_by_name=True)
    
    id: str
    lot_id: str = Field(alias="lotId")
    shipment_id: str = Field(alias="shipmentId")
    temperature_readings: List[TemperatureReading] = Field(default_factory=list, alias="temperatureReadings")
    excursions: List[TemperatureExcursion] = Field(default_factory=list)
    status: ShipmentStatus = ShipmentStatus.IN_TRANSIT
    device_info: MonitoringDevice = Field(alias="deviceInfo")
    started_at: datetime = Field(alias="startedAt")
    completed_at: Optional[datetime] = Field(default=None, alias="completedAt")


class ColdChainAlert(BaseModel):
    """Cold chain alert model."""
    model_config = ConfigDict(populate_by_name=True)
    
    id: str
    lot_id: str = Field(alias="lotId")
    shipment_id: str = Field(alias="shipmentId")
    alert_type: AlertType = Field(alias="alertType")
    severity: AlertSeverity
    message: str
    timestamp: datetime
    acknowledged: bool = False
    acknowledged_by: Optional[str] = Field(default=None, alias="acknowledgedBy")
    acknowledged_at: Optional[datetime] = Field(default=None, alias="acknowledgedAt")
    resolved_at: Optional[datetime] = Field(default=None, alias="resolvedAt")


class ColdChainShipment(BaseModel):
    """Cold chain shipment summary."""
    model_config = ConfigDict(populate_by_name=True)
    
    id: str
    tracking_number: str = Field(alias="trackingNumber")
    carrier: str
    origin: str
    destination: str
    status: ShipmentStatus
    current_temp: float = Field(alias="currentTemp")
    min_temp: float = Field(alias="minTemp")
    max_temp: float = Field(alias="maxTemp")
    target_temp: float = Field(alias="targetTemp")
    eta: datetime
    last_reading: datetime = Field(alias="lastReading")
    excursion_count: int = Field(default=0, alias="excursionCount")
    lot_ids: List[str] = Field(default_factory=list, alias="lotIds")
