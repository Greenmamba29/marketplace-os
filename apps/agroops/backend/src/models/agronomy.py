"""Agronomy and crop models."""

from datetime import datetime
from decimal import Decimal
from typing import List, Optional

from pydantic import BaseModel, Field


class Crop(BaseModel):
    """Crop model."""
    id: str
    name: str
    scientific_name: Optional[str] = None
    category: str  # row_crop, vegetable, fruit, forage, specialty
    typical_planting_months: List[int] = []
    typical_harvest_months: List[int] = []
    growing_degree_days: Optional[int] = None
    common_pests: List[str] = []
    common_diseases: List[str] = []
    
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class NutrientRequirement(BaseModel):
    """Nutrient requirement model."""
    growth_stage: str
    n_lbs_per_acre: float
    p_lbs_per_acre: float
    k_lbs_per_acre: float


class CropDetail(Crop):
    """Crop detail with nutrient requirements."""
    nutrient_requirements: List[NutrientRequirement] = []


class WeatherDay(BaseModel):
    """Weather forecast day model."""
    date: str
    temp_high: float
    temp_low: float
    precipitation_chance: float
    precipitation_amount: float
    wind_speed: float
    humidity: float
    conditions: str


class WeatherForecast(BaseModel):
    """Weather forecast model."""
    location: str
    forecast_days: List[WeatherDay]


class ProductRecommendation(BaseModel):
    """Product recommendation model."""
    input_id: str
    input_name: str
    category: str
    reason: str
    priority: str  # critical, high, medium, low
    timing_window: dict
    suggested_rate: str
    estimated_cost_per_acre: Decimal
    alternatives: List[str] = []


class AgronomicRecommendation(BaseModel):
    """Agronomic recommendation model."""
    id: str
    crop_id: str
    crop_name: str
    soil_type: Optional[str] = None
    growth_stage: str
    planting_date: Optional[datetime] = None
    expected_harvest_date: Optional[datetime] = None
    
    recommendations: List[ProductRecommendation]
    
    # Weather context
    weather_forecast: Optional[WeatherForecast] = None
    gdd_accumulated: Optional[int] = None
    
    created_at: datetime


class RecommendationRequest(BaseModel):
    """Recommendation request model."""
    crop_id: str
    growth_stage: Optional[str] = None
    soil_type: Optional[str] = None
    planting_date: Optional[str] = None
    acres: Optional[float] = None
    state: str


class GDDRequest(BaseModel):
    """Growing Degree Days request model."""
    crop_id: str
    planting_date: str
    location: str


class GDDResponse(BaseModel):
    """Growing Degree Days response model."""
    crop_id: str
    crop_name: str
    planting_date: str
    current_gdd: int
    target_gdd: int
    progress_percent: float
    estimated_days_to_target: Optional[int] = None


class SeasonalForecast(BaseModel):
    """Seasonal forecast model."""
    id: str
    season: str
    year: int
    crop_type: str
    region: str
    
    # Weather outlook
    weather_outlook: str
    precipitation_forecast: str  # above_normal, normal, below_normal
    temperature_forecast: str  # above_normal, normal, below_normal
    
    # Demand forecast
    expected_demand_index: int  # 0-100
    
    created_at: datetime


class InputPriceForecast(BaseModel):
    """Input price forecast model."""
    input_category: str
    current_avg_price: Decimal
    forecast_avg_price: Decimal
    price_change_percent: float
    confidence: str  # high, medium, low


class SeasonalForecastDetail(SeasonalForecast):
    """Seasonal forecast with price forecasts."""
    input_forecasts: List[InputPriceForecast]
