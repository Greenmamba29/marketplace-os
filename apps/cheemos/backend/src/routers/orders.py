"""Orders router — backed by Neon DB."""

from datetime import datetime
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, Request
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.database import get_db
from src.db_models import DBAuditLog, DBOrder, DBPayment, DBQuote, DBRFQSubmission
from src.models.order import Order, OrderUpdate, PaymentIntentResponse
from src.models.user import User
from src.routers.auth import get_current_active_user
from src.services.stripe import get_stripe_service

router = APIRouter()


def _order_to_dict(o: DBOrder) -> dict:
    return {
        "id": o.id,
        "quote_id": o.quote_id,
        "buyer_id": o.buyer_id,
        "supplier_name": o.supplier_name,
        "status": o.status,
        "total_amount": float(o.total_amount),
        "supplier_cost": float(o.supplier_cost) if o.supplier_cost else None,
        "platform_revenue": float(o.platform_revenue) if o.platform_revenue else None,
        "currency": o.currency,
        "payment_status": o.payment_status,
        "stripe_payment_intent_id": o.stripe_payment_intent_id,
        "paid_at": o.paid_at.isoformat() if o.paid_at else None,
        "shipped_at": o.shipped_at.isoformat() if o.shipped_at else None,
        "delivered_at": o.delivered_at.isoformat() if o.delivered_at else None,
        "tracking_number": o.tracking_number,
        "notes": o.notes,
        "created_at": o.created_at.isoformat(),
        "updated_at": o.updated_at.isoformat(),
    }


@router.get("")
async def list_orders(
    status: Optional[str] = None,
    buyer_id: Optional[str] = None,
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    stmt = select(DBOrder)

    if current_user.role == "admin":
        if buyer_id:
            stmt = stmt.where(DBOrder.buyer_id == buyer_id)
    elif current_user.role == "buyer":
        stmt = stmt.where(DBOrder.buyer_id == current_user.id)
    else:
        stmt = stmt.where(DBOrder.buyer_id == current_user.id)

    if status:
        stmt = stmt.where(DBOrder.status == status)

    stmt = stmt.order_by(DBOrder.created_at.desc())

    count_result = await db.execute(stmt)
    all_items = count_result.scalars().all()
    total = len(all_items)

    offset = (page - 1) * size
    paginated = all_items[offset: offset + size]

    return {
        "items": [_order_to_dict(o) for o in paginated],
        "total": total,
        "page": page,
        "size": size,
    }


@router.get("/{order_id}")
async def get_order(
    order_id: str,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(DBOrder).where(DBOrder.id == order_id))
    order = result.scalar_one_or_none()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    if current_user.role != "admin" and order.buyer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    return _order_to_dict(order)


@router.put("/{order_id}")
async def update_order(
    order_id: str,
    update_data: OrderUpdate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(DBOrder).where(DBOrder.id == order_id))
    order = result.scalar_one_or_none()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    if current_user.role != "admin" and order.buyer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    for field, value in update_data.model_dump(exclude_unset=True).items():
        setattr(order, field, value)

    return _order_to_dict(order)


@router.post("/{order_id}/payment-intent", response_model=PaymentIntentResponse)
async def create_payment_intent(
    order_id: str,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    """Create Stripe PaymentIntent for an order."""
    result = await db.execute(select(DBOrder).where(DBOrder.id == order_id))
    order = result.scalar_one_or_none()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    if current_user.role != "admin" and order.buyer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    if order.payment_status == "paid":
        raise HTTPException(status_code=400, detail="Order already paid")

    stripe = get_stripe_service()
    amount_cents = int(float(order.total_amount) * 100)

    intent = await stripe.create_payment_intent(
        amount=amount_cents,
        currency=order.currency.lower(),
        metadata={"order_id": order_id, "buyer_id": current_user.id},
    )

    # Store intent ID
    order.stripe_payment_intent_id = intent["id"]
    order.payment_status = "processing"

    # Record payment row
    db.add(DBPayment(
        order_id=order_id,
        stripe_payment_intent_id=intent["id"],
        amount=float(order.total_amount),
        currency=order.currency,
        status="processing",
    ))

    db.add(DBAuditLog(
        actor_id=current_user.id,
        actor_email=current_user.email,
        action="payment_intent.created",
        entity_type="order",
        entity_id=order_id,
        payload={"stripe_pi": intent["id"]},
    ))

    return {
        "client_secret": intent["client_secret"],
        "publishable_key": stripe.publishable_key,
    }


@router.post("/webhook/stripe")
async def stripe_webhook(
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    """Handle Stripe webhook events with signature verification."""
    stripe = get_stripe_service()
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature", "")

    try:
        event = stripe.construct_webhook_event(payload, sig_header)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Webhook error: {str(e)}")

    event_type = event["type"]
    data = event["data"]

    if event_type == "payment_intent.succeeded":
        pi_id = data.get("id")
        order_result = await db.execute(
            select(DBOrder).where(DBOrder.stripe_payment_intent_id == pi_id)
        )
        order = order_result.scalar_one_or_none()
        if order:
            order.payment_status = "paid"
            order.status = "payment_received"
            order.paid_at = datetime.utcnow()

            payment_result = await db.execute(
                select(DBPayment).where(DBPayment.stripe_payment_intent_id == pi_id)
            )
            payment = payment_result.scalar_one_or_none()
            if payment:
                payment.status = "succeeded"
                payment.stripe_charge_id = data.get("latest_charge")

    elif event_type == "payment_intent.payment_failed":
        pi_id = data.get("id")
        order_result = await db.execute(
            select(DBOrder).where(DBOrder.stripe_payment_intent_id == pi_id)
        )
        order = order_result.scalar_one_or_none()
        if order:
            order.payment_status = "failed"

            payment_result = await db.execute(
                select(DBPayment).where(DBPayment.stripe_payment_intent_id == pi_id)
            )
            payment = payment_result.scalar_one_or_none()
            if payment:
                payment.status = "failed"
                payment.failure_message = (
                    data.get("last_payment_error", {}).get("message", "Payment failed")
                )

    return {"status": "ok"}
