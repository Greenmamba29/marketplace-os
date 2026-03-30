"""
Compliance Router for GovSource Backend
"""

from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query, status
import structlog

from ..models.compliance import (
    FARCompliance, 
    DFARSCompliance, 
    ComplianceRecord, 
    ComplianceStats,
    DebarredCheckResult,
    ComplianceCertify
)
from ..models.common import ApiResponse
from ..services.samgov import get_samgov_service, SamGovService
from ..routers.auth import get_current_active_user
from ..models.auth import User

logger = structlog.get_logger()
router = APIRouter(prefix="/compliance", tags=["Compliance"])


# Mock compliance data
MOCK_FAR_COMPLIANCE = [
    FARCompliance(
        id="far_1",
        vendorId="vendor_1",
        clauseNumber="52.212-1",
        clauseTitle="Instructions to Offerors",
        applicable=True,
        certified=True,
        certificationDate="2023-06-01",
        expirationDate="2024-06-01",
    ),
    FARCompliance(
        id="far_2",
        vendorId="vendor_1",
        clauseNumber="52.212-3",
        clauseTitle="Offeror Representations",
        applicable=True,
        certified=True,
        certificationDate="2023-06-01",
        expirationDate="2024-06-01",
    ),
    FARCompliance(
        id="far_3",
        vendorId="vendor_1",
        clauseNumber="52.212-4",
        clauseTitle="Contract Terms and Conditions",
        applicable=True,
        certified=False,
    ),
]

MOCK_DFARS_COMPLIANCE = [
    DFARSCompliance(
        id="dfars_1",
        vendorId="vendor_1",
        clauseNumber="252.204-7012",
        clauseTitle="Safeguarding Covered Defense Information",
        applicable=True,
        certified=True,
        certificationDate="2023-07-01",
        expirationDate="2024-07-01",
        cyberComplianceLevel="NIST 800-171",
    ),
    DFARSCompliance(
        id="dfars_2",
        vendorId="vendor_1",
        clauseNumber="252.225-7001",
        clauseTitle="Buy American Act",
        applicable=True,
        certified=True,
        certificationDate="2023-06-01",
    ),
]


@router.get("/far", response_model=ApiResponse[List[FARCompliance]])
async def get_far_compliance(
    vendor_id: str = Query(..., alias="vendorId"),
    current_user: User = Depends(get_current_active_user),
):
    """Get FAR compliance records for a vendor."""
    try:
        logger.info("Getting FAR compliance", vendor_id=vendor_id)
        
        # Filter by vendor
        records = [r for r in MOCK_FAR_COMPLIANCE if r.vendorId == vendor_id]
        
        return ApiResponse(data=records)
    
    except Exception as e:
        logger.error("Failed to get FAR compliance", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get FAR compliance"
        )


@router.get("/dfars", response_model=ApiResponse[List[DFARSCompliance]])
async def get_dfars_compliance(
    vendor_id: str = Query(..., alias="vendorId"),
    current_user: User = Depends(get_current_active_user),
):
    """Get DFARS compliance records for a vendor."""
    try:
        logger.info("Getting DFARS compliance", vendor_id=vendor_id)
        
        records = [r for r in MOCK_DFARS_COMPLIANCE if r.vendorId == vendor_id]
        
        return ApiResponse(data=records)
    
    except Exception as e:
        logger.error("Failed to get DFARS compliance", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get DFARS compliance"
        )


@router.get("/records", response_model=ApiResponse[List[ComplianceRecord]])
async def get_compliance_records(
    vendor_id: str = Query(..., alias="vendorId"),
    current_user: User = Depends(get_current_active_user),
):
    """Get all compliance records for a vendor."""
    try:
        records = []
        return ApiResponse(data=records)
    
    except Exception as e:
        logger.error("Failed to get compliance records", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get compliance records"
        )


@router.post("/certify", response_model=ApiResponse[None])
async def certify_compliance(
    data: ComplianceCertify,
    current_user: User = Depends(get_current_active_user),
):
    """Certify compliance for a clause."""
    try:
        logger.info(
            "Certifying compliance",
            vendor_id=data.vendor_id,
            type=data.type,
            clause=data.clause_number
        )
        
        return ApiResponse(data=None)
    
    except Exception as e:
        logger.error("Certification failed", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Certification failed"
        )


@router.get("/stats", response_model=ApiResponse[ComplianceStats])
async def get_compliance_stats(
    current_user: User = Depends(get_current_active_user),
):
    """Get compliance statistics."""
    try:
        stats = ComplianceStats(
            totalVendors=1250,
            compliantVendors=1150,
            nonCompliantVendors=50,
            pendingReviews=50,
            farClausesTracked=150,
            dfarsClausesTracked=75,
        )
        
        return ApiResponse(data=stats)
    
    except Exception as e:
        logger.error("Failed to get stats", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get statistics"
        )


@router.get("/debarred-check", response_model=ApiResponse[DebarredCheckResult])
async def check_debarred(
    duns: Optional[str] = Query(None),
    cage_code: Optional[str] = Query(None, alias="cageCode"),
    samgov: SamGovService = Depends(get_samgov_service),
    current_user: User = Depends(get_current_active_user),
):
    """Check if an entity is debarred or suspended."""
    try:
        logger.info("Checking debarred status", duns=duns, cage_code=cage_code)
        
        # Call SAM.gov exclusions API
        # For demo, return mock result
        
        if cage_code == "DEBAR":
            result = DebarredCheckResult(
                isDebarred=True,
                isSuspended=False,
                matches=[
                    {
                        "name": "Test Company Inc",
                        "type": "Debarment",
                        "effectiveDate": "2023-01-01",
                        "terminationDate": "2026-01-01",
                    }
                ]
            )
        else:
            result = DebarredCheckResult(
                isDebarred=False,
                isSuspended=False,
                matches=[]
            )
        
        return ApiResponse(data=result)
    
    except Exception as e:
        logger.error("Debarred check failed", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Debarred check failed"
        )
