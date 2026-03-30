"""Market intelligence and AI recommendation service."""

from typing import Any, Dict, List, Optional
from datetime import datetime, timedelta

from config import get_settings


class IntelligenceService:
    """Service for market intelligence and AI-powered recommendations."""
    
    def __init__(self):
        self.settings = get_settings()
    
    async def get_price_trends(
        self,
        part_id: str,
        days: int = 90
    ) -> Dict[str, Any]:
        """Get price trends for a part."""
        # This would integrate with a price tracking system
        # For now, return mock data
        
        end_date = datetime.now()
        start_date = end_date - timedelta(days=days)
        
        # Generate mock trend data
        data_points = []
        current_date = start_date
        base_price = 100.0
        
        while current_date <= end_date:
            # Simulate some price variation
            variation = (current_date.day % 10) - 5
            price = base_price + variation
            
            data_points.append({
                "date": current_date.strftime("%Y-%m-%d"),
                "avg_price": round(price, 2),
                "min_price": round(price * 0.9, 2),
                "max_price": round(price * 1.1, 2),
                "volume": (current_date.day % 20) + 10,
            })
            
            current_date += timedelta(days=7)
        
        return {
            "part_id": part_id,
            "time_range": f"{days}d",
            "data_points": data_points,
        }
    
    async def get_substitute_recommendations(
        self,
        part_id: str,
        limit: int = 5
    ) -> List[Dict[str, Any]]:
        """Get AI-powered substitute recommendations."""
        # This would use ML models or similarity algorithms
        # For now, return mock recommendations
        
        return [
            {
                "original_part_id": part_id,
                "original_part_name": "Original Part",
                "substitute_part_id": "sub-1",
                "substitute_part_name": "Premium Alternative",
                "substitute_manufacturer": "Brand A",
                "confidence": 98,
                "price_difference": -15,
                "lead_time_difference": -3,
                "compatibility_notes": "Direct replacement, same specifications",
            },
            {
                "original_part_id": part_id,
                "original_part_name": "Original Part",
                "substitute_part_id": "sub-2",
                "substitute_part_name": "Standard Alternative",
                "substitute_manufacturer": "Brand B",
                "confidence": 92,
                "price_difference": -25,
                "lead_time_difference": 0,
                "compatibility_notes": "Compatible with minor adjustments",
            },
        ]
    
    async def get_availability_alerts(
        self,
        user_id: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """Get availability alerts for tracked parts."""
        # This would check stock levels and notify users
        # For now, return mock alerts
        
        return [
            {
                "id": "alert-1",
                "part_id": "part-1",
                "part_name": "SKF 6204-2RS",
                "alert_type": "low_stock",
                "severity": "warning",
                "message": "Only 3 suppliers have stock",
                "suggested_action": "Consider ordering from alternative suppliers",
                "created_at": datetime.now().isoformat(),
            },
            {
                "id": "alert-2",
                "part_id": "part-2",
                "part_name": "Parker PRV-3000",
                "alert_type": "price_spike",
                "severity": "warning",
                "message": "Price increased 25% in last 30 days",
                "suggested_action": "Wait for price stabilization or consider alternatives",
                "created_at": datetime.now().isoformat(),
            },
        ]
    
    async def get_market_insights(
        self,
        category: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """Get market insights and trends."""
        # This would aggregate market data
        # For now, return mock insights
        
        return [
            {
                "id": "insight-1",
                "title": "Bearing Prices Trending Down",
                "description": "SKF and NSK bearing prices have decreased 12% over the past quarter due to increased competition.",
                "trend": "down",
                "impact": "high",
                "category": "Bearings",
                "created_at": datetime.now().isoformat(),
            },
            {
                "id": "insight-2",
                "title": "Hydraulic Valve Shortage",
                "description": "Supply chain disruptions affecting Parker and Bosch Rexroth hydraulic valves. Lead times extended to 8 weeks.",
                "trend": "up",
                "impact": "critical",
                "category": "Hydraulics",
                "created_at": datetime.now().isoformat(),
            },
        ]
    
    async def analyze_rfq(
        self,
        rfq_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Analyze an RFQ and provide recommendations."""
        # This would analyze RFQ data and provide insights
        
        items = rfq_data.get("items", [])
        total_value = sum(
            item.get("target_price", 0) * item.get("quantity", 1)
            for item in items
        )
        
        return {
            "estimated_suppliers": min(len(items) * 3, 15),
            "estimated_response_time": "2-4 hours" if rfq_data.get("is_emergency") else "24-48 hours",
            "potential_savings": round(total_value * 0.15, 2),
            "recommendations": [
                "Consider allowing substitutes for better pricing",
                "Extend RFQ duration for more competitive quotes",
            ],
        }
    
    async def get_supplier_score(
        self,
        supplier_id: str
    ) -> Dict[str, Any]:
        """Calculate a supplier score based on various factors."""
        # This would aggregate supplier performance data
        
        return {
            "supplier_id": supplier_id,
            "overall_score": 4.5,
            "factors": {
                "on_time_delivery": 4.7,
                "quality": 4.6,
                "communication": 4.3,
                "pricing": 4.4,
            },
            "recommendation": "Highly recommended",
        }
