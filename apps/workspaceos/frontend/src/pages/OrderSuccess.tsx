import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Package, ArrowRight, ShoppingBag, RotateCcw, ExternalLink } from 'lucide-react';
import { getContinueShoppingUrl, getContinueShoppingLabel, useShoppingContext } from '../hooks/useShoppingContext';

const MALL_URL = 'https://marketplace-os-hub.netlify.app';

const OrderSuccess: React.FC = () => {
  const navigate = useNavigate();
  const { clear } = useShoppingContext();
  const orderId = `ORD-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
  const continueUrl = getContinueShoppingUrl();
  const continueLabel = getContinueShoppingLabel();

  useEffect(() => {
    // Clear context after success so next session is fresh
    return () => { /* keep ctx alive until user navigates away */ };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-24 bg-[#080C14]">
      <div className="max-w-lg w-full text-center">

        {/* Animated checkmark */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="w-24 h-24 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto mb-8"
        >
          <CheckCircle className="w-12 h-12 text-green-400" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <p className="text-[10px] text-green-400 font-black uppercase tracking-widest mb-3">Request Confirmed</p>
          <h1 className="text-4xl font-display font-black text-white uppercase tracking-tighter mb-3">
            RFQ Submitted!
          </h1>
          <p className="text-surface-400 mb-2">
            Your request has been broadcast to verified suppliers. You'll receive quotes within 2 hours.
          </p>
          <p className="text-surface-500 text-xs font-mono mb-10">Order ID: {orderId}</p>

          {/* Summary card */}
          <div className="bg-surface-50 border border-surface-200 rounded-2xl p-6 mb-10 text-left space-y-4">
            {[
              { label: 'Status', value: 'Broadcast to suppliers', color: 'text-green-400' },
              { label: 'Expected quotes', value: '4–12 hours', color: 'text-white' },
              { label: 'Supplier alerts sent', value: '3 verified matches', color: 'text-white' },
              { label: 'Confirmation email', value: 'Sent to your account', color: 'text-white' },
            ].map((row, i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-surface-200/50 last:border-0">
                <span className="text-xs text-surface-400 font-bold uppercase tracking-widest">{row.label}</span>
                <span className={`text-xs font-bold ${row.color}`}>{row.value}</span>
              </div>
            ))}
          </div>

          {/* CTA pair — primary action + continue shopping */}
          <div className="flex flex-col gap-3">
            <Link
              to="/dashboard"
              className="w-full py-4 bg-primary text-black font-black uppercase tracking-widest text-xs rounded-full flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
            >
              <Package className="w-4 h-4" />
              View My Orders & Quotes
            </Link>

            <a
              href={continueUrl}
              target={continueUrl.startsWith('http') && !continueUrl.includes(window.location.hostname) ? '_blank' : undefined}
              rel="noopener noreferrer"
              className="w-full py-4 bg-surface-50 border border-surface-200 text-white font-black uppercase tracking-widest text-xs rounded-full flex items-center justify-center gap-2 hover:border-primary transition-colors"
            >
              <ShoppingBag className="w-4 h-4" />
              {continueLabel}
              <ArrowRight className="w-4 h-4" />
            </a>

            <a
              href={MALL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-surface-500 hover:text-primary text-[11px] font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-1 mt-2"
              onClick={() => clear()}
            >
              <ExternalLink className="w-3 h-3" />
              Return to GrahmOS Mall
            </a>
          </div>

          {/* Repeat action nudge */}
          <div className="mt-10 p-4 bg-surface-50 border border-surface-200 rounded-xl flex items-center gap-3 text-left">
            <RotateCcw className="w-5 h-5 text-primary shrink-0" />
            <div>
              <p className="text-white text-xs font-bold mb-0.5">Save this as a Repeat List</p>
              <p className="text-surface-400 text-[11px]">Re-order the same parts in one click next time.</p>
            </div>
            <Link
              to="/dashboard"
              className="ml-auto text-[10px] text-primary font-black uppercase tracking-widest whitespace-nowrap hover:underline"
            >
              Save →
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderSuccess;
