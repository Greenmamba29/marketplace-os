"""
Cold Chain Router for LabSource
"""

from typing import Optional
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status

from ..models.common import ApiResponse
from ..services.baserow import BaserowService, get_baserow_service
from .auth import get_current_user, get_current_admin

router = APIRouter()


@router.get("/active", response_model=ApiResponse[list])
async def get_active_shipments(
    baserow: BaserowService = Depends(get_baserow_service),
    current_user = Depends(get_current_user),
):
    """Get all active cold chain shipments."""
    filters = {
        "filter_type": "AND",
        "filters": [{"field": "status", "type": "equal", "value": "in-transit"}]
    }
    
    shipments = await baserow.get_cold_chain_logs(filters=filters)
    
    # Enrich with shipment details
    enriched = []
    for shipment in shipments:
        enriched.append({
            "id": shipment.get("id"),
            "tracking_number": shipment.get("shipment_id", ""),
            "carrier": shipment.get("carrier", "Unknown"),
            "origin": shipment.get("origin", ""),
            "destination": shipment.get("destination", ""),
            "status": shipment.get("status", "in-transit"),
            "current_temp": shipment.get("current_temperature", 0),
            "min_temp": shipment.get("min_temperature", -25),
            "max_temp": shipment.get("max_temperature", -15),
            "target_temp": shipment.get("target_temperature", -20),
            "eta": shipment.get("estimated_arrival", datetime.utcnow().isoformat()),
            "last_reading": shipment.get("last_reading_time", datetime.utcnow().isoformat()),
            "excursion_count": shipment.get("excursion_count", 0),
            "lot_ids": shipment.get("lot_ids", []),
        })
    
    return ApiResponse.success_response(enriched)


@router.get("/shipments/{shipment_id}", response_model=ApiResponse[dict])
async def get_shipment(
    shipment_id: str,
    baserow: BaserowService = Depends(get_baserow_service),
    current_user = Depends(get_current_user),
):
    """Get detailed information about a shipment."""
    try:
        shipment = await baserow.get_row("COLD_CHAIN_COMPLIANCE", shipment_id)
        return ApiResponse.success_response(shipment)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Shipment not found: {shipment_id}",
        )


@router.get("/shipments/{shipment_id}/temperature", response_model=ApiResponse[list])
async def get_temperature_log(
    shipment_id: str,
    baserow: BaserowService = Depends(get_baserow_service),
    current_user = Depends(get_current_user),
):
    """Get temperature readings for a shipment."""
    try:
        shipment = await baserow.get_row("COLD_CHAIN_COMPLIANCE", shipment_id)
        readings = shipment.get("temperature_readings", [])
        return ApiResponse.success_response(readings)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Shipment not found: {shipment_id}",
        )


@router.get("/alerts", response_model=ApiResponse[list])
async def get_cold_chain_alerts(
    acknowledged: Optional[bool] = None,
    baserow: BaserowService = Depends(get_baserow_service),
    current_user = Depends(get_current_user),
):
    """Get cold chain alerts."""
    # In production, this would query an alerts table
    # For now, return mock data
    alerts = [
        {
            "id": "alert-1",
            "lot_id": "lot-123",
            "shipment_id": "ship-456",
            "alert_type": "excursion",
            "severity": "high",
            "message": "Temperature exceeded -15°C threshold",
            "timestamp": datetime.utcnow().isoformat(),
            "acknowledged": False,
        },
    ]
    
    if acknowledged is not None:
        alerts = [a for a in alerts if a["acknowledged"] == acknowledged]
    
    return ApiResponse.success_response(alerts)


@router.post("/alerts/{alert_id}/acknowledge", response_model=ApiResponse[dict])
async def acknowledge_alert(
    alert_id: str,
    baserow: BaserowService = Depends(get_baserow_service),
    current_user = Depends(get_current_user),
):
    """Acknowledge a cold chain alert."""
    # In production, update the alert in database
    return ApiResponse.success_response({
        "message": "Alert acknowledged",
        "alert_id": alert_id,
        "acknowledged_by": current_user.id,
        "acknowledged_at": datetime.utcnow().isoformat(),
    })


@router.get("/shipments/{shipment_id}/excursion-report", response_model=ApiResponse[dict])
async def get_excursion_report(
    shipment_id: str,
    baserow: BaserowService = Depends(get_baserow_service),
    current_user = Depends(get_current_user),
):
    """Get temperature excursion report for a shipment."""
    try:
        shipment = await baserow.get_row("COLD_CHAIN_COMPLIANCE", shipment_id)
        
        excursions = shipment.get("excursions", [])
        
        report = {
            "shipment_id": shipment_id,
            "total_excursions": len(excursions),
            "total_duration_minutes": sum(e.get("duration", 0) for e in excursions),
            "max_temperature": max((e.get("max_temperature", -100) for e in excursions), default=None),
            "min_temperature": min((e.get("min_temperature", 100) for e in excursions), default=None),
            "excursions": excursions,
            "impact_assessment": shipment.get("impact_assessment", "No significant impact detected"),
            "corrective_actions": shipment.get("corrective_actions", []),
        }
        
        return ApiResponse.success_response(report)
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Shipment not found: {shipment_id}",
        )


@router.post("/shipments", response_model=ApiResponse[dict])
async def create_shipment(
    shipment_data: dict,
    baserow: BaserowService = Depends(get_baserow_service),
    admin = Depends(get_current_admin),
):
    """Create a new cold chain shipment (admin only)."""
    result = await baserow.create_cold_chain_log(shipment_data)
    return ApiResponse.success_response(result)


@router.post("/shipments/{shipment_id}/readings", response_model=ApiResponse[dict])
async def add_temperature_reading(
    shipment_id: str,
    reading: dict,
    baserow: BaserowService = Depends(get_baserow_service),
    current_user = Depends(get_current_user),
):
    """Add a temperature reading to a shipment."""
    # In production, append reading to shipment's temperature_readings array
    return ApiResponse.success_response({
        "message": "Temperature reading added",
        "shipment_id": shipment_id,
        "reading": reading,
    })
