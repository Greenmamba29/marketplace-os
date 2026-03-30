"""
Vendors Router for GovSource Backend
"""

from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query, status
import structlog

from ..models.vendor import Vendor, VendorCreate, VendorUpdate, VendorFilter
from ..models.common import ApiResponse, PaginationMeta
from ..services.baserow import get_baserow_service, BaserowService
from ..services.samgov import get_samgov_service, SamGovService
from ..routers.auth import get_current_active_user
from ..models.auth import User

logger = structlog.get_logger()
router = APIRouter(prefix="/vendors", tags=["Vendors"])


# Mock vendors data for demo
MOCK_VENDORS = [
    Vendor(
        id="vendor_1",
        userId="user_1",
        companyName="Federal Tech Solutions LLC",
        dbaName="FTS",
        cageCode="5ABC1",
        uei="ABC123DEF456",
        samRegistration={
            "status": "ACTIVE",
            "registrationDate": "2023-01-15",
            "expirationDate": "2024-01-15",
            "lastUpdated": "2023-12-01",
            "samUei": "ABC123DEF456",
            "legalBusinessName": "Federal Tech Solutions LLC",
            "physicalAddress": {
                "street": "123 Gov Street",
                "city": "Washington",
                "state": "DC",
                "zipCode": "20001",
                "country": "USA"
            },
            "congressionalDistrict": "DC-01",
            "businessStartDate": "2015-03-01",
            "fiscalYearEnd": "12-31"
        },
        naicsCodes=[
            {"code": "541511", "description": "Custom Computer Programming", "isPrimary": True, "sizeStandard": "$30.0M"},
            {"code": "541512", "description": "Computer Systems Design", "isPrimary": False, "sizeStandard": "$30.0M"},
        ],
        pscCodes=[
            {"code": "D301", "description": "IT and Telecom"},
        ],
        setAsides=["SDVOSB", "SDB"],
        securityClearance="Secret",
        clearanceExpiration="2025-06-01",
        qualifications=[],
        pastPerformance=[
            {
                "id": "pp_1",
                "contractNumber": "GS-35F-1234",
                "agencyName": "General Services Administration",
                "contractValue": 2500000,
                "startDate": "2022-01-01",
                "endDate": "2023-12-31",
                "naicsCode": "541511",
                "description": "IT Support Services",
                "rating": 4.5,
                "cparsAvailable": True
            }
        ],
        certifications=[
            {
                "id": "cert_1",
                "type": "ISO",
                "name": "ISO 9001:2015",
                "issuingBody": "ANSI",
                "issueDate": "2022-03-01",
                "expirationDate": "2025-03-01",
            }
        ],
        contactInfo={
            "primaryContact": "John Smith",
            "phone": "(202) 555-0100",
            "email": "contact@federalttech.com",
            "website": "https://federalttech.com",
            "businessAddress": {
                "street": "123 Gov Street",
                "city": "Washington",
                "state": "DC",
                "zipCode": "20001",
                "country": "USA"
            }
        },
        financialInfo={
            "annualRevenue": 15000000,
            "numberOfEmployees": 75,
            "isSmallBusiness": True,
            "businessType": ["Veteran-Owned", "Small Disadvantaged Business"]
        },
        complianceStatus={
            "overallStatus": "COMPLIANT",
            "farCompliance": True,
            "dfarsCompliance": True,
            "debarred": False,
            "suspended": False,
            "lastChecked": "2024-01-01T00:00:00Z"
        },
        createdAt="2023-01-01T00:00:00Z",
        updatedAt="2023-12-01T00:00:00Z"
    ),
    Vendor(
        id="vendor_2",
        userId="user_2",
        companyName="SecureGov Consulting Inc",
        cageCode="6DEF2",
        uei="DEF456GHI789",
        samRegistration={
            "status": "ACTIVE",
            "registrationDate": "2022-06-01",
            "expirationDate": "2024-06-01",
            "lastUpdated": "2023-11-15",
            "samUei": "DEF456GHI789",
            "legalBusinessName": "SecureGov Consulting Inc",
            "physicalAddress": {
                "street": "456 Security Blvd",
                "city": "Arlington",
                "state": "VA",
                "zipCode": "22201",
                "country": "USA"
            },
            "congressionalDistrict": "VA-08",
            "businessStartDate": "2010-01-01",
            "fiscalYearEnd": "09-30"
        },
        naicsCodes=[
            {"code": "541611", "description": "Administrative Management", "isPrimary": True, "sizeStandard": "$19.0M"},
            {"code": "541618", "description": "Other Management Consulting", "isPrimary": False, "sizeStandard": "$19.0M"},
        ],
        pscCodes=[
            {"code": "R499", "description": "Professional Services"},
        ],
        setAsides=["WOSB", "EDWOSB"],
        securityClearance="Top Secret",
        clearanceExpiration="2024-12-01",
        qualifications=[],
        pastPerformance=[],
        certifications=[],
        contactInfo={
            "primaryContact": "Jane Doe",
            "phone": "(703) 555-0200",
            "email": "info@securegov.com",
            "website": "https://securegov.com",
            "businessAddress": {
                "street": "456 Security Blvd",
                "city": "Arlington",
                "state": "VA",
                "zipCode": "22201",
                "country": "USA"
            }
        },
        financialInfo={
            "annualRevenue": 8500000,
            "numberOfEmployees": 45,
            "isSmallBusiness": True,
            "businessType": ["Women-Owned", "Economically Disadvantaged WOSB"]
        },
        complianceStatus={
            "overallStatus": "COMPLIANT",
            "farCompliance": True,
            "dfarsCompliance": True,
            "debarred": False,
            "suspended": False,
            "lastChecked": "2024-01-01T00:00:00Z"
        },
        createdAt="2022-06-01T00:00:00Z",
        updatedAt="2023-11-15T00:00:00Z"
    ),
]


