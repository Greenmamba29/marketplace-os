"""
RFPs Router for GovSource Backend
"""

from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query, status
import structlog

from ..models.rfp import RFP, RFPCreate, RFPUpdate, RFPFilter, VendorMatch, RFPStats
from ..models.common import ApiResponse, PaginationMeta
from ..services.baserow import get_baserow_service, BaserowService
from ..routers.auth import get_current_active_user
from ..models.auth import User

logger = structlog.get_logger()
router = APIRouter(prefix="/rfps", tags=["RFPs"])


# Mock RFPs data for demo
MOCK_RFPS = [
    RFP(
        id="rfp_1",
        solicitationNumber="GS-35F-2024-001",
        title="IT Support Services for Federal Agency",
        description="The General Services Administration requires IT support services including help desk, system administration, and network management.",
        agency={
            "id": "agency_1",
            "name": "General Services Administration",
            "code": "GSA",
            "department": "General Services Administration",
            "contractingOfficerName": "Sarah Johnson",
            "contractingOfficerEmail": "sarah.johnson@gsa.gov"
        },
        status="OPEN",
        naicsCodes=["541511", "541512"],
        pscCodes=["D301"],
        setAside="SDVOSB",
        contractType="FIRM_FIXED_PRICE",
        estimatedValue={"min": 500000, "max": 2500000},
        periodOfPerformance={"basePeriod": 12, "optionPeriods": 24, "totalMonths": 36},
        securityClearanceRequired="Secret",
        importantDates={
            "issueDate": "2024-01-01",
            "questionsDue": "2024-01-15",
            "proposalDue": "2024-02-01",
            "awardDate": "2024-03-01"
        },
        farClauses=[
            {"number": "52.212-1", "title": "Instructions to Offerors", "description": "Standard instructions", "isFlowDown": False, "applicable": True},
            {"number": "52.212-3", "title": "Offeror Representations", "description": "Representations and certifications", "isFlowDown": False, "applicable": True},
        ],
        evaluationCriteria=[
            {"factor": "Technical Approach", "weight": 40, "description": "Technical solution and approach"},
            {"factor": "Past Performance", "weight": 30, "description": "Relevant past performance"},
            {"factor": "Price", "weight": 30, "description": "Total evaluated price"},
        ],
        attachments=[],
        createdAt="2024-01-01T00:00:00Z",
        updatedAt="2024-01-01T00:00:00Z"
    ),
    RFP(
        id="rfp_2",
        solicitationNumber="HHS-2024-002",
        title="Healthcare Data Analytics Platform",
        description="Department of Health and Human Services seeks a contractor to develop and maintain a healthcare data analytics platform.",
        agency={
            "id": "agency_2",
            "name": "Department of Health and Human Services",
            "code": "HHS",
            "department": "Health and Human Services",
        },
        status="OPEN",
        naicsCodes=["541511", "541512", "541519"],
        pscCodes=["D301", "R499"],
        setAside="WOSB",
        contractType="IDIQ",
        estimatedValue={"min": 1000000, "max": 10000000},
        periodOfPerformance={"basePeriod": 24, "optionPeriods": 36, "totalMonths": 60},
        securityClearanceRequired="Public Trust",
        importantDates={
            "issueDate": "2024-01-10",
            "questionsDue": "2024-01-25",
            "proposalDue": "2024-02-15",
        },
        farClauses=[
            {"number": "52.212-1", "title": "Instructions to Offerors", "description": "Standard instructions", "isFlowDown": False, "applicable": True},
        ],
        evaluationCriteria=[
            {"factor": "Technical Capability", "weight": 50, "description": "Technical expertise and solution"},
            {"factor": "Management Approach", "weight": 20, "description": "Project management plan"},
            {"factor": "Price", "weight": 30, "description": "Cost competitiveness"},
        ],
        attachments=[],
        createdAt="2024-01-10T00:00:00Z",
        updatedAt="2024-01-10T00:00:00Z"
    ),
    RFP(
        id="rfp_3",
        solicitationNumber="DOD-2024-003",
        title="Cybersecurity Assessment Services",
        description="Department of Defense requires cybersecurity assessment and penetration testing services for critical systems.",
        agency={
            "id": "agency_3",
            "name": "Department of Defense",
            "code": "DOD",
            "department": "Defense",
        },
        status="PUBLISHED",
        naicsCodes=["541511", "541519"],
        pscCodes=["D307"],
        setAside="8(a)",
        contractType="TIME_MATERIALS",
        estimatedValue={"min": 2000000, "max": 5000000},
        periodOfPerformance={"basePeriod": 12, "optionPeriods": 12, "totalMonths": 24},
        securityClearanceRequired="TS/SCI",
        importantDates={
            "issueDate": "2024-01-05",
            "questionsDue": "2024-01-20",
            "proposalDue": "2024-02-10",
        },
        farClauses=[
            {"number": "52.212-1", "title": "Instructions to Offerors", "description": "Standard instructions", "isFlowDown": False, "applicable": True},
            {"number": "252.204-7012", "title": "DFARS Safeguarding", "description": "DFARS safeguarding requirements", "isFlowDown": True, "applicable": True},
        ],
        evaluationCriteria=[
            {"factor": "Technical Merit", "weight": 60, "description": "Technical approach and qualifications"},
            {"factor": "Past Performance", "weight": 25, "description": "Relevant experience"},
            {"factor": "Price", "weight": 15, "description": "Competitive pricing"},
        ],
        attachments=[],
        createdAt="2024-01-05T00:00:00Z",
        updatedAt="2024-01-05T00:00:00Z"
    ),
]


