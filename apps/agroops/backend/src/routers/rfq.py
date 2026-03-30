"""RFQ router."""

from datetime import datetime, timedelta
from decimal import Decimal
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status

from src.models.auth import User, get_current_active_user
from src.models.rfq import (
    RFQ,
    RFQCreate,
    RFQUpdate,
    RFQItem,
    RFQItemCreate,
    PaginatedRFQs,
)
from src.services.baserow import BaserowService

router = APIRouter(prefix="/rfq", tags=["RFQ"])


# Mock RFQs
MOCK_RFQS = [
    RFQ(
        id="rfq_1",
        buyer_id="user_1",
        buyer_name="John Smith",
        title="Spring 2024 Corn Inputs",
        description="Looking for corn seed, fertilizer, and herbicide for 500 acres",
        crop_type="Corn",
        acres=500.0,
        planting_date=datetime(2024, 5, 1),
        target_application_date=datetime(2024, 5, 15),
        items=[
            RFQItem(
                id="item_1",
                input_category="seed",
                description="Corn seed - 110-day RM",
                quantity=500,
                unit="bag",
                specifications="GMO, insect resistant",
            ),
            RFQItem(
                id="item_2",
                input_category="fertilizer",
                description="28% UAN Solution",
                quantity=15000,
                unit="lb N",
            ),
        ],
        delivery_location="123 Farm Road",
        delivery_state="IA",
        delivery_date_start=datetime(2024, 4, 15),
        delivery_date_end=datetime(2024, 4, 30),
        payment_terms="Net 90",
        credit_terms_requested=True,
        bid_deadline=datetime(2024, 3, 15),
        min_supplier_rating=4.0,
        status="bidding",
        quote_count=3,
        created_at=datetime(2024, 2, 1),
        updated_at=datetime(2024, 2, 1),
    ),
]


@router.get("", response_model=PaginatedRFQs)
async def list_rfqs(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    status: Optional[str] = Query(None),
    my_rfqs: Optional[bool] = Query(None),
    current_user: User = Depends(get_current_active_user),
):
    """List RFQs."""
    filtered = MOCK_RFQS.copy()
    
    if status:
        filtered = [r for r in filtered if r.status == status]
    
    if my_rfqs:
        filtered = [r for r in filtered if r.buyer_id == current_user.id]
    
    total = len(filtered)
    start = (page - 1) * per_page
    end = start + per_page
    paginated = filtered[start:end]
    
    return PaginatedRFQs(
        items=paginated,
        total=total,
        page=page,
        per_page=per_page,
        total_pages=(total + per_page - 1) // per_page,
    )


@router.get("/{rfq_id}", response_model=RFQ)
async def get_rfq(
    rfq_id: str,
    current_user: User = Depends(get_current_active_user),
):
    """Get RFQ by ID."""
    for rfq in MOCK_RFQS:
        if rfq.id == rfq_id:
            return rfq
    
    raise HTTPException(status_code=404, detail="RFQ not found")


@router.post("", response_model=RFQ, status_code=status.HTTP_201_CREATED)
async def create_rfq(
    rfq_data: RFQCreate,
    current_user: User = Depends(get_current_active_user),
):
    """Create a new RFQ."""
    # Convert RFQItemCreate to RFQItem
    items = [
        RFQItem(
            id=f"item_{i}",
            **item.dict(),
        )
        for i, item in enumerate(rfq_data.items)
    ]
    
    new_rfq = RFQ(
        id=f"rfq_{len(MOCK_RFQS) + 1}",
        buyer_id=current_user.id,
        buyer_name=f"{current_user.first_name} {current_user.last_name}",
        title=rfq_data.title,
        description=rfq_data.description,
        crop_type=rfq_data.crop_type,
        acres=rfq_data.acres,
        planting_date=rfq_data.planting_date,
        target_application_date=rfq_data.target_application_date,
        items=items,
        delivery_location=rfq_data.delivery_location,
        delivery_state=rfq_data.delivery_state,
        delivery_date_start=rfq_data.delivery_date_start,
        delivery_date_end=rfq_data.delivery_date_end,
        payment_terms=rfq_data.payment_terms,
        credit_terms_requested=rfq_data.credit_terms_requested,
        bid_deadline=rfq_data.bid_deadline,
        min_supplier_rating=rfq_data.min_supplier_rating,
        status="draft",
        quote_count=0,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
    )
    
    MOCK_RFQS.append(new_rfq)
    return new_rfq


