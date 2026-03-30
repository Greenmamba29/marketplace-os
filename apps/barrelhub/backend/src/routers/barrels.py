"""Barrels router."""

from datetime import datetime
from decimal import Decimal
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status

from ..models.barrel import (
    Barrel,
    BarrelCreate,
    BarrelUpdate,
    BarrelFilter,
    SpiritType,
    StorageType,
    BarrelStatus,
)
from ..services.baserow import get_baserow_service, BaserowService

router = APIRouter()


# Mock data for demonstration
MOCK_BARRELS = [
    Barrel(
        id="barrel-001",
        barrel_number="B2024-0001",
        spirit_type=SpiritType.BOURBON,
        age_statement=8,
        entry_date=datetime(2016, 3, 15).date(),
        mash_bill="75% Corn, 21% Rye, 4% Malted Barley",
        distillery_origin="Kentucky Reserve Distillery",
        storage_type=StorageType.NEW_CHARRED_OAK,
        proof=Decimal("115.4"),
        volume_gallons=Decimal("53.0"),
        volume_proof_gallons=Decimal("111.56"),
        ttb_permit_number="DSP-KY-12345",
        tax_stamp_status="bonded",
        warehouse_location="Warehouse A, Rack 12, Tier 3",
        status=BarrelStatus.AVAILABLE,
        supplier_id="supplier-001",
        supplier_name="Kentucky Reserve Distillery",
        price_per_proof_gallon=Decimal("18.50"),
        total_value=Decimal("2063.86"),
        created_at=datetime.now(),
        updated_at=datetime.now(),
    ),
    Barrel(
        id="barrel-002",
        barrel_number="B2024-0002",
        spirit_type=SpiritType.RYE,
        age_statement=6,
        entry_date=datetime(2018, 6, 20).date(),
        mash_bill="51% Rye, 45% Corn, 4% Malted Barley",
        distillery_origin="Indiana Grain & Barrel",
        storage_type=StorageType.NEW_CHARRED_OAK,
        proof=Decimal("110.2"),
        volume_gallons=Decimal("53.0"),
        volume_proof_gallons=Decimal("116.61"),
        ttb_permit_number="DSP-IN-54321",
        tax_stamp_status="bonded",
        warehouse_location="Warehouse B, Rack 8, Tier 2",
        status=BarrelStatus.AVAILABLE,
        supplier_id="supplier-002",
        supplier_name="Indiana Grain & Barrel",
        price_per_proof_gallon=Decimal("16.75"),
        total_value=Decimal("1953.22"),
        created_at=datetime.now(),
        updated_at=datetime.now(),
    ),
    Barrel(
        id="barrel-003",
        barrel_number="B2024-0003",
        spirit_type=SpiritType.BOURBON,
        age_statement=12,
        entry_date=datetime(2012, 1, 10).date(),
        mash_bill="78% Corn, 10% Rye, 12% Malted Barley",
        distillery_origin="Tennessee Heritage Spirits",
        storage_type=StorageType.NEW_CHARRED_OAK,
        proof=Decimal("118.6"),
        volume_gallons=Decimal("52.5"),
        volume_proof_gallons=Decimal("124.27"),
        ttb_permit_number="DSP-TN-98765",
        tax_stamp_status="bonded",
        warehouse_location="Warehouse C, Rack 15, Tier 4",
        status=BarrelStatus.RESERVED,
        supplier_id="supplier-003",
        supplier_name="Tennessee Heritage Spirits",
        price_per_proof_gallon=Decimal("24.00"),
        total_value=Decimal("2982.48"),
        created_at=datetime.now(),
        updated_at=datetime.now(),
    ),
]


