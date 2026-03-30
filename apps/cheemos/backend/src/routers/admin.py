"""Admin router — users from Neon DB, chemicals/suppliers via Baserow."""

from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from src.database import get_db
from src.db_models import DBAuditLog, DBOrder, DBRFQSubmission, DBUser
from src.models.user import User
from src.routers.auth import get_current_active_user
from src.services.baserow import get_baserow_service

router = APIRouter()


async def require_admin(current_user: User = Depends(get_current_active_user)) -> User:
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user


@router.get("/stats")
async def get_stats(
    admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    """Platform-wide statistics (Neon DB + Baserow)."""
    baserow = get_baserow_service()

    user_count = await db.execute(select(func.count()).select_from(DBUser))
    rfq_count = await db.execute(select(func.count()).select_from(DBRFQSubmission))
    order_count = await db.execute(select(func.count()).select_from(DBOrder))

    chemicals = await baserow.list_rows("CHEMICALS", size=1)

    return {
        "total_users": user_count.scalar_one(),
        "total_rfqs": rfq_count.scalar_one(),
        "total_orders": order_count.scalar_one(),
        "total_chemicals": chemicals.get("count", 0),
    }


@router.get("/users")
async def list_users(
    role: Optional[str] = None,
    is_active: Optional[bool] = None,
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    stmt = select(DBUser)
    if role:
        stmt = stmt.where(DBUser.role == role)
    if is_active is not None:
        stmt = stmt.where(DBUser.is_active == is_active)

    stmt = stmt.order_by(DBUser.created_at.desc())
    result = await db.execute(stmt)
    all_users = result.scalars().all()
    total = len(all_users)

    offset = (page - 1) * size
    paginated = all_users[offset: offset + size]

    items = [
        {
            "id": u.id,
            "email": u.email,
            "first_name": u.first_name,
            "last_name": u.last_name,
            "company_name": u.company_name,
            "role": u.role,
            "is_verified": u.is_verified,
            "is_active": u.is_active,
            "created_at": u.created_at.isoformat(),
            "last_login": u.last_login.isoformat() if u.last_login else None,
        }
        for u in paginated
    ]

    return {"items": items, "total": total, "page": page, "size": size}


@router.put("/users/{user_id}")
async def update_user(
    user_id: str,
    update_data: dict,
    admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(DBUser).where(DBUser.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    allowed = {"first_name", "last_name", "company_name", "role", "is_active", "is_verified", "phone"}
    for k, v in update_data.items():
        if k in allowed:
            setattr(user, k, v)

    return {"id": user.id, "email": user.email, "role": user.role}


@router.get("/pending-verifications")
async def get_pending_verifications(admin: User = Depends(require_admin)):
    baserow = get_baserow_service()
    results = await baserow.list_rows(
        "SUPPLIERS",
        filters={"is_verified__boolean": False},
        size=50,
    )
    return {"items": results.get("results", []), "total": results.get("count", 0)}


@router.post("/suppliers/{supplier_id}/verify")
async def verify_supplier(supplier_id: str, admin: User = Depends(require_admin)):
    from datetime import datetime
    baserow = get_baserow_service()
    try:
        updated = await baserow.update_row("SUPPLIERS", supplier_id, {
            "is_verified": True,
            "verification_date": datetime.utcnow().isoformat(),
        })
        return updated
    except Exception:
        raise HTTPException(status_code=404, detail="Supplier not found")


@router.get("/audit-log")
async def get_audit_log(
    entity_type: Optional[str] = None,
    entity_id: Optional[str] = None,
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    stmt = select(DBAuditLog)
    if entity_type:
        stmt = stmt.where(DBAuditLog.entity_type == entity_type)
    if entity_id:
        stmt = stmt.where(DBAuditLog.entity_id == entity_id)

    stmt = stmt.order_by(DBAuditLog.created_at.desc())
    result = await db.execute(stmt)
    all_logs = result.scalars().all()
    total = len(all_logs)

    offset = (page - 1) * size
    paginated = all_logs[offset: offset + size]

    items = [
        {
            "id": log.id,
            "actor_id": log.actor_id,
            "actor_email": log.actor_email,
            "action": log.action,
            "entity_type": log.entity_type,
            "entity_id": log.entity_id,
            "payload": log.payload,
            "created_at": log.created_at.isoformat(),
        }
        for log in paginated
    ]

    return {"items": items, "total": total, "page": page, "size": size}


@router.post("/chemicals/import")
async def import_chemicals(chemicals: list, admin: User = Depends(require_admin)):
    baserow = get_baserow_service()
    imported, errors = [], []
    for chemical in chemicals:
        try:
            result = await baserow.create_row("CHEMICALS", chemical)
            imported.append(result)
        except Exception as e:
            errors.append({"chemical": chemical.get("cas_number"), "error": str(e)})
    return {"imported": len(imported), "errors": len(errors), "details": errors}
