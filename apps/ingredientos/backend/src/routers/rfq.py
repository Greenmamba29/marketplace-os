"""
RFQ (Request for Quote) router
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status

from ..models.common import ApiResponse, PaginatedResponse
from ..models.rfq import RFQSubmission, RFQSubmissionCreate, RFQSubmissionUpdate, Quote, QuoteCreate
from ..routers.auth import get_current_active_user, require_admin
from ..models.auth import User

router = APIRouter()


# Mock RFQ data
MOCK_RFQS = [
    {
        "id": "rfq_001",
        "buyer_id": "usr_001",
        "title": "Organic Sweetener for Beverage Line",
        "description": "Looking for organic sweetener for new beverage product line",
        "ingredient_category": "sweeteners",
        "quantity_kg": 500,
        "delivery_timeline": "Within 1 month",
        "delivery_location": "Los Angeles, CA, USA",
        "application": "beverages",
        "required_certifications": ["organic", "non_gmo"],
        "required_gras_status": True,
        "allergen_requirements": [],
        "visibility": "public",
        "status": "active",
        "quote_count": 4,
        "created_at": "2024-01-15T00:00:00Z",
        "expires_at": "2024-01-30T00:00:00Z",
    },
    {
        "id": "rfq_002",
        "buyer_id": "usr_001",
        "title": "Plant Protein for Protein Bars",
        "description": "Need high-quality plant protein for protein bar manufacturing",
        "ingredient_category": "proteins",
        "quantity_kg": 1000,
        "delivery_timeline": "Within 2 months",
        "delivery_location": "Chicago, IL, USA",
        "application": "snacks",
        "required_certifications": ["non_gmo"],
        "required_gras_status": True,
        "allergen_requirements": [{"allergen": "soy", "requirement": "free_from"}],
        "visibility": "public",
        "status": "active",
        "quote_count": 2,
        "created_at": "2024-01-14T00:00:00Z",
        "expires_at": "2024-02-05T00:00:00Z",
    },
]

# Mock Quotes data
MOCK_QUOTES = [
    {
        "id": "qt_001",
        "rfq_id": "rfq_001",
        "supplier_id": "sup_003",
        "unit_price": 92.50,
        "total_price": 46250,
        "currency": "USD",
        "lead_time_days": 14,
        "validity_days": 30,
        "incoterm": "FOB",
        "certifications_included": ["organic", "non_gmo"],
        "coa_included": True,
        "sample_available": True,
        "status": "submitted",
        "selected": False,
        "created_at": "2024-01-16T00:00:00Z",
    },
    {
        "id": "qt_002",
        "rfq_id": "rfq_001",
        "supplier_id": "sup_004",
        "unit_price": 88.00,
        "total_price": 44000,
        "currency": "USD",
        "lead_time_days": 21,
        "validity_days": 30,
        "incoterm": "CIF",
        "certifications_included": ["organic"],
        "coa_included": True,
        "sample_available": True,
        "status": "submitted",
        "selected": False,
        "created_at": "2024-01-16T00:00:00Z",
    },
]


@router.get("", response_model=ApiResponse[PaginatedResponse[RFQSubmission]])
async def list_rfqs(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    status: Optional[str] = None,
    current_user: User = Depends(get_current_active_user),
):
    """List RFQs for the current user"""
    filtered = MOCK_RFQS.copy()
    
    # Filter by user (in production, query by buyer_id)
    filtered = [r for r in filtered if r["buyer_id"] == "usr_001"]
    
    if status:
        filtered = [r for r in filtered if r["status"] == status]
    
    total = len(filtered)
    start = (page - 1) * per_page
    end = start + per_page
    items = filtered[start:end]
    
    pagination = PaginatedResponse.create(
        items=items,
        total=total,
        page=page,
        per_page=per_page,
    )
    
    return ApiResponse(success=True, data=pagination)


@router.get("/{rfq_id}", response_model=ApiResponse[RFQSubmission])
async def get_rfq(
    rfq_id: str,
    current_user: User = Depends(get_current_active_user),
):
    """Get a specific RFQ by ID"""
    rfq = next((r for r in MOCK_RFQS if r["id"] == rfq_id), None)
    
    if not rfq:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="RFQ not found",
        )
    
    return ApiResponse(success=True, data=rfq)


@router.post("", response_model=ApiResponse[RFQSubmission], status_code=status.HTTP_201_CREATED)
async def create_rfq(
    rfq_data: RFQSubmissionCreate,
    current_user: User = Depends(get_current_active_user),
):
    """Create a new RFQ"""
    # In production, save to database
    new_rfq = {
        "id": f"rfq_{len(MOCK_RFQS) + 1:03d}",
        "buyer_id": current_user.id,
        **rfq_data.model_dump(),
        "status": "draft",
        "quote_count": 0,
    }
    
    return ApiResponse(
        success=True,
        data=new_rfq,
        message="RFQ created successfully",
    )


@router.put("/{rfq_id}", response_model=ApiResponse[RFQSubmission])
async def update_rfq(
    rfq_id: str,
    rfq_data: RFQSubmissionUpdate,
    current_user: User = Depends(get_current_active_user),
):
    """Update an RFQ"""
    rfq = next((r for r in MOCK_RFQS if r["id"] == rfq_id), None)
    
    if not rfq:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="RFQ not found",
        )
    
    # Update fields
    update_data = rfq_data.model_dump(exclude_unset=True)
    rfq.update(update_data)
    
    return ApiResponse(
        success=True,
        data=rfq,
        message="RFQ updated successfully",
    )


@router.post("/{rfq_id}/cancel", response_model=ApiResponse[dict])
async def cancel_rfq(
    rfq_id: str,
    current_user: User = Depends(get_current_active_user),
):
    """Cancel an RFQ"""
    rfq = next((r for r in MOCK_RFQS if r["id"] == rfq_id), None)
    
    if not rfq:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="RFQ not found",
        )
    
    rfq["status"] = "cancelled"
    
    return ApiResponse(
        success=True,
        data={},
        message="RFQ cancelled successfully",
    )


@router.get("/{rfq_id}/quotes", response_model=ApiResponse[List[Quote]])
async def get_rfq_quotes(
    rfq_id: str,
    current_user: User = Depends(get_current_active_user),
):
    """Get all quotes for an RFQ"""
    rfq = next((r for r in MOCK_RFQS if r["id"] == rfq_id), None)
    
    if not rfq:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="RFQ not found",
        )
    
    quotes = [q for q in MOCK_QUOTES if q["rfq_id"] == rfq_id]
    
    return ApiResponse(success=True, data=quotes)


@router.post("/{rfq_id}/quotes", response_model=ApiResponse[Quote], status_code=status.HTTP_201_CREATED)
async def submit_quote(
    rfq_id: str,
    quote_data: QuoteCreate,
    current_user: User = Depends(get_current_active_user),
):
    """Submit a quote for an RFQ (supplier only)"""
    rfq = next((r for r in MOCK_RFQS if r["id"] == rfq_id), None)
    
    if not rfq:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="RFQ not found",
        )
    
    # In production, verify user is a supplier
    new_quote = {
        "id": f"qt_{len(MOCK_QUOTES) + 1:03d}",
        "rfq_id": rfq_id,
        "supplier_id": current_user.id,
        **quote_data.model_dump(),
        "status": "submitted",
        "selected": False,
    }
    
    # Update RFQ quote count
    rfq["quote_count"] = rfq.get("quote_count", 0) + 1
    
    return ApiResponse(
        success=True,
        data=new_quote,
        message="Quote submitted successfully",
    )


@router.post("/{rfq_id}/quotes/{quote_id}/select", response_model=ApiResponse[dict])
async def select_quote(
    rfq_id: str,
    quote_id: str,
    current_user: User = Depends(get_current_active_user),
):
    """Select a quote for an RFQ"""
    rfq = next((r for r in MOCK_RFQS if r["id"] == rfq_id), None)
    
    if not rfq:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="RFQ not found",
        )
    
    quote = next((q for q in MOCK_QUOTES if q["id"] == quote_id and q["rfq_id"] == rfq_id), None)
    
    if not quote:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Quote not found",
        )
    
    # Mark quote as selected
    quote["selected"] = True
    rfq["status"] = "awarded"
    
    return ApiResponse(
        success=True,
        data={"order_id": "ord_new_001"},
        message="Quote selected successfully. Order created.",
    )


@router.get("/quotes/{quote_id}", response_model=ApiResponse[Quote])
async def get_quote(
    quote_id: str,
    current_user: User = Depends(get_current_active_user),
):
    """Get a specific quote by ID"""
    quote = next((q for q in MOCK_QUOTES if q["id"] == quote_id), None)
    
    if not quote:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Quote not found",
        )
    
    return ApiResponse(success=True, data=quote)


@router.post("/quotes/{quote_id}/withdraw", response_model=ApiResponse[dict])
async def withdraw_quote(
    quote_id: str,
    current_user: User = Depends(get_current_active_user),
):
    """Withdraw a quote"""
    quote = next((q for q in MOCK_QUOTES if q["id"] == quote_id), None)
    
    if not quote:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Quote not found",
        )
    
    quote["status"] = "withdrawn"
    
    return ApiResponse(
        success=True,
        data={},
        message="Quote withdrawn successfully",
    )
