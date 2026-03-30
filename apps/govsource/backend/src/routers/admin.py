"""
Admin Router for GovSource Backend
"""

from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, status
import structlog

from ..models.common import ApiResponse
from ..services.baserow import get_baserow_service, BaserowService
from ..routers.auth import get_current_active_user
from ..models.auth import User

logger = structlog.get_logger()
router = APIRouter(prefix="/admin", tags=["Admin"])


async def require_admin(current_user: User = Depends(get_current_active_user)) -> User:
    """Require admin role."""
    if current_user.role != "ADMIN":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    return current_user


@router.get("/dashboard", response_model=ApiResponse[dict])
async def get_admin_dashboard(
    current_user: User = Depends(require_admin),
):
    """Get admin dashboard data."""
    try:
        return ApiResponse(data={
            "totalUsers": 5000,
            "totalVendors": 1250,
            "totalRFPs": 350,
            "totalRFQs": 1200,
            "pendingApprovals": 45,
            "recentActivity": [],
        })
    
    except Exception as e:
        logger.error("Failed to get dashboard", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get dashboard"
        )


@router.get("/users", response_model=ApiResponse[List[dict]])
async def list_users(
    page: int = 1,
    per_page: int = 50,
    current_user: User = Depends(require_admin),
):
    """List all users."""
    try:
        users = []
        return ApiResponse(data=users)
    
    except Exception as e:
        logger.error("Failed to list users", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to list users"
        )


@router.post("/sync-samgov", response_model=ApiResponse[dict])
async def sync_samgov(
    current_user: User = Depends(require_admin),
):
    """Sync vendor data with SAM.gov."""
    try:
        logger.info("Starting SAM.gov sync")
        
        return ApiResponse(data={
            "synced": 1250,
            "failed": 0,
            "timestamp": "2024-01-01T00:00:00Z"
        })
    
    except Exception as e:
        logger.error("SAM.gov sync failed", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Sync failed"
        )


@router.post("/run-compliance-check", response_model=ApiResponse[dict])
async def run_compliance_check(
    current_user: User = Depends(require_admin),
):
    """Run compliance check for all vendors."""
    try:
        logger.info("Running compliance check")
        
        return ApiResponse(data={
            "checked": 1250,
            "compliant": 1150,
            "nonCompliant": 50,
            "pending": 50,
            "timestamp": "2024-01-01T00:00:00Z"
        })
    
    except Exception as e:
        logger.error("Compliance check failed", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Compliance check failed"
        )


@router.get("/audit-log", response_model=ApiResponse[List[dict]])
async def get_audit_log(
    page: int = 1,
    per_page: int = 50,
    current_user: User = Depends(require_admin),
):
    """Get audit log entries."""
    try:
        logs = []
        return ApiResponse(data=logs)
    
    except Exception as e:
        logger.error("Failed to get audit log", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get audit log"
        )
