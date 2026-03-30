"""Quotes router."""

from datetime import datetime, timedelta
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from fastapi.security import HTTPBearer

from models.quotes import (
    Quote,
    QuoteCreate,
    QuoteUpdate,
    QuoteResponse,
    QuoteComparison,
)
from models.common import ApiResponse, PaginatedResponse
from services.baserow import get_baserow_service

router = APIRouter(prefix="/quotes", tags=["Quotes"])
security = HTTPBearer()


def generate_quote_number() -> str:
    """Generate a unique quote number."""
    timestamp = datetime.utcnow().strftime("%Y%m%d")
    return f"Q-{timestamp}-001"


@router.get("", response_model=ApiResponse[PaginatedResponse[QuoteResponse]])
async def list_quotes(
    rfq_id: Optional[str] = None,
    supplier_id: Optional[str] = None,
    status: Optional[str] = None,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    baserow=Depends(get_baserow_service),
) -> ApiResponse[PaginatedResponse[QuoteResponse]]:
    """List quotes with filters."""
    filters = {}
    if rfq_id:
        filters["rfq_id"] = rfq_id
    if supplier_id:
        filters["supplier_id"] = supplier_id
    if status:
        filters["status"] = status
    
    result = await baserow.list_rows(
        "quotes",
        filters=filters if filters else None,
        page=page,
        size=page_size,
    )
    
    quotes = [QuoteResponse(**item) for item in result.get("results", [])]
    total = result.get("count", 0)
    
    return ApiResponse.success_response(
        PaginatedResponse.create(
            items=quotes,
            total=total,
            page=page,
            page_size=page_size,
        )
    )


@router.post("", response_model=ApiResponse[QuoteResponse])
async def create_quote(
    quote: QuoteCreate,
    baserow=Depends(get_baserow_service),
) -> ApiResponse[QuoteResponse]:
    """Create a new quote."""
    # Calculate totals
    items = quote.items
    subtotal = sum(item.quantity * item.unit_price for item in items)
    tax_amount = subtotal * 0.08  # 8% tax (configurable)
    total_price = subtotal + tax_amount + quote.delivery_fee
    
    # Calculate validity
    valid_until = datetime.utcnow() + timedelta(days=quote.validity_days)
    
    # Create quote
    quote_data = quote.model_dump()
    quote_data["quote_number"] = generate_quote_number()
    quote_data["subtotal"] = subtotal
    quote_data["tax_amount"] = tax_amount
    quote_data["total_price"] = total_price
    quote_data["valid_until"] = valid_until.isoformat()
    quote_data["status"] = "draft"
    quote_data["is_lowest"] = False
    
    # Remove items from quote data
    items_data = quote_data.pop("items", [])
    
    created = await baserow.create_row("quotes", quote_data)
    quote_id = created.get("id")
    
    # Create quote items
    for item in items_data:
        item["quote_id"] = quote_id
        item["line_total"] = item["quantity"] * item["unit_price"]
        await baserow.create_row("quote_items", item)
    
    return ApiResponse.success_response(
        QuoteResponse(**created),
        message="Quote created successfully",
    )


@router.get("/{quote_id}", response_model=ApiResponse[QuoteResponse])
async def get_quote(
    quote_id: str,
    baserow=Depends(get_baserow_service),
) -> ApiResponse[QuoteResponse]:
    """Get a single quote by ID."""
    quote = await baserow.get_row("quotes", quote_id)
    if not quote:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Quote not found",
        )
    
    # Get quote items
    items_result = await baserow.list_rows(
        "quote_items",
        filters={"quote_id": quote_id},
    )
    quote["items"] = items_result.get("results", [])
    
    return ApiResponse.success_response(QuoteResponse(**quote))


@router.patch("/{quote_id}", response_model=ApiResponse[QuoteResponse])
async def update_quote(
    quote_id: str,
    update: QuoteUpdate,
    baserow=Depends(get_baserow_service),
) -> ApiResponse[QuoteResponse]:
    """Update a quote."""
    # Check if quote exists
    existing = await baserow.get_row("quotes", quote_id)
    if not existing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Quote not found",
        )
    
    # Can only update draft quotes
    if existing.get("status") != "draft":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Can only update draft quotes",
        )
    
    update_data = update.model_dump(exclude_unset=True)
    
    # Recalculate totals if items changed
    if "items" in update_data:
        items = update_data["items"]
        subtotal = sum(item["quantity"] * item["unit_price"] for item in items)
        tax_amount = subtotal * 0.08
        delivery_fee = update_data.get("delivery_fee", existing.get("delivery_fee", 0))
        total_price = subtotal + tax_amount + delivery_fee
        
        update_data["subtotal"] = subtotal
        update_data["tax_amount"] = tax_amount
        update_data["total_price"] = total_price
        
        # Update items
        # First delete existing items
        existing_items = await baserow.list_rows(
            "quote_items",
            filters={"quote_id": quote_id},
        )
        for item in existing_items.get("results", []):
            await baserow.delete_row("quote_items", item.get("id"))
        
        # Create new items
        for item in items:
            item["quote_id"] = quote_id
            item["line_total"] = item["quantity"] * item["unit_price"]
            await baserow.create_row("quote_items", item)
        
        del update_data["items"]
    
    updated = await baserow.update_row("quotes", quote_id, update_data)
    
    return ApiResponse.success_response(QuoteResponse(**updated))