@router.patch("/{rfq_id}", response_model=RFQ)
async def update_rfq(
    rfq_id: str,
    update_data: RFQUpdate,
    current_user: User = Depends(get_current_active_user),
):
    """Update an RFQ."""
    for i, rfq in enumerate(MOCK_RFQS):
        if rfq.id == rfq_id:
            # Check ownership
            if rfq.buyer_id != current_user.id:
                raise HTTPException(status_code=403, detail="Not authorized to update this RFQ")
            
            # Update fields
            update_dict = update_data.dict(exclude_unset=True)
            for key, value in update_dict.items():
                setattr(rfq, key, value)
            
            rfq.updated_at = datetime.utcnow()
            MOCK_RFQS[i] = rfq
            return rfq
    
    raise HTTPException(status_code=404, detail="RFQ not found")


@router.post("/{rfq_id}/publish", response_model=RFQ)
async def publish_rfq(
    rfq_id: str,
    current_user: User = Depends(get_current_active_user),
):
    """Publish an RFQ to suppliers."""
    rfq = await get_rfq(rfq_id, current_user)
    
    if rfq.buyer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    if rfq.status != "draft":
        raise HTTPException(status_code=400, detail="RFQ is not in draft status")
    
    rfq.status = "bidding"
    rfq.updated_at = datetime.utcnow()
    return rfq


@router.post("/{rfq_id}/cancel", response_model=RFQ)
async def cancel_rfq(
    rfq_id: str,
    current_user: User = Depends(get_current_active_user),
):
    """Cancel an RFQ."""
    rfq = await get_rfq(rfq_id, current_user)
    
    if rfq.buyer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    if rfq.status in ["awarded", "closed", "cancelled"]:
        raise HTTPException(status_code=400, detail="Cannot cancel this RFQ")
    
    rfq.status = "cancelled"
    rfq.updated_at = datetime.utcnow()
    return rfq


@router.delete("/{rfq_id}")
async def delete_rfq(
    rfq_id: str,
    current_user: User = Depends(get_current_active_user),
):
    """Delete an RFQ."""
    for i, rfq in enumerate(MOCK_RFQS):
        if rfq.id == rfq_id:
            if rfq.buyer_id != current_user.id:
                raise HTTPException(status_code=403, detail="Not authorized")
            
            if rfq.status != "draft":
                raise HTTPException(status_code=400, detail="Can only delete draft RFQs")
            
            MOCK_RFQS.pop(i)
            return {"message": "RFQ deleted successfully"}
    
    raise HTTPException(status_code=404, detail="RFQ not found")


@router.get("/{rfq_id}/quotes")
async def get_rfq_quotes(
    rfq_id: str,
    current_user: User = Depends(get_current_active_user),
):
    """Get quotes for an RFQ."""
    rfq = await get_rfq(rfq_id, current_user)
    
    if rfq.buyer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    # Return mock quotes
    return {
        "items": [
            {
                "id": "quote_1",
                "supplier_name": "AgriSupply LLC",
                "supplier_rating": 4.8,
                "total_amount": 12500.00,
                "status": "submitted",
                "submitted_at": datetime.utcnow().isoformat(),
            },
            {
                "id": "quote_2",
                "supplier_name": "Midwest Seeds",
                "supplier_rating": 4.6,
                "total_amount": 13200.00,
                "status": "submitted",
                "submitted_at": datetime.utcnow().isoformat(),
            },
        ],
        "total": 2,
    }


@router.post("/{rfq_id}/award")
async def award_rfq(
    rfq_id: str,
    quote_id: str,
    current_user: User = Depends(get_current_active_user),
):
    """Award RFQ to a quote."""
    rfq = await get_rfq(rfq_id, current_user)
    
    if rfq.buyer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    if rfq.status != "bidding":
        raise HTTPException(status_code=400, detail="RFQ is not open for bidding")
    
    rfq.status = "awarded"
    rfq.awarded_quote_id = quote_id
    rfq.awarded_amount = Decimal("12500.00")
    rfq.updated_at = datetime.utcnow()
    
    return {"message": "RFQ awarded successfully", "rfq": rfq}
