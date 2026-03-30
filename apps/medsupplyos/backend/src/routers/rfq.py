"""RFQ (Request for Quotation) router."""

from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status

from ..models.auth import User, get_current_active_user
from ..models.rfq import RFQ, RFQCreate, RFQUpdate, Quote
from ..services.baserow import BaserowService

router = APIRouter()


@router.get("", response_model=dict)
async def list_rfqs(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    status: Optional[str] = None,
    current_user: User = Depends(get_current_active_user),
):
    """List RFQs for current user."""
    baserow = BaserowService()
    
    filters = {}
    if status:
        filters["status"] = status
    
    # Filter by user's organization
    filters["organization_id"] = current_user.organization_id
    
    result = await baserow.list_rfqs(
        page=page,
        per_page=per_page,
        filters=filters,
    )
    
    return {
        "success": True,
        "data": result["data"],
        "meta": {
            "page": page,
            "per_page": per_page,
            "total": result["total"],
            "total_pages": (result["total"] + per_page - 1) // per_page,
        },
    }


@router.get("/{rfq_id}", response_model=dict)
async def get_rfq(
    rfq_id: str,
    current_user: User = Depends(get_current_active_user),
):
    """Get RFQ by ID."""
    baserow = BaserowService()
    rfq = await baserow.get_rfq_by_id(rfq_id)
    
    if not rfq:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="RFQ not found",
        )
    
    # Check authorization
    if rfq.get("organization_id") != current_user.organization_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view this RFQ",
        )
    
    return {
        "success": True,
        "data": rfq,
    }


@router.post("", response_model=dict, status_code=status.HTTP_201_CREATED)
async def create_rfq(
    rfq: RFQCreate,
    current_user: User = Depends(get_current_active_user),
):
    """Create new RFQ."""
    baserow = BaserowService()
    
    # Generate RFQ number
    import uuid
    rfq_number = f"RFQ-{uuid.uuid4().hex[:8].upper()}"
    
    rfq_data = rfq.model_dump()
    rfq_data.update({
        "rfq_number": rfq_number,
        "requester_id": current_user.id,
        "organization_id": current_user.organization_id,
        "status": "draft",
    })
    
    created = await baserow.create_rfq(rfq_data)
    
    return {
        "success": True,
        "data": created,
    }


@router.patch("/{rfq_id}", response_model=dict)
async def update_rfq(
    rfq_id: str,
    updates: RFQUpdate,
    current_user: User = Depends(get_current_active_user),
):
    """Update RFQ."""
    baserow = BaserowService()
    
    # Get existing RFQ
    existing = await baserow.get_rfq_by_id(rfq_id)
    if not existing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="RFQ not found",
        )
    
    # Check authorization
    if existing.get("requester_id") != current_user.id and current_user.role != "system_admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this RFQ",
        )
    
    # Can only update draft RFQs
    if existing.get("status") != "draft":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Can only update draft RFQs",
        )
    
    updated = await baserow.update_rfq(rfq_id, updates.model_dump(exclude_none=True))
    
    return {
        "success": True,
        "data": updated,
    }


@router.post("/{rfq_id}/submit", response_model=dict)
async def submit_rfq(
    rfq_id: str,
    current_user: User = Depends(get_current_active_user),
):
    """Submit RFQ for approval."""
    baserow = BaserowService()
    
    # Get existing RFQ
    existing = await baserow.get_rfq_by_id(rfq_id)
    if not existing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="RFQ not found",
        )
    
    # Check authorization
    if existing.get("requester_id") != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to submit this RFQ",
        )
    
    # Can only submit draft RFQs
    if existing.get("status") != "draft":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Can only submit draft RFQs",
        )
    
    # Update status to pending clinical approval
    updated = await baserow.update_rfq(rfq_id, {"status": "pending_clinical_approval"})
    
    # TODO: Send notification to clinical approvers
    
    return {
        "success": True,
        "data": updated,
    }


