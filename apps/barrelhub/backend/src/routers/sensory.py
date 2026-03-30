"""Sensory Profiles router."""

from datetime import datetime
from typing import Optional

from fastapi import APIRouter, HTTPException, Query

from ..models.barrel import SpiritType
from ..models.sensory import (
    SensoryProfile,
    SensoryProfileCreate,
    SensoryAppearance,
    SensoryNose,
    SensoryPalate,
    SensoryFinish,
    SensoryDistribution,
    ScoreDistribution,
)

router = APIRouter()


# Mock sensory profiles
MOCK_PROFILES = [
    SensoryProfile(
        id="sensory-001",
        barrel_id="barrel-001",
        barrel_number="B2024-0001",
        evaluation_date=datetime(2024, 1, 15),
        evaluator="Master Taster John",
        overall_score=8.5,
        appearance=SensoryAppearance(
            color="Deep amber",
            clarity=9,
            viscosity=8,
        ),
        nose=SensoryNose(
            intensity=8,
            vanilla=9,
            caramel=8,
            oak=7,
            spice=6,
            fruit=5,
            floral=3,
            smoke=2,
            other_notes="Hints of toasted nuts",
        ),
        palate=SensoryPalate(
            intensity=8,
            sweetness=7,
            vanilla=9,
            caramel=8,
            oak=7,
            spice=6,
            fruit=5,
            body=8,
            complexity=8,
        ),
        finish=SensoryFinish(
            length=8,
            warmth=7,
            aftertaste=8,
        ),
        tasting_notes="Excellent bourbon with rich vanilla and caramel notes. Well-balanced oak influence with a long, warm finish. Ideal for premium bottling.",
        recommended_use="Single Barrel Release",
        created_at=datetime.now(),
        updated_at=datetime.now(),
    ),
    SensoryProfile(
        id="sensory-002",
        barrel_id="barrel-002",
        barrel_number="B2024-0002",
        evaluation_date=datetime(2024, 1, 20),
        evaluator="Master Taster Sarah",
        overall_score=7.8,
        appearance=SensoryAppearance(
            color="Golden amber",
            clarity=8,
            viscosity=7,
        ),
        nose=SensoryNose(
            intensity=7,
            vanilla=7,
            caramel=6,
            oak=8,
            spice=8,
            fruit=4,
            floral=2,
            smoke=3,
            other_notes="Peppery rye spice",
        ),
        palate=SensoryPalate(
            intensity=7,
            sweetness=6,
            vanilla=7,
            caramel=6,
            oak=8,
            spice=9,
            fruit=4,
            body=7,
            complexity=7,
        ),
        finish=SensoryFinish(
            length=7,
            warmth=8,
            aftertaste=7,
        ),
        tasting_notes="Classic rye profile with bold spice notes. Good structure and warmth. Suitable for blending or as a spicy component.",
        recommended_use="Blend Component",
        created_at=datetime.now(),
        updated_at=datetime.now(),
    ),
]


@router.get("", response_model=dict)
async def list_sensory_profiles(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    spirit_type: Optional[SpiritType] = None,
    search: Optional[str] = None,
):
    """List sensory profiles."""
    filtered = MOCK_PROFILES.copy()
    
    if search:
        search_lower = search.lower()
        filtered = [
            p for p in filtered
            if search_lower in p.barrel_number.lower()
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


@router.get("/barrel/{barrel_id}", response_model=list[SensoryProfile])
async def get_barrel_sensory(barrel_id: str):
    """Get sensory profiles for a specific barrel."""
    profiles = [p for p in MOCK_PROFILES if p.barrel_id == barrel_id]
    return profiles


@router.get("/{profile_id}", response_model=SensoryProfile)
async def get_sensory_profile(profile_id: str):
    """Get a single sensory profile."""
    profile = next((p for p in MOCK_PROFILES if p.id == profile_id), None)
    if not profile:
        raise HTTPException(status_code=404, detail="Sensory profile not found")
    return profile


@router.get("/distribution", response_model=SensoryDistribution)
async def get_score_distribution(spirit_type: Optional[SpiritType] = None):
    """Get score distribution data."""
    # Mock distribution data
    return SensoryDistribution(
        overall=ScoreDistribution(
            ranges=[
                {"min": 0, "max": 4, "count": 15},
                {"min": 4, "max": 6, "count": 45},
                {"min": 6, "max": 8, "count": 120},
                {"min": 8, "max": 10, "count": 80},
            ],
            average=7.2,
        ),
        by_category={
            "nose": {"average": 7.0, "distribution": [10, 20, 50, 80, 100]},
            "palate": {"average": 7.3, "distribution": [15, 25, 55, 85, 100]},
            "finish": {"average": 7.1, "distribution": [12, 22, 52, 82, 100]},
        },
    )


@router.post("", response_model=SensoryProfile, status_code=201)
async def create_sensory_profile(profile_data: SensoryProfileCreate):
    """Create a new sensory profile."""
    new_profile = SensoryProfile(
        id=f"sensory-{len(MOCK_PROFILES) + 1:03d}",
        created_at=datetime.now(),
        updated_at=datetime.now(),
        **profile_data.model_dump(),
    )
    MOCK_PROFILES.append(new_profile)
    return new_profile
