"""RFQ router — backed by Neon DB."""

from datetime import datetime, timedelta
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from src.database import get_db
from src.db_models import DBAuditLog, DBRFQItem, DBRFQSubmission
from src.models.rfq import RFQItemCreate, RFQSubmission, RFQSubmissionCreate, RFQSubmissionUpdate
from src.models.user import User
from src.routers.auth import get_current_active_user

router = APIRouter()


def _rfq_to_dict(rfq: DBRFQSubmission) -> dict:
    return {
        "id": rfq.id,
        "buyer_id": rfq.buyer_id,
        "title": rfq.title,
        "description": rfq.description,
        "status": rfq.status,
        "delivery_location_city": rfq.delivery_location_city,
        "delivery_location_country": rfq.delivery_location_country,
        "delivery_date": rfq.delivery_date.isoformat() if rfq.delivery_date else None,
        "incoterms": rfq.incoterms,
        "payment_terms": rfq.payment_terms,
        "additional_requirements": rfq.additional_requirements,
        "quotes_received": rfq.quotes_received,
        "expires_at": rfq.expires_at.isoformat() if rfq.expires_at else None,
        "accio_analysis": rfq.accio_analysis,
        "created_at": rfq.created_at.isoformat(),
        "updated_at": rfq.updated_at.isoformat(),
        "items": [
            {
                "id": item.id,
                "cas_number": item.cas_number,
                "chemical_name": item.chemical_name,
                "quantity": float(item.quantity),
                "unit": item.unit,
                "grade": item.grade,
                "min_purity": float(item.min_purity) if item.min_purity else None,
                "packaging": item.packaging,
                "special_requirements": item.special_requirements,
            }
            for item in (rfq.items or [])
        ],
    }


@router.get("")
async def list_rfqs(
    status: Optional[str] = None,
    buyer_id: Optional[str] = None,
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    stmt = select(DBRFQSubmission).options(selectinload(DBRFQSubmission.items))

    if current_user.role != "admin":
        stmt = stmt.where(DBRFQSubmission.buyer_id == current_user.id)
    elif buyer_id:
        stmt = stmt.where(DBRFQSubmission.buyer_id == buyer_id)

    if status:
        stmt = stmt.where(DBRFQSubmission.status == status)

    stmt = stmt.order_by(DBRFQSubmission.created_at.desc())

    result = await db.execute(stmt)
    all_items = result.scalars().all()
    total = len(all_items)

    offset = (page - 1) * size
    paginated = all_items[offset: offset + size]

    return {
        "items": [_rfq_to_dict(r) for r in paginated],
        "total": total,
        "page": page,
        "size": size,
    }


@router.get("/{rfq_id}")
async def get_rfq(
    rfq_id: str,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(DBRFQSubmission)
        .options(selectinload(DBRFQSubmission.items))
        .where(DBRFQSubmission.id == rfq_id)
    )
    rfq = result.scalar_one_or_none()
    if not rfq:
        raise HTTPException(status_code=404, detail="RFQ not found")

    if current_user.role != "admin" and rfq.buyer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    return _rfq_to_dict(rfq)


@router.post("")
async def create_rfq(
    rfq_data: RFQSubmissionCreate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    rfq = DBRFQSubmission(
        buyer_id=current_user.id,
        title=rfq_data.title,
        description=getattr(rfq_data, "description", None),
        status="submitted",
        delivery_location_city=getattr(rfq_data, "delivery_location_city", None),
        delivery_location_country=getattr(rfq_data, "delivery_location_country", None),
        delivery_date=getattr(rfq_data, "delivery_date", None),
        incoterms=getattr(rfq_data, "incoterms", None),
        payment_terms=getattr(rfq_data, "payment_terms", None),
        additional_requirements=getattr(rfq_data, "additional_requirements", None),
        quotes_received=0,
        expires_at=datetime.utcnow() + timedelta(days=14),
    )
    db.add(rfq)
    await db.flush()

    for item_data in (rfq_data.items or []):
        item = DBRFQItem(
            rfq_id=rfq.id,
            cas_number=getattr(item_data, "cas_number", None),
            chemical_name=item_data.chemical_name,
            quantity=item_data.quantity,
            unit=getattr(item_data, "unit", "kg"),
            grade=getattr(item_data, "grade", None),
            min_purity=getattr(item_data, "min_purity", None),
            packaging=getattr(item_data, "packaging", None),
            special_requirements=getattr(item_data, "special_requirements", None),
        )
        db.add(item)

    db.add(DBAuditLog(
        actor_id=current_user.id,
        actor_email=current_user.email,
        action="rfq.created",
        entity_type="rfq",
        entity_id=rfq.id,
    ))

    await db.flush()

    # Reload with items
    result = await db.execute(
        select(DBRFQSubmission)
        .options(selectinload(DBRFQSubmission.items))
        .where(DBRFQSubmission.id == rfq.id)
    )
    return _rfq_to_dict(result.scalar_one())


@router.put("/{rfq_id}")
async def update_rfq(
    rfq_id: str,
    update_data: RFQSubmissionUpdate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(DBRFQSubmission)
        .options(selectinload(DBRFQSubmission.items))
        .where(DBRFQSubmission.id == rfq_id)
    )
    rfq = result.scalar_one_or_none()
    if not rfq:
        raise HTTPException(status_code=404, detail="RFQ not found")

    if current_user.role != "admin" and rfq.buyer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    for field, value in update_data.model_dump(exclude_unset=True).items():
        setattr(rfq, field, value)

    return _rfq_to_dict(rfq)


@router.delete("/{rfq_id}")
async def delete_rfq(
    rfq_id: str,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(DBRFQSubmission).where(DBRFQSubmission.id == rfq_id))
    rfq = result.scalar_one_or_none()
    if not rfq:
        raise HTTPException(status_code=404, detail="RFQ not found")

    if current_user.role != "admin" and rfq.buyer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    await db.delete(rfq)
    return {"message": "RFQ deleted"}


@router.post("/{rfq_id}/items")
async def add_rfq_item(
    rfq_id: str,
    item_data: RFQItemCreate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(DBRFQSubmission).where(DBRFQSubmission.id == rfq_id))
    rfq = result.scalar_one_or_none()
    if not rfq:
        raise HTTPException(status_code=404, detail="RFQ not found")

    if current_user.role != "admin" and rfq.buyer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    item = DBRFQItem(
        rfq_id=rfq_id,
        chemical_name=item_data.chemical_name,
        quantity=item_data.quantity,
        unit=getattr(item_data, "unit", "kg"),
        cas_number=getattr(item_data, "cas_number", None),
        grade=getattr(item_data, "grade", None),
        min_purity=getattr(item_data, "min_purity", None),
    )
    db.add(item)
    await db.flush()
    return {"id": item.id, "rfq_id": item.rfq_id, "chemical_name": item.chemical_name}


# ACCIO Work — autonomous sourcing AI endpoint
@router.post("/accio/analyze")
async def accio_analyze(
    description: str,
    requirements: Optional[List[str]] = None,
    current_user: User = Depends(get_current_active_user),
):
    from src.services.claude import get_claude_service
    claude = get_claude_service()
    result = await claude.analyze_chemical_request(description, requirements)
    return result
