"""Market intelligence models."""

from datetime import datetime
from enum import Enum
from typing import List, Optional

from pydantic import BaseModel, Field


class ReportType(str, Enum):
    """Market intelligence report types."""
    PRICE_INDEX = "price_index"
    SUPPLY_ALERT = "supply_alert"
    REGULATORY_CHANGE = "regulatory_change"
    MARKET_ANALYSIS = "market_analysis"


class PriceTrend(str, Enum):
    """Price trends."""
    UP = "up"
    DOWN = "down"
    STABLE = "stable"


class SupplyStatus(str, Enum):
    """Supply statuses."""
    ABUNDANT = "abundant"
    NORMAL = "normal"
    TIGHT = "tight"
    CRITICAL = "critical"


class RegionalAvailability(BaseModel):
    """Regional availability model."""
    region: str
    availability: str  # high, medium, low
    avg_lead_time_days: int
    avg_price_premium: float


class MarketIntelligence(BaseModel):
    """Market intelligence model."""
    id: str
    cas_number: str
    chemical_name: str
    report_type: ReportType
    period_start: datetime
    period_end: datetime
    avg_price_usd_kg: float
    price_change_percent: float
    price_trend: PriceTrend
    supply_status: SupplyStatus
    regional_availability: List[RegionalAvailability]
    key_insights: List[str]
    generated_by: str  # ai, analyst, automated
    confidence_score: float = Field(..., ge=0, le=1)
    created_at: datetime

    class Config:
        from_attributes = True


class PriceIndexData(BaseModel):
    """Price index data point."""
    date: datetime
    price: float
    volume: Optional[float] = None


class MarketOverview(BaseModel):
    """Market overview response."""
    total_chemicals_tracked: int
    avg_price_change_24h: float
    total_volume_24h: float
    active_rfqs: int
    market_sentiment: str  # bullish, bearish, neutral


class TopMover(BaseModel):
    """Top mover model."""
    cas_number: str
    name: str
    price_change_percent: float
    current_price: float


class TopMoversResponse(BaseModel):
    """Top movers response."""
    chemicals: List[TopMover]


class PriceForecast(BaseModel):
    """Price forecast model."""
    month: str
    predicted_price: float
    confidence_interval: tuple[float, float]


class PriceForecastResponse(BaseModel):
    """Price forecast response."""
    forecast: List[PriceForecast]
    factors: List[str]


class SupplyChainRisk(BaseModel):
    """Supply chain risk factor."""
    factor: str
    impact: str  # positive, negative, neutral
    severity: str  # low, medium, high


class SupplyChainAnalysisResponse(BaseModel):
    """Supply chain analysis response."""
    risk_score: float
    risk_level: str  # low, medium, high
    factors: List[SupplyChainRisk]
    recommendations: List[str]


class AlternativeChemical(BaseModel):
    """Alternative chemical model."""
    cas_number: str
    name: str
    similarity_score: float
    pros: List[str]
    cons: List[str]


class AlternativesResponse(BaseModel):
    """Alternatives response."""
    alternatives: List[AlternativeChemical]


class NewsSummaryResponse(BaseModel):
    """News summary response."""
    summary: str
    key_points: List[str]
    sentiment: str  # positive, negative, neutral
    sources: List[str]
