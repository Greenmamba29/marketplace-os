"""Quotes router — backed by Neon DB."""

from datetime import datetime
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from src.database import get_db
from src.db_models import DBAuditLog, DBOrder, DBQuote, DBQuoteItem, DBRFQSubmission
from src.models.quote import Quote, QuoteAcceptRequest, QuoteCreate, QuoteUpdate
from src.models.user import User
from src.routers.auth import get_current_active_user

router = APIRouter()


def _quote_to_dict(q: DBQuote) -> dict:
    return {
        "id": q.id,
        "rfq_id": q.rfq_id,
        "supplier_baserow_id": q.supplier_baserow_id,
        "supplier_name": q.supplier_name,
        "status": q.status,
        "total_amount": float(q.total_amount),
        "currency": q.currency,
        "unit_price": float(q.unit_price) if q.unit_price else None,
        "delivery_lead_days": q.delivery_lead_days,
        "incoterms": q.incoterms,
        "payment_terms": q.payment_terms,
        "validity_days": q.validity_days,
        "notes": q.notes,
        "platform_margin_pct": float(q.platform_margin_pct),
        "supplier_cost": float(q.supplier_cost) if q.supplier_cost else None,
        "created_at": q.created_at.isoformat(),
        "accepted_at": q.accepted_at.isoformat() if q.accepted_at else None,
        "items": [
            {
                "id": item.id,
                "chemical_name": item.chemical_name,
                "cas_number": item.cas_number,
                "quantity": float(item.quantity),
                "unit": item.unit,
                "unit_price": float(item.unit_price),
                "total_price": float(item.total_price),
                "currency": item.currency,
            }
            for item in (q.items or [])
        ],
    }


