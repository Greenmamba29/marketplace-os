"""Regional optimization service."""

import logging
from math import radians, sin, cos, sqrt, atan2
from typing import Dict, List, Optional, Tuple

from geopy.distance import geodesic
from geopy.geocoders import Nominatim

from config import settings

logger = logging.getLogger(__name__)


class RegionalService:
    """Service for regional supplier optimization and distance calculations."""
    
    # ZIP code to coordinates cache
    _zip_cache: Dict[str, Tuple[float, float]] = {}
    
    def __init__(self) -> None:
        """Initialize regional service."""
        self.geocoder = Nominatim(user_agent="buildsource-app")
        self.default_radius = settings.DEFAULT_SEARCH_RADIUS_MILES
        self.max_radius = settings.MAX_SEARCH_RADIUS_MILES
        self.leed_radius = settings.LEED_REGIONAL_RADIUS_MILES
    
    def calculate_distance(
        self,
        origin: Tuple[float, float],
        destination: Tuple[float, float],
    ) -> float:
        """Calculate distance between two coordinates in miles."""
        return geodesic(origin, destination).miles
    
    def calculate_distance_haversine(
        self,
        lat1: float,
        lon1: float,
        lat2: float,
        lon2: float,
    ) -> float:
        """Calculate distance using Haversine formula (faster, less accurate)."""
        R = 3959  # Earth's radius in miles
        
        lat1_rad = radians(lat1)
        lat2_rad = radians(lat2)
        delta_lat = radians(lat2 - lat1)
        delta_lon = radians(lon2 - lon1)
        
        a = sin(delta_lat / 2) ** 2 + cos(lat1_rad) * cos(lat2_rad) * sin(delta_lon / 2) ** 2
        c = 2 * atan2(sqrt(a), sqrt(1 - a))
        
        return R * c
    
    async def get_coordinates_from_zip(self, zip_code: str) -> Optional[Tuple[float, float]]:
        """Get coordinates from ZIP code."""
        # Check cache first
        if zip_code in self._zip_cache:
            return self._zip_cache[zip_code]
        
        try:
            # Geocode the ZIP code
            location = self.geocoder.geocode(f"{zip_code}, USA")
            if location:
                coords = (location.latitude, location.longitude)
                self._zip_cache[zip_code] = coords
                return coords
        except Exception as e:
            logger.error(f"Failed to geocode ZIP {zip_code}: {e}")
        
        return None
    
    def is_within_radius(
        self,
        origin: Tuple[float, float],
        destination: Tuple[float, float],
        radius_miles: float,
    ) -> bool:
        """Check if destination is within radius of origin."""
        distance = self.calculate_distance(origin, destination)
        return distance <= radius_miles
    
    def is_regional_for_leed(
        self,
        project_zip: str,
        supplier_zip: str,
    ) -> bool:
        """Check if supplier is within LEED regional radius."""
        # This would use actual coordinates in production
        # For now, use a simplified check
        return self._is_within_leed_radius(project_zip, supplier_zip)
    
    def _is_within_leed_radius(
        self,
        zip1: str,
        zip2: str,
    ) -> bool:
        """Check if two ZIP codes are within LEED regional radius."""
        # Simplified implementation - would use actual coordinates
        # Extract first 3 digits for rough regional comparison
        region1 = zip1[:3]
        region2 = zip2[:3]
        
        # Same region is definitely regional
        if region1 == region2:
            return True
        
        # Adjacent regions might be regional
        # This is a simplified heuristic
        try:
            return abs(int(region1) - int(region2)) <= 10
        except ValueError:
            return False
    
    def calculate_haul_cost(
        self,
        distance_miles: float,
        material_weight_tons: float,
        cost_per_ton_mile: float = 0.15,
    ) -> float:
        """Calculate hauling cost based on distance and weight."""
        return distance_miles * material_weight_tons * cost_per_ton_mile
    
    def calculate_carbon_footprint(
        self,
        distance_miles: float,
        material_weight_tons: float,
        emission_factor: float = 0.18,  # kg CO2 per ton-mile for truck
    ) -> float:
        """Calculate carbon footprint of transportation."""
        return distance_miles * material_weight_tons * emission_factor
    
    def rank_suppliers_by_proximity(
        self,
        project_zip: str,
        suppliers: List[Dict[str, Any]],
        max_radius: Optional[float] = None,
    ) -> List[Dict[str, Any]]:
        """Rank suppliers by proximity to project."""
        radius = max_radius or self.default_radius
        
        # Get project coordinates
        project_coords = self._zip_cache.get(project_zip)
        if not project_coords:
            # Return unsorted if we can't geocode
            return suppliers
        
        ranked = []
        for supplier in suppliers:
            supplier_zip = supplier.get("zip_code")
            if not supplier_zip:
                continue
            
            supplier_coords = self._zip_cache.get(supplier_zip)
            if not supplier_coords:
                continue
            
            distance = self.calculate_distance(project_coords, supplier_coords)
            if distance <= radius:
                ranked.append({
                    **supplier,
                    "distance_miles": round(distance, 1),
                })
        
        # Sort by distance
        ranked.sort(key=lambda x: x["distance_miles"])
        return ranked
    
    def get_optimal_suppliers(
        self,
        project_zip: str,
        material_type: str,
        required_quantity: float,
        suppliers: List[Dict[str, Any]],
        optimize_for: str = "cost",  # 'cost', 'time', 'carbon'
    ) -> List[Dict[str, Any]]:
        """Get optimal suppliers based on optimization criteria."""
        ranked = self.rank_suppliers_by_proximity(project_zip, suppliers)
        
        if optimize_for == "cost":
            # Consider both price and haul cost
            for supplier in ranked:
                distance = supplier.get("distance_miles", 0)
                unit_price = supplier.get("unit_price", 0)
                haul_cost = self.calculate_haul_cost(distance, required_quantity / 20)  # Assume 20 tons per load
                supplier["total_cost"] = (unit_price * required_quantity) + haul_cost
            
            ranked.sort(key=lambda x: x.get("total_cost", float("inf")))
        
        elif optimize_for == "time":
            # Sort by delivery lead time
            ranked.sort(key=lambda x: x.get("delivery_lead_time_days", float("inf")))
        
        elif optimize_for == "carbon":
            # Sort by carbon footprint
            for supplier in ranked:
                distance = supplier.get("distance_miles", 0)
                carbon = self.calculate_carbon_footprint(distance, required_quantity / 20)
                supplier["carbon_kg"] = round(carbon, 1)
            
            ranked.sort(key=lambda x: x.get("carbon_kg", float("inf")))
        
        return ranked
    
    def validate_delivery_feasibility(
        self,
        supplier_zip: str,
        project_zip: str,
        delivery_date: str,
        lead_time_days: int,
    ) -> Dict[str, any]:
        """Validate if delivery is feasible given constraints."""
        # Get coordinates
        supplier_coords = self._zip_cache.get(supplier_zip)
        project_coords = self._zip_cache.get(project_zip)
        
        if not supplier_coords or not project_coords:
            return {
                "feasible": True,  # Assume feasible if we can't calculate
                "distance_miles": None,
                "estimated_transit_days": None,
            }
        
        distance = self.calculate_distance(supplier_coords, project_coords)
        
        # Estimate transit time (roughly 500 miles per day for trucking)
        estimated_transit_days = max(1, int(distance / 500))
        
        return {
            "feasible": estimated_transit_days <= lead_time_days,
            "distance_miles": round(distance, 1),
            "estimated_transit_days": estimated_transit_days,
        }


# Singleton instance
_regional_service: Optional[RegionalService] = None


def get_regional_service() -> RegionalService:
    """Get or create regional service instance."""
    global _regional_service
    if _regional_service is None:
        _regional_service = RegionalService()
    return _regional_service
