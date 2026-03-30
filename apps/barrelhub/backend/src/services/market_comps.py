"""Market comps and pricing intelligence service."""

from datetime import date, datetime, timedelta
from decimal import Decimal
from typing import List, Optional

import structlog

from ..config import settings
from ..models.barrel import SpiritType
from ..models.market import (
    MarketComp,
    PriceStats,
    PriceStatsResponse,
    PriceTrend,
    ComparableTransaction,
)

logger = structlog.get_logger()


class MarketCompsService:
    """Service for market comps and pricing intelligence."""
    
    def __init__(self):
        self.cache_ttl = 300  # 5 minutes
        self._cache = {}
    
    async def get_comparables(
        self,
        spirit_type: SpiritType,
        age_years: Optional[int] = None,
        proof: Optional[Decimal] = None,
        months: int = 12,
        limit: int = 20,
    ) -> List[MarketComp]:
        """Get comparable transactions."""
        logger.info(
            "getting_comparables",
            spirit_type=spirit_type,
            age_years=age_years,
            proof=proof,
            months=months,
        )
        
        # Mock data for demonstration
        # In production, this would query from Baserow
        return self._generate_mock_comps(spirit_type, limit)
    
    async def get_price_trends(
        self,
        spirit_type: SpiritType,
        months: int = 12,
    ) -> List[PriceTrend]:
        """Get price trends over time."""
        logger.info(
            "getting_price_trends",
            spirit_type=spirit_type,
            months=months,
        )
        
        # Generate mock trend data
        trends = []
        base_price = Decimal("15.00") if spirit_type == SpiritType.BOURBON else Decimal("12.00")
        
        for i in range(months):
            month_date = datetime.now() - timedelta(days=30 * (months - i - 1))
            # Add some variation
            variation = Decimal(str(i * 0.5))
            price = base_price + variation
            
            trends.append(PriceTrend(
                month=month_date.strftime("%Y-%m"),
                avg_price=price,
                volume=Decimal("10000") + Decimal(str(i * 500)),
                transaction_count=50 + i * 5,
            ))
        
        return trends
    
    async def get_price_stats(
        self,
        spirit_type: Optional[SpiritType] = None,
        age_range: Optional[tuple[int, int]] = None,
        months: int = 12,
    ) -> PriceStatsResponse:
        """Get comprehensive price statistics."""
        logger.info(
            "getting_price_stats",
            spirit_type=spirit_type,
            age_range=age_range,
            months=months,
        )
        
        # Mock stats
        base_price = Decimal("15.00") if spirit_type == SpiritType.BOURBON else Decimal("12.00")
        
        overall = PriceStats(
            avg_price=base_price,
            median_price=base_price * Decimal("0.95"),
            min_price=base_price * Decimal("0.7"),
            max_price=base_price * Decimal("1.3"),
            transaction_count=450,
            total_volume=Decimal("450000"),
        )
        
        # By age breakdown
        by_age = []
        for age in [2, 4, 6, 8, 10, 12, 15]:
            price_multiplier = Decimal("1.0") + (Decimal("0.1") * age)
            by_age.append({
                "age": age,
                "avg_price": base_price * price_multiplier,
                "count": 50 + age * 10,
            })
        
        # By proof breakdown
        by_proof = [
            {"proof_range": "80-90", "avg_price": base_price * Decimal("0.9"), "count": 100},
            {"proof_range": "90-100", "avg_price": base_price, "count": 150},
            {"proof_range": "100-110", "avg_price": base_price * Decimal("1.1"), "count": 120},
            {"proof_range": "110-120", "avg_price": base_price * Decimal("1.2"), "count": 60},
            {"proof_range": "120+", "avg_price": base_price * Decimal("1.35"), "count": 20},
        ]
        
        return PriceStatsResponse(
            overall=overall,
            by_age=by_age,
            by_proof=by_proof,
        )
    
    async def find_comparables_for_barrel(
        self,
        barrel_id: str,
        limit: int = 10,
    ) -> List[ComparableTransaction]:
        """Find comparable transactions for a specific barrel."""
        logger.info(
            "finding_comparables_for_barrel",
            barrel_id=barrel_id,
            limit=limit,
        )
        
        # Mock comparables
        comps = self._generate_mock_comps(SpiritType.BOURBON, limit)
        
        return [
            ComparableTransaction(
                market_comp=comp,
                similarity_score=0.9 - (i * 0.05),
            )
            for i, comp in enumerate(comps)
        ]
    
    def _generate_mock_comps(self, spirit_type: SpiritType, count: int) -> List[MarketComp]:
        """Generate mock market comps for demonstration."""
        from ..models.market import TransactionSource
        
        comps = []
        sellers = [
            "Kentucky Reserve Distillery",
            "Tennessee Heritage Spirits",
            "Indiana Grain & Barrel",
            "Texas Bourbon Brokers",
        ]
        buyers = [
            "Heritage Blending Co.",
            "Craft Spirits Exchange",
            "Premium Bottlers LLC",
            "National Distributors Inc.",
        ]
        
        base_price = Decimal("15.00") if spirit_type == SpiritType.BOURBON else Decimal("12.00")
        
        for i in range(count):
            age = 4 + (i % 8)  # 4-11 years
            proof = Decimal("90") + Decimal(str((i % 6) * 5))  # 90-115 proof
            volume = Decimal("100") + Decimal(str(i * 10))
            price_per_pg = base_price * (Decimal("1.0") + Decimal("0.05") * age)
            
            comps.append(MarketComp(
                id=f"comp-{i}",
                transaction_date=date.today() - timedelta(days=i * 7),
                spirit_type=spirit_type,
                age_years=age,
                proof=proof,
                volume_proof_gallons=volume,
                price_per_proof_gallon=price_per_pg,
                total_price=volume * price_per_pg,
                seller=sellers[i % len(sellers)],
                buyer=buyers[i % len(buyers)],
                barrel_count=1 + (i % 5),
                source=TransactionSource.PRIVATE_SALE if i % 2 == 0 else TransactionSource.AUCTION,
                created_at=datetime.now(),
            ))
        
        return comps
    
    async def add_market_comp(self, comp: MarketComp) -> MarketComp:
        """Add a new market comp transaction."""
        logger.info(
            "adding_market_comp",
            spirit_type=comp.spirit_type,
            price=comp.price_per_proof_gallon,
        )
        
        # In production, save to Baserow
        return comp


# Singleton instance
_market_comps_service: Optional[MarketCompsService] = None


def get_market_comps_service() -> MarketCompsService:
    """Get or create market comps service instance."""
    global _market_comps_service
    if _market_comps_service is None:
        _market_comps_service = MarketCompsService()
    return _market_comps_service
