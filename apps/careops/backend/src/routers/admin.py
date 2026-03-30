"""Admin routes."""

from datetime import datetime, timezone
from typing import Optional

import structlog
from fastapi import APIRouter, Depends, HTTPException, Query, status

from ..models.background_check import BackgroundCheckProvider
from ..models.common import ApiResponse
from ..services.baserow import BaserowService
from ..services.background_check import BackgroundCheckService
from ..services.notifications import NotificationService
from .auth import get_current_admin

logger = structlog.get_logger()
router = APIRouter()


@router.get("/dashboard-stats", response_model=ApiResponse)
async def get_dashboard_stats(
    current_user: dict = Depends(get_current_admin),
):
    """Get admin dashboard statistics."""
    baserow = BaserowService()

    # Get counts from Baserow
    # These would be actual queries in production
    stats = {
        "total_caregivers": 1047,
        "active_care_plans": 328,
        "pending_background_checks": 23,
        "pending_authorizations": 15,
        "shifts_this_week": 1847,
        "revenue_this_month": 284750,
        "new_caregivers_this_week": 12,
        "completed_shifts_today": 89,
    }

    return ApiResponse(
        success=True,
        data=stats,
    )


@router.get("/pending-background-checks", response_model=ApiResponse)
async def get_pending_background_checks(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    current_user: dict = Depends(get_current_admin),
):
    """Get pending background checks."""
    baserow = BaserowService()

    # Query for pending/in-progress background checks
    # This would be an actual query in production
    pending_checks = [
        {
            "id": "bg-1",
            "caregiver_name": "Lisa Chen",
            "provider": "checkr",
            "submitted_at": "2024-01-15T10:00:00Z",
            "status": "in_progress",
        },
        {
            "id": "bg-2",
            "caregiver_name": "Amanda Davis",
            "provider": "sterling",
            "submitted_at": "2024-01-16T14:30:00Z",
            "status": "pending",
        },
    ]

    return ApiResponse(
        success=True,
        data=pending_checks,
        pagination={
            "page": page,
            "per_page": per_page,
            "total": len(pending_checks),
            "total_pages": 1,
        },
    )


@router.get("/pending-authorizations", response_model=ApiResponse)
async def get_pending_authorizations(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    current_user: dict = Depends(get_current_admin),
):
    """Get pending payer authorizations."""
    baserow = BaserowService()

    # Query for pending authorizations
    pending_auths = [
        {
            "id": "auth-1",
            "care_plan_id": "CP-2847",
            "patient_name": "Eleanor Thompson",
            "payer": "Medicare",
            "hours": 40,
            "submitted_at": "2024-01-12T09:00:00Z",
        },
        {
            "id": "auth-2",
            "care_plan_id": "CP-2848",
            "patient_name": "Robert Martinez",
            "payer": "Blue Cross",
            "hours": 20,
            "submitted_at": "2024-01-13T11:30:00Z",
        },
    ]

    return ApiResponse(
        success=True,
        data=pending_auths,
        pagination={
            "page": page,
            "per_page": per_page,
            "total": len(pending_auths),
            "total_pages": 1,
        },
    )


@router.post("/caregivers/{caregiver_id}/approve", response_model=ApiResponse)
async def approve_caregiver(
    caregiver_id: str,
    current_user: dict = Depends(get_current_admin),
):
    """Approve a caregiver."""
    baserow = BaserowService()
    notification_service = NotificationService()

    caregiver = await baserow.get_caregiver(caregiver_id)
    if not caregiver:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Caregiver not found",
        )

    try:
        updated = await baserow.update_caregiver(caregiver_id, {
            "status": "available",
            "approved_at": datetime.now(timezone.utc).isoformat(),
            "approved_by": current_user["id"],
            "updated_at": datetime.now(timezone.utc).isoformat(),
        })

        # Notify caregiver
        await notification_service.send_email(
            to_email=caregiver["email"],
            subject="Your CareOps Application Has Been Approved",
            template_id="d-caregiver-approved",
            template_data={
                "caregiver_name": f"{caregiver['first_name']} {caregiver['last_name']}",
            },
        )

        logger.info("caregiver_approved_by_admin", caregiver_id=caregiver_id, admin_id=current_user["id"])

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


