"""
Lots Router for LabSource
"""

from datetime import date, timedelta
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status

from ..models.lot import LotStatus, LotExpiryAlert
from ..models.common import ApiResponse, PaginationMeta
from ..services.baserow import BaserowService, get_baserow_service
from .auth import get_current_user, get_current_admin

router = APIRouter()


@router.get("", response_model=ApiResponse[list])
async def list_lots(
    reagent_id: Optional[str] = Query(None, alias="reagentId"),
    status: Optional[LotStatus] = Query(None),
    expiry_before: Optional[date] = Query(None, alias="expiryBefore"),
    expiry_after: Optional[date] = Query(None, alias="expiryAfter"),
    has_coa: Optional[bool] = Query(None, alias="hasCoa"),
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    baserow: BaserowService = Depends(get_baserow_service),
    current_user = Depends(get_current_user),
):
    """List lots with optional filtering."""
    # Build filters
    filters = {}
    
    if reagent_id:
        filters["reagent_id"] = reagent_id
    if status:
        filters["status"] = status.value
    
    # Get lots from Baserow
    lots = await baserow.get_lots(filters=filters if filters else None)
    
    # Apply additional filters
    if expiry_before:
        lots = [l for l in lots if date.fromisoformat(l.get("expiry_date", "9999-12-31")) <= expiry_before]
    if expiry_after:
        lots = [l for l in lots if date.fromisoformat(l.get("expiry_date", "1900-01-01")) >= expiry_after]
    if has_coa is not None:
        lots = [l for l in lots if (l.get("coa") is not None) == has_coa]
    
    # Paginate
    total = len(lots)
    start = (page - 1) * per_page
    end = start + per_page
    paginated_lots = lots[start:end]
    
    total_pages = (total + per_page - 1) // per_page
    
    return ApiResponse.success_response(
        data=paginated_lots,
        meta=PaginationMeta(
            page=page,
            per_page=per_page,
            total=total,
            total_pages=total_pages,
        ),
    )


@router.get("/expiring", response_model=ApiResponse[list])
async def get_expiring_lots(
    days: int = Query(30, ge=1, le=365),
    baserow: BaserowService = Depends(get_baserow_service),
    current_user = Depends(get_current_user),
):
    """Get lots expiring within specified days."""
    cutoff_date = date.today() + timedelta(days=days)
    
    # Get all lots
    lots = await baserow.get_lots()
    
    # Filter expiring lots
    expiring = []
    for lot in lots:
        expiry = date.fromisoformat(lot.get("expiry_date", "9999-12-31"))
        days_until = (expiry - date.today()).days
        
        if 0 <= days_until <= days and lot.get("status") == "available":
            expiring.append(LotExpiryAlert(
                lot_id=lot["id"],
                reagent_name=lot.get("reagent_name", "Unknown"),
                lot_number=lot.get("lot_number", ""),
                expiry_date=expiry,
                days_until_expiry=days_until,
                quantity_remaining=lot.get("quantity_available", 0),
            ))
    
    # Sort by days until expiry
    expiring.sort(key=lambda x: x.days_until_expiry)
    
    return ApiResponse.success_response(expiring)


@router.get("/reagent/{reagent_id}", response_model=ApiResponse[list])
async def get_lots_by_reagent(
    reagent_id: str,
    baserow: BaserowService = Depends(get_baserow_service),
    current_user = Depends(get_current_user),
):
    """Get all lots for a specific reagent."""
    filters = {"reagent_id": reagent_id}
    lots = await baserow.get_lots(filters=filters)
    
    return ApiResponse.success_response(lots)


@router.get("/{lot_id}", response_model=ApiResponse[dict])
async def get_lot(
    lot_id: str,
    baserow: BaserowService = Depends(get_baserow_service),
    current_user = Depends(get_current_user),
):
    """Get a single lot by ID."""
    try:
        lot = await baserow.get_lot(lot_id)
        return ApiResponse.success_response(lot)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Lot not found: {lot_id}",
        )


@router.get("/{lot_id}/coa", response_model=ApiResponse[dict])
async def get_lot_coa(
    lot_id: str,
    baserow: BaserowService = Depends(get_baserow_service),
    current_user = Depends(get_current_user),
):
    """Get Certificate of Analysis for a lot."""
    try:
        lot = await baserow.get_lot(lot_id)
        coa = lot.get("coa")
        
        if not coa:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="CoA not available for this lot",
            )
        
        return ApiResponse.success_response(coa)
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Lot not found: {lot_id}",
        )


@router.get("/{lot_id}/coa/download")
async def download_lot_coa(
    lot_id: str,
    baserow: BaserowService = Depends(get_baserow_service),
    current_user = Depends(get_current_user),
):
    """Download CoA PDF for a lot."""
    try:
        lot = await baserow.get_lot(lot_id)
        coa = lot.get("coa")
        
        if not coa or not coa.get("document_url"):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="CoA not available for download",
            )
        
        # In production, this would stream the PDF from S3
        # For now, return the URL
        return {"download_url": coa["document_url"]}
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Lot not found: {lot_id}",
        )


@router.post("/{lot_id}/quarantine", response_model=ApiResponse[dict])
async def quarantine_lot(
    lot_id: str,
    reason: str,
    baserow: BaserowService = Depends(get_baserow_service),
    admin = Depends(get_current_admin),
):
    """Quarantine a lot (admin only)."""
    try:
        lot = await baserow.get_lot(lot_id)
        
        # Update lot status
        updated = await baserow.update_lot(lot_id, {
            "status": "quarantined",
            "quarantine_reason": reason,
            "quarantined_at": date.today().isoformat(),
        })
        
        return ApiResponse.success_response({
            "message": "Lot quarantined successfully",
            "lot_id": lot_id,
            "reason": reason,
        })
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Lot not found: {lot_id}",
        )


@router.post("/{lot_id}/release", response_model=ApiResponse[dict])
async def release_lot(
    lot_id: str,
    baserow: BaserowService = Depends(get_baserow_service),
    admin = Depends(get_current_admin),
):
    """Release a quarantined lot (admin only)."""
    try:
        lot = await baserow.get_lot(lot_id)
        
        # Check if lot is quarantined
        if lot.get("status") != "quarantined":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Lot is not quarantined",
            )
        
        # Update lot status
        updated = await baserow.update_lot(lot_id, {
            "status": "available",
            "released_at": date.today().isoformat(),
        })
        
        return ApiResponse.success_response({
            "message": "Lot released successfully",
            "lot_id": lot_id,
        })
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Lot not found: {lot_id}",
        )
