"""LEED tracking service."""

import logging
from typing import Dict, List, Optional

from config import settings

logger = logging.getLogger(__name__)


class LEEDService:
    """Service for LEED compliance tracking and calculations."""
    
    # LEED credit definitions
    MR_CREDITS = {
        "MRc1": {
            "name": "Building Life-Cycle Impact Reduction",
            "points_available": 5,
            "requirements": [
                "Demonstrate reduced environmental impact through whole building life-cycle assessment",
                "Minimum 10% reduction in at least 3 impact categories",
            ],
        },
        "MRc2": {
            "name": "Building Product Disclosure and Optimization - EPDs",
            "points_available": 2,
            "requirements": [
                "Use at least 20 different products from manufacturers with EPDs (1 point)",
                "Use products from at least 5 manufacturers with EPDs (additional 1 point)",
            ],
        },
        "MRc3": {
            "name": "Building Product Disclosure and Optimization - Sourcing of Raw Materials",
            "points_available": 2,
            "requirements": [
                "Use products with responsible sourcing reporting (1 point)",
                "Meet leadership extraction criteria (additional 1 point)",
            ],
        },
        "MRc4": {
            "name": "Building Product Disclosure and Optimization - Material Ingredients",
            "points_available": 2,
            "requirements": [
                "Use at least 20 products with material ingredient reporting (1 point)",
                "Use products from at least 5 manufacturers with reporting (additional 1 point)",
            ],
        },
        "MRc5": {
            "name": "Construction and Demolition Waste Management",
            "points_available": 2,
            "requirements": [
                "Divert 50% of waste from landfills (1 point)",
                "Divert 75% of waste from landfills (additional 1 point)",
            ],
        },
    }
    
    # LEED level thresholds
    LEED_LEVELS = {
        "certified": {"min": 40, "max": 49},
        "silver": {"min": 50, "max": 59},
        "gold": {"min": 60, "max": 79},
        "platinum": {"min": 80, "max": 110},
    }
    
    def __init__(self) -> None:
        """Initialize LEED service."""
        self.regional_radius = settings.LEED_REGIONAL_RADIUS_MILES
    
    def calculate_mr_credit_1(self, lca_data: Dict) -> Dict:
        """Calculate MR Credit 1: Building Life-Cycle Impact Reduction."""
        # Simplified calculation - would use actual LCA data
        reduction_percentage = lca_data.get("reduction_percentage", 0)
        
        points = 0
        if reduction_percentage >= 10:
            points = 3
        elif reduction_percentage >= 5:
            points = 2
        elif reduction_percentage >= 3:
            points = 1
        
        return {
            "points": points,
            "requirements_met": points > 0,
            "reduction_percentage": reduction_percentage,
        }
    
    def calculate_mr_credit_2(self, products: List[Dict]) -> Dict:
        """Calculate MR Credit 2: EPDs."""
        products_with_epd = [p for p in products if p.get("has_epd", False)]
        manufacturers = set(p.get("manufacturer") for p in products_with_epd)
        
        points = 0
        if len(products_with_epd) >= 20:
            points += 1
        if len(manufacturers) >= 5:
            points += 1
        
        return {
            "points": points,
            "requirements_met": points > 0,
            "products_with_epd": len(products_with_epd),
            "manufacturers": len(manufacturers),
        }
    
    def calculate_mr_credit_3(self, materials: List[Dict]) -> Dict:
        """Calculate MR Credit 3: Sourcing of Raw Materials."""
        # Check for regional materials
        regional_materials = [m for m in materials if m.get("is_regional", False)]
        regional_value = sum(m.get("cost", 0) for m in regional_materials)
        total_value = sum(m.get("cost", 0) for m in materials)
        
        regional_percentage = (regional_value / total_value * 100) if total_value > 0 else 0
        
        points = 0
        if regional_percentage >= 20:
            points += 1
        if regional_percentage >= 40:
            points += 1
        
        return {
            "points": points,
            "requirements_met": points > 0,
            "regional_percentage": round(regional_percentage, 1),
            "regional_value": regional_value,
        }
    
    def calculate_mr_credit_4(self, materials: List[Dict]) -> Dict:
        """Calculate MR Credit 4: Material Ingredients."""
        # Calculate recycled content
        recycled_materials = [m for m in materials if m.get("recycled_percentage", 0) > 0]
        recycled_value = sum(
            m.get("cost", 0) * (m.get("recycled_percentage", 0) / 100)
            for m in recycled_materials
        )
        total_value = sum(m.get("cost", 0) for m in materials)
        
        recycled_percentage = (recycled_value / total_value * 100) if total_value > 0 else 0
        
        points = 0
        if recycled_percentage >= 15:
            points += 1
        if recycled_percentage >= 30:
            points += 1
        
        return {
            "points": points,
            "requirements_met": points > 0,
            "recycled_percentage": round(recycled_percentage, 1),
            "recycled_value": recycled_value,
        }
    
    def calculate_mr_credit_5(self, waste_data: Dict) -> Dict:
        """Calculate MR Credit 5: Construction and Demolition Waste Management."""
        total_waste = waste_data.get("total_waste", 0)
        diverted_waste = waste_data.get("diverted_waste", 0)
        
        diversion_percentage = (diverted_waste / total_waste * 100) if total_waste > 0 else 0
        
        points = 0
        if diversion_percentage >= 50:
            points += 1
        if diversion_percentage >= 75:
            points += 1
        
        return {
            "points": points,
            "requirements_met": points > 0,
            "diversion_percentage": round(diversion_percentage, 1),
        }
    
    def calculate_all_mr_credits(
        self,
        materials: List[Dict],
        lca_data: Optional[Dict] = None,
        waste_data: Optional[Dict] = None,
    ) -> Dict:
        """Calculate all MR credits for a project."""
        mr1 = self.calculate_mr_credit_1(lca_data or {})
        mr2 = self.calculate_mr_credit_2(materials)
        mr3 = self.calculate_mr_credit_3(materials)
        mr4 = self.calculate_mr_credit_4(materials)
        mr5 = self.calculate_mr_credit_5(waste_data or {})
        
        total_points = sum([
            mr1["points"],
            mr2["points"],
            mr3["points"],
            mr4["points"],
            mr5["points"],
        ])
        
        return {
            "mr_credit_1": mr1,
            "mr_credit_2": mr2,
            "mr_credit_3": mr3,
            "mr_credit_4": mr4,
            "mr_credit_5": mr5,
            "total_mr_points": total_points,
        }
    
    def get_leed_level(self, total_points: int) -> Optional[str]:
        """Determine LEED level based on total points."""
        for level, thresholds in self.LEED_LEVELS.items():
            if thresholds["min"] <= total_points <= thresholds["max"]:
                return level
        if total_points >= self.LEED_LEVELS["platinum"]["min"]:
            return "platinum"
        return None
    
    def get_credit_details(self, credit_id: str) -> Optional[Dict]:
        """Get details for a specific LEED credit."""
        return self.MR_CREDITS.get(credit_id)
    
    def get_all_credits(self) -> List[Dict]:
        """Get all LEED credits."""
        return [
            {"credit_id": k, **v}
            for k, v in self.MR_CREDITS.items()
        ]
    
    def generate_documentation_checklist(self, project_data: Dict) -> List[Dict]:
        """Generate documentation checklist for LEED submission."""
        checklist = []
        
        for credit_id, credit_info in self.MR_CREDITS.items():
            checklist.append({
                "credit_id": credit_id,
                "credit_name": credit_info["name"],
                "documentation_needed": credit_info["requirements"],
                "status": "pending",  # pending, in_progress, complete
            })
        
        return checklist


# Singleton instance
_leed_service: Optional[LEEDService] = None


def get_leed_service() -> LEEDService:
    """Get or create LEED service instance."""
    global _leed_service
    if _leed_service is None:
        _leed_service = LEEDService()
    return _leed_service
