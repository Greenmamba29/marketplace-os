"""RFQ router."""

from datetime import datetime, timedelta
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from fastapi.security import HTTPBearer

from models.rfq import (
    RFQSubmission,
    RFQCreate,
    RFQUpdate,
    RFQResponse,
    RecommendedSupplier,
)
from models.common import ApiResponse, PaginatedResponse
from services.baserow import get_baserow_service
from services.regional import get_regional_service

router = APIRouter(prefix="/rfq", tags=["RFQ"])
security = HTTPBearer()


def generate_rfq_number() -> str:
    """Generate a unique RFQ number."""
    timestamp = datetime.utcnow().strftime("%Y%m%d")
    # In production, use a proper sequence
    return f"RFQ-{timestamp}-001"


@router.get("", response_model=ApiResponse[PaginatedResponse[RFQResponse]])
async def list_rfqs(
    status: Optional[str] = None,
    project_id: Optional[str] = None,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    baserow=Depends(get_baserow_service),
) -> ApiResponse[PaginatedResponse[RFQResponse]]:
    """List RFQs with filters."""
    filters = {}
    if status:
        filters["status"] = status
    if project_id:
        filters["project_id"] = project_id
    
    result = await baserow.list_rows(
        "rfq_submissions",
        filters=filters if filters else None,
        page=page,
        size=page_size,
    )
    
    rfqs = []
    for item in result.get("results", []):
        # Calculate time remaining
        deadline = item.get("acceptance_deadline")
        time_remaining = None
        is_closing_soon = False
        
        if deadline:
            time_diff = deadline - datetime.utcnow()
            time_remaining = time_diff.total_seconds() / 3600  # hours
            is_closing_soon = time_remaining < 24
        
        rfqs.append(RFQResponse(
            **item,
            time_remaining_hours=time_remaining,
            is_closing_soon=is_closing_soon,
        ))
    
    total = result.get("count", 0)
    
    return ApiResponse.success_response(
        PaginatedResponse.create(
            items=rfqs,
            total=total,
            page=page,
            page_size=page_size,
        )
    )


@router.post("", response_model=ApiResponse[RFQResponse])
async def create_rfq(
    rfq: RFQCreate,
    baserow=Depends(get_baserow_service),
) -> ApiResponse[RFQResponse]:
    """Create a new RFQ."""
    # Create RFQ
    rfq_data = rfq.model_dump()
    rfq_data["rfq_number"] = generate_rfq_number()
    rfq_data["status"] = "submitted"
    rfq_data["quotes_received"] = 0
    
    # Create RFQ without items first
    items = rfq_data.pop("items", [])
    invited_suppliers = rfq_data.pop("invited_suppliers", [])
    rfq_data["invited_suppliers"] = invited_suppliers or []
    
    created = await baserow.create_row("rfq_submissions", rfq_data)
    rfq_id = created.get("id")
    
    # Create RFQ items
    for item in items:
        item["rfq_id"] = rfq_id
        await baserow.create_row("rfq_items", item)
    
    # Get full RFQ with items
    full_rfq = await baserow.get_rfq_with_items(rfq_id)
    
    return ApiResponse.success_response(
        RFQResponse(**full_rfq),
        message="RFQ created successfully",
    )


@router.get("/{rfq_id}", response_model=ApiResponse[RFQResponse])
async def get_rfq(
    rfq_id: str,
    baserow=Depends(get_baserow_service),
) -> ApiResponse[RFQResponse]:
    """Get a single RFQ by ID."""
    rfq = await baserow.get_rfq_with_items(rfq_id)
    if not rfq:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="RFQ not found",
        )
    
    # Calculate time remaining
    deadline = rfq.get("acceptance_deadline")
    time_remaining = None
    is_closing_soon = False
    
    if deadline:
        time_diff = deadline - datetime.utcnow()
        time_remaining = time_diff.total_seconds() / 3600
        is_closing_soon = time_remaining < 24
    
    return ApiResponse.success_response(
        RFQResponse(
            **rfq,
            time_remaining_hours=time_remaining,
            is_closing_soon=is_closing_soon,
        )
    )


@router.patch("/{rfq_id}", response_model=ApiResponse[RFQResponse])
async def update_rfq(
    rfq_id: str,
    update: RFQUpdate,
    baserow=Depends(get_baserow_service),
) -> ApiResponse[RFQResponse]:
    """Update an RFQ."""
    # Check if RFQ exists
    existing = await baserow.get_row("rfq_submissions", rfq_id)
    if not existing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="RFQ not found",
        )
    
    updated = await baserow.update_row(
        "rfq_submissions",
        rfq_id,
        update.model_dump(exclude_unset=True),
    )
    
    return ApiResponse.success_response(RFQResponse(**updated))


@router.post("/{rfq_id}/cancel", response_model=ApiResponse[dict])
async def cancel_rfq(
    rfq_id: str,
    reason: str,
    baserow=Depends(get_baserow_service),
) -> ApiResponse[dict]:
    """Cancel an RFQ."""
    # Check if RFQ exists
    existing = await baserow.get_row("rfq_submissions", rfq_id)
    if not existing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="RFQ not found",
        )
    
    await baserow.update_row(
        "rfq_submissions",
        rfq_id,
        {"status": "cancelled", "cancellation_reason": reason},
    )
    
    return ApiResponse.success_response(
        {},
        message="RFQ cancelled successfully",
    )


