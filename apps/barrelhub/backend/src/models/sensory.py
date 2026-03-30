"""Sensory profile models."""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field, ConfigDict


class SensoryAppearance(BaseModel):
    """Appearance evaluation."""
    color: str = Field(..., description="Color description (e.g., amber, golden)")
    clarity: int = Field(..., ge=0, le=10, description="Clarity score 0-10")
    viscosity: int = Field(..., ge=0, le=10, description="Viscosity score 0-10")


class SensoryNose(BaseModel):
    """Nose/aroma evaluation."""
    intensity: int = Field(..., ge=0, le=10)
    vanilla: int = Field(..., ge=0, le=10)
    caramel: int = Field(..., ge=0, le=10)
    oak: int = Field(..., ge=0, le=10)
    spice: int = Field(..., ge=0, le=10)
    fruit: int = Field(..., ge=0, le=10)
    floral: int = Field(..., ge=0, le=10)
    smoke: int = Field(..., ge=0, le=10)
    other_notes: Optional[str] = None


class SensoryPalate(BaseModel):
    """Palate/taste evaluation."""
    intensity: int = Field(..., ge=0, le=10)
    sweetness: int = Field(..., ge=0, le=10)
    vanilla: int = Field(..., ge=0, le=10)
    caramel: int = Field(..., ge=0, le=10)
    oak: int = Field(..., ge=0, le=10)
    spice: int = Field(..., ge=0, le=10)
    fruit: int = Field(..., ge=0, le=10)
    body: int = Field(..., ge=0, le=10)
    complexity: int = Field(..., ge=0, le=10)


class SensoryFinish(BaseModel):
    """Finish evaluation."""
    length: int = Field(..., ge=0, le=10)
    warmth: int = Field(..., ge=0, le=10)
    aftertaste: int = Field(..., ge=0, le=10)


class SensoryProfileBase(BaseModel):
    """Base sensory profile model."""
    barrel_id: str
    barrel_number: str
    evaluation_date: datetime
    evaluator: str
    overall_score: float = Field(..., ge=0, le=10)
    appearance: SensoryAppearance
    nose: SensoryNose
    palate: SensoryPalate
    finish: SensoryFinish
    tasting_notes: Optional[str] = None
    recommended_use: Optional[str] = None


class SensoryProfileCreate(SensoryProfileBase):
    """Sensory profile creation model."""
    pass


class SensoryProfile(SensoryProfileBase):
    """Full sensory profile model."""
    model_config = ConfigDict(from_attributes=True)
    
    id: str
    created_at: datetime
    updated_at: datetime


class ScoreDistribution(BaseModel):
    """Score distribution data."""
    ranges: list[dict]
    average: float


class SensoryDistribution(BaseModel):
    """Sensory score distribution response."""
    overall: ScoreDistribution
    by_category: dict[str, dict]