@router.get("", response_model=ApiResponse[List[Vendor]])
async def list_vendors(
    search: Optional[str] = Query(None),
    naics_codes: Optional[str] = Query(None, alias="naicsCodes"),
    psc_codes: Optional[str] = Query(None, alias="pscCodes"),
    set_asides: Optional[str] = Query(None, alias="setAsides"),
    security_clearance: Optional[str] = Query(None, alias="securityClearance"),
    sam_status: Optional[str] = Query(None, alias="samStatus"),
    state: Optional[str] = Query(None),
    small_business: Optional[bool] = Query(None, alias="smallBusiness"),
    qualified_only: Optional[bool] = Query(None, alias="qualifiedOnly"),
    page: int = Query(1, ge=1),
    per_page: int = Query(10, ge=1, le=100),
    current_user: User = Depends(get_current_active_user),
):
    """List vendors with optional filtering."""
    try:
        logger.info("Listing vendors", search=search)
        
        # Apply filters to mock data
        vendors = MOCK_VENDORS
        
        if search:
            vendors = [v for v in vendors if search.lower() in v.companyName.lower()]
        
        if set_asides:
            sa_list = set_asides.split(",")
            vendors = [v for v in vendors if any(sa in v.setAsides for sa in sa_list)]
        
        if sam_status:
            vendors = [v for v in vendors if v.samRegistration["status"] == sam_status]
        
        if small_business is not None:
            vendors = [v for v in vendors if v.financialInfo["isSmallBusiness"] == small_business]
        
        total = len(vendors)
        
        return ApiResponse(
            data=vendors,
            meta=PaginationMeta(
                page=page,
                per_page=per_page,
                total=total,
                total_pages=(total + per_page - 1) // per_page
            )
        )
    
    except Exception as e:
        logger.error("Failed to list vendors", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to list vendors"
        )


@router.get("/{vendor_id}", response_model=ApiResponse[Vendor])
async def get_vendor(
    vendor_id: str,
    current_user: User = Depends(get_current_active_user),
):
    """Get a vendor by ID."""
    try:
        vendor = next((v for v in MOCK_VENDORS if v.id == vendor_id), None)
        
        if not vendor:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Vendor not found"
            )
        
        return ApiResponse(data=vendor)
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Failed to get vendor", error=str(e), vendor_id=vendor_id)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get vendor"
        )


@router.post("/verify-sam", response_model=ApiResponse[Vendor])
async def verify_sam_registration(
    cage_code: str,
    samgov: SamGovService = Depends(get_samgov_service),
    current_user: User = Depends(get_current_active_user),
):
    """Verify a vendor's SAM.gov registration."""
    try:
        logger.info("Verifying SAM registration", cage_code=cage_code)
        
        # Query SAM.gov
        entity_data = await samgov.get_entity_by_cage(cage_code)
        
        if not entity_data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Entity not found in SAM.gov"
            )
        
        # Parse and return
        parsed = samgov.parse_entity_data(entity_data)
        
        return ApiResponse(data=parsed)
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error("SAM verification failed", error=str(e), cage_code=cage_code)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="SAM verification failed"
        )


@router.get("/{vendor_id}/qualifications", response_model=ApiResponse[list])
async def get_vendor_qualifications(
    vendor_id: str,
    current_user: User = Depends(get_current_active_user),
):
    """Get vendor qualifications."""
    vendor = next((v for v in MOCK_VENDORS if v.id == vendor_id), None)
    
    if not vendor:
        raise HTTPException(status_code=404, detail="Vendor not found")
    
    return ApiResponse(data=vendor.qualifications)


@router.get("/{vendor_id}/compliance", response_model=ApiResponse[dict])
async def get_vendor_compliance(
    vendor_id: str,
    current_user: User = Depends(get_current_active_user),
):
    """Get vendor compliance status."""
    vendor = next((v for v in MOCK_VENDORS if v.id == vendor_id), None)
    
    if not vendor:
        raise HTTPException(status_code=404, detail="Vendor not found")
    
    return ApiResponse(data=vendor.complianceStatus)
