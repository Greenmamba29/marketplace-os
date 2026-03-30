"""Care plan routes."""

from datetime import datetime, timezone
from typing import List, Optional

import structlog
from fastapi import APIRouter, Depends, HTTPException, Query, status

from ..models.careplan import (
    CarePlan,
    CarePlanCreate,
    CarePlanUpdate,
    CarePlanStatus,
)
from ..models.common import ApiResponse
from ..services.baserow import BaserowService
from ..services.notifications import NotificationService
from .auth import get_current_user

logger = structlog.get_logger()
router = APIRouter()


@router.get("/", response_model=ApiResponse)
async def list_care_plans(
    family_id: Optional[str] = Query(None),
    status: Optional[CarePlanStatus] = Query(None),
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    current_user: dict = Depends(get_current_user),
):
    """List care plans with optional filters."""
    baserow = BaserowService()

    # Build filters
    filters = {}
    if family_id:
        # Check permissions
        if current_user["role"] != "admin" and current_user["id"] != family_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to view these care plans",
            )
        filters["family_id"] = family_id
    elif current_user["role"] == "family":
        filters["family_id"] = current_user["id"]

    if status:
        filters["status"] = status.value

    try:
        if family_id or current_user["role"] == "family":
            result = await baserow.get_care_plans_by_family(
                family_id=filters.get("family_id", current_user["id"]),
                page=page,
                per_page=per_page,
            )
        else:
            # Admin can see all care plans
            result = {"results": [], "count": 0}  # Placeholder

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
        logger.error("care_plan_list_error", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to list care plans",
        )


@router.get("/{care_plan_id}", response_model=ApiResponse)
async def get_care_plan(
    care_plan_id: str,
    current_user: dict = Depends(get_current_user),
):
    """Get care plan by ID."""
    baserow = BaserowService()

    care_plan = await baserow.get_care_plan(care_plan_id)

    if not care_plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Care plan not found",
        )

    # Check permissions
    if current_user["role"] != "admin":
        if care_plan.get("family_id") != current_user["id"]:
            # Check if assigned caregiver
            caregiver = await baserow.get_caregiver_by_user_id(current_user["id"])
            if not caregiver or caregiver["id"] != care_plan.get("assigned_caregiver_id"):
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Not authorized to view this care plan",
                )

    return ApiResponse(
        success=True,
        data=care_plan,
    )


@router.post("/", response_model=ApiResponse)
async def create_care_plan(
    care_plan_data: CarePlanCreate,
    current_user: dict = Depends(get_current_user),
):
    """Create a new care plan."""
    # Only families can create care plans
    if current_user["role"] != "family" and current_user["role"] != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only families can create care plans",
        )

    # Verify the family_id matches the current user (unless admin)
    if current_user["role"] != "admin" and care_plan_data.family_id != current_user["id"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cannot create care plan for another family",
        )

    baserow = BaserowService()

    try:
        care_plan_dict = care_plan_data.model_dump()
        care_plan_dict["status"] = "draft"
        care_plan_dict["created_at"] = datetime.now(timezone.utc).isoformat()
        care_plan_dict["updated_at"] = datetime.now(timezone.utc).isoformat()

        created = await baserow.create_care_plan(care_plan_dict)

        logger.info("care_plan_created", care_plan_id=created["id"], family_id=care_plan_data.family_id)

        return ApiResponse(
            success=True,
            message="Care plan created successfully",
            data=created,
        )

    except Exception as e:
        logger.error("care_plan_create_error", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create care plan",
        )


