"""Barrel Registry router."""

from datetime import datetime
from decimal import Decimal
from typing import List, Optional

from fastapi import APIRouter, HTTPException, Query, status

from ..models.barrel import (
    BarrelRegistry,
    BarrelRegistryCreate,
    SampleRecord,
    MovementRecord,
    BarrelHistory,
)

router = APIRouter()


# Mock registry data
MOCK_REGISTRY = [
    BarrelRegistry(
        id="reg-001",
        barrel_id="barrel-001",
        barrel_number="B2024-0001",
        fill_date=datetime(2016, 3, 15).date(),
        original_proof=Decimal("125.0"),
        original_volume=Decimal("53.0"),
        current_proof=Decimal("115.4"),
        current_volume=Decimal("53.0"),
        angel_share_loss=Decimal("0"),
        warehouse_location="Warehouse A, Rack 12, Tier 3",
        rack_number="12",
        tier_position="3",
        sample_history=[
            SampleRecord(
                date=datetime(2020, 6, 1),
                proof=Decimal("118.5"),
                volume=Decimal("0.5"),
                sample_type="routine",
                notes="Good progression",
            ),
            SampleRecord(
                date=datetime(2022, 9, 15),
                proof=Decimal("116.2"),
                volume=Decimal("0.5"),
                sample_type="routine",
                notes="Excellent color",
            ),
        ],
        movement_history=[
            MovementRecord(
                date=datetime(2016, 3, 15),
                from_location="Fermentation",
                to_location="Warehouse A, Rack 12, Tier 3",
                reason="Initial fill",
                authorized_by="J. Smith",
            ),
        ],
        created_at=datetime.now(),
        updated_at=datetime.now(),
    ),
    BarrelRegistry(
        id="reg-002",
        barrel_id="barrel-002",
        barrel_number="B2024-0002",
        fill_date=datetime(2018, 6, 20).date(),
        original_proof=Decimal("120.0"),
        original_volume=Decimal("53.0"),
        current_proof=Decimal("110.2"),
        current_volume=Decimal("52.5"),
        angel_share_loss=Decimal("0.5"),
        warehouse_location="Warehouse B, Rack 8, Tier 2",
        rack_number="8",
        tier_position="2",
        sample_history=[
            SampleRecord(
                date=datetime(2021, 3, 10),
                proof=Decimal("114.8"),
                volume=Decimal("0.5"),
                sample_type="routine",
            ),
        ],
        movement_history=[],
        created_at=datetime.now(),
        updated_at=datetime.now(),
    ),
]


@router.get("", response_model=dict)
async def list_registry(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    search: Optional[str] = None,
):
    """List barrel registry entries."""
    filtered = MOCK_REGISTRY.copy()
    
    if search:
        search_lower = search.lower()
        filtered = [
            r for r in filtered
            if search_lower in r.barrel_number.lower()
            or search_lower in r.barrel_id.lower()
        ]
    
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


@router.get("/barrel/{barrel_id}", response_model=BarrelRegistry)
async def get_registry_by_barrel(barrel_id: str):
    """Get registry entry for a specific barrel."""
    registry = next((r for r in MOCK_REGISTRY if r.barrel_id == barrel_id), None)
    if not registry:
        raise HTTPException(status_code=404, detail="Registry entry not found")
    return registry


@router.get("/barrel/{barrel_id}/history", response_model=BarrelHistory)
async def get_barrel_history(barrel_id: str):
    """Get complete history for a barrel."""
    registry = next((r for r in MOCK_REGISTRY if r.barrel_id == barrel_id), None)
    if not registry:
        raise HTTPException(status_code=404, detail="Registry entry not found")
    
    return BarrelHistory(
        samples=registry.sample_history,
        movements=registry.movement_history,
    )


@router.post("/barrel/{barrel_id}/sample", status_code=status.HTTP_201_CREATED)
async def add_sample(
    barrel_id: str,
    sample: SampleRecord,
):
    """Add a sample record to a barrel."""
    registry = next((r for r in MOCK_REGISTRY if r.barrel_id == barrel_id), None)
    if not registry:
        raise HTTPException(status_code=404, detail="Registry entry not found")
    
    registry.sample_history.append(sample)
    registry.updated_at = datetime.now()
    
    return {"message": "Sample added successfully", "sample": sample}


@router.post("/barrel/{barrel_id}/movement", status_code=status.HTTP_201_CREATED)
async def record_movement(
    barrel_id: str,
    movement: MovementRecord,
):
    """Record a barrel movement."""
    registry = next((r for r in MOCK_REGISTRY if r.barrel_id == barrel_id), None)
    if not registry:
        raise HTTPException(status_code=404, detail="Registry entry not found")
    
    registry.movement_history.append(movement)
    registry.warehouse_location = movement.to_location
    registry.updated_at = datetime.now()
    
    return {"message": "Movement recorded successfully", "movement": movement}


@router.post("", response_model=BarrelRegistry, status_code=status.HTTP_201_CREATED)
async def create_registry_entry(registry_data: BarrelRegistryCreate):
    """Create a new registry entry."""
    new_registry = BarrelRegistry(
        id=f"reg-{len(MOCK_REGISTRY) + 1:03d}",
        sample_history=[],
        movement_history=[],
        created_at=datetime.now(),
        updated_at=datetime.now(),
        **registry_data.model_dump(),
    )
    MOCK_REGISTRY.append(new_registry)
    return new_registry
