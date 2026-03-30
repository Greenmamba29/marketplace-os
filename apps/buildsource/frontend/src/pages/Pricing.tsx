import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface Plan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  planKey: 'seller_monthly' | 'buyer_pro' | 'transaction' | 'rfq_boost' | 'free';
  highlighted?: boolean;
  cta: string;
}

const PLANS: Plan[] = [
  {
    name: 'Buyer Free',
    price: '$0',
    period: 'forever',
    description: 'Browse, search, and send up to 3 RFQs per month.',
    features: [
      'Full product catalog access',
      '3 RFQs / month',
      'Basic supplier profiles',
      'Email support',
    ],
    planKey: 'free',
    cta: 'Get Started Free',
  },
  {
    name: 'Buyer Pro',
    price: '$49',
    period: 'per month',
    description: 'Unlimited RFQs, quote comparisons, and priority matching.',
    features: [
      'Unlimited RFQs',
      'Quote comparison dashboard',
      'Priority supplier matching',
      'Price history & analytics',
      'Dedicated account manager',
      'Net-30 payment terms',
    ],
    planKey: 'buyer_pro',
    highlighted: true,
    cta: 'Start Buyer Pro',
  },
  {
    name: 'Seller / Vendor',
    price: '$99',
    period: 'per month',
    description: 'List products, receive RFQ leads, and close deals.',
    features: [
      'Unlimited product listings',
      'Inbound RFQ leads',
      'Storefront & company profile',
      'Quote management tools',
      'Order management dashboard',
      'Analytics & conversion tracking',
      '2.5% transaction fee on orders',
    ],
    planKey: 'seller_monthly',
    cta: 'Start Selling',
  },
];

const Pricing = () => {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubscribe = async (planKey: string) => {
    if (planKey === 'free') {
      window.location.href = '/dashboard';
      return;
    }

    setLoading(planKey);
    setError(null);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/payments/checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: JSON.stringify({ plan_key: planKey, quantity: 1, metadata: {} }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || 'Payment unavailable — add your Stripe key to .env');
      }

      const { url } = await res.json();
      window.location.href = url;
    } catch (err: any) {
      setError(err.message);
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-surface px-4 py-24 text-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <span
            className="inline-block px-3 py-1 rounded-full text-xs font-mono font-semibold mb-4"
            style={{ backgroundColor: '#D9770620', color: '#D97706' }}
          >
            PRICING
          </span>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Simple, transparent pricing
          </h1>
          <p className="text-lg text-surface-400 max-w-xl mx-auto">
            BuildSource earns when you earn. Start free, upgrade when you're ready.
          </p>
          {error && (
            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm max-w-md mx-auto">
              {error}
            </div>
          )}
        </motion.div>

        {/* Plans grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`relative rounded-xl border p-8 flex flex-col gap-6 ${
                plan.highlighted
                  ? 'border-primary bg-primary/5'
                  : 'border-surface-200 bg-surface-50'
              }`}
            >
              {plan.highlighted && (
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-semibold text-black"
                  style={{ backgroundColor: '#D97706' }}
                >
                  MOST POPULAR
                </div>
              )}

              <div>
                <h3 className="text-lg font-semibold text-white mb-1">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-display font-bold text-white">{plan.price}</span>
                  <span className="text-surface-400 text-sm">/{plan.period}</span>
                </div>
                <p className="text-surface-400 text-sm">{plan.description}</p>
              </div>

              <ul className="flex-1 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-surface-300">
                    <Check className="w-4 h-4 mt-0.5 shrink-0" style={{ color: '#D97706' }} />
                    {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe(plan.planKey)}
                disabled={!!loading}
                className={`w-full flex justify-center items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm transition-all
                  ${plan.highlighted ? 'bg-primary text-black' : 'bg-surface-200 text-white hover:bg-surface-300'}
                  disabled:opacity-50 disabled:cursor-not-allowed`}
                style={plan.highlighted ? { backgroundColor: '#D97706' } : {}}
              >
                {loading === plan.planKey ? (
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
                  plan.cta
                )}
              </button>
            </motion.div>
          ))}
        </div>

        {/* Enterprise CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-12 text-center border border-surface-200 rounded-xl p-8"
        >
          <h3 className="text-xl font-semibold text-white mb-2">Enterprise & Custom Volume</h3>
          <p className="text-surface-400 mb-6">
            High-volume buyers and multi-location vendors get custom pricing, dedicated support, and
            API access.
          </p>
          <a
            href="mailto:sales@marketplace-os.io"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-surface-200 text-white text-sm font-semibold hover:border-primary transition-colors"
          >
            Contact Sales
          </a>
        </motion.div>
      </div>
    </div>
  );
};

export default Pricing;
