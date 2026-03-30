"""GPO (Group Purchasing Organization) models."""

from datetime import datetime
from decimal import Decimal
from typing import List, Optional

from pydantic import BaseModel, Field


class ContractPricingTier(BaseModel):
    """Contract pricing tier."""
    tier: int = Field(..., ge=1, le=3)
    name: str
    minimum_spend: Decimal
    discount_percent: Decimal
    rebate_percent: Optional[Decimal] = None


class ContractTerms(BaseModel):
    """Contract terms."""
    payment_terms: str
    shipping_terms: str
    minimum_order_value: Optional[Decimal] = None
    exclusivity: bool = False
    performance_requirements: List[str] = Field(default_factory=list)


class GPOContract(BaseModel):
    """GPO contract model."""
    id: str
    gpo_id: str
    supplier_id: str
    contract_number: str
    title: str
    description: Optional[str] = None
    categories: List[str] = Field(default_factory=list)
    effective_date: datetime
    expiration_date: datetime
    renewal_terms: Optional[str] = None
    pricing_tiers: List[ContractPricingTier]
    terms: ContractTerms
    status: str = "active"
    created_at: datetime


class GPOStatistics(BaseModel):
    """GPO statistics."""
    total_members: int
    total_contract_value: Decimal
    average_savings: Decimal
    contracts_active: int


class GPO(BaseModel):
    """Group Purchasing Organization model."""
    id: str
    name: str
    legal_name: str
    website: Optional[str] = None
    contact_info: dict
    member_organizations: List[str] = Field(default_factory=list)
    contracts: List[GPOContract] = Field(default_factory=list)
    statistics: Optional[GPOStatistics] = None
    created_at: datetime
    
    model_config = {"from_attributes": True}


class GPOEquipmentPrice(BaseModel):
    """GPO pricing for specific equipment."""
    gpo_id: str
    gpo_name: str
    contract_number: str
    tier: int
    tier_name: str
    price: Decimal
    savings_vs_list: Decimal
    savings_percent: Decimal


class PriceBenchmark(BaseModel):
    """Price benchmark for equipment."""
    equipment_id: str
    equipment_name: str
    manufacturer: str
    list_price: Decimal
    gpo_prices: List[GPOEquipmentPrice]
    market_average: Decimal
    lowest_price: Decimal
    highest_price: Decimal
    potential_savings: Decimal
    last_updated: datetime


class ContractSavings(BaseModel):
    """Savings for a specific contract."""
    contract_id: str
    contract_name: str
    savings: Decimal
    utilization: Decimal


class MissedGPOOpportunity(BaseModel):
    """Missed GPO savings opportunity."""
    equipment_id: str
    equipment_name: str
    amount_spent: Decimal
    gpo_price: Decimal
    potential_savings: Decimal


class GPOSavingsAnalysis(BaseModel):
    """GPO savings analysis."""
    total_savings: Decimal
    savings_percent: Decimal
    by_contract: List[ContractSavings]
    missed_opportunities: List[MissedGPOOpportunity]


class GPOPriceComparisonRequest(BaseModel):
    """Request to compare GPO prices."""
    equipment_ids: List[str]
