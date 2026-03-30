"""Weather integration service."""

import logging
from datetime import datetime, timedelta
from typing import Any, Dict, List, Optional

import httpx
from tenacity import retry, stop_after_attempt, wait_exponential

from src.config import get_settings

logger = logging.getLogger(__name__)


class WeatherService:
    """Service for fetching weather data."""
    
    def __init__(self):
        self.settings = get_settings()
        self.api_key = self.settings.WEATHER_API_KEY
        self.base_url = self.settings.WEATHER_API_URL
    
    @retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=4, max=10))
    async def _request(
        self,
        endpoint: str,
        params: Optional[Dict] = None,
    ) -> Dict[str, Any]:
        """Make a request to weather API."""
        url = f"{self.base_url}/{endpoint}"
        
        if params is None:
            params = {}
        params["appid"] = self.api_key
        
        async with httpx.AsyncClient() as client:
            response = await client.get(url, params=params, timeout=30.0)
            response.raise_for_status()
            return response.json()
    
    async def get_current_weather(
        self,
        lat: float,
        lon: float,
    ) -> Dict:
        """Get current weather for location."""
        return await self._request(
            "weather",
            params={"lat": lat, "lon": lon, "units": "imperial"},
        )
    
    async def get_forecast(
        self,
        lat: float,
        lon: float,
        days: int = 7,
    ) -> Dict:
        """Get weather forecast for location."""
        result = await self._request(
            "forecast",
            params={"lat": lat, "lon": lon, "units": "imperial"},
        )
        
        # Process and format forecast data
        forecast_days = []
        seen_dates = set()
        
        for item in result.get("list", []):
            dt = datetime.fromtimestamp(item["dt"])
            date_str = dt.strftime("%Y-%m-%d")
            
            if date_str not in seen_dates and len(forecast_days) < days:
                seen_dates.add(date_str)
                
                main = item.get("main", {})
                weather = item.get("weather", [{}])[0]
                
                forecast_days.append({
                    "date": date_str,
                    "temp_high": main.get("temp_max", 0),
                    "temp_low": main.get("temp_min", 0),
                    "precipitation_chance": item.get("pop", 0) * 100,
                    "precipitation_amount": item.get("rain", {}).get("3h", 0),
                    "wind_speed": item.get("wind", {}).get("speed", 0),
                    "humidity": main.get("humidity", 0),
                    "conditions": weather.get("main", ""),
                })
        
        return {
            "location": result.get("city", {}).get("name", ""),
            "forecast_days": forecast_days,
        }
    
    async def get_weather_by_zip(
        self,
        zip_code: str,
        country: str = "us",
    ) -> Dict:
        """Get weather by ZIP code."""
        return await self._request(
            "weather",
            params={"zip": f"{zip_code},{country}", "units": "imperial"},
        )
    
    def calculate_gdd(
        self,
        temp_high: float,
        temp_low: float,
        base_temp: float = 50.0,
    ) -> float:
        """Calculate Growing Degree Days for a day."""
        # Average daily temperature
        avg_temp = (temp_high + temp_low) / 2
        
        # GDD = max(0, avg_temp - base_temp)
        gdd = max(0.0, avg_temp - base_temp)
        
        return gdd
    
    async def get_gdd_accumulation(
        self,
        lat: float,
        lon: float,
        planting_date: datetime,
        base_temp: float = 50.0,
    ) -> Dict:
        """Calculate accumulated GDD since planting date."""
        # Get historical weather data (simplified - in production would use historical API)
        current = await self.get_current_weather(lat, lon)
        forecast = await self.get_forecast(lat, lon, days=7)
        
        # Calculate days since planting
        days_since_planting = (datetime.now() - planting_date).days
        
        # For demo, estimate GDD based on typical values
        # In production, fetch actual historical data
        estimated_daily_gdd = 15.0  # Average GDD per day during growing season
        accumulated_gdd = days_since_planting * estimated_daily_gdd
        
        return {
            "planting_date": planting_date.isoformat(),
            "days_since_planting": days_since_planting,
            "accumulated_gdd": round(accumulated_gdd, 1),
            "base_temperature": base_temp,
            "current_temp": current.get("main", {}).get("temp"),
        }
    
    async def get_agricultural_forecast(
        self,
        lat: float,
        lon: float,
    ) -> Dict:
        """Get agricultural-specific weather forecast."""
        forecast = await self.get_forecast(lat, lon, days=14)
        
        # Calculate agricultural metrics
        total_precipitation = sum(d.get("precipitation_amount", 0) for d in forecast["forecast_days"])
        avg_temp = sum((d.get("temp_high", 0) + d.get("temp_low", 0)) / 2 for d in forecast["forecast_days"]) / len(forecast["forecast_days"])
        
        # Determine if conditions are favorable for field work
        favorable_days = sum(
            1 for d in forecast["forecast_days"]
            if d.get("precipitation_chance", 0) < 30 and d.get("wind_speed", 0) < 15
        )
        
        return {
            **forecast,
            "agricultural_summary": {
                "total_precipitation_14d": round(total_precipitation, 2),
                "average_temperature": round(avg_temp, 1),
                "favorable_fieldwork_days": favorable_days,
                "recommendation": self._get_fieldwork_recommendation(favorable_days),
            },
        }
    
    def _get_fieldwork_recommendation(self, favorable_days: int) -> str:
        """Get fieldwork recommendation based on forecast."""
        if favorable_days >= 10:
            return "Excellent conditions for fieldwork. Good window for planting or spraying."
        elif favorable_days >= 7:
            return "Good conditions for fieldwork. Plan activities accordingly."
        elif favorable_days >= 4:
            return "Fair conditions. Limited windows for fieldwork - prioritize critical tasks."
        else:
            return "Poor conditions. Delay non-essential fieldwork if possible."