@router.post("/{rfq_id}/award", response_model=ApiResponse[dict])
async def award_rfq(
    rfq_id: str,
    quote_id: str,
    baserow=Depends(get_baserow_service),
) -> ApiResponse[dict]:
    """Award RFQ to a supplier."""
    # Update RFQ status
    await baserow.update_row(
        "rfq_submissions",
        rfq_id,
        {
            "status": "awarded",
            "best_quote_id": quote_id,
        },
    )
    
    # Update quote status
    await baserow.update_row(
        "quotes",
        quote_id,
        {"status": "accepted"},
    )
    
    return ApiResponse.success_response(
        {},
        message="RFQ awarded successfully",
    )


@router.get("/{rfq_id}/quotes", response_model=ApiResponse[list])
async def get_rfq_quotes(
    rfq_id: str,
    baserow=Depends(get_baserow_service),
) -> ApiResponse[list]:
    """Get quotes for an RFQ."""
    result = await baserow.list_rows(
        "quotes",
        filters={"rfq_id": rfq_id},
    )
    
    return ApiResponse.success_response(result.get("results", []))


@router.get("/{rfq_id}/recommended-suppliers", response_model=ApiResponse[list[RecommendedSupplier]])
async def get_recommended_suppliers(
    rfq_id: str,
    baserow=Depends(get_baserow_service),
    regional=Depends(get_regional_service),
) -> ApiResponse[list[RecommendedSupplier]]:
    """Get recommended suppliers for an RFQ."""
    # Get RFQ details
    rfq = await baserow.get_rfq_with_items(rfq_id)
    if not rfq:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="RFQ not found",
        )
    
    # Get material types needed
    material_types = set()
    for item in rfq.get("items", []):
        material_types.add(item.get("material_type"))
    
    # Find suppliers that can provide these materials
    suppliers_result = await baserow.list_rows("suppliers", size=100)
    all_suppliers = suppliers_result.get("results", [])
    
    recommended = []
    for supplier in all_suppliers:
        supplier_materials = supplier.get("material_types", [])
        
        # Check if supplier can provide any needed materials
        match_count = len(material_types.intersection(set(supplier_materials)))
        if match_count == 0:
            continue
        
        # Calculate match score
        match_score = (match_count / len(material_types)) * 100
        
        # Calculate distance (would use actual coordinates)
        distance = 25  # Mock distance
        
        # Estimate price (would use actual pricing)
        estimated_price = 1000  # Mock price
        
        recommended.append(RecommendedSupplier(
            supplier_id=str(supplier.get("id")),
            supplier_name=supplier.get("company_name"),
            match_score=round(match_score, 1),
            distance_miles=distance,
            estimated_price=estimated_price,
            material_types=supplier_materials,
        ))
    
    # Sort by match score
    recommended.sort(key=lambda x: x.match_score, reverse=True)
    
    return ApiResponse.success_response(recommended[:10])


@router.post("/{rfq_id}/extend", response_model=ApiResponse[RFQResponse])
async def extend_rfq_deadline(
    rfq_id: str,
    new_deadline: datetime,
    baserow=Depends(get_baserow_service),
) -> ApiResponse[RFQResponse]:
    """Extend RFQ acceptance deadline."""
    updated = await baserow.update_row(
        "rfq_submissions",
        rfq_id,
        {"acceptance_deadline": new_deadline.isoformat()},
    )
    
    return ApiResponse.success_response(
        RFQResponse(**updated),
        message="Deadline extended successfully",
    )


@router.post("/{rfq_id}/clone", response_model=ApiResponse[RFQResponse])
async def clone_rfq(
    rfq_id: str,
    modifications: Optional[dict] = None,
    baserow=Depends(get_baserow_service),
) -> ApiResponse[RFQResponse]:
    """Clone an existing RFQ."""
    # Get original RFQ
    original = await baserow.get_rfq_with_items(rfq_id)
    if not original:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="RFQ not found",
        )
    
    # Create new RFQ
    new_rfq = {
        **original,
        "rfq_number": generate_rfq_number(),
        "status": "draft",
        "quotes_received": 0,
        "best_quote_id": None,
        "best_price": None,
    }
    
    # Apply modifications
    if modifications:
        new_rfq.update(modifications)
    
    # Remove IDs and timestamps
    new_rfq.pop("id", None)
    new_rfq.pop("created_at", None)
    new_rfq.pop("updated_at", None)
    
    items = new_rfq.pop("items", [])
    
    created = await baserow.create_row("rfq_submissions", new_rfq)
    new_rfq_id = created.get("id")
    
    # Clone items
    for item in items:
        item["rfq_id"] = new_rfq_id
        item.pop("id", None)
        await baserow.create_row("rfq_items", item)
    
    # Get full RFQ
    full_rfq = await baserow.get_rfq_with_items(new_rfq_id)
    
    return ApiResponse.success_response(
        RFQResponse(**full_rfq),
        message="RFQ cloned successfully",
    )
