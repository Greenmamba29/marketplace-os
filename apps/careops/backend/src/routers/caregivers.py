"""Caregiver routes."""

from typing import List, Optional

import structlog
from fastapi import APIRouter, Depends, HTTPException, Query, status

from ..models.caregiver import (
    CaregiverProfile,
    CaregiverProfileCreate,
    CaregiverProfileUpdate,
    CaregiverFilter,
    Certification,
    Specialization,
)
from ..models.common import ApiResponse, PaginatedResponse, PaginationParams
from ..services.baserow import BaserowService
from .auth import get_current_user

logger = structlog.get_logger()
router = APIRouter()


@router.get("/", response_model=ApiResponse)
async def search_caregivers(
    certifications: Optional[List[Certification]] = Query(None),
    languages: Optional[List[str]] = Query(None),
    specializations: Optional[List[Specialization]] = Query(None),
    min_rating: Optional[float] = Query(None, ge=0, le=5),
    max_rate: Optional[float] = Query(None, ge=15, le=200),
    zip_code: Optional[str] = Query(None),
    available_only: Optional[bool] = Query(None),
    background_checked: Optional[bool] = Query(None),
    q: Optional[str] = Query(None, description="Search query"),
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    current_user: dict = Depends(get_current_user),
):
    """Search caregivers with filters."""
    baserow = BaserowService()

    # Build filter dict
    filters = {}
    if certifications:
        filters["certifications__has"] = ",".join(certifications)
    if languages:
        filters["languages__has"] = ",".join(languages)
    if specializations:
        filters["specializations__has"] = ",".join(specializations)
    if min_rating:
        filters["rating__gte"] = min_rating
    if max_rate:
        filters["hourly_rate__lte"] = max_rate
    if zip_code:
        filters["service_area__zip_codes__contains"] = zip_code
    if available_only:
        filters["status__equal"] = "available"
    if background_checked:
        filters["background_check_status__equal"] = "completed"

    try:
        result = await baserow.search_caregivers(
            filters=filters if filters else None,
            page=page,
            per_page=per_page,
        )

        # Filter by search query if provided
        caregivers = result.get("results", [])
        if q:
            q_lower = q.lower()
            caregivers = [
                c for c in caregivers
                if q_lower in c.get("first_name", "").lower()
                or q_lower in c.get("last_name", "").lower()
                or q_lower in c.get("bio", "").lower()
            ]

        total = result.get("count", 0)
        total_pages = (total + per_page - 1) // per_page

        return ApiResponse(
            success=True,
            data=caregivers,
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
        logger.error("caregiver_search_error", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to search caregivers",
        )


@router.get("/{caregiver_id}", response_model=ApiResponse)
async def get_caregiver(
    caregiver_id: str,
    current_user: dict = Depends(get_current_user),
):
    """Get caregiver by ID."""
    baserow = BaserowService()

    caregiver = await baserow.get_caregiver(caregiver_id)

    if not caregiver:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Caregiver not found",
        )

    return ApiResponse(
        success=True,
        data=caregiver,
    )


@router.post("/", response_model=ApiResponse)
async def create_caregiver(
    caregiver_data: CaregiverProfileCreate,
    current_user: dict = Depends(get_current_user),
):
    """Create a new caregiver profile."""
    # Only allow caregivers to create their own profile
    if current_user["role"] != "caregiver" and current_user["role"] != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only caregivers can create caregiver profiles",
        )

    baserow = BaserowService()

    # Check if caregiver profile already exists
    existing = await baserow.get_caregiver_by_user_id(caregiver_data.user_id)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Caregiver profile already exists",
        )

    try:
        created = await baserow.create_caregiver(caregiver_data.model_dump())

        logger.info("caregiver_created", caregiver_id=created["id"], user_id=caregiver_data.user_id)

        return ApiResponse(
            success=True,
            message="Caregiver profile created successfully",
            data=created,
        )

    except Exception as e:
        logger.error("caregiver_create_error", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create caregiver profile",
        )


@router.patch("/{caregiver_id}", response_model=ApiResponse)
async def update_caregiver(
    caregiver_id: str,
    caregiver_data: CaregiverProfileUpdate,
    current_user: dict = Depends(get_current_user),
):
    """Update caregiver profile."""
    baserow = BaserowService()

    # Get existing caregiver
    existing = await baserow.get_caregiver(caregiver_id)
    if not existing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Caregiver not found",
        )

    # Check permissions
    if current_user["role"] != "admin" and existing.get("user_id") != current_user["id"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this profile",
        )

    try:
        # Filter out None values
        update_dict = {k: v for k, v in caregiver_data.model_dump().items() if v is not None}

        updated = await baserow.update_caregiver(caregiver_id, update_dict)

        logger.info("caregiver_updated", caregiver_id=caregiver_id)

        return ApiResponse(
            success=True,
            message="Caregiver profile updated successfully",
            data=updated,
        )

    except Exception as e:
        logger.error("caregiver_update_error", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update caregiver profile",
        )


@router.get("/{caregiver_id}/availability", response_model=ApiResponse)
async def get_caregiver_availability(
    caregiver_id: str,
    start_date: str,
    end_date: str,
    current_user: dict = Depends(get_current_user),
):
    """Get caregiver availability for date range."""
    baserow = BaserowService()

    caregiver = await baserow.get_caregiver(caregiver_id)
    if not caregiver:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Caregiver not found",
        )

    # Get existing shifts for the date range
    shifts = await baserow.get_shifts(
        filters={"caregiver_id": caregiver_id},
    )

    return ApiResponse(
        success=True,
        data={
            "availability": caregiver.get("availability", {}),
            "booked_shifts": shifts.get("results", []),
        },
    )


@router.post("/{caregiver_id}/approve", response_model=ApiResponse)
async def approve_caregiver(
    caregiver_id: str,
    current_user: dict = Depends(get_current_user),
):
    """Approve a caregiver (admin only)."""
    if current_user["role"] != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required",
        )

    baserow = BaserowService()

    caregiver = await baserow.get_caregiver(caregiver_id)
    if not caregiver:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Caregiver not found",
        )

    try:
        updated = await baserow.update_caregiver(caregiver_id, {
            "status": "available",
            "updated_at": __import__('datetime').datetime.now(__import__('datetime').timezone.utc).isoformat(),
        })

        logger.info("caregiver_approved", caregiver_id=caregiver_id, admin_id=current_user["id"])

        return ApiResponse(
            success=True,
            message="Caregiver approved successfully",
            data=updated,
        )

    except Exception as e:
        logger.error("caregiver_approval_error", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to approve caregiver",
        )
