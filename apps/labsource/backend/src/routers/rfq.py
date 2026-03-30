"""
RFQ (Request for Quote) Router for LabSource
"""

from typing import Optional
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status

from ..models.rfq import RFQStatus, QuoteStatus
from ..models.common import ApiResponse, PaginationMeta
from ..services.baserow import BaserowService, get_baserow_service
from .auth import get_current_user, get_current_admin

router = APIRouter()


@router.get("", response_model=ApiResponse[list])
async def list_rfqs(
    status: Optional[RFQStatus] = Query(None),
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    baserow: BaserowService = Depends(get_baserow_service),
    current_user = Depends(get_current_user),
):
    """List RFQs for the current user."""
    filters = {"buyer_id": current_user.id}
    
    if status:
        filters["status"] = status.value
    
    rfqs = await baserow.get_rfq_submissions(filters=filters)
    
    # Paginate
    total = len(rfqs)
    start = (page - 1) * per_page
    end = start + per_page
    paginated_rfqs = rfqs[start:end]
    
    total_pages = (total + per_page - 1) // per_page
    
    return ApiResponse.success_response(
        data=paginated_rfqs,
        meta=PaginationMeta(
            page=page,
            per_page=per_page,
            total=total,
            total_pages=total_pages,
        ),
    )


@router.get("/{rfq_id}", response_model=ApiResponse[dict])
async def get_rfq(
    rfq_id: str,
    baserow: BaserowService = Depends(get_baserow_service),
    current_user = Depends(get_current_user),
):
    """Get a single RFQ by ID."""
    try:
        rfq = await baserow.get_row("RFQ_SUBMISSIONS", rfq_id)
        
        # Check ownership
        if rfq.get("buyer_id") != current_user.id and current_user.role != "admin":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to view this RFQ",
            )
        
        return ApiResponse.success_response(rfq)
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"RFQ not found: {rfq_id}",
        )


@router.post("", response_model=ApiResponse[dict])
async def create_rfq(
    rfq_data: dict,
    baserow: BaserowService = Depends(get_baserow_service),
    current_user = Depends(get_current_user),
):
    """Create a new RFQ."""
    # Add buyer ID and timestamps
    rfq_data["buyer_id"] = current_user.id
    rfq_data["status"] = "draft"
    rfq_data["created_at"] = datetime.utcnow().isoformat()
    rfq_data["updated_at"] = datetime.utcnow().isoformat()
    
    result = await baserow.create_rfq(rfq_data)
    
    return ApiResponse.success_response(result)


@router.put("/{rfq_id}", response_model=ApiResponse[dict])
async def update_rfq(
    rfq_id: str,
    rfq_data: dict,
    baserow: BaserowService = Depends(get_baserow_service),
    current_user = Depends(get_current_user),
):
    """Update an existing RFQ."""
    try:
        existing = await baserow.get_row("RFQ_SUBMISSIONS", rfq_id)
        
        # Check ownership
        if existing.get("buyer_id") != current_user.id and current_user.role != "admin":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to update this RFQ",
            )
        
        # Check if RFQ can be updated
        if existing.get("status") not in ["draft", "published"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot update RFQ in current status",
            )
        
        rfq_data["updated_at"] = datetime.utcnow().isoformat()
        
        result = await baserow.update_row("RFQ_SUBMISSIONS", rfq_id, rfq_data)
        return ApiResponse.success_response(result)
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"RFQ not found: {rfq_id}",
        )


@router.post("/{rfq_id}/publish", response_model=ApiResponse[dict])
async def publish_rfq(
    rfq_id: str,
    baserow: BaserowService = Depends(get_baserow_service),
    current_user = Depends(get_current_user),
):
    """Publish an RFQ to suppliers."""
    try:
        existing = await baserow.get_row("RFQ_SUBMISSIONS", rfq_id)
        
        # Check ownership
        if existing.get("buyer_id") != current_user.id and current_user.role != "admin":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to publish this RFQ",
            )
        
        # Check if RFQ can be published
        if existing.get("status") != "draft":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Only draft RFQs can be published",
            )
        
        result = await baserow.update_row("RFQ_SUBMISSIONS", rfq_id, {
            "status": "published",
            "published_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat(),
        })
        
        return ApiResponse.success_response({
            "message": "RFQ published successfully",
            "rfq_id": rfq_id,
        })
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"RFQ not found: {rfq_id}",
        )


@router.post("/{rfq_id}/close", response_model=ApiResponse[dict])
async def close_rfq(
    rfq_id: str,
    baserow: BaserowService = Depends(get_baserow_service),
    current_user = Depends(get_current_user),
):
    """Close an RFQ to new quotes."""
    try:
        existing = await baserow.get_row("RFQ_SUBMISSIONS", rfq_id)
        
        # Check ownership
        if existing.get("buyer_id") != current_user.id and current_user.role != "admin":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to close this RFQ",
            )
        
        result = await baserow.update_row("RFQ_SUBMISSIONS", rfq_id, {
            "status": "closed",
            "closed_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat(),
        })
        
        return ApiResponse.success_response({
            "message": "RFQ closed successfully",
            "rfq_id": rfq_id,
        })
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"RFQ not found: {rfq_id}",
        )


@router.get("/{rfq_id}/quotes", response_model=ApiResponse[list])
async def get_rfq_quotes(
    rfq_id: str,
    baserow: BaserowService = Depends(get_baserow_service),
    current_user = Depends(get_current_user),
):
    """Get all quotes for an RFQ."""
    try:
        rfq = await baserow.get_row("RFQ_SUBMISSIONS", rfq_id)
        
        # Check ownership
        if rfq.get("buyer_id") != current_user.id and current_user.role != "admin":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to view quotes for this RFQ",
            )
        
        quotes = rfq.get("quotes", [])
        return ApiResponse.success_response(quotes)
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"RFQ not found: {rfq_id}",
        )


@router.post("/{rfq_id}/quotes", response_model=ApiResponse[dict])
async def submit_quote(
    rfq_id: str,
    quote_data: dict,
    baserow: BaserowService = Depends(get_baserow_service),
    current_user = Depends(get_current_user),
):
    """Submit a quote for an RFQ (supplier only)."""
    # TODO: Implement supplier quote submission
    quote_data["supplier_id"] = current_user.id
    quote_data["status"] = "submitted"
    quote_data["submitted_at"] = datetime.utcnow().isoformat()
    
    return ApiResponse.success_response({
        "message": "Quote submitted successfully",
        "quote_id": "new-quote-id",
    })


@router.post("/{rfq_id}/quotes/{quote_id}/accept", response_model=ApiResponse[dict])
async def accept_quote(
    rfq_id: str,
    quote_id: str,
    baserow: BaserowService = Depends(get_baserow_service),
    current_user = Depends(get_current_user),
):
    """Accept a quote and create an order."""
    try:
        rfq = await baserow.get_row("RFQ_SUBMISSIONS", rfq_id)
        
        # Check ownership
        if rfq.get("buyer_id") != current_user.id and current_user.role != "admin":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to accept quotes for this RFQ",
            )
        
        # Update RFQ status
        await baserow.update_row("RFQ_SUBMISSIONS", rfq_id, {
            "status": "awarded",
            "accepted_quote_id": quote_id,
            "awarded_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat(),
        })
        
        # TODO: Create order from quote
        
        return ApiResponse.success_response({
            "message": "Quote accepted successfully",
            "rfq_id": rfq_id,
            "quote_id": quote_id,
            "order_id": "new-order-id",
        })
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"RFQ not found: {rfq_id}",
        )
