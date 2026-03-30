"""Quotes router."""

from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, Query, HTTPException, status

from ..models.quotes import Quote, QuoteCreate, QuoteUpdate, QuoteItem
from ..models.common import ApiResponse, PaginatedResponse
from ..routers.auth import get_current_active_user
from ..models.auth import User


router = APIRouter()


# Mock quotes
MOCK_QUOTES = [
    Quote(
        id="1",
        quote_number="QTE-2024-001",
        rfq_id="1",
        supplier_id="sup-1",
        supplier_name="Premium Poultry Farms",
        items=[
            QuoteItem(
                id="qitem-1",
                rfq_item_id="item-1",
                ingredient_id="1",
                ingredient_name="Organic Chicken Breast",
                unit_price=8.50,
                quantity=50,
                unit_of_measure="lb",
                line_total=425.00,
                available_quantity=100,
                is_substitute=False,
            ),
        ],
        subtotal=425.00,
        tax_amount=35.06,
        shipping_cost=25.00,
        total=485.06,
        payment_terms="Net 30",
        lead_time=2,
        validity_date=datetime.utcnow() + datetime.timedelta(days=7),
        delivery_date=datetime.utcnow() + datetime.timedelta(days=5),
        status="submitted",
        is_selected=False,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
    ),
]


@router.get("", response_model=ApiResponse[PaginatedResponse[Quote]])
async def list_quotes(
    rfq_id: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_active_user),
):
    """List all quotes."""
    filtered = MOCK_QUOTES.copy()
    
    if rfq_id:
        filtered = [q for q in filtered if q.rfq_id == rfq_id]
    
    if status:
        filtered = [q for q in filtered if q.status == status]
    
    total = len(filtered)
    start = (page - 1) * limit
    end = start + limit
    paginated = filtered[start:end]
    
    return ApiResponse(
        success=True,
        data=PaginatedResponse(
            data=paginated,
            pagination={
                "page": page,
                "limit": limit,
                "total": total,
                "total_pages": (total + limit - 1) // limit,
                "has_next": end < total,
                "has_prev": page > 1,
            },
        ),
        meta={"timestamp": datetime.utcnow().isoformat(), "request_id": "req-1"},
    )


@router.get("/{quote_id}", response_model=ApiResponse[Quote])
async def get_quote(
    quote_id: str,
    current_user: User = Depends(get_current_active_user),
):
    """Get a single quote by ID."""
    quote = next((q for q in MOCK_QUOTES if q.id == quote_id), None)
    
    if not quote:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Quote not found",
        )
    
    return ApiResponse(
        success=True,
        data=quote,
        meta={"timestamp": datetime.utcnow().isoformat(), "request_id": "req-1"},
    )


@router.post("", response_model=ApiResponse[Quote])
async def create_quote(
    quote_data: QuoteCreate,
    current_user: User = Depends(get_current_active_user),
):
    """Submit a new quote."""
    quote_number = f"QTE-{datetime.utcnow().strftime('%Y%m%d')}-{len(MOCK_QUOTES) + 1:03d}"
    
    # Calculate totals
    subtotal = sum(item.unit_price * item.quantity for item in quote_data.items)
    total = subtotal + quote_data.tax_amount + quote_data.shipping_cost
    
    quote = Quote(
        id=f"quote-{datetime.utcnow().timestamp()}",
        quote_number=quote_number,
        supplier_id=current_user.id,
        supplier_name=current_user.organization_name,
        items=[QuoteItem(id=f"qitem-{i}", **item.model_dump()) for i, item in enumerate(quote_data.items)],
        subtotal=subtotal,
        total=total,
        status="submitted",
        is_selected=False,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
        **quote_data.model_dump(exclude={"items"}),
    )
    
    MOCK_QUOTES.append(quote)
    
    return ApiResponse(
        success=True,
        data=quote,
        meta={"timestamp": datetime.utcnow().isoformat(), "request_id": "req-1"},
    )


@router.post("/{quote_id}/accept", response_model=ApiResponse[Quote])
async def accept_quote(
    quote_id: str,
    current_user: User = Depends(get_current_active_user),
):
    """Accept a quote and create an order."""
    quote = next((q for q in MOCK_QUOTES if q.id == quote_id), None)
    
    if not quote:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Quote not found",
        )
    
    if quote.status != "submitted":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only submitted quotes can be accepted",
        )
    
    quote.status = "accepted"
    quote.is_selected = True
    quote.selected_at = datetime.utcnow()
    quote.updated_at = datetime.utcnow()
    
    # In production, create an order from the quote
    
    return ApiResponse(
        success=True,
        data=quote,
        meta={"timestamp": datetime.utcnow().isoformat(), "request_id": "req-1"},
    )


@router.post("/{quote_id}/reject", response_model=ApiResponse[Quote])
async def reject_quote(
    quote_id: str,
    current_user: User = Depends(get_current_active_user),
):
    """Reject a quote."""
    quote = next((q for q in MOCK_QUOTES if q.id == quote_id), None)
    
    if not quote:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Quote not found",
        )
    
    quote.status = "rejected"
    quote.updated_at = datetime.utcnow()
    
    return ApiResponse(
        success=True,
        data=quote,
        meta={"timestamp": datetime.utcnow().isoformat(), "request_id": "req-1"},
    )
