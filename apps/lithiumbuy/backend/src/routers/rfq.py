"""RFQ router."""

from datetime import datetime, timedelta
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status

from src.models import (
    ApiResponse,
    PaginatedResponse,
    Quote,
    RFQ,
    RFQCreate,
)
from src.models.rfq import RFQStatus
from src.routers.auth import get_current_active_user
from src.services.baserow import baserow_service

router = APIRouter(prefix="/rfq", tags=["RFQ"])


def generate_rfq_number() -> str:
    """Generate a unique RFQ number."""
    now = datetime.utcnow()
    return f"RFQ-{now.year}-{now.strftime('%m%d')}-{now.strftime('%H%M%S')}"


@router.get("", response_model=ApiResponse[PaginatedResponse[RFQ]])
async def list_rfqs(
    status: Optional[RFQStatus] = None,
    material_form: Optional[str] = None,
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    current_user: dict = Depends(get_current_active_user),
):
    """List RFQs with optional filters."""
    filters = {}
    user_id = str(current_user.get("id"))
    
    # Filter by buyer
    filters["filter__field_buyer_id__equal"] = user_id
    
    if status:
        filters["filter__field_status__equal"] = status.value
    if material_form:
        filters["filter__field_material_form__equal"] = material_form
    
    result = await baserow_service.get_rfqs(
        filters=filters if filters else None,
        page=page,
        size=per_page,
    )
    
    items = result.get("results", [])
    total = result.get("count", 0)
    
    return ApiResponse(
        success=True,
        data=PaginatedResponse(
            items=items,
            total=total,
            page=page,
            per_page=per_page,
            total_pages=(total + per_page - 1) // per_page,
        ),
    )


@router.get("/{rfq_id}", response_model=ApiResponse[RFQ])
async def get_rfq(
    rfq_id: str,
    current_user: dict = Depends(get_current_active_user),
):
    """Get a single RFQ by ID."""
    try:
        rfq = await baserow_service.get_row(
            baserow_service.settings.rfq_table_id,
            rfq_id,
        )
        
        # Check ownership
        user_id = str(current_user.get("id"))
        if rfq.get("buyer_id") != user_id:
            if current_user.get("role") != "admin":
                raise HTTPException(status_code=403, detail="Access denied")
        
        return ApiResponse(success=True, data=rfq)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="RFQ not found",
        )


@router.post("", response_model=ApiResponse[RFQ])
async def create_rfq(
    rfq_data: RFQCreate,
    current_user: dict = Depends(get_current_active_user),
):
    """Create a new RFQ."""
    try:
        user_id = str(current_user.get("id"))
        
        # Prepare RFQ data
        data = rfq_data.model_dump()
        data["buyer_id"] = user_id
        data["rfq_number"] = generate_rfq_number()
        data["status"] = RFQStatus.SUBMITTED.value
        data["created_at"] = datetime.utcnow().isoformat()
        data["expires_at"] = (datetime.utcnow() + timedelta(days=rfq_data.validity_days)).isoformat()
        
        rfq = await baserow_service.create_rfq(data)
        
        return ApiResponse(
            success=True,
            data=rfq,
            message="RFQ created successfully",
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to create RFQ: {str(e)}",
        )


@router.patch("/{rfq_id}", response_model=ApiResponse[RFQ])
async def update_rfq(
    rfq_id: str,
    update_data: dict,
    current_user: dict = Depends(get_current_active_user),
):
    """Update an RFQ."""
    try:
        # Check ownership
        rfq = await baserow_service.get_row(
            baserow_service.settings.rfq_table_id,
            rfq_id,
        )
        
        user_id = str(current_user.get("id"))
        if rfq.get("buyer_id") != user_id:
            if current_user.get("role") != "admin":
                raise HTTPException(status_code=403, detail="Access denied")
        
        updated = await baserow_service.update_rfq(rfq_id, update_data)
        
        return ApiResponse(
            success=True,
            data=updated,
            message="RFQ updated successfully",
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to update RFQ: {str(e)}",
        )


@router.post("/{rfq_id}/cancel", response_model=ApiResponse[dict])
async def cancel_rfq(
    rfq_id: str,
    current_user: dict = Depends(get_current_active_user),
):
    """Cancel an RFQ."""
    try:
        # Check ownership
        rfq = await baserow_service.get_row(
            baserow_service.settings.rfq_table_id,
            rfq_id,
        )
        
        user_id = str(current_user.get("id"))
        if rfq.get("buyer_id") != user_id:
            if current_user.get("role") != "admin":
                raise HTTPException(status_code=403, detail="Access denied")
        
        await baserow_service.update_rfq(
            rfq_id,
            {"status": RFQStatus.EXPIRED.value},
        )
        
        return ApiResponse(
            success=True,
            message="RFQ cancelled successfully",
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to cancel RFQ: {str(e)}",
        )


@router.get("/{rfq_id}/quotes", response_model=ApiResponse[list[Quote]])
async def get_rfq_quotes(
    rfq_id: str,
    current_user: dict = Depends(get_current_active_user),
):
    """Get quotes for an RFQ."""
    try:
        # Check ownership
        rfq = await baserow_service.get_row(
            baserow_service.settings.rfq_table_id,
            rfq_id,
        )
        
        user_id = str(current_user.get("id"))
        if rfq.get("buyer_id") != user_id:
            if current_user.get("role") != "admin":
                raise HTTPException(status_code=403, detail="Access denied")
        
        result = await baserow_service.get_quotes(
            filters={"filter__field_rfq_id__equal": rfq_id},
        )
        
        items = result.get("results", [])
        
        return ApiResponse(success=True, data=items)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to get quotes: {str(e)}",
        )
