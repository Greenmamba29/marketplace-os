"""Pricing engine service for calculating prices and managing formulas."""

import logging
from datetime import datetime, timedelta
from typing import Dict, List, Optional

from src.config import settings
from src.services.baserow import baserow_service

logger = logging.getLogger(__name__)


class PricingEngine:
    """Service for calculating prices and managing pricing formulas."""
    
    # Base prices for different materials (fallback if no data)
    BASE_PRICES = {
        "carbonate": {
            "battery": 25000,
            "technical": 22000,
            "industrial": 18000,
        },
        "hydroxide": {
            "battery": 28000,
            "technical": 25000,
            "industrial": 21000,
        },
        "spodumene": {
            "battery": 3500,
            "technical": 3200,
            "industrial": 2800,
        },
        "metal": {
            "battery": 45000,
            "technical": 42000,
            "industrial": 38000,
        },
        "chloride": {
            "battery": 15000,
            "technical": 13000,
            "industrial": 11000,
        },
    }
    
    def __init__(self):
        self.cache = {}
        self.last_update = None
    
    async def get_current_price(
        self,
        material_form: str,
        grade: str = "battery",
        currency: str = "USD",
    ) -> Dict:
        """Get the current price for a material."""
        try:
            # Try to get latest spot price from Baserow
            result = await baserow_service.get_spot_prices(
                filters={
                    "filter__field_material_form__equal": material_form,
                    "filter__field_grade__equal": grade,
                },
                size=1,
            )
            
            items = result.get("results", [])
            if items:
                price_data = items[0]
                return {
                    "material_form": material_form,
                    "grade": grade,
                    "price": float(price_data.get("price", 0)),
                    "currency": price_data.get("currency", currency),
                    "unit": price_data.get("unit", "mt"),
                    "timestamp": price_data.get("timestamp"),
                    "source": price_data.get("source", "internal"),
                }
        except Exception as e:
            logger.warning(f"Failed to get spot price from Baserow: {e}")
        
        # Fallback to base price
        base_price = self.BASE_PRICES.get(material_form, {}).get(grade, 0)
        return {
            "material_form": material_form,
            "grade": grade,
            "price": base_price,
            "currency": currency,
            "unit": "mt",
            "timestamp": datetime.utcnow().isoformat(),
            "source": "base",
        }
    
    async def get_price_index(self, material_form: str) -> Dict:
        """Get comprehensive price index for a material."""
        now = datetime.utcnow()
        
        # Get current price
        current = await self.get_current_price(material_form)
        current_price = current["price"]
        
        # Calculate changes (mock data for demo)
        # In production, these would be calculated from historical data
        change_24h = current_price * 0.02  # 2% change
        change_7d = current_price * 0.05   # 5% weekly change
        change_30d = current_price * -0.03  # -3% monthly change
        
        return {
            "material_form": material_form,
            "current_price": current_price,
            "change_24h": round(change_24h, 2),
            "change_24h_percent": round((change_24h / current_price) * 100, 2),
            "change_7d": round(change_7d, 2),
            "change_30d": round(change_30d, 2),
            "high_52w": round(current_price * 1.3, 2),
            "low_52w": round(current_price * 0.7, 2),
            "currency": current["currency"],
            "unit": current["unit"],
            "last_updated": now.isoformat(),
        }
    
    async def get_all_indices(self) -> List[Dict]:
        """Get price indices for all material forms."""
        indices = []
        for material_form in self.BASE_PRICES.keys():
            index = await self.get_price_index(material_form)
            indices.append(index)
        return indices
    
    async def get_price_history(
        self,
        material_form: str,
        start_date: datetime,
        end_date: datetime,
        grade: str = "battery",
    ) -> List[Dict]:
        """Get historical price data."""
        try:
            # Try to get from Baserow
            result = await baserow_service.get_spot_prices(
                filters={
                    "filter__field_material_form__equal": material_form,
                    "filter__field_grade__equal": grade,
                },
                size=365,
            )
            
            items = result.get("results", [])
            if items:
                return [
                    {
                        "date": item.get("timestamp"),
                        "open": float(item.get("open", item.get("price", 0))),
                        "high": float(item.get("high", item.get("price", 0))),
                        "low": float(item.get("low", item.get("price", 0))),
                        "close": float(item.get("price", 0)),
                        "volume": float(item.get("volume", 0)),
                        "currency": item.get("currency", "USD"),
                    }
                    for item in items
                ]
        except Exception as e:
            logger.warning(f"Failed to get price history from Baserow: {e}")
        
        # Generate mock historical data
        return self._generate_mock_history(material_form, start_date, end_date)
    
    def _generate_mock_history(
        self,
        material_form: str,
        start_date: datetime,
        end_date: datetime,
    ) -> List[Dict]:
        """Generate mock historical price data."""
        import random
        
        base_price = self.BASE_PRICES.get(material_form, {}).get("battery", 25000)
        history = []
        current_date = start_date
        
        price = base_price
        while current_date <= end_date:
            # Random daily fluctuation
            change = random.uniform(-0.03, 0.03)
            price = price * (1 + change)
            
            history.append({
                "date": current_date.strftime("%Y-%m-%d"),
                "open": round(price * 0.99, 2),
                "high": round(price * 1.02, 2),
                "low": round(price * 0.97, 2),
                "close": round(price, 2),
                "volume": round(random.uniform(1000, 10000), 2),
                "currency": "USD",
            })
            
            current_date += timedelta(days=1)
        
        return history
    
    def calculate_contract_price(
        self,
        base_price: float,
        quantity: float,
        contract_type: str,
        delivery_term: str,
        premium_discount: float = 0,
    ) -> Dict:
        """Calculate contract price with adjustments."""
        # Volume discount
        volume_discount = 0
        if quantity >= 1000:
            volume_discount = 0.05  # 5% for 1000+ mt
        elif quantity >= 500:
            volume_discount = 0.03  # 3% for 500+ mt
        elif quantity >= 100:
            volume_discount = 0.01  # 1% for 100+ mt
        
        # Contract type premium/discount
        contract_adjustment = {
            "spot": 0.05,      # +5% for spot
            "quarterly": 0,    # No adjustment
            "annual": -0.02,   # -2% for annual
            "multi_year": -0.05,  # -5% for multi-year
        }.get(contract_type, 0)
        
        # Delivery term adjustment
        delivery_adjustment = {
            "EXW": -0.02,
            "FOB": -0.01,
            "CFR": 0,
            "CIF": 0.01,
            "DDP": 0.03,
        }.get(delivery_term, 0)
        
        # Calculate final price
        total_adjustment = (
            volume_discount +
            contract_adjustment +
            delivery_adjustment +
            premium_discount
        )
        
        unit_price = base_price * (1 + total_adjustment)
        total_price = unit_price * quantity
        
        return {
            "base_price": base_price,
            "unit_price": round(unit_price, 2),
            "total_price": round(total_price, 2),
            "adjustments": {
                "volume_discount": round(volume_discount * 100, 2),
                "contract_adjustment": round(contract_adjustment * 100, 2),
                "delivery_adjustment": round(delivery_adjustment * 100, 2),
                "premium_discount": round(premium_discount * 100, 2),
            },
            "total_adjustment_percent": round(total_adjustment * 100, 2),
        }


# Singleton instance
pricing_engine = PricingEngine()
