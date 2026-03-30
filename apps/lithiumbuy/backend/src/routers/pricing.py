"""Pricing router."""

from datetime import datetime, timedelta
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query

from src.models import (
    ApiResponse,
    PriceHistory,
    PriceIndex,
    SpotPrice,
)
from src.models.pricing import Currency
from src.routers.auth import get_current_active_user
from src.services.pricing_engine import pricing_engine

router = APIRouter(prefix="/pricing", tags=["Pricing"])


@router.get("/spot", response_model=ApiResponse[list[SpotPrice]])
async def get_spot_prices(
    material_form: Optional[str] = None,
    grade: Optional[str] = None,
    current_user: dict = Depends(get_current_active_user),
):
    """Get current spot prices."""
    # Return mock data for demo
    prices = []
    now = datetime.utcnow()
    
    base_prices = {
        "carbonate": {"battery": 25200, "technical": 22100, "industrial": 18200},
        "hydroxide": {"battery": 28400, "technical": 25200, "industrial": 21200},
        "spodumene": {"battery": 3580, "technical": 3250, "industrial": 2820},
        "metal": {"battery": 45200, "technical": 42300, "industrial": 38200},
        "chloride": {"battery": 15200, "technical": 13200, "industrial": 11200},
    }
    
    for form, grades in base_prices.items():
        if material_form and form != material_form:
            continue
        for g, price in grades.items():
            if grade and g != grade:
                continue
            prices.append({
                "id": f"{form}_{g}",
                "material_form": form,
                "grade": g,
                "price": price,
                "currency": "USD",
                "unit": "mt",
                "source": "LithiumBuy Index",
                "timestamp": now.isoformat(),
                "change_24h": round(price * 0.02, 2),
                "change_24h_percent": 2.0,
                "volume_traded": 5000,
            })
    
    return ApiResponse(success=True, data=prices)


@router.get("/index/{material_form}", response_model=ApiResponse[PriceIndex])
async def get_price_index(
    material_form: str,
    current_user: dict = Depends(get_current_active_user),
):
    """Get price index for a specific material."""
    index = await pricing_engine.get_price_index(material_form)
    return ApiResponse(success=True, data=index)


@router.get("/indices", response_model=ApiResponse[list[PriceIndex]])
async def get_all_indices(
    current_user: dict = Depends(get_current_active_user),
):
    """Get price indices for all materials."""
    indices = await pricing_engine.get_all_indices()
    return ApiResponse(success=True, data=indices)


@router.get("/history", response_model=ApiResponse[list[PriceHistory]])
async def get_price_history(
    material_form: str,
    start_date: str,
    end_date: str,
    grade: Optional[str] = "battery",
    currency: Optional[str] = "USD",
    current_user: dict = Depends(get_current_active_user),
):
    """Get historical price data."""
    try:
        start = datetime.fromisoformat(start_date)
        end = datetime.fromisoformat(end_date)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format")
    
    history = await pricing_engine.get_price_history(
        material_form=material_form,
        start_date=start,
        end_date=end,
        grade=grade,
    )
    
    return ApiResponse(success=True, data=history)


@router.post("/update")
async def update_prices(
    current_user: dict = Depends(get_current_active_user),
):
    """Trigger a price update (admin only)."""
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    # TODO: Implement price update
    return ApiResponse(success=True, message="Price update triggered")
