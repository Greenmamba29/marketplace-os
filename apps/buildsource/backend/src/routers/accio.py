"""ACCIO emergency sourcing router."""

from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer

from models.accio import (
    AccioRequest,
    AccioRequestCreate,
    AccioEstimateRequest,
    AccioEstimateResponse,
    AccioStatusUpdate,
)
from models.common import ApiResponse
from services.baserow import get_baserow_service
from services.accio import get_accio_service
from services.regional import get_regional_service

router = APIRouter(prefix="/accio", tags=["ACCIO"])
security = HTTPBearer()


def generate_request_number() -> str:
    """Generate a unique ACCIO request number."""
    from datetime import datetime
    timestamp = datetime.utcnow().strftime("%Y%m%d%H%M%S")
    return f"ACCIO-{timestamp}"


@router.post("/request", response_model=ApiResponse[AccioRequest])
async def create_request(
    request: AccioRequestCreate,
    accio=Depends(get_accio_service),
    baserow=Depends(get_baserow_service),
) -> ApiResponse[AccioRequest]:
    """Create an emergency sourcing request."""
    # Validate request
    validation = accio.validate_request(
        request.material_type.value,
        request.quantity_needed,
        request.needed_by,
    )
    
    if not validation["valid"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"errors": validation["errors"]},
        )
    
    # Create request
    request_data = request.model_dump()
    request_data["request_number"] = generate_request_number()
    request_data["status"] = "searching"
    
    created = await baserow.create_row("accio_requests", request_data)
    
    # Find best supplier
    suppliers_result = await baserow.list_rows(
        "suppliers",
        filters={"material_types__contains": request.material_type.value},
    )
    
    best_supplier = await accio.find_best_supplier(
        request.material_type.value,
        request.specification,
        request.quantity_needed,
        request.delivery_address.zip,
        request.needed_by,
        suppliers_result.get("results", []),
    )
    
    if best_supplier:
        # Update request with matched supplier
        await baserow.update_row(
            "accio_requests",
            created.get("id"),
            {
                "status": "found",
                "matched_supplier_id": best_supplier.get("supplier_id"),
            },
        )
        created["matched_supplier_id"] = best_supplier.get("supplier_id")
        created["status"] = "found"
    
    return ApiResponse.success_response(
        AccioRequest(**created),
        message="Emergency request created",
    )


@router.get("/request/{request_id}", response_model=ApiResponse[AccioRequest])
async def get_request(
    request_id: str,
    baserow=Depends(get_baserow_service),
) -> ApiResponse[AccioRequest]:
    """Get an ACCIO request by ID."""
    request = await baserow.get_row("accio_requests", request_id)
    if not request:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Request not found",
        )
    
    return ApiResponse.success_response(AccioRequest(**request))


@router.get("/my-requests", response_model=ApiResponse[List[AccioRequest]])
async def get_my_requests(
    baserow=Depends(get_baserow_service),
) -> ApiResponse[List[AccioRequest]]:
    """Get all ACCIO requests for current user."""
    # In a real implementation, filter by current user's projects
    result = await baserow.list_rows(
        "accio_requests",
        size=100,
    )
    
    requests = [AccioRequest(**item) for item in result.get("results", [])]
    return ApiResponse.success_response(requests)


@router.post("/request/{request_id}/cancel", response_model=ApiResponse[dict])
async def cancel_request(
    request_id: str,
    reason: str,
    baserow=Depends(get_baserow_service),
) -> ApiResponse[dict]:
    """Cancel an ACCIO request."""
    # Check if request exists
    existing = await baserow.get_row("accio_requests", request_id)
    if not existing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Request not found",
        )
    
    # Can only cancel active requests
    if existing.get("status") in ["delivered", "cancelled"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot cancel request in current status",
        )
    
    await baserow.update_row(
        "accio_requests",
        request_id,
        {
            "status": "cancelled",
            "cancellation_reason": reason,
        },
    )
    
    return ApiResponse.success_response(
        {},
        message="Request cancelled",
    )


@router.post("/estimate", response_model=ApiResponse[AccioEstimateResponse])
async def get_estimate(
    request: AccioEstimateRequest,
    accio=Depends(get_accio_service),
    baserow=Depends(get_baserow_service),
    regional=Depends(get_regional_service),
) -> ApiResponse[AccioEstimateResponse]:
    """Get delivery estimate for emergency request."""
    # Find nearby suppliers
    suppliers_result = await baserow.list_rows(
        "suppliers",
        filters={"material_types__contains": request.material_type.value},
    )
    
    # Add distance info
    suppliers = suppliers_result.get("results", [])
    for supplier in suppliers:
        supplier_zip = supplier.get("address", {}).get("zip", "")
        # Would calculate actual distance
        supplier["distance_miles"] = 25
    
    estimate = await accio.estimate_delivery(
        request.material_type.value,
        request.zip_code,
        request.quantity,
        suppliers,
    )
    
    return ApiResponse.success_response(AccioEstimateResponse(**estimate))


@router.get("/active", response_model=ApiResponse[List[AccioRequest]])
async def get_active_requests(
    baserow=Depends(get_baserow_service),
) -> ApiResponse[List[AccioRequest]]:
    """Get all active emergency requests (admin only)."""
    result = await baserow.list_rows(
        "accio_requests",
        filters={"status__in": "searching,found,in_transit"},
    )
    
    requests = [AccioRequest(**item) for item in result.get("results", [])]
    return ApiResponse.success_response(requests)


@router.patch("/request/{request_id}/status", response_model=ApiResponse[AccioRequest])
async def update_status(
    request_id: str,
    update: AccioStatusUpdate,
    baserow=Depends(get_baserow_service),
) -> ApiResponse[AccioRequest]:
    """Update ACCIO request status (admin/supplier only)."""
    # Check if request exists
    existing = await baserow.get_row("accio_requests", request_id)
    if not existing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Request not found",
        )
    
    update_data = {"status": update.status}
    
    if update.matched_supplier_id:
        update_data["matched_supplier_id"] = update.matched_supplier_id
    if update.estimated_arrival:
        update_data["estimated_arrival"] = update.estimated_arrival.isoformat()
    if update.notes:
        update_data["notes"] = update.notes
    
    updated = await baserow.update_row(
        "accio_requests",
        request_id,
        update_data,
    )
    
    return ApiResponse.success_response(AccioRequest(**updated))