@router.post("/{quote_id}/submit", response_model=ApiResponse[QuoteResponse])
async def submit_quote(
    quote_id: str,
    baserow=Depends(get_baserow_service),
) -> ApiResponse[QuoteResponse]:
    """Submit a quote for review."""
    # Check if quote exists
    existing = await baserow.get_row("quotes", quote_id)
    if not existing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Quote not found",
        )
    
    # Can only submit draft quotes
    if existing.get("status") != "draft":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Quote is not in draft status",
        )
    
    updated = await baserow.update_row(
        "quotes",
        quote_id,
        {"status": "submitted"},
    )
    
    # Update RFQ quotes received count
    rfq_id = existing.get("rfq_id")
    if rfq_id:
        rfq = await baserow.get_row("rfq_submissions", rfq_id)
        if rfq:
            current_count = rfq.get("quotes_received", 0)
            await baserow.update_row(
                "rfq_submissions",
                rfq_id,
                {"quotes_received": current_count + 1},
            )
    
    return ApiResponse.success_response(
        QuoteResponse(**updated),
        message="Quote submitted successfully",
    )


@router.post("/{quote_id}/accept", response_model=ApiResponse[dict])
async def accept_quote(
    quote_id: str,
    baserow=Depends(get_baserow_service),
) -> ApiResponse[dict]:
    """Accept a quote."""
    # Check if quote exists
    existing = await baserow.get_row("quotes", quote_id)
    if not existing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Quote not found",
        )
    
    # Can only accept submitted quotes
    if existing.get("status") != "submitted":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Quote must be submitted before acceptance",
        )
    
    await baserow.update_row(
        "quotes",
        quote_id,
        {"status": "accepted"},
    )
    
    # Reject other quotes for this RFQ
    rfq_id = existing.get("rfq_id")
    if rfq_id:
        other_quotes = await baserow.list_rows(
            "quotes",
            filters={"rfq_id": rfq_id},
        )
        for quote in other_quotes.get("results", []):
            if str(quote.get("id")) != quote_id and quote.get("status") == "submitted":
                await baserow.update_row(
                    "quotes",
                    quote.get("id"),
                    {"status": "rejected"},
                )
    
    return ApiResponse.success_response(
        {},
        message="Quote accepted successfully",
    )


@router.post("/{quote_id}/reject", response_model=ApiResponse[dict])
async def reject_quote(
    quote_id: str,
    reason: str,
    baserow=Depends(get_baserow_service),
) -> ApiResponse[dict]:
    """Reject a quote."""
    # Check if quote exists
    existing = await baserow.get_row("quotes", quote_id)
    if not existing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Quote not found",
        )
    
    await baserow.update_row(
        "quotes",
        quote_id,
        {
            "status": "rejected",
            "rejection_reason": reason,
        },
    )
    
    return ApiResponse.success_response(
        {},
        message="Quote rejected",
    )


@router.post("/{quote_id}/withdraw", response_model=ApiResponse[dict])
async def withdraw_quote(
    quote_id: str,
    reason: str,
    baserow=Depends(get_baserow_service),
) -> ApiResponse[dict]:
    """Withdraw a quote (supplier only)."""
    # Check if quote exists
    existing = await baserow.get_row("quotes", quote_id)
    if not existing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Quote not found",
        )
    
    # Can only withdraw submitted quotes
    if existing.get("status") not in ["draft", "submitted"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot withdraw quote in current status",
        )
    
    await baserow.update_row(
        "quotes",
        quote_id,
        {
            "status": "expired",
            "withdrawal_reason": reason,
        },
    )
    
    return ApiResponse.success_response(
        {},
        message="Quote withdrawn",
    )


@router.get("/compare", response_model=ApiResponse[QuoteComparison])
async def compare_quotes(
    rfq_id: str,
    baserow=Depends(get_baserow_service),
) -> ApiResponse[QuoteComparison]:
    """Compare quotes for an RFQ."""
    # Get all quotes for RFQ
    result = await baserow.list_rows(
        "quotes",
        filters={"rfq_id": rfq_id},
    )
    quotes = result.get("results", [])
    
    if not quotes:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No quotes found for this RFQ",
        )
    
    # Get quote items for comparison
    comparison_matrix = []
    all_items = {}
    
    for quote in quotes:
        items_result = await baserow.list_rows(
            "quote_items",
            filters={"quote_id": quote.get("id")},
        )
        for item in items_result.get("results", []):
            desc = item.get("description")
            if desc not in all_items:
                all_items[desc] = {}
            all_items[desc][quote.get("id")] = item.get("unit_price")
    
    for desc, prices in all_items.items():
        comparison_matrix.append({
            "item_description": desc,
            "prices": prices,
        })
    
    # Calculate savings analysis
    totals = [q.get("total_price", 0) for q in quotes]
    lowest = min(totals)
    highest = max(totals)
    
    savings_analysis = {
        "lowest_total": lowest,
        "highest_total": highest,
        "potential_savings": highest - lowest,
    }
    
    return ApiResponse.success_response(
        QuoteComparison(
            quotes=[Quote(**q) for q in quotes],
            comparison_matrix=comparison_matrix,
            savings_analysis=savings_analysis,
        )
    )
