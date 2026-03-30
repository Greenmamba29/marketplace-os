"""Market comps and pricing models."""

from datetime import date, datetime
from decimal import Decimal
from typing import Optional

from pydantic import BaseModel, Field, ConfigDict

from .barrel import SpiritType


class TransactionSource(str, Enum):
    """Transaction source enumeration."""
    AUCTION = "auction"
    PRIVATE_SALE = "private_sale"
    DISTILLERY = "distillery"
    BROKER = "broker"


class MarketCompBase(BaseModel):
    """Base market comp model."""
    transaction_date: date
    spirit_type: SpiritType
    age_years: int = Field(..., ge=0)
    proof: Decimal
    volume_proof_gallons: Decimal
    price_per_proof_gallon: Decimal = Field(..., ge=0, decimal_places=2)
    total_price: Decimal = Field(..., ge=0, decimal_places=2)
    seller: str
    buyer: str
    barrel_count: int = Field(..., ge=1)
    source: TransactionSource
    notes: Optional[str] = None


class MarketCompCreate(MarketCompBase):
    """Market comp creation model."""
    pass


class MarketComp(MarketCompBase):
    """Full market comp model."""
    model_config = ConfigDict(from_attributes=True)
    
    id: str
    created_at: datetime


class PriceStats(BaseModel):
    """Price statistics."""
    avg_price: Decimal
    median_price: Decimal
    min_price: Decimal
    max_price: Decimal
    transaction_count: int
    total_volume: Decimal


class PriceStatsResponse(BaseModel):
    """Price stats response."""
    overall: PriceStats
    by_age: list[dict]
    by_proof: list[dict]


class PriceTrend(BaseModel):
    """Price trend data point."""
    month: str
    avg_price: Decimal
    volume: Decimal
    transaction_count: int


class ComparableTransaction(BaseModel):
    """Comparable transaction for a barrel."""
    market_comp: MarketComp
    similarity_score: float = Field(..., ge=0, le=1, description="How similar this comp is to the target barrel")
