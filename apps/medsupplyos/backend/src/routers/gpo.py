"""GPO (Group Purchasing Organization) router."""

from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query

from ..models.auth import User, get_current_active_user
from ..models.gpo import GPO, GPOContract, PriceBenchmark, GPOPriceComparisonRequest
from ..services.baserow import BaserowService

router = APIRouter()


@router.get("", response_model=dict)
async def list_gpos(
    current_user: User = Depends(get_current_active_user),
):
    """List all GPOs."""
    baserow = BaserowService()
    gpos = await baserow.list_gpos()
    
    return {
        "success": True,
        "data": gpos,
    }


@router.get("/{gpo_id}", response_model=dict)
async def get_gpo(
    gpo_id: str,
    current_user: User = Depends(get_current_active_user),
):
    """Get GPO by ID."""
    baserow = BaserowService()
    gpo = await baserow.get_gpo_by_id(gpo_id)
    
    if not gpo:
        raise HTTPException(status_code=404, detail="GPO not found")
    
    return {
        "success": True,
        "data": gpo,
    }


@router.get("/{gpo_id}/contracts", response_model=dict)
async def get_gpo_contracts(
    gpo_id: str,
    current_user: User = Depends(get_current_active_user),
):
    """Get contracts for a GPO."""
    baserow = BaserowService()
    contracts = await baserow.get_gpo_contracts(gpo_id)
    
    return {
        "success": True,
        "data": contracts,
    }


@router.get("/benchmark/{equipment_id}", response_model=dict)
async def get_price_benchmark(
    equipment_id: str,
    current_user: User = Depends(get_current_active_user),
):
    """Get GPO price benchmark for equipment."""
    baserow = BaserowService()
    
    # Get equipment details
    equipment = await baserow.get_equipment_by_id(equipment_id)
    if not equipment:
        raise HTTPException(status_code=404, detail="Equipment not found")
    
    # Get GPO pricing
    gpo_prices = await baserow.get_equipment_gpo_pricing(equipment_id)
    
    # Calculate benchmark
    list_price = equipment.get("pricing", {}).get("list_price", 0)
    prices = [p.get("contract_price", 0) for p in gpo_prices]
    
    benchmark = {
        "equipment_id": equipment_id,
        "equipment_name": equipment.get("name"),
        "manufacturer": equipment.get("manufacturer", {}).get("name"),
        "list_price": list_price,
        "gpo_prices": gpo_prices,
        "market_average": sum(prices) / len(prices) if prices else list_price,
        "lowest_price": min(prices) if prices else list_price,
        "highest_price": max(prices) if prices else list_price,
        "potential_savings": list_price - (min(prices) if prices else list_price),
        "last_updated": equipment.get("updated_at"),
    }
    
    return {
        "success": True,
        "data": benchmark,
    }


@router.post("/compare", response_model=dict)
async def compare_prices(
    request: GPOPriceComparisonRequest,
    current_user: User = Depends(get_current_active_user),
):
    """Compare GPO prices for multiple equipment items."""
    baserow = BaserowService()
    
    results = []
    for equipment_id in request.equipment_ids:
        equipment = await baserow.get_equipment_by_id(equipment_id)
        if equipment:
            gpo_prices = await baserow.get_equipment_gpo_pricing(equipment_id)
            results.append({
                "equipment_id": equipment_id,
                "equipment_name": equipment.get("name"),
                "list_price": equipment.get("pricing", {}).get("list_price"),
                "gpo_prices": gpo_prices,
            })
    
    return {
        "success": True,
        "data": results,
    }


@router.get("/savings/{organization_id}", response_model=dict)
async def get_savings_analysis(
    organization_id: str,
    period: Optional[str] = "2024",
    current_user: User = Depends(get_current_active_user),
):
    """Get GPO savings analysis for an organization."""
    baserow = BaserowService()
    
    # Get organization's orders
    orders = await baserow.get_organization_orders(organization_id, period)
    
    # Calculate savings
    total_spend = sum(order.get("totals", {}).get("total", 0) for order in orders)
    
    # Get GPO contracts
    contracts = await baserow.get_organization_gpo_contracts(organization_id)
    
    # Calculate potential savings (mock calculation)
    savings_percent = 23.4
    total_savings = total_spend * (savings_percent / 100)
    
    analysis = {
        "total_savings": total_savings,
        "savings_percent": savings_percent,
        "by_contract": [
            {
                "contract_id": c.get("id"),
                "contract_name": c.get("title"),
                "savings": total_savings / len(contracts) if contracts else 0,
                "utilization": 85.5,
            }
            for c in contracts[:3]
        ],
        "missed_opportunities": [
            {
                "equipment_id": "eq-123",
                "equipment_name": "Surgical Kit SK-2024",
                "amount_spent": 15000,
                "gpo_price": 12000,
                "potential_savings": 3000,
            },
            {
                "equipment_id": "eq-456",
                "equipment_name": "Patient Monitor MX200",
                "amount_spent": 8500,
                "gpo_price": 6800,
                "potential_savings": 1700,
            },
        ],
    }
    
    return {
        "success": True,
        "data": analysis,
    }
