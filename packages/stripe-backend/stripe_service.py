"""
Reusable Stripe service for all 20 Marketplace OS backends.

Copy this file to each app's src/services/stripe.py
(or symlink — both approaches work).

Environment variables required:
  STRIPE_SECRET_KEY        sk_test_... or sk_live_...
  STRIPE_WEBHOOK_SECRET    whsec_...  (from Stripe Dashboard → Webhooks)
  FRONTEND_URL             https://yourapp.netlify.app  (or http://localhost:3001)

Stripe Price IDs (create once in Stripe Dashboard, paste here):
  STRIPE_PRICE_SELLER_MONTHLY   price_...
  STRIPE_PRICE_BUYER_PRO        price_...

How to use in a FastAPI router:
  from src.services.stripe import StripeService
  stripe_svc = StripeService()

  @router.post('/payments/checkout-session')
  async def checkout(req: CheckoutRequest, user=Depends(get_current_user)):
      url = await stripe_svc.create_checkout_session(
          plan_key=req.plan_key,
          customer_email=user.email,
          success_url=req.success_url,
          cancel_url=req.cancel_url,
          metadata={'user_id': str(user.id), 'app': APP_NAME},
      )
      return {'url': url}
"""

import os
import stripe
from typing import Literal, Optional

# Stripe reads the key on import
stripe.api_key = os.getenv('STRIPE_SECRET_KEY', '')

WEBHOOK_SECRET = os.getenv('STRIPE_WEBHOOK_SECRET', '')
FRONTEND_URL = os.getenv('FRONTEND_URL', 'http://localhost:3000')

# Map plan keys → Stripe Price IDs
# Replace with your actual Price IDs from the Stripe Dashboard
PRICE_MAP: dict[str, str] = {
    'seller_monthly': os.getenv('STRIPE_PRICE_SELLER_MONTHLY', 'price_seller_monthly_REPLACE'),
    'buyer_pro': os.getenv('STRIPE_PRICE_BUYER_PRO', 'price_buyer_pro_REPLACE'),
    'rfq_boost': os.getenv('STRIPE_PRICE_RFQ_BOOST', 'price_rfq_boost_REPLACE'),
}

PlanKey = Literal['seller_monthly', 'buyer_pro', 'rfq_boost', 'transaction']


class StripeService:
    """Plug-and-play Stripe integration. Works as soon as STRIPE_SECRET_KEY is set."""

    async def create_checkout_session(
        self,
        plan_key: PlanKey,
        customer_email: str,
        success_url: Optional[str] = None,
        cancel_url: Optional[str] = None,
        metadata: Optional[dict] = None,
        quantity: int = 1,
    ) -> str:
        """
        Creates a Stripe Checkout Session and returns the hosted URL.
        Redirect the user to this URL to complete payment.
        """
        if not stripe.api_key:
            raise RuntimeError('STRIPE_SECRET_KEY not set. Add it to your .env file.')

        price_id = PRICE_MAP.get(plan_key)
        if not price_id or 'REPLACE' in price_id:
            raise ValueError(
                f'No Stripe Price ID configured for plan "{plan_key}". '
                'Create a price in the Stripe Dashboard and set STRIPE_PRICE_SELLER_MONTHLY etc.'
            )

        session = stripe.checkout.Session.create(
            mode='subscription' if plan_key in ('seller_monthly', 'buyer_pro') else 'payment',
            line_items=[{'price': price_id, 'quantity': quantity}],
            customer_email=customer_email,
            success_url=success_url or f'{FRONTEND_URL}/dashboard?payment=success&session_id={{CHECKOUT_SESSION_ID}}',
            cancel_url=cancel_url or f'{FRONTEND_URL}/pricing?cancelled=1',
            metadata=metadata or {},
            allow_promotion_codes=True,
            billing_address_collection='required',
        )
        return session.url

    async def create_payment_intent(
        self,
        amount_cents: int,
        currency: str = 'usd',
        metadata: Optional[dict] = None,
    ) -> dict:
        """
        Creates a PaymentIntent for one-time charges (e.g. transaction fees).
        Returns client_secret for frontend confirmation.
        """
        if not stripe.api_key:
            raise RuntimeError('STRIPE_SECRET_KEY not set.')

        intent = stripe.PaymentIntent.create(
            amount=amount_cents,
            currency=currency,
            automatic_payment_methods={'enabled': True},
            metadata=metadata or {},
        )
        return {'client_secret': intent.client_secret, 'payment_intent_id': intent.id}

    async def get_subscription_status(self, customer_email: str) -> dict:
        """Check if a user has an active subscription."""
        if not stripe.api_key:
            return {'active': False, 'plan': None, 'current_period_end': None}

        customers = stripe.Customer.list(email=customer_email, limit=1)
        if not customers.data:
            return {'active': False, 'plan': None, 'current_period_end': None}

        customer = customers.data[0]
        subs = stripe.Subscription.list(customer=customer.id, status='active', limit=1)

        if not subs.data:
            return {'active': False, 'plan': None, 'current_period_end': None}

        sub = subs.data[0]
        plan_name = sub['items']['data'][0]['price']['nickname'] or 'active'
        return {
            'active': True,
            'plan': plan_name,
            'current_period_end': sub['current_period_end'],
            'subscription_id': sub.id,
        }

    def handle_webhook(self, payload: bytes, sig_header: str) -> dict:
        """
        Verifies and parses a Stripe webhook event.
        Call this from your /payments/webhook POST endpoint.

        Returns the parsed event dict on success.
        Raises stripe.error.SignatureVerificationError on invalid signature.
        """
        if not WEBHOOK_SECRET:
            raise RuntimeError(
                'STRIPE_WEBHOOK_SECRET not set. '
                'Add it from Stripe Dashboard → Developers → Webhooks.'
            )

        event = stripe.Webhook.construct_event(payload, sig_header, WEBHOOK_SECRET)
        return event

    def handle_webhook_event(self, event: dict) -> dict:
        """
        Routes common webhook events to appropriate actions.
        Extend this switch with your business logic.
        """
        event_type = event['type']
        data = event['data']['object']

        handlers = {
            'checkout.session.completed': self._on_checkout_completed,
            'customer.subscription.created': self._on_subscription_created,
            'customer.subscription.deleted': self._on_subscription_cancelled,
            'invoice.payment_failed': self._on_payment_failed,
        }

        handler = handlers.get(event_type)
        if handler:
            return handler(data)
        return {'status': 'unhandled', 'event_type': event_type}

    # ── Private event handlers ─────────────────────────────────────────────────

    def _on_checkout_completed(self, session: dict) -> dict:
        """Checkout complete → provision access, send confirmation email."""
        customer_email = session.get('customer_email', '')
        metadata = session.get('metadata', {})
        # TODO: Mark user as paid in your database
        # e.g. db.users.update(email=customer_email, is_pro=True)
        return {
            'status': 'ok',
            'action': 'provision_access',
            'email': customer_email,
            'metadata': metadata,
        }

    def _on_subscription_created(self, subscription: dict) -> dict:
        """New subscription → update user plan in DB."""
        return {'status': 'ok', 'action': 'subscription_created', 'id': subscription.get('id')}

    def _on_subscription_cancelled(self, subscription: dict) -> dict:
        """Subscription cancelled → downgrade user."""
        return {'status': 'ok', 'action': 'subscription_cancelled', 'id': subscription.get('id')}

    def _on_payment_failed(self, invoice: dict) -> dict:
        """Payment failed → send dunning email."""
        return {'status': 'ok', 'action': 'payment_failed', 'invoice': invoice.get('id')}
