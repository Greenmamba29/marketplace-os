"""Admin router."""

from datetime import datetime, timedelta
from decimal import Decimal
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query

from ..models.user import User, UserRole
from ..models.ttb import TTBPermit, TTBStatus, PermitType

router = APIRouter()


# Mock admin data
MOCK_USERS = [
    User(
        id="user-001",
        email="admin@barrelhub.io",
        company_name="BarrelHub Admin",
        role=UserRole.ADMIN,
        is_verified=True,
        is_active=True,
        created_at=datetime.now() - timedelta(days=365),
        updated_at=datetime.now(),
    ),
    User(
        id="user-002",
        email="buyer@heritage.com",
        company_name="Heritage Blending Co.",
        role=UserRole.BUYER,
        ttb_permit_number="DSP-KY-99999",
        is_verified=True,
        is_active=True,
        created_at=datetime.now() - timedelta(days=180),
        updated_at=datetime.now(),
    ),
    User(
        id="user-003",
        email="supplier@kentuckyreserve.com",
        company_name="Kentucky Reserve Distillery",
        role=UserRole.SUPPLIER,
        ttb_permit_number="DSP-KY-12345",
        is_verified=True,
        is_active=True,
        created_at=datetime.now() - timedelta(days=200),
        updated_at=datetime.now(),
    ),
]

MOCK_PENDING_VERIFICATIONS = [
    {
        "id": "ver-001",
        "company": "Heritage Distilling Co.",
        "permit": "DSP-KY-12345",
        "type": "DSP",
        "submitted": "2024-01-15",
        "status": "pending",
    },
    {
        "id": "ver-002",
        "company": "Oak & Grain Brokers",
        "permit": "BWG-TX-67890",
        "type": "BWG",
        "submitted": "2024-01-14",
        "status": "pending",
    },
    {
        "id": "ver-003",
        "company": "Bluegrass Spirits LLC",
        "permit": "DSP-KY-54321",
        "type": "DSP",
        "submitted": "2024-01-13",
        "status": "pending",
    },
]

MOCK_AUDIT_LOG = [
    {
        "id": "audit-001",
        "action": "USER_LOGIN",
        "user_id": "user-002",
        "details": "User logged in successfully",
        "timestamp": datetime.now() - timedelta(minutes=5),
    },
    {
        "id": "audit-002",
        "action": "BARREL_CREATED",
        "user_id": "user-003",
        "details": "Created barrel listing B2024-0001",
        "timestamp": datetime.now() - timedelta(minutes=15),
    },
    {
        "id": "audit-003",
        "action": "RFQ_SUBMITTED",
        "user_id": "user-002",
        "details": "Submitted RFQ-2024-0001",
        "timestamp": datetime.now() - timedelta(hours=1),
    },
    {
        "id": "audit-004",
        "action": "QUOTE_ACCEPTED",
        "user_id": "user-002",
        "details": "Accepted quote Q-2024-0001",
        "timestamp": datetime.now() - timedelta(hours=2),
    },
    {
        "id": "audit-005",
        "action": "ORDER_CREATED",
        "user_id": "user-003",
        "details": "Created order ORD-2024-0001",
        "timestamp": datetime.now() - timedelta(hours=3),
    },
]


def require_admin(current_user: User = None) -> User:
    """Require admin role."""
    # In production, verify JWT token and check role
    # For now, return mock admin
    return MOCK_USERS[0]


@router.get("/stats")
async def get_dashboard_stats():
    """Get admin dashboard statistics."""
    return {
        "users": {
            "total": 4250,
            "buyers": 3200,
            "suppliers": 850,
            "admins": 5,
            "new_this_month": 145,
        },
        "barrels": {
            "total": 15234,
            "available": 8750,
            "reserved": 2100,
            "sold": 4384,
        },
        "transactions": {
            "total_volume": Decimal("2840000"),
            "total_value": Decimal("45600000"),
            "this_month_volume": Decimal("320000"),
            "this_month_value": Decimal("5200000"),
            "active_orders": 156,
        },
        "rfqs": {
            "total": 892,
            "pending": 45,
            "quoted": 120,
            "accepted": 727,
        },
        "pending_verifications": len(MOCK_PENDING_VERIFICATIONS),
    }