@router.get("", response_model=dict)
async def list_barrels(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    spirit_type: Optional[List[SpiritType]] = Query(None),
    age_min: Optional[int] = Query(None, ge=0),
    age_max: Optional[int] = Query(None, ge=0),
    proof_min: Optional[Decimal] = Query(None, ge=0),
    proof_max: Optional[Decimal] = Query(None, ge=0),
    price_min: Optional[Decimal] = Query(None, ge=0),
    price_max: Optional[Decimal] = Query(None, ge=0),
    status: Optional[List[BarrelStatus]] = Query(None),
    search: Optional[str] = Query(None),
):
    """List barrels with filtering and pagination."""
    # Filter barrels
    filtered = MOCK_BARRELS.copy()
    
    if spirit_type:
        filtered = [b for b in filtered if b.spirit_type in spirit_type]
    
    if age_min is not None:
        filtered = [b for b in filtered if (b.age_statement or 0) >= age_min]
    
    if age_max is not None:
        filtered = [b for b in filtered if (b.age_statement or 0) <= age_max]
    
    if proof_min is not None:
        filtered = [b for b in filtered if b.proof >= proof_min]
    
    if proof_max is not None:
        filtered = [b for b in filtered if b.proof <= proof_max]
    
    if price_min is not None:
        filtered = [b for b in filtered if (b.price_per_proof_gallon or Decimal("0")) >= price_min]
    
    if price_max is not None:
        filtered = [b for b in filtered if (b.price_per_proof_gallon or Decimal("999999")) <= price_max]
    
    if status:
        filtered = [b for b in filtered if b.status in status]
    
    if search:
        search_lower = search.lower()
        filtered = [
            b for b in filtered 
            if search_lower in b.barrel_number.lower() 
            or search_lower in b.distillery_origin.lower()
            or search_lower in b.warehouse_location.lower()
        ]
    
    # Paginate
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


@router.get("/filters")
async def get_filters():
    """Get available filter options."""
    return {
        "spirit_types": [t.value for t in SpiritType],
        "distilleries": list(set(b.distillery_origin for b in MOCK_BARRELS)),
        "storage_types": [t.value for t in StorageType],
        "locations": list(set(b.warehouse_location.split(",")[0] for b in MOCK_BARRELS)),
        "age_range": {"min": 2, "max": 20},
        "proof_range": {"min": 80, "max": 140},
        "price_range": {"min": 10, "max": 50},
    }


@router.get("/search")
async def search_barrels(
    q: str = Query(..., min_length=2),
    spirit_type: Optional[SpiritType] = None,
    limit: int = Query(20, ge=1, le=50),
):
    """Search barrels by query string."""
    query_lower = q.lower()
    results = [
        b for b in MOCK_BARRELS
        if query_lower in b.barrel_number.lower()
        or query_lower in b.distillery_origin.lower()
        or query_lower in b.mash_bill.lower()
    ]
    
    if spirit_type:
        results = [b for b in results if b.spirit_type == spirit_type]
    
    return results[:limit]


@router.get("/{barrel_id}", response_model=Barrel)
async def get_barrel(barrel_id: str):
    """Get a single barrel by ID."""
    barrel = next((b for b in MOCK_BARRELS if b.id == barrel_id), None)
    if not barrel:
        raise HTTPException(status_code=404, detail="Barrel not found")
    return barrel


@router.get("/number/{barrel_number}", response_model=Barrel)
async def get_barrel_by_number(barrel_number: str):
    """Get a barrel by its number."""
    barrel = next((b for b in MOCK_BARRELS if b.barrel_number == barrel_number), None)
    if not barrel:
        raise HTTPException(status_code=404, detail="Barrel not found")
    return barrel


@router.post("", response_model=Barrel, status_code=status.HTTP_201_CREATED)
async def create_barrel(barrel_data: BarrelCreate):
    """Create a new barrel listing."""
    # In production, save to Baserow
    new_barrel = Barrel(
        id=f"barrel-{len(MOCK_BARRELS) + 1:03d}",
        supplier_name="New Supplier",
        created_at=datetime.now(),
        updated_at=datetime.now(),
        **barrel_data.model_dump(),
    )
    MOCK_BARRELS.append(new_barrel)
    return new_barrel


@router.patch("/{barrel_id}", response_model=Barrel)
async def update_barrel(barrel_id: str, barrel_data: BarrelUpdate):
    """Update a barrel."""
    barrel = next((b for b in MOCK_BARRELS if b.id == barrel_id), None)
    if not barrel:
        raise HTTPException(status_code=404, detail="Barrel not found")
    
    # Update fields
    update_data = barrel_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(barrel, field, value)
    
    barrel.updated_at = datetime.now()
    return barrel


@router.delete("/{barrel_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_barrel(barrel_id: str):
    """Delete a barrel."""
    global MOCK_BARRELS
    barrel = next((b for b in MOCK_BARRELS if b.id == barrel_id), None)
    if not barrel:
        raise HTTPException(status_code=404, detail="Barrel not found")
    
    MOCK_BARRELS = [b for b in MOCK_BARRELS if b.id != barrel_id]
    return None
