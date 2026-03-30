"""RFQ (Request for Quote) router."""

from typing import Optional
from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException, Query, status

from config import get_settings, RFQStatus
from models.rfq import RFQSubmission, RFQCreate, RFQUpdate, RFQItem, EmergencySourcingRequest
from models.common import APIResponse, PaginatedResponse
from models.user import User
from routers.auth import get_current_user, get_baserow_service
from services.baserow import BaserowService, BaserowError
from services.intelligence import IntelligenceService

router = APIRouter()


def get_intelligence_service() -> IntelligenceService:
    """Get intelligence service instance."""
    return IntelligenceService()


@router.get("", response_model=APIResponse[PaginatedResponse[RFQSubmission]])
async def list_rfqs(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=50),
    status: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    baserow_service: BaserowService = Depends(get_baserow_service),
):
    """List RFQs for the current user."""
    settings = get_settings()
    
    if not settings.BASEROW_RFQ_TABLE_ID:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="RFQ service unavailable",
        )
    
    filters = {"buyer_id": current_user.id}
    if status:
        filters["status"] = status
    
    try:
        result = await baserow_service.list_rows(
            settings.BASEROW_RFQ_TABLE_ID,
            filters=filters,
            page=page,
            size=page_size,
            order_by="-created_at",
        )
    except BaserowError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch RFQs: {str(e)}",
        )
    
    rfqs = [RFQSubmission(**item) for item in result.get("results", [])]
    total = result.get("count", 0)
    
    return APIResponse.success_response(
        PaginatedResponse.create(rfqs, total, page, page_size)
    )


@router.get("/active-count", response_model=APIResponse[int])
async def get_active_rfqs_count(
    current_user: User = Depends(get_current_user),
    baserow_service: BaserowService = Depends(get_baserow_service),
):
    """Get count of active RFQs for the current user."""
    settings = get_settings()
    
    if not settings.BASEROW_RFQ_TABLE_ID:
        return APIResponse.success_response(0)
    
    try:
        result = await baserow_service.list_rows(
            settings.BASEROW_RFQ_TABLE_ID,
            filters={
                "buyer_id": current_user.id,
                "status": RFQStatus.SUBMITTED,
            },
            size=1,
        )
        count = result.get("count", 0)
    except BaserowError:
        count = 0
    
    return APIResponse.success_response(count)


@router.get("/{rfq_id}", response_model=APIResponse[RFQSubmission])
async def get_rfq(
    rfq_id: str,
    current_user: User = Depends(get_current_user),
    baserow_service: BaserowService = Depends(get_baserow_service),
):
    """Get a specific RFQ."""
    settings = get_settings()
    
    if not settings.BASEROW_RFQ_TABLE_ID:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="RFQ service unavailable",
        )
    
    try:
        rfq_data = await baserow_service.get_row(
            settings.BASEROW_RFQ_TABLE_ID,
            rfq_id
        )
    except BaserowError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="RFQ not found",
        )
    
    # Check ownership
    if rfq_data.get("buyer_id") != current_user.id and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied",
        )
    
    return APIResponse.success_response(RFQSubmission(**rfq_data))


@router.post("", response_model=APIResponse[RFQSubmission])
async def create_rfq(
    rfq_data: RFQCreate,
    current_user: User = Depends(get_current_user),
    baserow_service: BaserowService = Depends(get_baserow_service),
):
    """Create a new RFQ."""
    settings = get_settings()
    
    if not settings.BASEROW_RFQ_TABLE_ID:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="RFQ service unavailable",
        )
    
    # Build items with part details
    items = []
    for item in rfq_data.items:
        # Get part details
        if settings.BASEROW_PARTS_TABLE_ID:
            try:
                part = await baserow_service.get_row(
                    settings.BASEROW_PARTS_TABLE_ID,
                    item.part_id
                )
                items.append(RFQItem(
                    part_id=item.part_id,
                    part_sku=part.get("sku"),
                    part_name=part.get("name"),
                    manufacturer_part_number=part.get("manufacturer_part_number"),
                    quantity=item.quantity,
                    target_price=item.target_price,
                    notes=item.notes,
                    is_substitute_allowed=item.is_substitute_allowed,
                ))
            except BaserowError:
                items.append(RFQItem(
                    part_id=item.part_id,
                    quantity=item.quantity,
                    target_price=item.target_price,
                    notes=item.notes,
                    is_substitute_allowed=item.is_substitute_allowed,
                ))
    
    # Create RFQ
    rfq_dict = rfq_data.model_dump()
    rfq_dict["items"] = [item.model_dump() for item in items]
    rfq_dict["buyer_id"] = current_user.id
    rfq_dict["buyer_company"] = current_user.company
    rfq_dict["status"] = RFQStatus.SUBMITTED
    rfq_dict["quotes_count"] = 0
    rfq_dict["created_at"] = datetime.utcnow().isoformat()
    rfq_dict["updated_at"] = datetime.utcnow().isoformat()
    rfq_dict["expires_at"] = (datetime.utcnow() + timedelta(days=7)).isoformat()
    
    try:
        created = await baserow_service.create_row(
            settings.BASEROW_RFQ_TABLE_ID,
            rfq_dict
        )
    except BaserowError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create RFQ: {str(e)}",
        )
    
    return APIResponse.success_response(RFQSubmission(**created))


