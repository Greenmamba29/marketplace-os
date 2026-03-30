/**
 * Shared Stripe utilities for all 20 Marketplace OS frontends.
 *
 * Usage:
 *   import { redirectToCheckout, PLANS } from '@marketplace-os/stripe-utils';
 *
 * Environment variables (set per-app in .env.local):
 *   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
 *   VITE_API_URL=http://localhost:800X
 */

export const PLANS = {
  /** Seller / Vendor monthly subscription */
  SELLER_MONTHLY: 'seller_monthly',
  /** Buyer / Buyer premium access */
  BUYER_PRO: 'buyer_pro',
  /** Transaction fee top-up (marketplace commission) */
  TRANSACTION: 'transaction',
  /** RFQ listing boost */
  RFQ_BOOST: 'rfq_boost',
} as const;

export type PlanKey = (typeof PLANS)[keyof typeof PLANS];

export interface CheckoutOptions {
  planKey: PlanKey;
  /** Optional quantity override */
  quantity?: number;
  /** Metadata forwarded to the backend and stored on Stripe session */
  metadata?: Record<string, string>;
  /** Override success redirect (default: /dashboard?payment=success) */
  successUrl?: string;
  /** Override cancel redirect (default: /pricing) */
  cancelUrl?: string;
}

/**
 * Calls the backend /payments/checkout-session endpoint, then redirects
 * to Stripe-hosted checkout.  Drop-in for any of the 20 apps.
 */
export async function redirectToCheckout(
  apiUrl: string,
  options: CheckoutOptions,
  authToken: string
): Promise<void> {
  const { planKey, quantity = 1, metadata = {}, successUrl, cancelUrl } = options;

  const res = await fetch(`${apiUrl}/payments/checkout-session`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({
      plan_key: planKey,
      quantity,
      metadata,
      success_url: successUrl ?? `${window.location.origin}/dashboard?payment=success`,
      cancel_url: cancelUrl ?? `${window.location.origin}/pricing`,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.detail ?? 'Failed to create checkout session');
  }

  const { url } = await res.json();
  window.location.href = url;
}

/**
 * Fetch subscription status for the current user.
 */
export async function getSubscriptionStatus(
  apiUrl: string,
  authToken: string
): Promise<{ active: boolean; plan: string | null; currentPeriodEnd: string | null }> {
  const res = await fetch(`${apiUrl}/payments/subscription`, {
    headers: { Authorization: `Bearer ${authToken}` },
  });
  if (!res.ok) return { active: false, plan: null, currentPeriodEnd: null };
  return res.json();
}