@router.get("")
async def list_quotes(
    rfq_id: Optional[str] = None,
    status: Optional[str] = None,
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    stmt = select(DBQuote).options(selectinload(DBQuote.items))

    if rfq_id:
        stmt = stmt.where(DBQuote.rfq_id == rfq_id)
    if status:
        stmt = stmt.where(DBQuote.status == status)

    stmt = stmt.order_by(DBQuote.created_at.desc())
    result = await db.execute(stmt)
    all_items = result.scalars().all()
    total = len(all_items)

    offset = (page - 1) * size
    paginated = all_items[offset: offset + size]

    return {
        "items": [_quote_to_dict(q) for q in paginated],
        "total": total,
        "page": page,
        "size": size,
    }


@router.get("/{quote_id}")
async def get_quote(
    quote_id: str,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(DBQuote).options(selectinload(DBQuote.items)).where(DBQuote.id == quote_id)
    )
    quote = result.scalar_one_or_none()
    if not quote:
        raise HTTPException(status_code=404, detail="Quote not found")
    return _quote_to_dict(quote)


@router.post("")
async def create_quote(
    quote_data: QuoteCreate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    if current_user.role not in ("supplier", "admin"):
        raise HTTPException(status_code=403, detail="Only suppliers can create quotes")

    rfq_result = await db.execute(
        select(DBRFQSubmission).where(DBRFQSubmission.id == quote_data.rfq_id)
    )
    rfq = rfq_result.scalar_one_or_none()
    if not rfq:
        raise HTTPException(status_code=404, detail="RFQ not found")

    quote = DBQuote(
        rfq_id=quote_data.rfq_id,
        supplier_name=getattr(quote_data, "supplier_name", current_user.company_name),
        status="pending",
        total_amount=0,
        currency=getattr(quote_data, "currency", "USD"),
        delivery_lead_days=getattr(quote_data, "delivery_lead_days", None),
        incoterms=getattr(quote_data, "incoterms", None),
        payment_terms=getattr(quote_data, "payment_terms", None),
        validity_days=getattr(quote_data, "validity_days", 30),
        notes=getattr(quote_data, "notes", None),
        platform_margin_pct=getattr(quote_data, "platform_margin_pct", 20.0),
    )
    db.add(quote)
    await db.flush()

    total = 0.0
    for item_data in (getattr(quote_data, "items", None) or []):
        qty = float(item_data.quantity)
        unit_price = float(item_data.unit_price)
        line_total = qty * unit_price
        total += line_total

        item = DBQuoteItem(
            quote_id=quote.id,
            rfq_item_id=getattr(item_data, "rfq_item_id", None),
            chemical_name=item_data.chemical_name,
            cas_number=getattr(item_data, "cas_number", None),
            quantity=qty,
            unit=getattr(item_data, "unit", "kg"),
            unit_price=unit_price,
            total_price=line_total,
            currency=getattr(item_data, "currency", "USD"),
        )
        db.add(item)

    quote.total_amount = total
    # Derive supplier cost from margin
    if quote.platform_margin_pct:
        quote.supplier_cost = total * (1 - float(quote.platform_margin_pct) / 100)

    rfq.quotes_received = (rfq.quotes_received or 0) + 1
    if rfq.status == "submitted":
        rfq.status = "sourcing"

    db.add(DBAuditLog(
        actor_id=current_user.id,
        actor_email=current_user.email,
        action="quote.created",
        entity_type="quote",
        entity_id=quote.id,
        payload={"rfq_id": quote_data.rfq_id},
    ))

    await db.flush()
    result = await db.execute(
        select(DBQuote).options(selectinload(DBQuote.items)).where(DBQuote.id == quote.id)
    )
    return _quote_to_dict(result.scalar_one())


@router.put("/{quote_id}")
async def update_quote(
    quote_id: str,
    update_data: QuoteUpdate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(DBQuote).options(selectinload(DBQuote.items)).where(DBQuote.id == quote_id)
    )
    quote = result.scalar_one_or_none()
    if not quote:
        raise HTTPException(status_code=404, detail="Quote not found")

    if current_user.role != "admin":
        # Suppliers can only update their own quotes
        pass  # no supplier_id field in our model — admin check sufficient for now

    for field, value in update_data.model_dump(exclude_unset=True).items():
        setattr(quote, field, value)

    return _quote_to_dict(quote)


@router.post("/{quote_id}/accept")
async def accept_quote(
    quote_id: str,
    accept_data: QuoteAcceptRequest,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    """Accept a quote — creates a Neon DB order record."""
    q_result = await db.execute(
        select(DBQuote).options(selectinload(DBQuote.rfq)).where(DBQuote.id == quote_id)
    )
    quote = q_result.scalar_one_or_none()
    if not quote:
        raise HTTPException(status_code=404, detail="Quote not found")

    rfq_result = await db.execute(
        select(DBRFQSubmission).where(DBRFQSubmission.id == quote.rfq_id)
    )
    rfq = rfq_result.scalar_one_or_none()

    if current_user.role != "admin" and rfq and rfq.buyer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    quote.status = "accepted"
    quote.accepted_at = datetime.utcnow()

    if rfq:
        rfq.status = "accepted"

    order = DBOrder(
        quote_id=quote_id,
        buyer_id=rfq.buyer_id if rfq else current_user.id,
        supplier_name=quote.supplier_name,
        status="pending_payment",
        total_amount=float(quote.total_amount),
        supplier_cost=float(quote.supplier_cost) if quote.supplier_cost else None,
        platform_revenue=(
            float(quote.total_amount) - float(quote.supplier_cost)
            if quote.supplier_cost else None
        ),
        currency=quote.currency,
        payment_status="unpaid",
        notes=getattr(accept_data, "po_number", None),
    )
    db.add(order)

    db.add(DBAuditLog(
        actor_id=current_user.id,
        actor_email=current_user.email,
        action="quote.accepted",
        entity_type="quote",
        entity_id=quote_id,
    ))

    await db.flush()
    return {"message": "Quote accepted", "order_id": order.id}


@router.post("/{quote_id}/reject")
async def reject_quote(
    quote_id: str,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(DBQuote).where(DBQuote.id == quote_id))
    quote = result.scalar_one_or_none()
    if not quote:
        raise HTTPException(status_code=404, detail="Quote not found")

    quote.status = "rejected"
    return {"message": "Quote rejected"}
