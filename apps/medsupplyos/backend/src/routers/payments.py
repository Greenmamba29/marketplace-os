"""
Drop-in FastAPI payments router for all 20 Marketplace OS backends.

Copy to each app's src/routers/payments.py and register in main.py:

    from src.routers.payments import router as payments_router
    app.include_router(payments_router, prefix='/payments', tags=['payments'])

Endpoints:
  POST /payments/checkout-session   → create Stripe Checkout session → redirect URL
  POST /payments/webhook            → handle Stripe webhook events
  GET  /payments/subscription       → get current user's subscription status
  POST /payments/payment-intent     → create PaymentIntent (one-time fees)
"""

from fastapi import APIRouter, Depends, Header, HTTPException, Request, status
from pydantic import BaseModel
from typing import Optional
import stripe

from src.services.stripe import StripeService
# Replace with your actual auth dependency:
# from src.routers.auth import get_current_user

router = APIRouter()
stripe_svc = StripeService()


# ── Request / Response models ─────────────────────────────────────────────────

class CheckoutRequest(BaseModel):
    plan_key: str  # 'seller_monthly' | 'buyer_pro' | 'rfq_boost'
    quantity: int = 1
    metadata: dict[str, str] = {}
    success_url: Optional[str] = None
    cancel_url: Optional[str] = None


class PaymentIntentRequest(BaseModel):
    amount_cents: int  # e.g. 2500 = $25.00
    currency: str = 'usd'
    metadata: dict[str, str] = {}


class CheckoutResponse(BaseModel):
    url: str


class SubscriptionStatus(BaseModel):
    active: bool
    plan: Optional[str]
    current_period_end: Optional[int]


# ── Simple mock auth (replace with real auth in each app) ────────────────────

class MockUser:
    id: str = 'user_123'
    email: str = 'user@example.com'

async def get_current_user_mock():
    """Replace with your actual JWT-based dependency."""
    return MockUser()


# ── Endpoints ─────────────────────────────────────────────────────────────────

@router.post('/checkout-session', response_model=CheckoutResponse)
async def create_checkout_session(
    req: CheckoutRequest,
    current_user=Depends(get_current_user_mock),
):
    """
    Creates a Stripe Checkout Session.
    Frontend calls this, then redirects to the returned URL.
    User completes payment on Stripe's hosted page.
    """
    try:
        url = await stripe_svc.create_checkout_session(
            plan_key=req.plan_key,
            customer_email=current_user.email,
            success_url=req.success_url,
            cancel_url=req.cancel_url,
            metadata={**req.metadata, 'user_id': str(current_user.id)},
            quantity=req.quantity,
        )
        return CheckoutResponse(url=url)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except stripe.error.StripeError as e:
        raise HTTPException(status_code=400, detail=str(e.user_message))


@router.post('/webhook', status_code=status.HTTP_200_OK)
async def stripe_webhook(
    request: Request,
    stripe_signature: str = Header(None, alias='stripe-signature'),
):
    """
    Stripe webhook receiver.
    Configure this URL in Stripe Dashboard → Developers → Webhooks.
    URL: https://your-backend.railway.app/payments/webhook

    Events to enable in Stripe Dashboard:
      - checkout.session.completed
      - customer.subscription.created
      - customer.subscription.deleted
      - invoice.payment_failed
    """
    payload = await request.body()

    try:
        event = stripe_svc.handle_webhook(payload, stripe_signature or '')
    except ValueError:
        raise HTTPException(status_code=400, detail='Invalid payload')
    except stripe.error.SignatureVerificationError:
        raise HTTPException(status_code=400, detail='Invalid signature')

    result = stripe_svc.handle_webhook_event(event)
    return {'received': True, 'result': result}


@router.get('/subscription', response_model=SubscriptionStatus)
async def get_subscription(current_user=Depends(get_current_user_mock)):
    """Returns the current user's Stripe subscription status."""
    status_data = await stripe_svc.get_subscription_status(current_user.email)
    return SubscriptionStatus(**status_data)


@router.post('/payment-intent')
async def create_payment_intent(
    req: PaymentIntentRequest,
    current_user=Depends(get_current_user_mock),
):
    """
    Create a PaymentIntent for one-time charges (transaction fees, RFQ boosts).
    Returns client_secret for frontend Stripe.js confirmation.
    """
    try:
        return await stripe_svc.create_payment_intent(
            amount_cents=req.amount_cents,
            currency=req.currency,
            metadata={**req.metadata, 'user_id': str(current_user.id)},
        )
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except stripe.error.StripeError as e:
        raise HTTPException(status_code=400, detail=str(e.user_message))
