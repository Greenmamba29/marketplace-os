"""Quotes router."""

from datetime import datetime, timedelta
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status

from src.models import ApiResponse, PaginatedResponse, Quote, QuoteCreate
from src.models.rfq import QuoteStatus
from src.routers.auth import get_current_active_user
from src.services.baserow import baserow_service

router = APIRouter(prefix="/quotes", tags=["Quotes"])


def generate_quote_number() -> str:
    """Generate a unique quote number."""
    now = datetime.utcnow()
    return f"QT-{now.year}-{now.strftime('%m%d')}-{now.strftime('%H%M%S')}"


@router.get("", response_model=ApiResponse[PaginatedResponse[Quote]])
async def list_quotes(
    status: Optional[QuoteStatus] = None,
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    current_user: dict = Depends(get_current_active_user),
):
    """List quotes with optional filters."""
    filters = {}
    user_id = str(current_user.get("id"))
    
    # Filter by supplier
    filters["filter__field_supplier_id__equal"] = user_id
    
    if status:
        filters["filter__field_status__equal"] = status.value
    
    result = await baserow_service.get_quotes(
        filters=filters if filters else None,
        page=page,
        size=per_page,
    )
    
    items = result.get("results", [])
    total = result.get("count", 0)
    
    return ApiResponse(
        success=True,
        data=PaginatedResponse(
            items=items,
            total=total,
            page=page,
            per_page=per_page,
            total_pages=(total + per_page - 1) // per_page,
        ),
    )


@router.get("/{quote_id}", response_model=ApiResponse[Quote])
async def get_quote(
    quote_id: str,
    current_user: dict = Depends(get_current_active_user),
):
    """Get a single quote by ID."""
    try:
        quote = await baserow_service.get_row(
            baserow_service.settings.quotes_table_id,
            quote_id,
        )
        
        # Check ownership
        user_id = str(current_user.get("id"))
        if quote.get("supplier_id") != user_id:
            if current_user.get("role") != "admin":
                raise HTTPException(status_code=403, detail="Access denied")
        
        return ApiResponse(success=True, data=quote)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Quote not found",
        )


@router.post("", response_model=ApiResponse[Quote])
async def create_quote(
    quote_data: QuoteCreate,
    current_user: dict = Depends(get_current_active_user),
):
    """Create a new quote (supplier only)."""
    try:
        user_id = str(current_user.get("id"))
        
        # Prepare quote data
        data = quote_data.model_dump()
        data["supplier_id"] = user_id
        data["quote_number"] = generate_quote_number()
        data["status"] = QuoteStatus.PENDING.value
        data["created_at"] = datetime.utcnow().isoformat()
        data["expires_at"] = (datetime.utcnow() + timedelta(days=quote_data.validity_days)).isoformat()
        
        quote = await baserow_service.create_quote(data)
        
        # Update RFQ status
        await baserow_service.update_rfq(
            quote_data.rfq_id,
            {"status": "quoted"},
        )
        
        return ApiResponse(
            success=True,
            data=quote,
            message="Quote submitted successfully",
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to create quote: {str(e)}",
        )


@router.post("/{quote_id}/accept", response_model=ApiResponse[dict])
async def accept_quote(
    quote_id: str,
    current_user: dict = Depends(get_current_active_user),
):
    """Accept a quote (buyer only)."""
    try:
        quote = await baserow_service.get_row(
            baserow_service.settings.quotes_table_id,
            quote_id,
        )
        
        # Get the RFQ to check ownership
        rfq = await baserow_service.get_row(
            baserow_service.settings.rfq_table_id,
            quote.get("rfq_id"),
        )
        
        user_id = str(current_user.get("id"))
        if rfq.get("buyer_id") != user_id:
            if current_user.get("role") != "admin":
                raise HTTPException(status_code=403, detail="Access denied")
        
        # Update quote status
        await baserow_service.update_quote(
            quote_id,
            {"status": QuoteStatus.ACCEPTED.value},
        )
        
        # Update RFQ status
        await baserow_service.update_rfq(
            quote.get("rfq_id"),
            {"status": "accepted"},
        )
        
        # TODO: Create order from quote
        
        return ApiResponse(
            success=True,
            message="Quote accepted successfully",
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to accept quote: {str(e)}",
        )


@router.post("/{quote_id}/reject", response_model=ApiResponse[dict])
async def reject_quote(
    quote_id: str,
    reason: Optional[str] = None,
    current_user: dict = Depends(get_current_active_user),
):
    """Reject a quote (buyer only)."""
    try:
        quote = await baserow_service.get_row(
            baserow_service.settings.quotes_table_id,
            quote_id,
        )
        
        # Get the RFQ to check ownership
        rfq = await baserow_service.get_row(
            baserow_service.settings.rfq_table_id,
            quote.get("rfq_id"),
        )
        
        user_id = str(current_user.get("id"))
        if rfq.get("buyer_id") != user_id:
            if current_user.get("role") != "admin":
                raise HTTPException(status_code=403, detail="Access denied")
        
        # Update quote status
        await baserow_service.update_quote(
            quote_id,
            {
                "status": QuoteStatus.REJECTED.value,
                "rejection_reason": reason,
            },
        )
        
        return ApiResponse(
            success=True,
            message="Quote rejected successfully",
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to reject quote: {str(e)}",
        )
