"""Equipment router."""

from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status

from ..models.auth import User, get_current_active_user
from ..models.equipment import (
    Equipment,
    EquipmentCreate,
    EquipmentUpdate,
    EquipmentFilter,
    UDITrackingInfo,
    RegulatoryClearance,
)
from ..services.baserow import BaserowService
from ..services.fda import FDAService

router = APIRouter()


@router.get("", response_model=dict)
async def list_equipment(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    category: Optional[List[str]] = Query(None),
    device_class: Optional[List[str]] = Query(None),
    manufacturer: Optional[List[str]] = Query(None),
    cold_chain: Optional[bool] = None,
    sterile: Optional[bool] = None,
    in_stock: Optional[bool] = None,
    search: Optional[str] = None,
    current_user: User = Depends(get_current_active_user),
):
    """List equipment with filtering."""
    baserow = BaserowService()
    
    filters = EquipmentFilter(
        category=category,
        device_class=device_class,
        manufacturer=manufacturer,
        cold_chain=cold_chain,
        sterile=sterile,
        in_stock=in_stock,
        search=search,
    )
    
    result = await baserow.list_equipment(
        page=page,
        per_page=per_page,
        filters=filters.model_dump(exclude_none=True),
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


@router.get("/search", response_model=dict)
async def search_equipment(
    q: str = Query(..., min_length=2),
    category: Optional[List[str]] = Query(None),
    device_class: Optional[List[str]] = Query(None),
    current_user: User = Depends(get_current_active_user),
):
    """Search equipment by query string."""
    baserow = BaserowService()
    
    results = await baserow.search_equipment(
        query=q,
        filters={
            "category": category,
            "device_class": device_class,
        },
    )
    
    return {
        "success": True,
        "data": results,
    }


@router.get("/category/{category_id}", response_model=dict)
async def get_equipment_by_category(
    category_id: str,
    current_user: User = Depends(get_current_active_user),
):
    """Get equipment by category."""
    baserow = BaserowService()
    results = await baserow.get_equipment_by_category(category_id)
    
    return {
        "success": True,
        "data": results,
    }


@router.get("/{equipment_id}", response_model=dict)
async def get_equipment(
    equipment_id: str,
    current_user: User = Depends(get_current_active_user),
):
    """Get equipment by ID."""
    baserow = BaserowService()
    equipment = await baserow.get_equipment_by_id(equipment_id)
    
    if not equipment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Equipment not found",
        )
    
    return {
        "success": True,
        "data": equipment,
    }


@router.get("/{equipment_id}/regulatory", response_model=dict)
async def get_regulatory_info(
    equipment_id: str,
    current_user: User = Depends(get_current_active_user),
):
    """Get regulatory information for equipment."""
    baserow = BaserowService()
    equipment = await baserow.get_equipment_by_id(equipment_id)
    
    if not equipment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Equipment not found",
        )
    
    return {
        "success": True,
        "data": equipment.get("regulatory", {}),
    }


@router.get("/{equipment_id}/fda-verify", response_model=dict)
async def verify_fda_clearance(
    equipment_id: str,
    current_user: User = Depends(get_current_active_user),
):
    """Verify FDA clearance for equipment."""
    baserow = BaserowService()
    fda = FDAService()
    
    equipment = await baserow.get_equipment_by_id(equipment_id)
    if not equipment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Equipment not found",
        )
    
    regulatory = equipment.get("regulatory", {})
    fda_clearance = regulatory.get("fda_clearance", {})
    
    # Verify with FDA API
    verification = await fda.verify_device(
        product_code=regulatory.get("fda_product_code"),
        clearance_number=fda_clearance.get("number"),
    )
    
    return {
        "success": True,
        "data": {
            "verified": verification.get("verified", False),
            "device_info": verification.get("device_info", {}),
            "recall_status": verification.get("recall_status", {}),
            "last_verified": verification.get("timestamp"),
        },
    }


@router.post("", response_model=dict, status_code=status.HTTP_201_CREATED)
async def create_equipment(
    equipment: EquipmentCreate,
    current_user: User = Depends(get_current_active_user),
):
    """Create new equipment (admin only)."""
    if current_user.role not in ["system_admin", "supplier"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to create equipment",
        )
    
    baserow = BaserowService()
    created = await baserow.create_equipment(equipment.model_dump())
    
    return {
        "success": True,
        "data": created,
    }


@router.patch("/{equipment_id}", response_model=dict)
async def update_equipment(
    equipment_id: str,
    updates: EquipmentUpdate,
    current_user: User = Depends(get_current_active_user),
):
    """Update equipment (admin only)."""
    if current_user.role not in ["system_admin", "supplier"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update equipment",
        )
    
    baserow = BaserowService()
    updated = await baserow.update_equipment(equipment_id, updates.model_dump(exclude_none=True))
    
    return {
        "success": True,
        "data": updated,
    }


# UDI Tracking endpoints
@router.get("/udi/scan/{udi}", response_model=dict)
async def scan_udi(
    udi: str,
    current_user: User = Depends(get_current_active_user),
):
    """Scan and lookup UDI."""
    baserow = BaserowService()
    
    # Parse UDI and lookup
    result = await baserow.get_udi_tracking_info(udi)
    
    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="UDI not found",
        )
    
    return {
        "success": True,
        "data": result,
    }


@router.get("/udi/validate/{udi}", response_model=dict)
async def validate_udi(
    udi: str,
    current_user: User = Depends(get_current_active_user),
):
    """Validate UDI format and check against FDA database."""
    fda = FDAService()
    
    # Validate UDI format
    is_valid = len(udi) >= 14
    
    # Check FDA database if applicable
    fda_check = await fda.check_udi(udi) if is_valid else None
    
    return {
        "success": True,
        "data": {
            "udi": udi,
            "valid_format": is_valid,
            "fda_verified": fda_check.get("verified") if fda_check else None,
            "device_info": fda_check.get("device_info") if fda_check else None,
        },
    }


@router.get("/udi/{udi}/history", response_model=dict)
async def get_udi_history(
    udi: str,
    current_user: User = Depends(get_current_active_user),
):
    """Get UDI movement history."""
    baserow = BaserowService()
    history = await baserow.get_udi_movement_history(udi)
    
    return {
        "success": True,
        "data": {
            "udi": udi,
            "movements": history,
        },
    }


@router.post("/udi/{udi}/movement", response_model=dict)
async def record_udi_movement(
    udi: str,
    data: dict,
    current_user: User = Depends(get_current_active_user),
):
    """Record UDI movement."""
    baserow = BaserowService()
    
    movement = await baserow.record_udi_movement(
        udi=udi,
        from_location=data.get("from_location"),
        to_location=data.get("to_location"),
        reason=data.get("reason"),
        performed_by=current_user.id,
    )
    
    return {
        "success": True,
        "data": movement,
    }


@router.get("/udi/order/{order_id}", response_model=dict)
async def get_order_udis(
    order_id: str,
    current_user: User = Depends(get_current_active_user),
):
    """Get all UDIs for an order."""
    baserow = BaserowService()
    udis = await baserow.get_order_udis(order_id)
    
    return {
        "success": True,
        "data": udis,
    }