@router.patch("/{care_plan_id}", response_model=ApiResponse)
async def update_care_plan(
    care_plan_id: str,
    care_plan_data: CarePlanUpdate,
    current_user: dict = Depends(get_current_user),
):
    """Update care plan."""
    baserow = BaserowService()

    # Get existing care plan
    existing = await baserow.get_care_plan(care_plan_id)
    if not existing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Care plan not found",
        )

    # Check permissions
    if current_user["role"] != "admin":
        if existing.get("family_id") != current_user["id"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to update this care plan",
            )

    try:
        # Filter out None values
        update_dict = {k: v for k, v in care_plan_data.model_dump().items() if v is not None}
        update_dict["updated_at"] = datetime.now(timezone.utc).isoformat()

        updated = await baserow.update_care_plan(care_plan_id, update_dict)

        logger.info("care_plan_updated", care_plan_id=care_plan_id)

        return ApiResponse(
            success=True,
            message="Care plan updated successfully",
            data=updated,
        )

    except Exception as e:
        logger.error("care_plan_update_error", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update care plan",
        )


@router.post("/{care_plan_id}/assign", response_model=ApiResponse)
async def assign_caregiver(
    care_plan_id: str,
    caregiver_id: str,
    current_user: dict = Depends(get_current_user),
):
    """Assign a caregiver to a care plan."""
    baserow = BaserowService()
    notification_service = NotificationService()

    # Get care plan
    care_plan = await baserow.get_care_plan(care_plan_id)
    if not care_plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Care plan not found",
        )

    # Check permissions
    if current_user["role"] != "admin":
        if care_plan.get("family_id") != current_user["id"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to assign caregiver to this care plan",
            )

    # Get caregiver
    caregiver = await baserow.get_caregiver(caregiver_id)
    if not caregiver:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Caregiver not found",
        )

    try:
        # Update care plan
        updated = await baserow.update_care_plan(care_plan_id, {
            "assigned_caregiver_id": caregiver_id,
            "status": "active",
            "updated_at": datetime.now(timezone.utc).isoformat(),
        })

        # Update caregiver status
        await baserow.update_caregiver(caregiver_id, {
            "status": "assigned",
            "updated_at": datetime.now(timezone.utc).isoformat(),
        })

        # Notify caregiver
        await notification_service.notify_caregiver_assigned(
            caregiver_email=caregiver["email"],
            caregiver_phone=caregiver.get("phone"),
            care_plan_data={
                "patient_name": care_plan["patient_name"],
                "care_type": care_plan["care_type"],
                "start_date": care_plan["schedule_requirements"]["start_date"],
            },
        )

        logger.info(
            "caregiver_assigned",
            care_plan_id=care_plan_id,
            caregiver_id=caregiver_id,
        )

        return ApiResponse(
            success=True,
            message="Caregiver assigned successfully",
            data=updated,
        )

    except Exception as e:
        logger.error("caregiver_assignment_error", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to assign caregiver",
        )


@router.post("/{care_plan_id}/cancel", response_model=ApiResponse)
async def cancel_care_plan(
    care_plan_id: str,
    reason: str,
    current_user: dict = Depends(get_current_user),
):
    """Cancel a care plan."""
    baserow = BaserowService()

    care_plan = await baserow.get_care_plan(care_plan_id)
    if not care_plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Care plan not found",
        )

    # Check permissions
    if current_user["role"] != "admin":
        if care_plan.get("family_id") != current_user["id"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to cancel this care plan",
            )

    try:
        updated = await baserow.update_care_plan(care_plan_id, {
            "status": "cancelled",
            "cancellation_reason": reason,
            "updated_at": datetime.now(timezone.utc).isoformat(),
        })

        # If caregiver was assigned, update their status
        assigned_caregiver_id = care_plan.get("assigned_caregiver_id")
        if assigned_caregiver_id:
            await baserow.update_caregiver(assigned_caregiver_id, {
                "status": "available",
                "updated_at": datetime.now(timezone.utc).isoformat(),
            })

        logger.info("care_plan_cancelled", care_plan_id=care_plan_id, reason=reason)

        return ApiResponse(
            success=True,
            message="Care plan cancelled successfully",
            data=updated,
        )

    except Exception as e:
        logger.error("care_plan_cancel_error", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to cancel care plan",
        )
