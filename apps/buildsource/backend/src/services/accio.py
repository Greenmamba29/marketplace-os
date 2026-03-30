"""ACCIO emergency sourcing service."""

import logging
from datetime import datetime, timedelta
from typing import Dict, List, Optional

from config import settings

logger = logging.getLogger(__name__)


class AccioService:
    """Service for ACCIO emergency material sourcing."""
    
    def __init__(self) -> None:
        """Initialize ACCIO service."""
        self.enabled = settings.ACCIO_ENABLED
        self.max_radius = settings.ACCIO_MAX_RADIUS_MILES
        self.premium_multiplier = settings.ACCIO_PREMIUM_MULTIPLIER
    
    async def estimate_delivery(
        self,
        material_type: str,
        zip_code: str,
        quantity: float,
        suppliers: List[Dict],
    ) -> Dict:
        """Estimate delivery time and cost for emergency sourcing."""
        if not self.enabled:
            return {
                "estimated_time_hours": 0,
                "estimated_cost_range": {"min": 0, "max": 0},
                "available_suppliers": 0,
            }
        
        # Find nearby suppliers
        nearby_suppliers = [
            s for s in suppliers
            if s.get("distance_miles", float("inf")) <= self.max_radius
        ]
        
        if not nearby_suppliers:
            return {
                "estimated_time_hours": 0,
                "estimated_cost_range": {"min": 0, "max": 0},
                "available_suppliers": 0,
            }
        
        # Calculate average prices
        prices = [s.get("unit_price", 0) for s in nearby_suppliers]
        avg_price = sum(prices) / len(prices)
        min_price = min(prices)
        max_price = max(prices)
        
        # Apply premium for emergency service
        min_cost = min_price * quantity * self.premium_multiplier
        max_cost = max_price * quantity * self.premium_multiplier
        
        # Estimate time based on distance
        closest_distance = min(s.get("distance_miles", float("inf")) for s in nearby_suppliers)
        
        # Rough estimate: 2 hours for close, up to 8 hours for max radius
        estimated_hours = 2 + (closest_distance / self.max_radius) * 6
        
        return {
            "estimated_time_hours": round(estimated_hours, 1),
            "estimated_cost_range": {
                "min": round(min_cost, 2),
                "max": round(max_cost, 2),
            },
            "available_suppliers": len(nearby_suppliers),
        }
    
    async def find_best_supplier(
        self,
        material_type: str,
        specification: str,
        quantity: float,
        zip_code: str,
        needed_by: datetime,
        suppliers: List[Dict],
    ) -> Optional[Dict]:
        """Find the best supplier for an emergency request."""
        if not self.enabled:
            return None
        
        # Filter suppliers by material type and availability
        eligible_suppliers = [
            s for s in suppliers
            if material_type in s.get("material_types", [])
            and s.get("available_quantity", 0) >= quantity
            and s.get("distance_miles", float("inf")) <= self.max_radius
        ]
        
        if not eligible_suppliers:
            return None
        
        # Score suppliers based on:
        # - Distance (closer is better)
        # - Price (lower is better)
        # - Availability (immediate is better)
        # - Rating (higher is better)
        
        def score_supplier(s: Dict) -> float:
            distance_score = 1 - (s.get("distance_miles", 0) / self.max_radius)
            
            # Normalize price (assuming $100 as reference)
            price = s.get("unit_price", 100)
            price_score = max(0, 1 - (price / 100))
            
            rating_score = s.get("rating", 3) / 5
            
            # Weighted average
            return (distance_score * 0.4) + (price_score * 0.3) + (rating_score * 0.3)
        
        # Sort by score
        eligible_suppliers.sort(key=score_supplier, reverse=True)
        
        return eligible_suppliers[0] if eligible_suppliers else None
    
    def calculate_premium_price(
        self,
        base_price: float,
        urgency_hours: float,
    ) -> float:
        """Calculate premium price based on urgency."""
        # Base premium
        premium = self.premium_multiplier
        
        # Additional premium for very urgent requests (< 4 hours)
        if urgency_hours < 4:
            premium += 0.5
        
        return base_price * premium
    
    def validate_request(
        self,
        material_type: str,
        quantity: float,
        needed_by: datetime,
    ) -> Dict:
        """Validate an ACCIO request."""
        errors = []
        warnings = []
        
        # Check quantity
        if quantity <= 0:
            errors.append("Quantity must be greater than 0")
        
        # Check timeframe
        now = datetime.utcnow()
        min_lead_time = timedelta(hours=2)
        
        if needed_by < now:
            errors.append("Delivery time must be in the future")
        elif needed_by < now + min_lead_time:
            errors.append("Minimum lead time is 2 hours")
        elif needed_by < now + timedelta(hours=4):
            warnings.append("Very short lead time - limited supplier availability")
        
        return {
            "valid": len(errors) == 0,
            "errors": errors,
            "warnings": warnings,
        }
    
    async def notify_suppliers(
        self,
        request_id: str,
        suppliers: List[Dict],
    ) -> bool:
        """Notify suppliers of an emergency request."""
        # This would integrate with notification service
        logger.info(f"Notifying {len(suppliers)} suppliers for ACCIO request {request_id}")
        return True
    
    def generate_request_number(self) -> str:
        """Generate a unique ACCIO request number."""
        timestamp = datetime.utcnow().strftime("%Y%m%d%H%M%S")
        return f"ACCIO-{timestamp}"


# Singleton instance
_accio_service: Optional[AccioService] = None


def get_accio_service() -> AccioService:
    """Get or create ACCIO service instance."""
    global _accio_service
    if _accio_service is None:
        _accio_service = AccioService()
    return _accio_service
