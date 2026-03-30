"""
RFQs Router for GovSource Backend
"""

from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, status
import structlog

from ..models.rfq import RFQ, RFQCreate, RFQUpdate, QuoteSubmit, ApprovalAction, AwardAction
from ..models.common import ApiResponse, PaginationMeta
from ..services.baserow import get_baserow_service, BaserowService
from ..routers.auth import get_current_active_user
from ..models.auth import User

logger = structlog.get_logger()
router = APIRouter(prefix="/rfqs", tags=["RFQs"])


# Mock RFQs data
MOCK_RFQS = [
    RFQ(
        id="rfq_1",
        rfqNumber="RFQ-2024-001",
        title="IT Equipment Procurement",
        description="Procurement of laptops and monitors for new staff",
        agencyId="agency_1",
        rfpId=None,
        status="OPEN",
        lineItems=[
            {
                "id": "li_1",
                "lineNumber": 1,
                "description": "Laptop Computers",
                "quantity": 50,
                "unit": "EA",
                "requiredDeliveryDate": "2024-03-01",
            },
            {
                "id": "li_2",
                "lineNumber": 2,
                "description": "27-inch Monitors",
                "quantity": 50,
                "unit": "EA",
                "requiredDeliveryDate": "2024-03-01",
            },
        ],
        deliveryRequirements={
            "fobDestination": True,
            "shippingAddress": {
                "street": "1800 F Street NW",
                "city": "Washington",
                "state": "DC",
                "zipCode": "20405",
                "country": "USA"
            },
            "requiredDate": "2024-03-01",
            "partialShipmentsAllowed": False,
        },
        terms={
            "paymentTerms": "Net 30",
            "netDays": 30,
        },
        invitedVendors=["vendor_1", "vendor_2"],
        quotes=[],
        approvalChain=[
            {"step": 1, "role": "CONTRACTING_OFFICER", "status": "APPROVED", "approverId": "user_co1", "actionedAt": "2024-01-15T10:00:00Z"},
        ],
        createdBy="user_1",
        createdAt="2024-01-10T00:00:00Z",
        updatedAt="2024-01-15T00:00:00Z",
    ),
    RFQ(
        id="rfq_2",
        rfqNumber="RFQ-2024-002",
        title="Professional Services",
        description="Consulting services for system modernization",
        agencyId="agency_2",
        rfpId="rfp_2",
        status="PENDING_APPROVAL",
        lineItems=[
            {
                "id": "li_3",
                "lineNumber": 1,
                "description": "Technical Consulting",
                "quantity": 1000,
                "unit": "HR",
                "requiredDeliveryDate": "2024-06-01",
            },
        ],
        deliveryRequirements={
            "fobDestination": True,
            "shippingAddress": {
                "street": "200 Independence Ave SW",
                "city": "Washington",
                "state": "DC",
                "zipCode": "20201",
                "country": "USA"
            },
            "requiredDate": "2024-06-01",
            "partialShipmentsAllowed": True,
        },
        terms={
            "paymentTerms": "Net 15",
            "netDays": 15,
        },
        invitedVendors=["vendor_1"],
        quotes=[],
        approvalChain=[
            {"step": 1, "role": "PROGRAM_MANAGER", "status": "APPROVED", "approverId": "user_pm1", "actionedAt": "2024-01-20T10:00:00Z"},
            {"step": 2, "role": "CONTRACTING_OFFICER", "status": "PENDING"},
        ],
        createdBy="user_2",
        createdAt="2024-01-20T00:00:00Z",
        updatedAt="2024-01-20T00:00:00Z",
    ),
]


@router.get("", response_model=ApiResponse[List[RFQ]])
async def list_rfqs(
    status: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    per_page: int = Query(10, ge=1, le=100),
    current_user: User = Depends(get_current_active_user),
):
    """List RFQs with optional filtering."""
    try:
        logger.info("Listing RFQs")
        
        rfqs = MOCK_RFQS
        
        if status:
            rfqs = [r for r in rfqs if r.status == status]
        
        total = len(rfqs)
        
        return ApiResponse(
            data=rfqs,
            meta=PaginationMeta(
                page=page,
                per_page=per_page,
                total=total,
                total_pages=(total + per_page - 1) // per_page
            )
        )
    
    except Exception as e:
        logger.error("Failed to list RFQs", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to list RFQs"
        )


@router.get("/{rfq_id}", response_model=ApiResponse[RFQ])
async def get_rfq(
    rfq_id: str,
    current_user: User = Depends(get_current_active_user),
):
    """Get an RFQ by ID."""
    try:
        rfq = next((r for r in MOCK_RFQS if r.id == rfq_id), None)
        
        if not rfq:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="RFQ not found"
            )
        
        return ApiResponse(data=rfq)
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Failed to get RFQ", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get RFQ"
        )


