"""Admin router."""

from datetime import datetime
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status

from src.models.auth import User, get_current_active_user
from src.services.epa import EPAService

router = APIRouter(prefix="/admin", tags=["Admin"])


async def get_current_admin(current_user: User = Depends(get_current_active_user)) -> User:
    """Verify user is admin."""
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user


@router.get("/users")
async def list_users(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    role: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    current_user: User = Depends(get_current_admin),
):
    """List all users."""
    return {
        "items": [
            {
                "id": "user_1",
                "email": "john@farmco.com",
                "first_name": "John",
                "last_name": "Smith",
                "role": "buyer",
                "company_name": "FarmCo Inc",
                "status": "active",
                "created_at": datetime.utcnow().isoformat(),
            },
        ],
        "total": 1,
        "page": page,
        "per_page": per_page,
        "total_pages": 1,
    }


@router.get("/suppliers")
async def list_suppliers(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    status: Optional[str] = Query(None),
    current_user: User = Depends(get_current_admin),
):
    """List all suppliers."""
    return {
        "items": [
            {
                "id": "supplier_1",
                "company_name": "AgriSupply LLC",
                "contact_name": "Sarah Johnson",
                "contact_email": "sarah@agrisupply.com",
                "status": "verified",
                "product_count": 234,
                "rating": 4.8,
                "created_at": datetime.utcnow().isoformat(),
            },
        ],
        "total": 1,
        "page": page,
        per_page=per_page,
        "total_pages": 1,
    }


@router.post("/suppliers/{supplier_id}/verify")
async def verify_supplier(
    supplier_id: str,
    current_user: User = Depends(get_current_admin),
):
    """Verify a supplier."""
    return {
        "message": "Supplier verified successfully",
        "supplier_id": supplier_id,
        "status": "verified",
        "verified_at": datetime.utcnow().isoformat(),
        "verified_by": current_user.id,
    }


@router.get("/inputs")
async def list_inputs(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    status: Optional[str] = Query(None),
    current_user: User = Depends(get_current_admin),
):
    """List all inputs/products."""
    return {
        "items": [
            {
                "id": "input_1",
                "name": "Roundup PowerMax 3",
                "category": "crop_protection",
                "brand": "Bayer",
                "supplier_name": "AgriSupply LLC",
                "epa_number": "524-529",
                "status": "approved",
                "created_at": datetime.utcnow().isoformat(),
            },
        ],
        "total": 1,
        "page": page,
        "per_page": per_page,
        "total_pages": 1,
    }


@router.post("/inputs/{input_id}/approve")
async def approve_input(
    input_id: str,
    current_user: User = Depends(get_current_admin),
):
    """Approve an input/product."""
    return {
        "message": "Input approved successfully",
        "input_id": input_id,
        "status": "approved",
        "approved_at": datetime.utcnow().isoformat(),
        "approved_by": current_user.id,
    }


@router.get("/rfqs")
async def list_all_rfqs(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    status: Optional[str] = Query(None),
    current_user: User = Depends(get_current_admin),
):
    """List all RFQs."""
    return {
        "items": [
            {
                "id": "rfq_1",
                "title": "Spring 2024 Corn Inputs",
                "buyer_name": "John Smith",
                "crop_type": "Corn",
                "status": "bidding",
                "quote_count": 3,
                "created_at": datetime.utcnow().isoformat(),
            },
        ],
        "total": 1,
        "page": page,
        "per_page": per_page,
        "total_pages": 1,
    }


@router.get("/orders")
async def list_all_orders(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    status: Optional[str] = Query(None),
    current_user: User = Depends(get_current_admin),
):
    """List all orders."""
    return {
        "items": [
            {
                "id": "order_1",
                "buyer_name": "John Smith",
                "supplier_name": "AgriSupply LLC",
                "total_amount": 155500.00,
                "status": "confirmed",
                "created_at": datetime.utcnow().isoformat(),
            },
        ],
        "total": 1,
        "page": page,
        "per_page": per_page,
        "total_pages": 1,
    }


@router.get("/analytics")
async def get_analytics(
    current_user: User = Depends(get_current_admin),
):
    """Get platform analytics."""
    return {
        "overview": {
            "total_users": 2847,
            "total_suppliers": 156,
            "total_products": 15234,
            "total_rfqs": 892,
            "total_orders": 3456,
            "total_volume": 45600000,
        },
        "growth": {
            "users_monthly": 12.5,
            "orders_monthly": 23.8,
            "volume_monthly": 18.2,
        },
        "top_categories": [
            {"category": "seed", "order_count": 1200, "volume": 15000000},
            {"category": "fertilizer", "order_count": 980, "volume": 18000000},
            {"category": "crop_protection", "order_count": 1276, "volume": 12600000},
        ],
        "top_states": [
            {"state": "IA", "order_count": 450, "volume": 8500000},
            {"state": "IL", "order_count": 380, "volume": 7200000},
            {"state": "NE", "order_count": 290, "volume": 5800000},
        ],
    }


@router.post("/epa/sync")
async def sync_epa_data(
    current_user: User = Depends(get_current_admin),
):
    """Sync EPA registration data."""
    epa_service = EPAService()
    result = await epa_service.sync_registrations()
    return result


@router.get("/epa/stats")
async def get_epa_stats(
    current_user: User = Depends(get_current_admin),
):
    """Get EPA registration statistics."""
    return {
        "total_registrations": 15432,
        "by_status": {
            "registered": 14200,
            "pending": 523,
            "expired": 709,
        },
        "by_state": {
            "IA": 12500,
            "IL": 11800,
            "NE": 10200,
        },
        "last_sync": datetime.utcnow().isoformat(),
    }
