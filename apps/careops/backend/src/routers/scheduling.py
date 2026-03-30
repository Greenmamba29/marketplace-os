"""Scheduling routes."""

from datetime import datetime, timezone
from typing import Optional

import structlog
from fastapi import APIRouter, Depends, HTTPException, Query, status

from ..models.schedule import Shift, ShiftCreate, ShiftUpdate, ShiftStatus, ClockInOutRequest
from ..models.common import ApiResponse
from ..services.baserow import BaserowService
from .auth import get_current_user

logger = structlog.get_logger()
router = APIRouter()


@router.get("/", response_model=ApiResponse)
async def get_shifts(
    caregiver_id: Optional[str] = Query(None),
    care_plan_id: Optional[str] = Query(None),
    family_id: Optional[str] = Query(None),
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
    status: Optional[ShiftStatus] = Query(None),
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    current_user: dict = Depends(get_current_user),
):
    """Get shifts with filters."""
    baserow = BaserowService()

    # Build filters
    filters = {}
    if caregiver_id:
        filters["caregiver_id"] = caregiver_id
    if care_plan_id:
        filters["care_plan_id"] = care_plan_id
    if family_id:
        filters["family_id"] = family_id
    if status:
        filters["status"] = status.value

    # Apply user-based filters
    if current_user["role"] == "family":
        filters["family_id"] = current_user["id"]
    elif current_user["role"] == "caregiver":
        caregiver = await baserow.get_caregiver_by_user_id(current_user["id"])
        if caregiver:
            filters["caregiver_id"] = caregiver["id"]

    try:
        result = await baserow.get_shifts(
            filters=filters if filters else None,
            page=page,
            per_page=per_page,
        )

        total = result.get("count", 0)
        total_pages = (total + per_page - 1) // per_page

        return ApiResponse(
            success=True,
            data=result.get("results", []),
            pagination={
                "page": page,
                "per_page": per_page,
                "total": total,
                "total_pages": total_pages,
                "has_next": page < total_pages,
                "has_prev": page > 1,
            },
        )

    except Exception as e:
        logger.error("shift_list_error", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to list shifts",
        )


@router.get("/{shift_id}", response_model=ApiResponse)
async def get_shift(
    shift_id: str,
    current_user: dict = Depends(get_current_user),
):
    """Get shift by ID."""
    baserow = BaserowService()

    # Note: This would need a get_shift_by_id method in BaserowService
    # For now, we'll return a placeholder
    shift = None  # await baserow.get_shift(shift_id)

    if not shift:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Shift not found",
        )

    return ApiResponse(
        success=True,
        data=shift,
    )


@router.post("/", response_model=ApiResponse)
async def create_shift(
    shift_data: ShiftCreate,
    current_user: dict = Depends(get_current_user),
):
    """Create a new shift."""
    # Only families and admins can create shifts
    if current_user["role"] not in ["family", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only families can create shifts",
        )

    baserow = BaserowService()

    # Verify care plan exists and belongs to family
    care_plan = await baserow.get_care_plan(shift_data.care_plan_id)
    if not care_plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Care plan not found",
        )

    if current_user["role"] != "admin" and care_plan.get("family_id") != current_user["id"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to create shifts for this care plan",
        )

    try:
        shift_dict = shift_data.model_dump()
        shift_dict["status"] = "scheduled"
        shift_dict["created_at"] = datetime.now(timezone.utc).isoformat()
        shift_dict["updated_at"] = datetime.now(timezone.utc).isoformat()

        created = await baserow.create_shift(shift_dict)

        logger.info("shift_created", shift_id=created["id"], care_plan_id=shift_data.care_plan_id)

        return ApiResponse(
            success=True,
            message="Shift created successfully",
            data=created,
        )

    except Exception as e:
        logger.error("shift_create_error", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create shift",
        )


@router.patch("/{shift_id}", response_model=ApiResponse)
async def update_shift(
    shift_id: str,
    shift_data: ShiftUpdate,
    current_user: dict = Depends(get_current_user),
):
    """Update shift."""
    baserow = BaserowService()

    # Get existing shift
    # shift = await baserow.get_shift(shift_id)
    # if not shift:
    #     raise HTTPException(
    #         status_code=status.HTTP_404_NOT_FOUND,
    #         detail="Shift not found",
    #     )

    # Check permissions
    # Implementation depends on shift structure

    try:
        update_dict = {k: v for k, v in shift_data.model_dump().items() if v is not None}
        update_dict["updated_at"] = datetime.now(timezone.utc).isoformat()

        updated = await baserow.update_shift(shift_id, update_dict)

        logger.info("shift_updated", shift_id=shift_id)

        return ApiResponse(
            success=True,
            message="Shift updated successfully",
            data=updated,
        )

    except Exception as e:
        logger.error("shift_update_error", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update shift",
        )


@router.post("/{shift_id}/cancel", response_model=ApiResponse)
async def cancel_shift(
    shift_id: str,
    reason: str,
    current_user: dict = Depends(get_current_user),
):
    """Cancel a shift."""
    baserow = BaserowService()

    try:
        updated = await baserow.update_shift(shift_id, {
            "status": "cancelled",
            "cancellation_reason": reason,
            "updated_at": datetime.now(timezone.utc).isoformat(),
        })

        logger.info("shift_cancelled", shift_id=shift_id, reason=reason)

        return ApiResponse(
            success=True,
            message="Shift cancelled successfully",
            data=updated,
        )

    except Exception as e:
        logger.error("shift_cancel_error", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to cancel shift",
        )


@router.post("/{shift_id}/clock-in", response_model=ApiResponse)
async def clock_in(
    shift_id: str,
    clock_data: ClockInOutRequest,
    current_user: dict = Depends(get_current_user),
):
    """Clock in for a shift."""
    baserow = BaserowService()

    # Verify caregiver is assigned to this shift
    caregiver = await baserow.get_caregiver_by_user_id(current_user["id"])
    if not caregiver:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only caregivers can clock in",
        )

    try:
        updated = await baserow.update_shift(shift_id, {
            "status": "in_progress",
            "clock_in_time": datetime.now(timezone.utc).isoformat(),
            "clock_in_location": clock_data.location.model_dump(),
            "updated_at": datetime.now(timezone.utc).isoformat(),
        })

        logger.info("shift_clock_in", shift_id=shift_id, caregiver_id=caregiver["id"])

        return ApiResponse(
            success=True,
            message="Clocked in successfully",
            data=updated,
        )

    except Exception as e:
        logger.error("clock_in_error", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to clock in",
        )


@router.post("/{shift_id}/clock-out", response_model=ApiResponse)
async def clock_out(
    shift_id: str,
    clock_data: ClockInOutRequest,
    current_user: dict = Depends(get_current_user),
):
    """Clock out for a shift."""
    baserow = BaserowService()

    # Verify caregiver is assigned to this shift
    caregiver = await baserow.get_caregiver_by_user_id(current_user["id"])
    if not caregiver:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only caregivers can clock out",
        )

    try:
        update_data = {
            "status": "completed",
            "clock_out_time": datetime.now(timezone.utc).isoformat(),
            "clock_out_location": clock_data.location.model_dump(),
            "updated_at": datetime.now(timezone.utc).isoformat(),
        }

        if clock_data.notes:
            update_data["caregiver_notes"] = clock_data.notes

        updated = await baserow.update_shift(shift_id, update_data)

        logger.info("shift_clock_out", shift_id=shift_id, caregiver_id=caregiver["id"])

        return ApiResponse(
            success=True,
            message="Clocked out successfully",
            data=updated,
        )

    except Exception as e:
        logger.error("clock_out_error", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to clock out",
        )