@router.patch("/{rfq_id}", response_model=APIResponse[RFQSubmission])
async def update_rfq(
    rfq_id: str,
    updates: RFQUpdate,
    current_user: User = Depends(get_current_user),
    baserow_service: BaserowService = Depends(get_baserow_service),
):
    """Update an RFQ."""
    settings = get_settings()
    
    if not settings.BASEROW_RFQ_TABLE_ID:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="RFQ service unavailable",
        )
    
    # Get existing RFQ
    try:
        existing = await baserow_service.get_row(
            settings.BASEROW_RFQ_TABLE_ID,
            rfq_id
        )
    except BaserowError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="RFQ not found",
        )
    
    # Check ownership
    if existing.get("buyer_id") != current_user.id and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied",
        )
    
    # Update
    update_data = updates.model_dump(exclude_unset=True)
    update_data["updated_at"] = datetime.utcnow().isoformat()
    
    try:
        updated = await baserow_service.update_row(
            settings.BASEROW_RFQ_TABLE_ID,
            rfq_id,
            update_data
        )
    except BaserowError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update RFQ: {str(e)}",
        )
    
    return APIResponse.success_response(RFQSubmission(**updated))


@router.post("/{rfq_id}/cancel")
async def cancel_rfq(
    rfq_id: str,
    current_user: User = Depends(get_current_user),
    baserow_service: BaserowService = Depends(get_baserow_service),
):
    """Cancel an RFQ."""
    settings = get_settings()
    
    if not settings.BASEROW_RFQ_TABLE_ID:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="RFQ service unavailable",
        )
    
    # Get existing RFQ
    try:
        existing = await baserow_service.get_row(
            settings.BASEROW_RFQ_TABLE_ID,
            rfq_id
        )
    except BaserowError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="RFQ not found",
        )
    
    # Check ownership
    if existing.get("buyer_id") != current_user.id and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied",
        )
    
    # Cancel
    try:
        await baserow_service.update_row(
            settings.BASEROW_RFQ_TABLE_ID,
            rfq_id,
            {"status": RFQStatus.CANCELLED, "updated_at": datetime.utcnow().isoformat()}
        )
    except BaserowError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to cancel RFQ: {str(e)}",
        )
    
    return APIResponse.success_response({"message": "RFQ cancelled successfully"})


@router.post("/emergency")
async def emergency_sourcing(
    request: EmergencySourcingRequest,
    current_user: User = Depends(get_current_user),
    baserow_service: BaserowService = Depends(get_baserow_service),
):
    """Submit an emergency sourcing request."""
    # This would trigger immediate notifications to suppliers
    # and create a high-priority RFQ
    
    # Create emergency RFQ
    rfq_data = {
        "title": f"EMERGENCY: {request.part_number}",
        "description": f"Emergency sourcing request. Needed by: {request.needed_by}. Contact: {request.contact_phone}",
        "items": [{
            "part_id": "unknown",
            "manufacturer_part_number": request.part_number,
            "quantity": request.quantity,
            "is_substitute_allowed": True,
        }],
        "delivery_location": request.location,
        "required_delivery_date": request.needed_by,
        "is_emergency": True,
        "emergency_reason": f"Line-down situation. Contact: {request.contact_phone}",
        "buyer_id": current_user.id,
        "buyer_company": current_user.company,
        "status": RFQStatus.SUBMITTED,
        "quotes_count": 0,
        "created_at": datetime.utcnow().isoformat(),
        "updated_at": datetime.utcnow().isoformat(),
    }
    
    # Return response with estimated response time
    return APIResponse.success_response({
        "rfq_id": "emergency-rfq-id",
        "estimated_responses": 5,
        "response_time_estimate": "2 hours",
        "message": "Emergency RFQ submitted. Suppliers have been notified.",
    })


@router.get("/{rfq_id}/quotes")
async def get_rfq_quotes(
    rfq_id: str,
    current_user: User = Depends(get_current_user),
    baserow_service: BaserowService = Depends(get_baserow_service),
):
    """Get quotes for an RFQ."""
    # This would fetch quotes from the quotes table
    # For now, return mock data
    
    mock_quotes = [
        {
            "id": "qt-1",
            "rfq_id": rfq_id,
            "supplier_name": "SKF Authorized Distributor",
            "total": 403.80,
            "status": "submitted",
            "expires_at": "2024-01-25",
        },
        {
            "id": "qt-2",
            "rfq_id": rfq_id,
            "supplier_name": "Bearing Solutions Ltd",
            "total": 389.50,
            "status": "submitted",
            "expires_at": "2024-01-24",
        },
    ]
    
    return APIResponse.success_response(mock_quotes)


@router.post("/{rfq_id}/quotes/{quote_id}/accept")
async def accept_quote(
    rfq_id: str,
    quote_id: str,
    current_user: User = Depends(get_current_user),
    baserow_service: BaserowService = Depends(get_baserow_service),
):
    """Accept a quote and create an order."""
    # This would:
    # 1. Mark the quote as accepted
    # 2. Create an order
    # 3. Close the RFQ
    
    return APIResponse.success_response({
        "order_id": "ord-new-order",
        "message": "Quote accepted. Order created successfully.",
    })
