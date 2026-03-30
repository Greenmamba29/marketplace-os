"""AI demand forecasting service."""

from datetime import datetime, timedelta
from typing import Dict, List, Optional
import random

from ..config import settings
from ..models.menu import DemandForecast


class ForecastingService:
    """Service for AI-powered demand forecasting."""
    
    def __init__(self):
        self.model_version = "1.0.0"
        self.forecasts: Dict[str, DemandForecast] = {}
    
    async def generate_forecast(
        self,
        ingredient_id: str,
        ingredient_name: str,
        historical_data: List[dict],
        horizon_days: int = None,
    ) -> DemandForecast:
        """Generate a demand forecast for an ingredient."""
        if horizon_days is None:
            horizon_days = settings.FORECAST_HORIZON_DAYS
        
        # Generate predictions (mock implementation)
        # In production, this would use Prophet, ARIMA, or ML models
        predictions = []
        base_demand = 100  # Base daily demand
        
        for i in range(horizon_days):
            date = datetime.utcnow() + timedelta(days=i)
            
            # Add some seasonality and trend
            day_of_week = date.weekday()
            weekend_factor = 1.3 if day_of_week >= 5 else 1.0
            trend_factor = 1 + (i * 0.01)  # Slight upward trend
            
            # Add randomness
            noise = random.uniform(0.9, 1.1)
            
            predicted_quantity = base_demand * weekend_factor * trend_factor * noise
            
            predictions.append({
                "date": date.isoformat(),
                "predicted_quantity": round(predicted_quantity, 2),
                "confidence_interval": {
                    "lower": round(predicted_quantity * 0.85, 2),
                    "upper": round(predicted_quantity * 1.15, 2),
                },
            })
        
        # Calculate overall confidence
        confidence = random.uniform(0.85, 0.95)
        
        # Identify influencing factors
        influencing_factors = [
            {"factor": "Day of week", "impact": "positive" if day_of_week >= 5 else "neutral", "weight": 0.3},
            {"factor": "Historical trend", "impact": "positive", "weight": 0.4},
            {"factor": "Seasonality", "impact": "neutral", "weight": 0.2},
            {"factor": "Weather forecast", "impact": "neutral", "weight": 0.1},
        ]
        
        forecast = DemandForecast(
            id=f"FC-{datetime.utcnow().strftime('%Y%m%d%H%M%S')}",
            ingredient_id=ingredient_id,
            ingredient_name=ingredient_name,
            forecast_period_start=datetime.utcnow(),
            forecast_period_end=datetime.utcnow() + timedelta(days=horizon_days),
            predicted_quantity=sum(p["predicted_quantity"] for p in predictions),
            confidence_interval_lower=sum(p["confidence_interval"]["lower"] for p in predictions),
            confidence_interval_upper=sum(p["confidence_interval"]["upper"] for p in predictions),
            confidence=confidence,
            model_version=self.model_version,
            influencing_factors=influencing_factors,
            created_at=datetime.utcnow(),
        )
        
        self.forecasts[forecast.id] = forecast
        return forecast
    
    async def get_forecast(self, forecast_id: str) -> Optional[DemandForecast]:
        """Get a forecast by ID."""
        return self.forecasts.get(forecast_id)
    
    async def get_forecasts_for_ingredient(
        self,
        ingredient_id: str,
    ) -> List[DemandForecast]:
        """Get all forecasts for an ingredient."""
        return [
            f for f in self.forecasts.values()
            if f.ingredient_id == ingredient_id
        ]
    
    async def generate_menu_based_forecast(
        self,
        menu_items: List[dict],
        forecast_days: int = 7,
    ) -> Dict[str, dict]:
        """Generate forecast based on menu items."""
        ingredient_totals: Dict[str, dict] = {}
        
        for menu_item in menu_items:
            # Estimate servings per day
            servings_per_day = random.randint(20, 50)
            
            for component in menu_item.get("recipe", []):
                ingredient_id = component["ingredient_id"]
                ingredient_name = component["ingredient_name"]
                quantity_per_serving = component["quantity"]
                unit_of_measure = component["unit_of_measure"]
                
                daily_quantity = quantity_per_serving * servings_per_day
                
                if ingredient_id not in ingredient_totals:
                    ingredient_totals[ingredient_id] = {
                        "ingredient_name": ingredient_name,
                        "unit_of_measure": unit_of_measure,
                        "daily_quantity": 0,
                        "forecast_days": forecast_days,
                    }
                
                ingredient_totals[ingredient_id]["daily_quantity"] += daily_quantity
        
        # Calculate totals
        for ingredient_id, data in ingredient_totals.items():
            data["total_quantity"] = data["daily_quantity"] * forecast_days
        
        return ingredient_totals
    
    async def get_accuracy_metrics(
        self,
        forecast_id: str,
    ) -> Optional[dict]:
        """Get accuracy metrics for a forecast."""
        forecast = await self.get_forecast(forecast_id)
        if not forecast:
            return None
        
        # Mock accuracy metrics
        return {
            "mae": 12.5,  # Mean Absolute Error
            "mape": 8.3,  # Mean Absolute Percentage Error
            "rmse": 15.2,  # Root Mean Square Error
            "bias": 2.1,  # Bias
        }


# Global service instance
forecasting_service = ForecastingService()
