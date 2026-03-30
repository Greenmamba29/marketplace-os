"""Quotes router."""

from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status

from config import get_settings, QuoteStatus
from models.quote import Quote, QuoteCreate, QuoteSummary
from models.common import APIResponse, PaginatedResponse
from models.user import User
from routers.auth import get_current_user, get_baserow_service
from services.baserow import BaserowService, BaserowError

router = APIRouter()


@router.get("", response_model=APIResponse[PaginatedResponse[QuoteSummary]])
async def list_quotes(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=50),
    status: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    baserow_service: BaserowService = Depends(get_baserow_service),
):
    """List quotes for the current user."""
    settings = get_settings()
    
    if not settings.BASEROW_QUOTES_TABLE_ID:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Quotes service unavailable",
        )
    
    filters = {"buyer_id": current_user.id}
    if status:
        filters["status"] = status
    
    try:
        result = await baserow_service.list_rows(
            settings.BASEROW_QUOTES_TABLE_ID,
            filters=filters,
            page=page,
            size=page_size,
            order_by="-created_at",
        )
    except BaserowError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch quotes: {str(e)}",
        )
    
    quotes = [QuoteSummary(**item) for item in result.get("results", [])]
    total = result.get("count", 0)
    
    return APIResponse.success_response(
        PaginatedResponse.create(quotes, total, page, page_size)
    )


@router.get("/{quote_id}", response_model=APIResponse[Quote])
async def get_quote(
    quote_id: str,
    current_user: User = Depends(get_current_user),
    baserow_service: BaserowService = Depends(get_baserow_service),
):
    """Get a specific quote."""
    settings = get_settings()
    
    if not settings.BASEROW_QUOTES_TABLE_ID:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Quotes service unavailable",
        )
    
    try:
        quote_data = await baserow_service.get_row(
            settings.BASEROW_QUOTES_TABLE_ID,
            quote_id
        )
    except BaserowError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Quote not found",
        )
    
    # Check ownership
    if quote_data.get("buyer_id") != current_user.id and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied",
        )
    
    return APIResponse.success_response(Quote(**quote_data))


@router.post("/{quote_id}/accept")
async def accept_quote(
    quote_id: str,
    current_user: User = Depends(get_current_user),
    baserow_service: BaserowService = Depends(get_baserow_service),
):
    """Accept a quote and create an order."""
    settings = get_settings()
    
    if not settings.BASEROW_QUOTES_TABLE_ID:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Quotes service unavailable",
        )
    
    # Get quote
    try:
        quote = await baserow_service.get_row(
            settings.BASEROW_QUOTES_TABLE_ID,
            quote_id
        )
    except BaserowError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Quote not found",
        )
    
    # Check ownership
    if quote.get("buyer_id") != current_user.id and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied",
        )
    
    # Update quote status
    try:
        await baserow_service.update_row(
            settings.BASEROW_QUOTES_TABLE_ID,
            quote_id,
            {"status": QuoteStatus.ACCEPTED}
        )
    except BaserowError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to accept quote: {str(e)}",
        )
    
    # Create order (would be implemented with orders service)
    order_id = f"ord-{quote_id}"
    
    return APIResponse.success_response({
        "order_id": order_id,
        "message": "Quote accepted. Order created successfully.",
    })


@router.post("/{quote_id}/reject")
async def reject_quote(
    quote_id: str,
    current_user: User = Depends(get_current_user),
    baserow_service: BaserowService = Depends(get_baserow_service),
):
    """Reject a quote."""
    settings = get_settings()
    
    if not settings.BASEROW_QUOTES_TABLE_ID:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Quotes service unavailable",
        )
    
    # Get quote
    try:
        quote = await baserow_service.get_row(
            settings.BASEROW_QUOTES_TABLE_ID,
            quote_id
        )
    except BaserowError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Quote not found",
        )
    
    # Check ownership
    if quote.get("buyer_id") != current_user.id and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied",
        )
    
    # Update quote status
    try:
        await baserow_service.update_row(
            settings.BASEROW_QUOTES_TABLE_ID,
            quote_id,
            {"status": QuoteStatus.REJECTED}
        )
    except BaserowError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to reject quote: {str(e)}",
        )
    
    return APIResponse.success_response({"message": "Quote rejected successfully"})
