"""Contracts router."""

from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status

from src.models import (
    ApiResponse,
    Contract,
    ContractCreate,
    PaginatedResponse,
)
from src.models.contracts import ContractStatus, ContractType
from src.routers.auth import get_current_active_user
from src.services.baserow import baserow_service

router = APIRouter(prefix="/contracts", tags=["Contracts"])


@router.get("", response_model=ApiResponse[PaginatedResponse[Contract]])
async def list_contracts(
    status: Optional[ContractStatus] = None,
    contract_type: Optional[ContractType] = None,
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    current_user: dict = Depends(get_current_active_user),
):
    """List contracts with optional filters."""
    filters = {}
    user_id = str(current_user.get("id"))
    
    # Filter by user (buyer or supplier)
    filters["filter__field_buyer_id__equal"] = user_id
    
    if status:
        filters["filter__field_status__equal"] = status.value
    if contract_type:
        filters["filter__field_contract_type__equal"] = contract_type.value
    
    result = await baserow_service.get_contracts(
        filters=filters if filters else None,
        page=page,
        size=per_page,
    )
    
    items = result.get("results", [])
    total = result.get("count", 0)
    
    return ApiResponse(
        success=True,
        data=PaginatedResponse(
            items=items,
            total=total,
            page=page,
            per_page=per_page,
            total_pages=(total + per_page - 1) // per_page,
        ),
    )


@router.get("/{contract_id}", response_model=ApiResponse[Contract])
async def get_contract(
    contract_id: str,
    current_user: dict = Depends(get_current_active_user),
):
    """Get a single contract by ID."""
    try:
        contract = await baserow_service.get_row(
            baserow_service.settings.contracts_table_id,
            contract_id,
        )
        
        # Check ownership
        user_id = str(current_user.get("id"))
        if contract.get("buyer_id") != user_id and contract.get("supplier_id") != user_id:
            if current_user.get("role") != "admin":
                raise HTTPException(status_code=403, detail="Access denied")
        
        return ApiResponse(success=True, data=contract)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Contract not found",
        )


@router.post("", response_model=ApiResponse[Contract])
async def create_contract(
    contract_data: ContractCreate,
    current_user: dict = Depends(get_current_active_user),
):
    """Create a new contract."""
    try:
        contract = await baserow_service.create_contract(contract_data.model_dump())
        return ApiResponse(
            success=True,
            data=contract,
            message="Contract created successfully",
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to create contract: {str(e)}",
        )


@router.patch("/{contract_id}", response_model=ApiResponse[Contract])
async def update_contract(
    contract_id: str,
    update_data: dict,
    current_user: dict = Depends(get_current_active_user),
):
    """Update a contract."""
    try:
        contract = await baserow_service.update_contract(contract_id, update_data)
        return ApiResponse(
            success=True,
            data=contract,
            message="Contract updated successfully",
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to update contract: {str(e)}",
        )


@router.post("/{contract_id}/terminate", response_model=ApiResponse[dict])
async def terminate_contract(
    contract_id: str,
    current_user: dict = Depends(get_current_active_user),
):
    """Terminate a contract."""
    try:
        contract = await baserow_service.get_row(
            baserow_service.settings.contracts_table_id,
            contract_id,
        )
        
        # Check ownership
        user_id = str(current_user.get("id"))
        if contract.get("buyer_id") != user_id:
            if current_user.get("role") != "admin":
                raise HTTPException(status_code=403, detail="Access denied")
        
        await baserow_service.update_contract(
            contract_id,
            {"status": ContractStatus.TERMINATED.value},
        )
        
        return ApiResponse(
            success=True,
            message="Contract terminated successfully",
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to terminate contract: {str(e)}",
        )
