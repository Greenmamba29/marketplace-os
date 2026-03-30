"""Agronomy router."""

from datetime import datetime
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query

from src.models.auth import User, get_current_active_user
from src.models.agronomy import (
    Crop,
    CropDetail,
    RecommendationRequest,
    AgronomicRecommendation,
    ProductRecommendation,
    WeatherForecast,
    WeatherDay,
    GDDRequest,
    GDDResponse,
    SeasonalForecast,
    InputPriceForecast,
)
from src.services.weather import WeatherService

router = APIRouter(prefix="/agronomy", tags=["Agronomy"])


# Mock crops data
MOCK_CROPS = [
    Crop(
        id="crop_1",
        name="Corn",
        scientific_name="Zea mays",
        category="row_crop",
        typical_planting_months=[4, 5],
        typical_harvest_months=[9, 10, 11],
        growing_degree_days=2700,
        common_pests=["Corn borer", "Armyworm", "Rootworm"],
        common_diseases=["Gray leaf spot", "Northern corn leaf blight"],
        created_at="2024-01-01T00:00:00Z",
        updated_at="2024-01-01T00:00:00Z",
    ),
    Crop(
        id="crop_2",
        name="Soybean",
        scientific_name="Glycine max",
        category="row_crop",
        typical_planting_months=[4, 5, 6],
        typical_harvest_months=[9, 10, 11],
        growing_degree_days=2400,
        common_pests=["Aphids", "Spider mites", "Stink bugs"],
        common_diseases=["Sudden death syndrome", "White mold"],
        created_at="2024-01-01T00:00:00Z",
        updated_at="2024-01-01T00:00:00Z",
    ),
    Crop(
        id="crop_3",
        name="Wheat",
        scientific_name="Triticum aestivum",
        category="row_crop",
        typical_planting_months=[9, 10],
        typical_harvest_months=[6, 7],
        growing_degree_days=2200,
        common_pests=["Aphids", "Hessian fly"],
        common_diseases=["Fusarium head blight", "Stripe rust"],
        created_at="2024-01-01T00:00:00Z",
        updated_at="2024-01-01T00:00:00Z",
    ),
    Crop(
        id="crop_4",
        name="Cotton",
        scientific_name="Gossypium hirsutum",
        category="row_crop",
        typical_planting_months=[4, 5],
        typical_harvest_months=[10, 11, 12],
        growing_degree_days=2800,
        common_pests=["Bollworm", "Aphids", "Thrips"],
        common_diseases=["Bacterial blight", "Verticillium wilt"],
        created_at="2024-01-01T00:00:00Z",
        updated_at="2024-01-01T00:00:00Z",
    ),
]


@router.get("/crops", response_model=List[Crop])
async def list_crops():
    """List all available crops."""
    return MOCK_CROPS


@router.get("/crops/{crop_id}", response_model=CropDetail)
async def get_crop(crop_id: str):
    """Get crop details."""
    for crop in MOCK_CROPS:
        if crop.id == crop_id:
            return CropDetail(
                **crop.dict(),
                nutrient_requirements=[
                    {"growth_stage": "Early vegetative", "n_lbs_per_acre": 30, "p_lbs_per_acre": 20, "k_lbs_per_acre": 30},
                    {"growth_stage": "Reproductive", "n_lbs_per_acre": 100, "p_lbs_per_acre": 10, "k_lbs_per_acre": 40},
                ],
            )
    
    raise HTTPException(status_code=404, detail="Crop not found")


@router.get("/crops/{crop_id}/growth-stages")
async def get_growth_stages(crop_id: str):
    """Get growth stages for a crop."""
    crop = await get_crop(crop_id)
    
    stages = {
        "Corn": ["Pre-Plant", "VE-V3", "V4-V6", "V7-V10", "V11-VT", "R1-R2", "R3-R4", "R5-R6"],
        "Soybean": ["Pre-Plant", "VE-VC", "V1-V3", "V4-V6", "R1-R2", "R3-R4", "R5-R6", "R7-R8"],
        "Wheat": ["Pre-Plant", "GS10-GS21", "GS30-GS32", "GS37-GS39", "GS45-GS55", "GS60-GS69", "GS70-GS89"],
        "Cotton": ["Pre-Plant", "Cotyledon", "First Square", "First Flower", "Peak Bloom", "First Open Boll", "Defoliation"],
    }
    
    return {"stages": stages.get(crop.name, [])}


