"""Spot price feed service for external price sources."""

import logging
from datetime import datetime
from typing import Dict, List, Optional

import httpx

from src.config import settings
from src.services.baserow import baserow_service

logger = logging.getLogger(__name__)


class SpotFeedService:
    """Service for fetching and managing spot price feeds."""
    
    # Mock price sources for demo
    PRICE_SOURCES = {
        "carbonate": ["Fastmarkets", "Asian Metal", "SMM"],
        "hydroxide": ["Fastmarkets", "Benchmark", "SMM"],
        "spodumene": ["Fastmarkets", "Platts", "Asian Metal"],
        "metal": ["Fastmarkets", "Metal Bulletin"],
        "chloride": ["SMM", "Asian Metal"],
    }
    
    def __init__(self):
        self.accio_url = settings.accio_api_url
        self.accio_key = settings.accio_api_key
    
    async def fetch_accio_prices(self) -> List[Dict]:
        """Fetch spot prices from ACCIO API."""
        if not self.accio_url or not self.accio_key:
            logger.info("ACCIO API not configured, using mock data")
            return self._generate_mock_prices()
        
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.accio_url}/prices",
                    headers={"Authorization": f"Bearer {self.accio_key}"},
                    timeout=30.0,
                )
                response.raise_for_status()
                return response.json()
        except Exception as e:
            logger.error(f"Failed to fetch ACCIO prices: {e}")
            return self._generate_mock_prices()
    
    def _generate_mock_prices(self) -> List[Dict]:
        """Generate mock spot prices for demo."""
        import random
        
        prices = []
        now = datetime.utcnow()
        
        base_prices = {
            "carbonate": 25000,
            "hydroxide": 28000,
            "spodumene": 3500,
            "metal": 45000,
            "chloride": 15000,
        }
        
        for material, base_price in base_prices.items():
            for grade in ["battery", "technical", "industrial"]:
                # Adjust price based on grade
                grade_multiplier = {
                    "battery": 1.0,
                    "technical": 0.9,
                    "industrial": 0.75,
                }[grade]
                
                price = base_price * grade_multiplier * (1 + random.uniform(-0.02, 0.02))
                
                prices.append({
                    "material_form": material,
                    "grade": grade,
                    "price": round(price, 2),
                    "currency": "USD",
                    "unit": "mt",
                    "source": random.choice(self.PRICE_SOURCES.get(material, ["Internal"])),
                    "timestamp": now.isoformat(),
                    "volume_traded": round(random.uniform(100, 10000), 2),
                })
        
        return prices
    
    async def update_spot_prices(self) -> Dict:
        """Update spot prices in the database."""
        try:
            # Fetch latest prices
            prices = await self.fetch_accio_prices()
            
            # Store in Baserow
            updated = 0
            for price in prices:
                try:
                    await baserow_service.create_spot_price(price)
                    updated += 1
                except Exception as e:
                    logger.warning(f"Failed to store price: {e}")
            
            return {
                "success": True,
                "updated": updated,
                "total": len(prices),
                "timestamp": datetime.utcnow().isoformat(),
            }
        except Exception as e:
            logger.error(f"Failed to update spot prices: {e}")
            return {
                "success": False,
                "error": str(e),
                "timestamp": datetime.utcnow().isoformat(),
            }
    
    async def get_price_sources(self) -> Dict[str, List[str]]:
        """Get available price sources for each material."""
        return self.PRICE_SOURCES
    
    async def calculate_price_average(
        self,
        material_form: str,
        grade: str,
        sources: Optional[List[str]] = None,
    ) -> Dict:
        """Calculate average price across sources."""
        try:
            # Get prices from database
            result = await baserow_service.get_spot_prices(
                filters={
                    "filter__field_material_form__equal": material_form,
                    "filter__field_grade__equal": grade,
                },
                size=100,
            )
            
            items = result.get("results", [])
            if not items:
                return {
                    "material_form": material_form,
                    "grade": grade,
                    "average_price": 0,
                    "sources_used": 0,
                    "timestamp": datetime.utcnow().isoformat(),
                }
            
            # Filter by sources if specified
            if sources:
                items = [i for i in items if i.get("source") in sources]
            
            # Calculate average
            prices = [float(i.get("price", 0)) for i in items]
            avg_price = sum(prices) / len(prices) if prices else 0
            
            return {
                "material_form": material_form,
                "grade": grade,
                "average_price": round(avg_price, 2),
                "min_price": round(min(prices), 2) if prices else 0,
                "max_price": round(max(prices), 2) if prices else 0,
                "sources_used": len(items),
                "timestamp": datetime.utcnow().isoformat(),
            }
        except Exception as e:
            logger.error(f"Failed to calculate price average: {e}")
            raise


# Singleton instance
spot_feed_service = SpotFeedService()
