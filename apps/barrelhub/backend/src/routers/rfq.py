"""RFQ (Request for Quote) router."""

from datetime import datetime, timedelta
from decimal import Decimal
from typing import List, Optional

from fastapi import APIRouter, HTTPException, Query, status

from ..models.rfq import (
    RFQ,
    RFQCreate,
    RFQUpdate,
    Quote,
    QuoteCreate,
    Order,
    OrderCreate,
    RFQStatus,
    QuoteStatus,
    OrderStatus,
    AgePreference,
    ProofRequirements,
    BudgetRange,
)
from ..models.barrel import SpiritType

router = APIRouter()


# Mock RFQs
MOCK_RFQS = [
    RFQ(
        id="rfq-001",
        rfq_number="RFQ-2024-0001",
        buyer_id="buyer-001",
        buyer_company="Heritage Blending Co.",
        status=RFQStatus.SUBMITTED,
        spirit_type=SpiritType.BOURBON,
        age_preference=AgePreference(min_age=6, max_age=10),
        proof_requirements=ProofRequirements(min_proof=Decimal("100"), max_proof=Decimal("120")),
        volume_required=Decimal("5000"),
        delivery_timeline="3-6 months",
        budget_range=BudgetRange(min=Decimal("15.00"), max=Decimal("25.00")),
        special_requirements="Prefer barrels from Kentucky distilleries",
        ttb_compliance_required=True,
        sensory_preferences="High vanilla, moderate oak",
        submitted_at=datetime.now() - timedelta(days=2),
        expires_at=datetime.now() + timedelta(days=28),
        created_at=datetime.now() - timedelta(days=2),
        updated_at=datetime.now(),
    ),
    RFQ(
        id="rfq-002",
        rfq_number="RFQ-2024-0002",
        buyer_id="buyer-002",
        buyer_company="Craft Spirits Exchange",
        status=RFQStatus.QUOTED,
        spirit_type=SpiritType.RYE,
        age_preference=AgePreference(min_age=4, max_age=8),
        proof_requirements=ProofRequirements(min_proof=Decimal("90"), max_proof=Decimal("115")),
        volume_required=Decimal("3000"),
        delivery_timeline="1-3 months",
        budget_range=BudgetRange(min=Decimal("14.00"), max=Decimal("20.00")),
        special_requirements=None,
        ttb_compliance_required=True,
        sensory_preferences="Spicy profile preferred",
        submitted_at=datetime.now() - timedelta(days=5),
        expires_at=datetime.now() + timedelta(days=25),
        created_at=datetime.now() - timedelta(days=5),
        updated_at=datetime.now(),
    ),
]

# Mock Quotes
MOCK_QUOTES = [
    Quote(
        id="quote-001",
        quote_number="Q-2024-0001",
        rfq_id="rfq-002",
        supplier_id="supplier-001",
        supplier_name="Kentucky Reserve Distillery",
        barrel_ids=["barrel-002"],
        price_per_proof_gallon=Decimal("17.50"),
        total_price=Decimal("52500.00"),
        delivery_terms="FOB Warehouse",
        payment_terms="Net 30",
        validity_period=14,
        status=QuoteStatus.PENDING,
        notes="Premium rye barrels available immediately",
        submitted_at=datetime.now() - timedelta(days=1),
        expires_at=datetime.now() + timedelta(days=13),
        created_at=datetime.now() - timedelta(days=1),
        updated_at=datetime.now(),
    ),
]

# Mock Orders
MOCK_ORDERS = [
    Order(
        id="order-001",
        order_number="ORD-2024-0001",
        quote_id="quote-001",
        buyer_id="buyer-002",
        supplier_id="supplier-001",
        barrel_ids=["barrel-002"],
        total_volume=Decimal("3000"),
        total_price=Decimal("52500.00"),
        status=OrderStatus.CONFIRMED,
        shipping_address="123 Distillery Row, Louisville, KY 40202",
        tracking_number="TRK123456789",
        carrier="Freight Partners LLC",
        estimated_delivery=datetime.now().date() + timedelta(days=14),
        created_at=datetime.now() - timedelta(days=3),
        updated_at=datetime.now(),
    ),
]


