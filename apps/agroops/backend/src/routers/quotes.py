"""Quotes router."""

from datetime import datetime
from decimal import Decimal
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status

from src.models.auth import User, get_current_active_user
from src.models.quotes import (
    Quote,
    QuoteCreate,
    QuoteUpdate,
    QuoteLineItem,
    QuoteLineItemCreate,
    PaginatedQuotes,
)

router = APIRouter(prefix="/quotes", tags=["Quotes"])


# Mock quotes
MOCK_QUOTES = [
    Quote(
        id="quote_1",
        rfq_id="rfq_1",
        supplier_id="supplier_1",
        supplier_name="AgriSupply LLC",
        supplier_rating=4.8,
        line_items=[
            QuoteLineItem(
                id="line_1",
                rfq_item_id="item_1",
                product_name="Pioneer P1197AM",
                description="Corn seed - 110-day RM",
                quantity=500,
                unit="bag",
                unit_price=Decimal("310.00"),
                line_total=Decimal("155000.00"),
                availability="in_stock",
                lead_time_days=7,
            ),
        ],
        subtotal=Decimal("155000.00"),
        tax_amount=Decimal("0.00"),
        shipping_amount=Decimal("500.00"),
        total_amount=Decimal("155500.00"),
        payment_terms="Net 90",
        delivery_date=datetime(2024, 4, 20),
        delivery_method="Truck",
        valid_until=datetime(2024, 3, 20),
        notes="Free delivery on orders over $100,000",
        status="submitted",
        created_at=datetime(2024, 2, 10),
        updated_at=datetime(2024, 2, 10),
    ),
]


@router.get("", response_model=PaginatedQuotes)
async def list_quotes(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    status: Optional[str] = Query(None),
    my_quotes: Optional[bool] = Query(None),
    current_user: User = Depends(get_current_active_user),
):
    """List quotes."""
    filtered = MOCK_QUOTES.copy()
    
    if status:
        filtered = [q for q in filtered if q.status == status]
    
    if my_quotes:
        # In production, filter by supplier_id
        pass
    
    total = len(filtered)
    start = (page - 1) * per_page
    end = start + per_page
    paginated = filtered[start:end]
    
    return PaginatedQuotes(
        items=paginated,
        total=total,
        page=page,
        per_page=per_page,
        total_pages=(total + per_page - 1) // per_page,
    )


@router.get("/{quote_id}", response_model=Quote)
async def get_quote(
    quote_id: str,
    current_user: User = Depends(get_current_active_user),
):
    """Get quote by ID."""
    for quote in MOCK_QUOTES:
        if quote.id == quote_id:
            return quote
    
    raise HTTPException(status_code=404, detail="Quote not found")


@router.post("/rfq/{rfq_id}", response_model=Quote, status_code=status.HTTP_201_CREATED)
async def submit_quote(
    rfq_id: str,
    quote_data: QuoteCreate,
    current_user: User = Depends(get_current_active_user),
):
    """Submit a quote for an RFQ."""
    # Convert line items
    line_items = [
        QuoteLineItem(
            id=f"line_{i}",
            **item.dict(),
            line_total=item.unit_price * Decimal(str(item.quantity)),
        )
        for i, item in enumerate(quote_data.line_items)
    ]
    
    # Calculate totals
    subtotal = sum(item.line_total for item in line_items)
    total = subtotal + quote_data.tax_amount + quote_data.shipping_amount
    
    new_quote = Quote(
        id=f"quote_{len(MOCK_QUOTES) + 1}",
        rfq_id=rfq_id,
        supplier_id="supplier_current",  # In production, get from current user
        supplier_name="Current Supplier",
        supplier_rating=4.5,
        line_items=line_items,
        subtotal=subtotal,
        tax_amount=quote_data.tax_amount,
        shipping_amount=quote_data.shipping_amount,
        total_amount=total,
        payment_terms=quote_data.payment_terms,
        delivery_date=quote_data.delivery_date,
        delivery_method=quote_data.delivery_method,
        valid_until=quote_data.valid_until,
        notes=quote_data.notes,
        status="submitted",
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
    )
    
    MOCK_QUOTES.append(new_quote)
    return new_quote


@router.patch("/{quote_id}", response_model=Quote)
async def update_quote(
    quote_id: str,
    update_data: QuoteUpdate,
    current_user: User = Depends(get_current_active_user),
):
    """Update a quote."""
    for i, quote in enumerate(MOCK_QUOTES):
        if quote.id == quote_id:
            # Check ownership
            if quote.supplier_id != "supplier_current":  # In production, check properly
                raise HTTPException(status_code=403, detail="Not authorized")
            
            # Update fields
            update_dict = update_data.dict(exclude_unset=True)
            for key, value in update_dict.items():
                setattr(quote, key, value)
            
            quote.updated_at = datetime.utcnow()
            MOCK_QUOTES[i] = quote
            return quote
    
    raise HTTPException(status_code=404, detail="Quote not found")


@router.post("/{quote_id}/withdraw")
async def withdraw_quote(
    quote_id: str,
    current_user: User = Depends(get_current_active_user),
):
    """Withdraw a quote."""
    for quote in MOCK_QUOTES:
        if quote.id == quote_id:
            if quote.supplier_id != "supplier_current":
                raise HTTPException(status_code=403, detail="Not authorized")
            
            if quote.status != "submitted":
                raise HTTPException(status_code=400, detail="Can only withdraw submitted quotes")
            
            quote.status = "expired"
            quote.updated_at = datetime.utcnow()
            return {"message": "Quote withdrawn successfully"}
    
    raise HTTPException(status_code=404, detail="Quote not found")
