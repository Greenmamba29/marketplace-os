import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { StripeCheckoutButton } from './StripeCheckoutButton';

interface Plan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  planKey: 'seller_monthly' | 'buyer_pro' | 'transaction' | 'rfq_boost';
  highlighted?: boolean;
  cta: string;
}

interface Props {
  appName: string;
  apiUrl: string;
  authToken: string;
  accentColor?: string;
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
    planKey: 'buyer_pro',
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

export function PricingPage({ appName, apiUrl, authToken, accentColor = '#0ABFBC' }: Props) {
  return (
    <div className="min-h-screen bg-surface px-4 py-24">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <span
            className="inline-block px-3 py-1 rounded-full text-xs font-mono font-semibold mb-4"
            style={{ backgroundColor: `${accentColor}20`, color: accentColor }}
          >
            PRICING
          </span>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
            Simple, transparent pricing
          </h1>
          <p className="text-lg text-text-secondary max-w-xl mx-auto">
            {appName} earns when you earn. Start free, upgrade when you're ready.
          </p>
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
                  : 'border-border bg-surface-elevated'
              }`}
            >
              {plan.highlighted && (
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-semibold text-black"
                  style={{ backgroundColor: accentColor }}
                >
                  MOST POPULAR
                </div>
              )}

              <div>
                <h3 className="text-lg font-semibold text-white mb-1">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-display font-bold text-white">{plan.price}</span>
                  <span className="text-text-muted text-sm">/{plan.period}</span>
                </div>
                <p className="text-text-secondary text-sm">{plan.description}</p>
              </div>

              <ul className="flex-1 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-text-secondary">
                    <Check className="w-4 h-4 mt-0.5 shrink-0" style={{ color: accentColor }} />
                    {f}
                  </li>
                ))}
              </ul>

              <StripeCheckoutButton
                apiUrl={apiUrl}
                authToken={authToken}
                planKey={plan.planKey}
                label={plan.cta}
                className="w-full justify-center"
              />
            </motion.div>
          ))}
        </div>

        {/* Enterprise CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-12 text-center border border-border rounded-xl p-8"
        >
          <h3 className="text-xl font-semibold text-white mb-2">Enterprise & Custom Volume</h3>
          <p className="text-text-secondary mb-6">
            High-volume buyers and multi-location vendors get custom pricing, dedicated support, and
            API access.
          </p>
          <a
            href="mailto:sales@marketplace-os.io"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-border text-white text-sm font-semibold hover:border-primary transition-colors"
          >
            Contact Sales
          </a>
        </motion.div>
      </div>
    </div>
  );
}