@router.get("/users", response_model=dict)
async def list_users(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    role: Optional[UserRole] = None,
    search: Optional[str] = None,
):
    """List all users."""
    filtered = MOCK_USERS.copy()
    
    if role:
        filtered = [u for u in filtered if u.role == role]
    
    if search:
        search_lower = search.lower()
        filtered = [
            u for u in filtered
            if search_lower in u.email.lower()
            or search_lower in u.company_name.lower()
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


@router.get("/users/{user_id}", response_model=User)
async def get_user(user_id: str):
    """Get a single user by ID."""
    user = next((u for u in MOCK_USERS if u.id == user_id), None)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.post("/users/{user_id}/verify")
async def verify_user(user_id: str):
    """Verify a user account."""
    user = next((u for u in MOCK_USERS if u.id == user_id), None)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.is_verified = True
    user.updated_at = datetime.now()
    
    return {"message": "User verified successfully", "user": user}


@router.post("/users/{user_id}/deactivate")
async def deactivate_user(user_id: str):
    """Deactivate a user account."""
    user = next((u for u in MOCK_USERS if u.id == user_id), None)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.is_active = False
    user.updated_at = datetime.now()
    
    return {"message": "User deactivated successfully"}


@router.get("/pending-verifications")
async def get_pending_verifications():
    """Get all pending TTB permit verifications."""
    return MOCK_PENDING_VERIFICATIONS


@router.post("/verifications/{verification_id}/approve")
async def approve_verification(verification_id: str):
    """Approve a pending verification."""
    verification = next(
        (v for v in MOCK_PENDING_VERIFICATIONS if v["id"] == verification_id),
        None
    )
    if not verification:
        raise HTTPException(status_code=404, detail="Verification not found")
    
    verification["status"] = "approved"
    
    return {"message": "Verification approved", "verification": verification}


@router.post("/verifications/{verification_id}/reject")
async def reject_verification(verification_id: str, reason: Optional[str] = None):
    """Reject a pending verification."""
    verification = next(
        (v for v in MOCK_PENDING_VERIFICATIONS if v["id"] == verification_id),
        None
    )
    if not verification:
        raise HTTPException(status_code=404, detail="Verification not found")
    
    verification["status"] = "rejected"
    verification["rejection_reason"] = reason
    
    return {"message": "Verification rejected", "verification": verification}


@router.get("/audit-log", response_model=dict)
async def get_audit_log(
    page: int = Query(1, ge=1),
    per_page: int = Query(50, ge=1, le=200),
    action: Optional[str] = None,
    user_id: Optional[str] = None,
):
    """Get audit log entries."""
    filtered = MOCK_AUDIT_LOG.copy()
    
    if action:
        filtered = [a for a in filtered if a["action"] == action]
    
    if user_id:
        filtered = [a for a in filtered if a["user_id"] == user_id]
    
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


@router.get("/reports/transactions")
async def get_transaction_report(
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
):
    """Get transaction report."""
    return {
        "period": {
            "start": start_date or datetime.now() - timedelta(days=30),
            "end": end_date or datetime.now(),
        },
        "summary": {
            "total_transactions": 156,
            "total_volume": Decimal("450000"),
            "total_value": Decimal("7200000"),
            "average_price_per_pg": Decimal("16.00"),
        },
        "by_spirit_type": {
            "bourbon": {"transactions": 89, "volume": Decimal("280000"), "value": Decimal("4760000")},
            "rye": {"transactions": 42, "volume": Decimal("120000"), "value": Decimal("1800000")},
            "scotch": {"transactions": 15, "volume": Decimal("35000"), "value": Decimal("490000")},
            "other": {"transactions": 10, "volume": Decimal("15000"), "value": Decimal("150000")},
        },
    }


@router.get("/reports/users")
async def get_user_report():
    """Get user activity report."""
    return {
        "total_users": 4250,
        "active_users_30d": 3200,
        "new_users_30d": 145,
        "verified_users": 3800,
        "by_role": {
            "buyer": 3200,
            "supplier": 850,
            "admin": 5,
        },
        "top_buyers": [
            {"company": "Heritage Blending Co.", "volume": Decimal("50000"), "transactions": 25},
            {"company": "Craft Spirits Exchange", "volume": Decimal("35000"), "transactions": 18},
            {"company": "Premium Bottlers LLC", "volume": Decimal("28000"), "transactions": 15},
        ],
        "top_suppliers": [
            {"company": "Kentucky Reserve Distillery", "volume": Decimal("75000"), "transactions": 45},
            {"company": "Tennessee Heritage Spirits", "volume": Decimal("52000"), "transactions": 32},
            {"company": "Indiana Grain & Barrel", "volume": Decimal("38000"), "transactions": 24},
        ],
    }
