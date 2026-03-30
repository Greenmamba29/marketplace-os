"""Market intelligence and alert models."""

from datetime import datetime
from enum import Enum
from typing import Optional, Dict, Any, List

from pydantic import BaseModel, Field


class AlertSeverity(str, Enum):
    """Alert severity enumeration."""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class AlertType(str, Enum):
    """Alert type enumeration."""
    TIGHTNESS = "tightness"
    PRICE_SPIKE = "price_spike"
    GEOPOLITICAL = "geopolitical"
    QUALITY = "quality"


class SupplyAlert(BaseModel):
    """Supply alert model."""
    id: str
    alert_type: AlertType
    severity: AlertSeverity
    material_form: Optional[str] = None
    region: Optional[str] = None
    message: str
    details: Dict[str, Any] = Field(default_factory=dict)
    is_active: bool = True
    created_at: datetime
    expires_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class GeopoliticalRisk(BaseModel):
    """Geopolitical risk model."""
    country: str
    risk_score: float = Field(..., ge=0, le=100)
    risk_level: str
    factors: List[str] = Field(default_factory=list)
    last_updated: datetime
    
    class Config:
        from_attributes = True


class MarketSummary(BaseModel):
    """Market summary model."""
    total_volume_24h: float
    active_rfqs: int
    open_contracts: int
    avg_quote_response_hours: float
    price_volatility_index: float
    supply_tightness_score: float
    last_updated: datetime
    
    class Config:
        from_attributes = True


class AlertCreate(BaseModel):
    """Alert creation model."""
    alert_type: AlertType
    severity: AlertSeverity
    material_form: Optional[str] = None
    region: Optional[str] = None
    message: str
    details: Dict[str, Any] = Field(default_factory=dict)
    expires_at: Optional[datetime] = None