@router.get("", response_model=ApiResponse[List[RFP]])
async def list_rfps(
    search: Optional[str] = Query(None),
    agency: Optional[str] = Query(None),
    naics_codes: Optional[str] = Query(None, alias="naicsCodes"),
    set_aside: Optional[str] = Query(None, alias="setAside"),
    status: Optional[str] = Query(None),
    min_value: Optional[float] = Query(None, alias="minValue"),
    max_value: Optional[float] = Query(None, alias="maxValue"),
    security_clearance: Optional[str] = Query(None, alias="securityClearance"),
    page: int = Query(1, ge=1),
    per_page: int = Query(10, ge=1, le=100),
    current_user: User = Depends(get_current_active_user),
):
    """List RFPs with optional filtering."""
    try:
        logger.info("Listing RFPs", search=search)
        
        # Apply filters to mock data
        rfps = MOCK_RFPS
        
        if search:
            rfps = [r for r in rfps if search.lower() in r.title.lower() or search.lower() in r.solicitationNumber.lower()]
        
        if agency:
            rfps = [r for r in rfps if agency.lower() in r.agency["name"].lower()]
        
        if set_aside:
            rfps = [r for r in rfps if r.setAside == set_aside]
        
        if status:
            rfps = [r for r in rfps if r.status == status]
        
        if min_value:
            rfps = [r for r in rfps if r.estimatedValue["max"] >= min_value]
        
        if security_clearance:
            rfps = [r for r in rfps if r.securityClearanceRequired == security_clearance]
        
        total = len(rfps)
        
        return ApiResponse(
            data=rfps,
            meta=PaginationMeta(
                page=page,
                per_page=per_page,
                total=total,
                total_pages=(total + per_page - 1) // per_page
            )
        )
    
    except Exception as e:
        logger.error("Failed to list RFPs", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to list RFPs"
        )


@router.get("/{rfp_id}", response_model=ApiResponse[RFP])
async def get_rfp(
    rfp_id: str,
    current_user: User = Depends(get_current_active_user),
):
    """Get an RFP by ID."""
    try:
        rfp = next((r for r in MOCK_RFPS if r.id == rfp_id), None)
        
        if not rfp:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="RFP not found"
            )
        
        return ApiResponse(data=rfp)
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Failed to get RFP", error=str(e), rfp_id=rfp_id)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get RFP"
        )


@router.get("/{rfp_id}/matches", response_model=ApiResponse[List[VendorMatch]])
async def match_rfp_to_vendors(
    rfp_id: str,
    current_user: User = Depends(get_current_active_user),
):
    """Match an RFP to qualified vendors."""
    try:
        rfp = next((r for r in MOCK_RFPS if r.id == rfp_id), None)
        
        if not rfp:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="RFP not found"
            )
        
        # Mock matching algorithm
        matches = [
            VendorMatch(
                vendorId="vendor_1",
                score=0.92,
                reasons=["NAICS match", "Set-aside eligible", "Clearance level"]
            ),
            VendorMatch(
                vendorId="vendor_2",
                score=0.78,
                reasons=["NAICS match", "Past performance"]
            ),
        ]
        
        return ApiResponse(data=matches)
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Failed to match RFP", error=str(e), rfp_id=rfp_id)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to match RFP"
        )


@router.post("/import-samgov", response_model=ApiResponse[RFP])
async def import_from_samgov(
    notice_id: str,
    current_user: User = Depends(get_current_active_user),
):
    """Import an RFP from SAM.gov."""
    try:
        logger.info("Importing from SAM.gov", notice_id=notice_id)
        
        # This would call the SAM.gov API
        # For demo, return a mock RFP
        
        raise HTTPException(
            status_code=status.HTTP_501_NOT_IMPLEMENTED,
            detail="SAM.gov import not yet implemented"
        )
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Import failed", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Import failed"
        )


@router.get("/stats/summary", response_model=ApiResponse[RFPStats])
async def get_rfp_stats(
    current_user: User = Depends(get_current_active_user),
):
    """Get RFP statistics."""
    try:
        stats = RFPStats(
            total=len(MOCK_RFPS),
            open=len([r for r in MOCK_RFPS if r.status == "OPEN"]),
            closed=len([r for r in MOCK_RFPS if r.status == "CLOSED"]),
            awarded=len([r for r in MOCK_RFPS if r.status == "AWARDED"]),
            byAgency={
                "GSA": 1,
                "HHS": 1,
                "DOD": 1,
            },
            bySetAside={
                "SDVOSB": 1,
                "WOSB": 1,
                "8(a)": 1,
            }
        )
        
        return ApiResponse(data=stats)
    
    except Exception as e:
        logger.error("Failed to get stats", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get statistics"
        )