@router.get("", response_model=dict)
async def list_rfqs(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    status: Optional[RFQStatus] = None,
    buyer_id: Optional[str] = None,
):
    """List RFQs with filtering."""
    filtered = MOCK_RFQS.copy()
    
    if status:
        filtered = [r for r in filtered if r.status == status]
    
    if buyer_id:
        filtered = [r for r in filtered if r.buyer_id == buyer_id]
    
    total = len(filtered)
    total_pages = (total + per_page - 1) // per_page
    start = (page - 1) * per_page
    end = start + per_page
    items = filtered[start:end]
    
    return {
        "items": items,
        "total": total,
        "page": page,
        "per_page": per_page,
        "total_pages": total_pages,
    }


@router.get("/{rfq_id}", response_model=RFQ)
async def get_rfq(rfq_id: str):
    """Get a single RFQ by ID."""
    rfq = next((r for r in MOCK_RFQS if r.id == rfq_id), None)
    if not rfq:
        raise HTTPException(status_code=404, detail="RFQ not found")
    
    # Attach quotes
    rfq.quotes = [q for q in MOCK_QUOTES if q.rfq_id == rfq_id]
    return rfq


@router.post("", response_model=RFQ, status_code=status.HTTP_201_CREATED)
async def create_rfq(rfq_data: RFQCreate):
    """Create a new RFQ."""
    new_rfq = RFQ(
        id=f"rfq-{len(MOCK_RFQS) + 1:03d}",
        rfq_number=f"RFQ-2024-{len(MOCK_RFQS) + 1:04d}",
        buyer_id="buyer-001",
        buyer_company="Example Company",
        status=RFQStatus.DRAFT,
        created_at=datetime.now(),
        updated_at=datetime.now(),
        **rfq_data.model_dump(),
    )
    MOCK_RFQS.append(new_rfq)
    return new_rfq


@router.patch("/{rfq_id}", response_model=RFQ)
async def update_rfq(rfq_id: str, rfq_data: RFQUpdate):
    """Update an RFQ."""
    rfq = next((r for r in MOCK_RFQS if r.id == rfq_id), None)
    if not rfq:
        raise HTTPException(status_code=404, detail="RFQ not found")
    
    update_data = rfq_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(rfq, field, value)
    
    rfq.updated_at = datetime.now()
    return rfq


@router.post("/{rfq_id}/submit", response_model=RFQ)
async def submit_rfq(rfq_id: str):
    """Submit an RFQ for supplier review."""
    rfq = next((r for r in MOCK_RFQS if r.id == rfq_id), None)
    if not rfq:
        raise HTTPException(status_code=404, detail="RFQ not found")
    
    if rfq.status != RFQStatus.DRAFT:
        raise HTTPException(status_code=400, detail="Only draft RFQs can be submitted")
    
    rfq.status = RFQStatus.SUBMITTED
    rfq.submitted_at = datetime.now()
    rfq.expires_at = datetime.now() + timedelta(days=30)
    rfq.updated_at = datetime.now()
    
    return rfq


@router.post("/{rfq_id}/cancel", response_model=RFQ)
async def cancel_rfq(rfq_id: str):
    """Cancel an RFQ."""
    rfq = next((r for r in MOCK_RFQS if r.id == rfq_id), None)
    if not rfq:
        raise HTTPException(status_code=404, detail="RFQ not found")
    
    if rfq.status in [RFQStatus.ACCEPTED, RFQStatus.REJECTED, RFQStatus.EXPIRED]:
        raise HTTPException(status_code=400, detail="Cannot cancel this RFQ")
    
    rfq.status = RFQStatus.EXPIRED
    rfq.updated_at = datetime.now()
    
    return rfq


@router.get("/{rfq_id}/quotes", response_model=list[Quote])
async def get_rfq_quotes(rfq_id: str):
    """Get all quotes for an RFQ."""
    rfq = next((r for r in MOCK_RFQS if r.id == rfq_id), None)
    if not rfq:
        raise HTTPException(status_code=404, detail="RFQ not found")
    
    return [q for q in MOCK_QUOTES if q.rfq_id == rfq_id]


# Quote endpoints