@router.post("/{rfq_id}/approve-clinical", response_model=dict)
async def approve_clinical(
    rfq_id: str,
    data: dict,
    current_user: User = Depends(get_current_active_user),
):
    """Approve RFQ clinically."""
    if current_user.role not in ["clinical_approver", "system_admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to approve RFQs",
        )
    
    baserow = BaserowService()
    
    # Get existing RFQ
    existing = await baserow.get_rfq_by_id(rfq_id)
    if not existing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="RFQ not found",
        )
    
    if existing.get("status") != "pending_clinical_approval":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="RFQ is not pending clinical approval",
        )
    
    from datetime import datetime
    approval_data = {
        "clinical_approval": {
            "approver_id": current_user.id,
            "approved_at": datetime.utcnow().isoformat(),
            "clinical_indication": data.get("clinical_indication", ""),
            "patient_safety_impact": data.get("patient_safety_impact", "low"),
            "comments": data.get("comments"),
        },
        "status": "pending_budget_approval",
    }
    
    updated = await baserow.update_rfq(rfq_id, approval_data)
    
    return {
        "success": True,
        "data": updated,
    }


@router.post("/{rfq_id}/approve-budget", response_model=dict)
async def approve_budget(
    rfq_id: str,
    data: dict,
    current_user: User = Depends(get_current_active_user),
):
    """Approve RFQ budget."""
    if current_user.role not in ["hospital_admin", "system_admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to approve budgets",
        )
    
    baserow = BaserowService()
    
    # Get existing RFQ
    existing = await baserow.get_rfq_by_id(rfq_id)
    if not existing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="RFQ not found",
        )
    
    if existing.get("status") != "pending_budget_approval":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="RFQ is not pending budget approval",
        )
    
    from datetime import datetime
    approval_data = {
        "budget_approval": {
            "approver_id": current_user.id,
            "approved_at": datetime.utcnow().isoformat(),
            "approved_amount": data.get("approved_amount"),
            "comments": data.get("comments"),
        },
        "status": "approved",
    }
    
    updated = await baserow.update_rfq(rfq_id, approval_data)
    
    return {
        "success": True,
        "data": updated,
    }


@router.post("/{rfq_id}/cancel", response_model=dict)
async def cancel_rfq(
    rfq_id: str,
    data: dict,
    current_user: User = Depends(get_current_active_user),
):
    """Cancel RFQ."""
    baserow = BaserowService()
    
    # Get existing RFQ
    existing = await baserow.get_rfq_by_id(rfq_id)
    if not existing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="RFQ not found",
        )
    
    # Check authorization
    if existing.get("requester_id") != current_user.id and current_user.role != "system_admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to cancel this RFQ",
        )
    
    # Cannot cancel already awarded or cancelled RFQs
    if existing.get("status") in ["awarded", "cancelled"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot cancel RFQ with status: {existing.get('status')}",
        )
    
    updated = await baserow.update_rfq(rfq_id, {
        "status": "cancelled",
        "cancellation_reason": data.get("reason"),
    })
    
    return {
        "success": True,
        "data": updated,
    }


@router.get("/{rfq_id}/quotes", response_model=dict)
async def get_rfq_quotes(
    rfq_id: str,
    current_user: User = Depends(get_current_active_user),
):
    """Get quotes for an RFQ."""
    baserow = BaserowService()
    
    # Get existing RFQ
    existing = await baserow.get_rfq_by_id(rfq_id)
    if not existing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="RFQ not found",
        )
    
    # Check authorization
    if existing.get("organization_id") != current_user.organization_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view quotes for this RFQ",
        )
    
    quotes = await baserow.get_rfq_quotes(rfq_id)
    
    return {
        "success": True,
        "data": quotes,
    }


@router.post("/{rfq_id}/select-quote", response_model=dict)
async def select_quote(
    rfq_id: str,
    data: dict,
    current_user: User = Depends(get_current_active_user),
):
    """Select winning quote for RFQ."""
    baserow = BaserowService()
    
    # Get existing RFQ
    existing = await baserow.get_rfq_by_id(rfq_id)
    if not existing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="RFQ not found",
        )
    
    # Check authorization
    if existing.get("requester_id") != current_user.id and current_user.role != "system_admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to select quotes for this RFQ",
        )
    
    quote_id = data.get("quote_id")
    if not quote_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="quote_id is required",
        )
    
    updated = await baserow.update_rfq(rfq_id, {
        "selected_quote_id": quote_id,
        "status": "awarded",
    })
    
    return {
        "success": True,
        "data": updated,
    }