@router.post("", response_model=ApiResponse[RFQ])
async def create_rfq(
    data: RFQCreate,
    current_user: User = Depends(get_current_active_user),
):
    """Create a new RFQ."""
    try:
        logger.info("Creating RFQ", title=data.title)
        
        # Generate RFQ number
        rfq_number = f"RFQ-2024-{len(MOCK_RFQS) + 1:03d}"
        
        rfq = RFQ(
            id=f"rfq_{len(MOCK_RFQS) + 1}",
            rfqNumber=rfq_number,
            title=data.title,
            description=data.description,
            agencyId=data.agency_id,
            rfpId=data.rfp_id,
            status="DRAFT",
            lineItems=data.line_items,
            deliveryRequirements=data.delivery_requirements,
            terms=data.terms,
            invitedVendors=data.invited_vendors,
            quotes=[],
            approvalChain=[
                {"step": 1, "role": "PROGRAM_MANAGER", "status": "PENDING"},
                {"step": 2, "role": "CONTRACTING_OFFICER", "status": "PENDING"},
            ],
            createdBy=current_user.id,
            createdAt="2024-01-01T00:00:00Z",
            updatedAt="2024-01-01T00:00:00Z",
        )
        
        MOCK_RFQS.append(rfq)
        
        return ApiResponse(data=rfq)
    
    except Exception as e:
        logger.error("Failed to create RFQ", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create RFQ"
        )


@router.post("/{rfq_id}/quotes", response_model=ApiResponse[dict])
async def submit_quote(
    rfq_id: str,
    quote: QuoteSubmit,
    current_user: User = Depends(get_current_active_user),
):
    """Submit a quote for an RFQ."""
    try:
        logger.info("Submitting quote", rfq_id=rfq_id)
        
        rfq = next((r for r in MOCK_RFQS if r.id == rfq_id), None)
        
        if not rfq:
            raise HTTPException(status_code=404, detail="RFQ not found")
        
        if rfq.status != "OPEN":
            raise HTTPException(status_code=400, detail="RFQ is not open for quotes")
        
        # Add quote
        new_quote = {
            "id": f"quote_{len(rfq.quotes) + 1}",
            "vendorId": current_user.vendor_id or "vendor_unknown",
            "rfqId": rfq_id,
            "status": "SUBMITTED",
            "lineItemQuotes": quote.line_item_quotes,
            "totalPrice": quote.total_price,
            "deliveryDays": quote.delivery_days,
            "validityDays": quote.validity_days,
            "technicalProposal": quote.technical_proposal,
            "pastPerformance": quote.past_performance,
            "submittedAt": "2024-01-01T00:00:00Z",
        }
        
        rfq.quotes.append(new_quote)
        
        return ApiResponse(data=new_quote)
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Failed to submit quote", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to submit quote"
        )


@router.post("/{rfq_id}/approve", response_model=ApiResponse[RFQ])
async def approve_rfq(
    rfq_id: str,
    action: ApprovalAction,
    current_user: User = Depends(get_current_active_user),
):
    """Approve an RFQ at a specific approval step."""
    try:
        logger.info("Approving RFQ", rfq_id=rfq_id, step=action.step)
        
        rfq = next((r for r in MOCK_RFQS if r.id == rfq_id), None)
        
        if not rfq:
            raise HTTPException(status_code=404, detail="RFQ not found")
        
        # Update approval step
        for step in rfq.approvalChain:
            if step["step"] == action.step:
                step["status"] = "APPROVED"
                step["approverId"] = current_user.id
                step["comments"] = action.comments
                step["actionedAt"] = "2024-01-01T00:00:00Z"
        
        # Check if all approvals complete
        if all(s["status"] == "APPROVED" for s in rfq.approvalChain):
            rfq.status = "APPROVED"
        
        return ApiResponse(data=rfq)
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Approval failed", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Approval failed"
        )


@router.post("/{rfq_id}/reject", response_model=ApiResponse[RFQ])
async def reject_rfq(
    rfq_id: str,
    action: ApprovalAction,
    current_user: User = Depends(get_current_active_user),
):
    """Reject an RFQ at a specific approval step."""
    try:
        logger.info("Rejecting RFQ", rfq_id=rfq_id, step=action.step)
        
        rfq = next((r for r in MOCK_RFQS if r.id == rfq_id), None)
        
        if not rfq:
            raise HTTPException(status_code=404, detail="RFQ not found")
        
        # Update approval step
        for step in rfq.approvalChain:
            if step["step"] == action.step:
                step["status"] = "REJECTED"
                step["approverId"] = current_user.id
                step["comments"] = action.comments
                step["actionedAt"] = "2024-01-01T00:00:00Z"
        
        rfq.status = "CANCELLED"
        
        return ApiResponse(data=rfq)
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Rejection failed", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Rejection failed"
        )


@router.post("/{rfq_id}/award", response_model=ApiResponse[RFQ])
async def award_rfq(
    rfq_id: str,
    action: AwardAction,
    current_user: User = Depends(get_current_active_user),
):
    """Award an RFQ to a vendor."""
    try:
        logger.info("Awarding RFQ", rfq_id=rfq_id, quote_id=action.quote_id)
        
        rfq = next((r for r in MOCK_RFQS if r.id == rfq_id), None)
        
        if not rfq:
            raise HTTPException(status_code=404, detail="RFQ not found")
        
        # Update quote status
        for quote in rfq.quotes:
            if quote["id"] == action.quote_id:
                quote["status"] = "ACCEPTED"
            else:
                quote["status"] = "REJECTED"
        
        rfq.status = "AWARDED"
        
        return ApiResponse(data=rfq)
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Award failed", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Award failed"
        )
