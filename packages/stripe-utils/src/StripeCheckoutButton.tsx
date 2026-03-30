import { useState } from 'react';
import { redirectToCheckout, PlanKey } from './index';

interface Props {
  apiUrl: string;
  authToken: string;
  planKey: PlanKey;
  label?: string;
  className?: string;
  metadata?: Record<string, string>;
  successUrl?: string;
  cancelUrl?: string;
}

/**
 * Drop-in Stripe checkout button.
 * Calls the backend to create a session, then redirects to Stripe-hosted checkout.
 *
 * Example:
 *   <StripeCheckoutButton
 *     apiUrl={import.meta.env.VITE_API_URL}
 *     authToken={user.token}
 *     planKey="seller_monthly"
 *     label="Start Selling — $99/mo"
 *   />
 */
export function StripeCheckoutButton({
  apiUrl,
  authToken,
  planKey,
  label = 'Subscribe Now',
  className = '',
  metadata,
  successUrl,
  cancelUrl,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    if (!authToken) {
      setError('Please log in first.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await redirectToCheckout(apiUrl, { planKey, metadata, successUrl, cancelUrl }, authToken);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Payment error');
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={loading}
        className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm transition-all
          bg-primary text-black hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed
          ${className}`}
      >
        {loading ? (
          <>
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Processing...
          </>
        ) : (
          label
        )}
      </button>
      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
    </div>
  );
}