@router.post("/recommendations", response_model=AgronomicRecommendation)
async def get_recommendations(request: RecommendationRequest):
    """Get agronomic recommendations."""
    crop = next((c for c in MOCK_CROPS if c.id == request.crop_id), None)
    if not crop:
        raise HTTPException(status_code=404, detail="Crop not found")
    
    # Generate mock recommendations based on crop and growth stage
    recommendations = []
    
    if crop.name == "Corn":
        if request.growth_stage in ["V4-V6", "V7-V10"]:
            recommendations = [
                ProductRecommendation(
                    input_id="input_3",
                    input_name="28% UAN Solution",
                    category="fertilizer",
                    reason="Side-dress nitrogen application recommended at V6 stage for optimal yield",
                    priority="high",
                    timing_window={
                        "start_date": "2024-06-01",
                        "end_date": "2024-06-15",
                        "optimal_date": "2024-06-08",
                    },
                    suggested_rate="30-40 lbs N/acre",
                    estimated_cost_per_acre=15.00,
                    alternatives=["32% UAN", "Anhydrous Ammonia"],
                ),
                ProductRecommendation(
                    input_id="input_1",
                    input_name="Roundup PowerMax 3",
                    category="crop_protection",
                    reason="Post-emergence weed control recommended",
                    priority="medium",
                    timing_window={
                        "start_date": "2024-05-25",
                        "end_date": "2024-06-10",
                    },
                    suggested_rate="22 fl oz/acre",
                    estimated_cost_per_acre=8.50,
                    alternatives=["Generic Glyphosate"],
                ),
            ]
    elif crop.name == "Soybean":
        recommendations = [
            ProductRecommendation(
                input_id="input_5",
                input_name="Liberty 280 SL",
                category="crop_protection",
                reason="Glufosinate herbicide for LibertyLink soybeans",
                priority="high",
                timing_window={
                    "start_date": "2024-06-01",
                    "end_date": "2024-06-20",
                },
                suggested_rate="29 fl oz/acre",
                estimated_cost_per_acre=18.00,
                alternatives=[],
            ),
        ]
    
    # Mock weather forecast
    weather = WeatherForecast(
        location=f"{request.state} Region",
        forecast_days=[
            WeatherDay(
                date="2024-05-20",
                temp_high=75,
                temp_low=55,
                precipitation_chance=20,
                precipitation_amount=0.0,
                wind_speed=8,
                humidity=65,
                conditions="Partly Cloudy",
            ),
            WeatherDay(
                date="2024-05-21",
                temp_high=78,
                temp_low=58,
                precipitation_chance=40,
                precipitation_amount=0.25,
                wind_speed=10,
                humidity=70,
                conditions="Scattered Showers",
            ),
        ],
    )
    
    return AgronomicRecommendation(
        id=f"rec_{request.crop_id}_{datetime.now().timestamp()}",
        crop_id=request.crop_id,
        crop_name=crop.name,
        soil_type=request.soil_type,
        growth_stage=request.growth_stage or "",
        planting_date=datetime.fromisoformat(request.planting_date) if request.planting_date else None,
        recommendations=recommendations,
        weather_forecast=weather,
        gdd_accumulated=850 if request.planting_date else None,
        created_at=datetime.utcnow(),
    )


@router.get("/weather")
async def get_weather(
    lat: float = Query(...),
    lon: float = Query(...),
    days: int = Query(7, ge=1, le=14),
):
    """Get weather forecast for location."""
    weather_service = WeatherService()
    
    try:
        forecast = await weather_service.get_forecast(lat, lon, days)
        return forecast
    except Exception as e:
        # Return mock data if API fails
        return WeatherForecast(
            location="Des Moines, IA",
            forecast_days=[
                WeatherDay(
                    date="2024-05-20",
                    temp_high=75,
                    temp_low=55,
                    precipitation_chance=20,
                    precipitation_amount=0.0,
                    wind_speed=8,
                    humidity=65,
                    conditions="Partly Cloudy",
                ),
            ] * days,
        )


@router.get("/gdd")
async def get_gdd(
    crop_id: str = Query(...),
    planting_date: str = Query(...),
    location: str = Query(...),
):
    """Get Growing Degree Days accumulation."""
    crop = next((c for c in MOCK_CROPS if c.id == crop_id), None)
    if not crop:
        raise HTTPException(status_code=404, detail="Crop not found")
    
    # Calculate mock GDD
    planting = datetime.fromisoformat(planting_date)
    days_since_planting = (datetime.now() - planting).days
    estimated_gdd = days_since_planting * 15  # Approx 15 GDD per day
    
    return GDDResponse(
        crop_id=crop_id,
        crop_name=crop.name,
        planting_date=planting_date,
        current_gdd=estimated_gdd,
        target_gdd=crop.growing_degree_days or 2500,
        progress_percent=min(100, (estimated_gdd / (crop.growing_degree_days or 2500)) * 100),
        estimated_days_to_target=((crop.growing_degree_days or 2500) - estimated_gdd) // 15 if estimated_gdd < (crop.growing_degree_days or 2500) else 0,
    )


@router.get("/seasonal-forecast")
async def get_seasonal_forecast(
    crop_type: Optional[str] = None,
    region: Optional[str] = None,
):
    """Get seasonal market forecast."""
    return SeasonalForecast(
        id="forecast_1",
        season="Spring 2024",
        year=2024,
        crop_type=crop_type or "All",
        region=region or "National",
        weather_outlook="Near-normal temperatures with above-average precipitation expected for the Corn Belt",
        precipitation_forecast="above_normal",
        temperature_forecast="normal",
        expected_demand_index=75,
        input_forecasts=[
            InputPriceForecast(
                input_category="fertilizer",
                current_avg_price=0.45,
                forecast_avg_price=0.48,
                price_change_percent=6.7,
                confidence="medium",
            ),
            InputPriceForecast(
                input_category="seed",
                current_avg_price=320.0,
                forecast_avg_price=335.0,
                price_change_percent=4.7,
                confidence="high",
            ),
            InputPriceForecast(
                input_category="crop_protection",
                current_avg_price=45.0,
                forecast_avg_price=42.0,
                price_change_percent=-6.7,
                confidence="medium",
            ),
        ],
        created_at=datetime.utcnow(),
    )