@router.post("/{rfq_id}/quotes", response_model=Quote, status_code=status.HTTP_201_CREATED)
async def create_quote(rfq_id: str, quote_data: QuoteCreate):
    """Submit a quote for an RFQ."""
    rfq = next((r for r in MOCK_RFQS if r.id == rfq_id), None)
    if not rfq:
        raise HTTPException(status_code=404, detail="RFQ not found")
    
    new_quote = Quote(
        id=f"quote-{len(MOCK_QUOTES) + 1:03d}",
        quote_number=f"Q-2024-{len(MOCK_QUOTES) + 1:04d}",
        rfq_id=rfq_id,
        supplier_id="supplier-001",
        supplier_name="Example Supplier",
        status=QuoteStatus.PENDING,
        submitted_at=datetime.now(),
        expires_at=datetime.now() + timedelta(days=quote_data.validity_period),
        created_at=datetime.now(),
        updated_at=datetime.now(),
        **quote_data.model_dump(),
    )
    MOCK_QUOTES.append(new_quote)
    
    # Update RFQ status
    rfq.status = RFQStatus.QUOTED
    rfq.updated_at = datetime.now()
    
    return new_quote


@router.post("/quotes/{quote_id}/accept", response_model=Quote)
async def accept_quote(quote_id: str):
    """Accept a quote."""
    quote = next((q for q in MOCK_QUOTES if q.id == quote_id), None)
    if not quote:
        raise HTTPException(status_code=404, detail="Quote not found")
    
    if quote.status != QuoteStatus.PENDING:
        raise HTTPException(status_code=400, detail="Quote is not pending")
    
    quote.status = QuoteStatus.ACCEPTED
    quote.updated_at = datetime.now()
    
    # Update RFQ status
    rfq = next((r for r in MOCK_RFQS if r.id == quote.rfq_id), None)
    if rfq:
        rfq.status = RFQStatus.ACCEPTED
        rfq.updated_at = datetime.now()
    
    return quote


@router.post("/quotes/{quote_id}/reject", response_model=Quote)
async def reject_quote(quote_id: str):
    """Reject a quote."""
    quote = next((q for q in MOCK_QUOTES if q.id == quote_id), None)
    if not quote:
        raise HTTPException(status_code=404, detail="Quote not found")
    
    if quote.status != QuoteStatus.PENDING:
        raise HTTPException(status_code=400, detail="Quote is not pending")
    
    quote.status = QuoteStatus.REJECTED
    quote.updated_at = datetime.now()
    
    return quote


# Order endpoints

@router.get("/orders", response_model=dict)
async def list_orders(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    status: Optional[OrderStatus] = None,
):
    """List orders."""
    filtered = MOCK_ORDERS.copy()
    
    if status:
        filtered = [o for o in filtered if o.status == status]
    
    total = len(filtered)
    total_pages = (total + per_page - 1) // per_page
    start = (page - 1) * per_page
    end = start + per_page
    items = filtered[start:end]
    
    return {
        "items": items,
        "total": total,
        "page": page,
        "per_page": per_page,
        "total_pages": total_pages,
    }


@router.get("/orders/{order_id}", response_model=Order)
async def get_order(order_id: str):
    """Get a single order by ID."""
    order = next((o for o in MOCK_ORDERS if o.id == order_id), None)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order


@router.post("/orders", response_model=Order, status_code=status.HTTP_201_CREATED)
async def create_order(order_data: OrderCreate):
    """Create a new order from an accepted quote."""
    quote = next((q for q in MOCK_QUOTES if q.id == order_data.quote_id), None)
    if not quote:
        raise HTTPException(status_code=404, detail="Quote not found")
    
    if quote.status != QuoteStatus.ACCEPTED:
        raise HTTPException(status_code=400, detail="Quote must be accepted before creating order")
    
    new_order = Order(
        id=f"order-{len(MOCK_ORDERS) + 1:03d}",
        order_number=f"ORD-2024-{len(MOCK_ORDERS) + 1:04d}",
        quote_id=order_data.quote_id,
        buyer_id="buyer-001",
        supplier_id=quote.supplier_id,
        barrel_ids=quote.barrel_ids,
        total_volume=Decimal("3000"),  # Would calculate from barrels
        total_price=quote.total_price,
        status=OrderStatus.PENDING,
        created_at=datetime.now(),
        updated_at=datetime.now(),
        **order_data.model_dump(),
    )
    MOCK_ORDERS.append(new_order)
    return new_order
