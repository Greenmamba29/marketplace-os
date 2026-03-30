"""Chemicals router."""

from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query

from src.models.chemical import Chemical, ChemicalFilter, ChemicalSearchResult
from src.models.user import User
from src.routers.auth import get_current_active_user
from src.services.baserow import get_baserow_service

router = APIRouter()


@router.get("", response_model=dict)
async def list_chemicals(
    query: Optional[str] = None,
    cas_number: Optional[str] = None,
    category: Optional[str] = None,
    grade: Optional[str] = None,
    min_purity: Optional[float] = None,
    max_purity: Optional[float] = None,
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
):
    """List chemicals with filtering."""
    baserow = get_baserow_service()
    
    filters = {}
    
    if cas_number:
        filters["cas_number__equal"] = cas_number
    elif query:
        filters["search"] = query
    
    if category:
        filters["category__equal"] = category
    
    if grade:
        filters["grade__equal"] = grade
    
    results = await baserow.list_rows(
        "CHEMICALS",
        filters=filters if filters else None,
        page=page,
        size=size,
    )
    
    return {
        "results": results.get("results", []),
        "total": results.get("count", 0),
        "page": page,
        "size": size,
    }


@router.get("/search", response_model=List[ChemicalSearchResult])
async def search_chemicals(
    q: str = Query(..., min_length=2),
    limit: int = Query(10, ge=1, le=50),
):
    """Search chemicals by query."""
    baserow = get_baserow_service()
    
    results = await baserow.search_rows("CHEMICALS", q, limit=limit)
    
    return [
        {
            **chem,
            "score": 1.0,  # Baserow doesn't return scores
        }
        for chem in results
    ]


@router.get("/{chemical_id}", response_model=Chemical)
async def get_chemical(chemical_id: str):
    """Get a chemical by ID."""
    baserow = get_baserow_service()
    
    try:
        chemical = await baserow.get_row("CHEMICALS", chemical_id)
        return chemical
    except Exception as e:
        raise HTTPException(status_code=404, detail="Chemical not found")


@router.get("/cas/{cas_number}", response_model=Chemical)
async def get_chemical_by_cas(cas_number: str):
    """Get a chemical by CAS number."""
    baserow = get_baserow_service()
    
    results = await baserow.list_rows(
        "CHEMICALS",
        filters={"cas_number__equal": cas_number},
    )
    
    if not results.get("results"):
        raise HTTPException(status_code=404, detail="Chemical not found")
    
    return results["results"][0]


@router.get("/{chemical_id}/offerings")
async def get_chemical_offerings(
    chemical_id: str,
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
):
    """Get product offerings for a chemical."""
    baserow = get_baserow_service()
    
    results = await baserow.list_rows(
        "PRODUCT_OFFERINGS",
        filters={"chemical_id__equal": chemical_id},
        page=page,
        size=size,
    )
    
    return {
        "results": results.get("results", []),
        "total": results.get("count", 0),
        "page": page,
        "size": size,
    }


@router.get("/{chemical_id}/price-history")
async def get_price_history(
    chemical_id: str,
    months: int = Query(12, ge=1, le=24),
):
    """Get price history for a chemical."""
    baserow = get_baserow_service()
    
    results = await baserow.list_rows(
        "MARKET_INTELLIGENCE",
        filters={"cas_number__equal": chemical_id},
        size=months,
        order_by="-period_end",
    )
    
    history = []
    for intel in results.get("results", []):
        if intel.get("avg_price_usd_kg"):
            history.append({
                "date": intel["period_end"],
                "price": intel["avg_price_usd_kg"],
                "volume": intel.get("volume"),
            })
    
    return {"data": list(reversed(history))}
