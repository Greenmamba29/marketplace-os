"""Admin router."""

from datetime import datetime
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query

from src.models import ApiResponse
from src.models.intelligence import AlertCreate, SupplyAlert
from src.routers.auth import get_current_active_user
from src.services.baserow import baserow_service
from src.services.pricing_engine import pricing_engine
from src.services.spot_feeds import spot_feed_service

router = APIRouter(prefix="/admin", tags=["Admin"])


async def require_admin(current_user: dict = Depends(get_current_active_user)):
    """Require admin role."""
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user


@router.get("/dashboard", response_model=ApiResponse[dict])
async def get_dashboard(
    current_user: dict = Depends(require_admin),
):
    """Get admin dashboard data."""
    # Mock dashboard data
    dashboard = {
        "total_users": 2847,
        "total_suppliers": 156,
        "total_buyers": 2691,
        "total_volume_traded": 456780,
        "total_gmv": 2845000000,
        "pending_verifications": 23,
        "active_contracts": 1847,
        "monthly_growth": 12.5,
        "recent_signups": [
            {"id": 1, "email": "user1@example.com", "company_name": "Company 1", "role": "buyer"},
            {"id": 2, "email": "user2@example.com", "company_name": "Company 2", "role": "supplier"},
        ],
        "system_health": {
            "status": "operational",
            "uptime": "99.9%",
            "last_check": datetime.utcnow().isoformat(),
        },
    }
    
    return ApiResponse(success=True, data=dashboard)


@router.get("/users", response_model=ApiResponse[dict])
async def list_users(
    status: Optional[str] = None,
    role: Optional[str] = None,
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    current_user: dict = Depends(require_admin),
):
    """List all users (admin only)."""
    filters = {}
    
    if status:
        filters["filter__field_status__equal"] = status
    if role:
        filters["filter__field_role__equal"] = role
    
    result = await baserow_service.get_users(
        filters=filters if filters else None,
        page=page,
        size=per_page,
    )
    
    items = result.get("results", [])
    total = result.get("count", 0)
    
    return ApiResponse(
        success=True,
        data={
            "items": items,
            "total": total,
            "page": page,
            "per_page": per_page,
            "total_pages": (total + per_page - 1) // per_page,
        },
    )


@router.post("/users/{user_id}/verify", response_model=ApiResponse[dict])
async def verify_user(
    user_id: str,
    current_user: dict = Depends(require_admin),
):
    """Verify a user account."""
    try:
        await baserow_service.update_row(
            baserow_service.settings.users_table_id,
            user_id,
            {"is_verified": True},
        )
        
        return ApiResponse(
            success=True,
            message="User verified successfully",
        )
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Failed to verify user: {str(e)}",
        )


@router.get("/alerts", response_model=ApiResponse[list[SupplyAlert]])
async def get_alerts(
    current_user: dict = Depends(require_admin),
):
    """Get all system alerts."""
    try:
        result = await baserow_service.get_alerts()
        items = result.get("results", [])
        return ApiResponse(success=True, data=items)
    except Exception:
        # Return mock data if Baserow not configured
        mock_alerts = [
            {
                "id": "1",
                "alert_type": "tightness",
                "severity": "high",
                "material_form": "carbonate",
                "region": "South America",
                "message": "Supply tightness detected in Chilean lithium carbonate market",
                "is_active": True,
                "created_at": datetime.utcnow().isoformat(),
            },
            {
                "id": "2",
                "alert_type": "price_spike",
                "severity": "medium",
                "material_form": "hydroxide",
                "region": "Asia",
                "message": "Hydroxide prices increased 5% in past 24 hours",
                "is_active": True,
                "created_at": datetime.utcnow().isoformat(),
            },
        ]
        return ApiResponse(success=True, data=mock_alerts)


@router.post("/alerts", response_model=ApiResponse[dict])
async def create_alert(
    alert_data: AlertCreate,
    current_user: dict = Depends(require_admin),
):
    """Create a new system alert."""
    try:
        data = alert_data.model_dump()
        data["created_at"] = datetime.utcnow().isoformat()
        data["is_active"] = True
        
        alert = await baserow_service.create_alert(data)
        
        return ApiResponse(
            success=True,
            data=alert,
            message="Alert created successfully",
        )
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Failed to create alert: {str(e)}",
        )


@router.get("/geopolitical-risks", response_model=ApiResponse[list[dict]])
async def get_geopolitical_risks(
    country: Optional[str] = None,
    current_user: dict = Depends(require_admin),
):
    """Get geopolitical risk assessments."""
    # Mock data
    risks = [
        {
            "country": "Australia",
            "risk_score": 15,
            "risk_level": "low",
            "factors": ["Stable government", "Strong rule of law"],
            "last_updated": datetime.utcnow().isoformat(),
        },
        {
            "country": "Chile",
            "risk_score": 35,
            "risk_level": "medium",
            "factors": ["Policy uncertainty", "Social unrest"],
            "last_updated": datetime.utcnow().isoformat(),
        },
        {
            "country": "Argentina",
            "risk_score": 55,
            "risk_level": "medium",
            "factors": ["Economic volatility", "Currency risk"],
            "last_updated": datetime.utcnow().isoformat(),
        },
        {
            "country": "Zimbabwe",
            "risk_score": 75,
            "risk_level": "high",
            "factors": ["Political instability", "Sanctions risk"],
            "last_updated": datetime.utcnow().isoformat(),
        },
        {
            "country": "DRC",
            "risk_score": 85,
            "risk_level": "critical",
            "factors": ["Conflict zones", "Regulatory uncertainty"],
            "last_updated": datetime.utcnow().isoformat(),
        },
    ]
    
    if country:
        risks = [r for r in risks if r["country"].lower() == country.lower()]
    
    return ApiResponse(success=True, data=risks)


@router.post("/prices/update", response_model=ApiResponse[dict])
async def trigger_price_update(
    current_user: dict = Depends(require_admin),
):
    """Trigger manual price update."""
    result = await spot_feed_service.update_spot_prices()
    
    if result.get("success"):
        return ApiResponse(
            success=True,
            data=result,
            message="Price update completed",
        )
    else:
        raise HTTPException(
            status_code=500,
            detail=result.get("error", "Price update failed"),
        )


@router.get("/intelligence/market-summary", response_model=ApiResponse[dict])
async def get_market_summary(
    current_user: dict = Depends(require_admin),
):
    """Get market intelligence summary."""
    summary = {
        "total_volume_24h": 12450,
        "active_rfqs": 847,
        "open_contracts": 1234,
        "avg_quote_response_hours": 4.2,
        "price_volatility_index": 0.23,
        "supply_tightness_score": 65,
        "last_updated": datetime.utcnow().isoformat(),
    }
    
    return ApiResponse(success=True, data=summary)
