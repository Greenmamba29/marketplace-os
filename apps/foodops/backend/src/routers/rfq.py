"""RFQ (Request for Quote) router."""

from datetime import datetime, timedelta
from typing import List, Optional
from fastapi import APIRouter, Depends, Query, HTTPException, status

from ..models.rfq import RFQ, RFQCreate, RFQUpdate, RFQItem, RFQItemCreate
from ..models.common import ApiResponse, PaginatedResponse
from ..routers.auth import get_current_active_user
from ..models.auth import User


router = APIRouter()


# Mock RFQs
MOCK_RFQS = [
    RFQ(
        id="1",
        rfq_number="RFQ-2024-001",
        buyer_id="user-1",
        buyer_name="Executive Chef",
        organization_id="org-1",
        organization_name="Gourmet Bistro",
        items=[
            RFQItem(
                id="item-1",
                ingredient_id="1",
                ingredient_name="Organic Chicken Breast",
                quantity=50,
                unit_of_measure="lb",
                allow_substitutes=True,
            ),
            RFQItem(
                id="item-2",
                ingredient_id="2",
                ingredient_name="Atlantic Salmon Fillet",
                quantity=25,
                unit_of_measure="lb",
                allow_substitutes=False,
            ),
        ],
        delivery_date=datetime.utcnow() + timedelta(days=7),
        delivery_window_earliest="08:00",
        delivery_window_latest="12:00",
        delivery_address={
            "name": "Gourmet Bistro",
            "line1": "123 Main St",
            "city": "New York",
            "state": "NY",
            "postal_code": "10001",
            "country": "USA",
        },
        temperature_requirements=["refrigerated"],
        special_instructions="Please deliver to the back entrance",
        submission_deadline=datetime.utcnow() + timedelta(days=3),
        status="published",
        quotes_received=2,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
    ),
]


@router.get("", response_model=ApiResponse[PaginatedResponse[RFQ]])
async def list_rfqs(
    status: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_active_user),
):
    """List all RFQs for the current user."""
    filtered = MOCK_RFQS.copy()
    
    if status:
        filtered = [r for r in filtered if r.status == status]
    
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


@router.get("/{rfq_id}", response_model=ApiResponse[RFQ])
async def get_rfq(
    rfq_id: str,
    current_user: User = Depends(get_current_active_user),
):
    """Get a single RFQ by ID."""
    rfq = next((r for r in MOCK_RFQS if r.id == rfq_id), None)
    
    if not rfq:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="RFQ not found",
        )
    
    return ApiResponse(
        success=True,
        data=rfq,
        meta={"timestamp": datetime.utcnow().isoformat(), "request_id": "req-1"},
    )


@router.post("", response_model=ApiResponse[RFQ])
async def create_rfq(
    rfq_data: RFQCreate,
    current_user: User = Depends(get_current_active_user),
):
    """Create a new RFQ."""
    rfq_number = f"RFQ-{datetime.utcnow().strftime('%Y%m%d')}-{len(MOCK_RFQS) + 1:03d}"
    
    rfq = RFQ(
        id=f"rfq-{datetime.utcnow().timestamp()}",
        rfq_number=rfq_number,
        buyer_id=current_user.id,
        buyer_name=current_user.name,
        organization_id=current_user.organization_id,
        organization_name=current_user.organization_name,
        items=[RFQItem(id=f"item-{i}", **item.model_dump()) for i, item in enumerate(rfq_data.items)],
        status="draft",
        quotes_received=0,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
        **rfq_data.model_dump(exclude={"items"}),
    )
    
    MOCK_RFQS.append(rfq)
    
    return ApiResponse(
        success=True,
        data=rfq,
        meta={"timestamp": datetime.utcnow().isoformat(), "request_id": "req-1"},
    )


@router.patch("/{rfq_id}", response_model=ApiResponse[RFQ])
async def update_rfq(
    rfq_id: str,
    rfq_data: RFQUpdate,
    current_user: User = Depends(get_current_active_user),
):
    """Update an existing RFQ."""
    rfq = next((r for r in MOCK_RFQS if r.id == rfq_id), None)
    
    if not rfq:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="RFQ not found",
        )
    
    update_data = rfq_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(rfq, field, value)
    
    rfq.updated_at = datetime.utcnow()
    
    return ApiResponse(
        success=True,
        data=rfq,
        meta={"timestamp": datetime.utcnow().isoformat(), "request_id": "req-1"},
    )


@router.post("/{rfq_id}/publish", response_model=ApiResponse[RFQ])
async def publish_rfq(
    rfq_id: str,
    current_user: User = Depends(get_current_active_user),
):
    """Publish an RFQ to suppliers."""
    rfq = next((r for r in MOCK_RFQS if r.id == rfq_id), None)
    
    if not rfq:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="RFQ not found",
        )
    
    if rfq.status != "draft":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only draft RFQs can be published",
        )
    
    rfq.status = "published"
    rfq.updated_at = datetime.utcnow()
    
    return ApiResponse(
        success=True,
        data=rfq,
        meta={"timestamp": datetime.utcnow().isoformat(), "request_id": "req-1"},
    )


@router.delete("/{rfq_id}")
async def delete_rfq(
    rfq_id: str,
    current_user: User = Depends(get_current_active_user),
):
    """Delete an RFQ."""
    rfq = next((r for r in MOCK_RFQS if r.id == rfq_id), None)
    
    if not rfq:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="RFQ not found",
        )
    
    if rfq.status not in ["draft", "cancelled"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only draft or cancelled RFQs can be deleted",
        )
    
    MOCK_RFQS.remove(rfq)
    
    return ApiResponse(
        success=True,
        data={"message": "RFQ deleted successfully"},
        meta={"timestamp": datetime.utcnow().isoformat(), "request_id": "req-1"},
    )
