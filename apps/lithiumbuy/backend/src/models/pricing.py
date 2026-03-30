"""Pricing and price history models."""

from datetime import datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field


class Currency(str, Enum):
    """Currency enumeration."""
    USD = "USD"
    EUR = "EUR"
    CNY = "CNY"
    AUD = "AUD"


class SpotPrice(BaseModel):
    """Spot price model."""
    id: str
    material_form: str
    grade: str
    price: float = Field(..., ge=0)
    currency: Currency = Currency.USD
    unit: str = Field(default="mt")
    source: str
    timestamp: datetime
    change_24h: float = Field(default=0)
    change_24h_percent: float = Field(default=0)
    volume_traded: float = Field(default=0)
    
    class Config:
        from_attributes = True


class PriceIndex(BaseModel):
    """Price index model."""
    material_form: str
    current_price: float
    change_24h: float
    change_24h_percent: float
    change_7d: float
    change_30d: float
    high_52w: float
    low_52w: float
    currency: Currency
    unit: str
    last_updated: datetime
    
    class Config:
        from_attributes = True


class PriceHistory(BaseModel):
    """Price history model."""
    id: str
    material_form: str
    grade: str
    date: datetime
    open: float = Field(..., ge=0)
    high: float = Field(..., ge=0)
    low: float = Field(..., ge=0)
    close: float = Field(..., ge=0)
    volume: float = Field(default=0)
    currency: Currency = Currency.USD
    
    class Config:
        from_attributes = True


class PriceUpdate(BaseModel):
    """Price update request model."""
    material_form: str
    grade: str
    price: float = Field(..., ge=0)
    currency: Currency = Currency.USD
    source: str


class PricingFormula(BaseModel):
    """Pricing formula for contracts."""
    base_price: float
    index_reference: str
    adjustment_frequency: str
    premium_discount: float = Field(default=0)
