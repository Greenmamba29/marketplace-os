"""Quote router."""

from fastapi import APIRouter, Depends, HTTPException, status

from ..models.auth import User, get_current_active_user
from ..models.rfq import Quote, QuoteCreate
from ..services.baserow import BaserowService

router = APIRouter()


@router.get("/{quote_id}", response_model=dict)
async def get_quote(
    quote_id: str,
    current_user: User = Depends(get_current_active_user),
):
    """Get quote by ID."""
    baserow = BaserowService()
    quote = await baserow.get_quote_by_id(quote_id)
    
    if not quote:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Quote not found",
        )
    
    return {
        "success": True,
        "data": quote,
    }


@router.post("/rfq/{rfq_id}", response_model=dict, status_code=status.HTTP_201_CREATED)
async def submit_quote(
    rfq_id: str,
    quote: QuoteCreate,
    current_user: User = Depends(get_current_active_user),
):
    """Submit a quote for an RFQ (supplier only)."""
    if current_user.role != "supplier":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only suppliers can submit quotes",
        )
    
    baserow = BaserowService()
    
    # Get RFQ
    rfq = await baserow.get_rfq_by_id(rfq_id)
    if not rfq:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="RFQ not found",
        )
    
    # Check RFQ status
    if rfq.get("status") not in ["approved", "sent_to_suppliers"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="RFQ is not accepting quotes",
        )
    
    # Generate quote number
    import uuid
    quote_number = f"QT-{uuid.uuid4().hex[:8].upper()}"
    
    quote_data = quote.model_dump()
    quote_data.update({
        "quote_number": quote_number,
        "rfq_id": rfq_id,
        "supplier_id": current_user.id,
        "status": "submitted",
    })
    
    created = await baserow.create_quote(quote_data)
    
    # Update RFQ status if first quote
    existing_quotes = await baserow.get_rfq_quotes(rfq_id)
    if len(existing_quotes) == 1:
        await baserow.update_rfq(rfq_id, {"status": "quotes_received"})
    
    return {
        "success": True,
        "data": created,
    }


@router.post("/{quote_id}/accept", response_model=dict)
async def accept_quote(
    quote_id: str,
    current_user: User = Depends(get_current_active_user),
):
    """Accept a quote."""
    baserow = BaserowService()
    
    quote = await baserow.get_quote_by_id(quote_id)
    if not quote:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Quote not found",
        )
    
    # Get RFQ to check authorization
    rfq = await baserow.get_rfq_by_id(quote.get("rfq_id"))
    if rfq.get("requester_id") != current_user.id and current_user.role != "system_admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to accept this quote",
        )
    
    updated = await baserow.update_quote(quote_id, {"status": "accepted"})
    
    # Update RFQ
    await baserow.update_rfq(quote.get("rfq_id"), {
        "selected_quote_id": quote_id,
        "status": "awarded",
    })
    
    return {
        "success": True,
        "data": updated,
    }


@router.post("/{quote_id}/reject", response_model=dict)
async def reject_quote(
    quote_id: str,
    data: dict,
    current_user: User = Depends(get_current_active_user),
):
    """Reject a quote."""
    baserow = BaserowService()
    
    quote = await baserow.get_quote_by_id(quote_id)
    if not quote:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Quote not found",
        )
    
    # Get RFQ to check authorization
    rfq = await baserow.get_rfq_by_id(quote.get("rfq_id"))
    if rfq.get("requester_id") != current_user.id and current_user.role != "system_admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to reject this quote",
        )
    
    updated = await baserow.update_quote(quote_id, {
        "status": "rejected",
        "rejection_reason": data.get("reason"),
    })
    
    return {
        "success": True,
        "data": updated,
    }