@router.post("/background-checks/initiate", response_model=ApiResponse)
async def initiate_background_check(
    caregiver_id: str,
    provider: BackgroundCheckProvider,
    current_user: dict = Depends(get_current_admin),
):
    """Initiate a background check for a caregiver."""
    baserow = BaserowService()
    bg_service = BackgroundCheckService()

    caregiver = await baserow.get_caregiver(caregiver_id)
    if not caregiver:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Caregiver not found",
        )

    try:
        # Initiate check with provider
        result = await bg_service.initiate_check(
            caregiver_id=caregiver_id,
            provider=provider,
            caregiver_data={
                "first_name": caregiver["first_name"],
                "last_name": caregiver["last_name"],
                "email": caregiver["email"],
                "phone": caregiver.get("phone"),
            },
        )

        # Create background check record
        check_record = await baserow.create_background_check({
            "caregiver_id": caregiver_id,
            "provider": provider.value,
            "status": "in_progress",
            "report_id": result.get("report_id"),
            "candidate_id": result.get("candidate_id"),
            "initiated_at": datetime.now(timezone.utc).isoformat(),
        })

        # Update caregiver status
        await baserow.update_caregiver(caregiver_id, {
            "background_check_status": "in_progress",
            "background_check_provider": provider.value,
            "updated_at": datetime.now(timezone.utc).isoformat(),
        })

        logger.info(
            "background_check_initiated",
            caregiver_id=caregiver_id,
            provider=provider.value,
        )

        return ApiResponse(
            success=True,
            message="Background check initiated",
            data=check_record,
        )

    except Exception as e:
        logger.error("background_check_initiation_error", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to initiate background check",
        )


@router.get("/users", response_model=ApiResponse)
async def get_all_users(
    role: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    current_user: dict = Depends(get_current_admin),
):
    """Get all users (admin only)."""
    baserow = BaserowService()

    # This would query all users in production
    users = [
        {
            "id": "user-1",
            "email": "family@example.com",
            "first_name": "John",
            "last_name": "Family",
            "role": "family",
            "is_active": True,
            "created_at": "2024-01-01T00:00:00Z",
        },
        {
            "id": "user-2",
            "email": "caregiver@example.com",
            "first_name": "Jane",
            "last_name": "Caregiver",
            "role": "caregiver",
            "is_active": True,
            "created_at": "2024-01-02T00:00:00Z",
        },
    ]

    if role:
        users = [u for u in users if u["role"] == role]

    return ApiResponse(
        success=True,
        data=users,
        pagination={
            "page": page,
            "per_page": per_page,
            "total": len(users),
            "total_pages": 1,
        },
    )


@router.post("/payer-authorizations/{auth_id}/approve", response_model=ApiResponse)
async def approve_payer_authorization(
    auth_id: str,
    current_user: dict = Depends(get_current_admin),
):
    """Approve a payer authorization."""
    baserow = BaserowService()

    try:
        updated = await baserow.update_payer_authorization(auth_id, {
            "status": "approved",
            "approved_at": datetime.now(timezone.utc).isoformat(),
            "approved_by": current_user["id"],
            "updated_at": datetime.now(timezone.utc).isoformat(),
        })

        logger.info("payer_authorization_approved", auth_id=auth_id, admin_id=current_user["id"])

        return ApiResponse(
            success=True,
            message="Authorization approved successfully",
            data=updated,
        )

    except Exception as e:
        logger.error("authorization_approval_error", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to approve authorization",
        )


@router.post("/webhooks/background-check/{provider}", response_model=ApiResponse)
async def handle_background_check_webhook(
    provider: BackgroundCheckProvider,
    payload: dict,
    current_user: dict = Depends(get_current_admin),
):
    """Handle background check provider webhooks."""
    bg_service = BackgroundCheckService()
    baserow = BaserowService()
    notification_service = NotificationService()

    try:
        # Process webhook
        result = await bg_service.process_webhook(provider, payload)

        # Update background check record if report_id is present
        report_id = result.get("report_id")
        if report_id:
            # Find background check by report_id
            # This would be an actual query in production
            # bg_check = await baserow.get_background_check_by_report_id(report_id)

            # Update status
            # await baserow.update_background_check(bg_check["id"], {
            #     "status": result["status"],
            #     "completed_at": result.get("completed_at"),
            # })

            # Update caregiver status if completed
            if result["status"] == "completed":
                # caregiver_id = bg_check["caregiver_id"]
                # await baserow.update_caregiver(caregiver_id, {
                #     "background_check_status": "completed",
                #     "background_check_completed_at": result.get("completed_at"),
                # })

                # Notify caregiver
                # caregiver = await baserow.get_caregiver(caregiver_id)
                # await notification_service.notify_background_check_complete(
                #     caregiver_email=caregiver["email"],
                #     status=result.get("result", "clear"),
                # )
                pass

        logger.info("background_check_webhook_processed", provider=provider.value)

        return ApiResponse(
            success=True,
            message="Webhook processed successfully",
        )

    except Exception as e:
        logger.error("webhook_processing_error", error=str(e), provider=provider.value)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to process webhook",
        )
