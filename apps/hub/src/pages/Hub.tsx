import React, { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag, ChevronDown, Zap, Database, Globe, Info,
  TrendingUp, Users, Clock, CheckCircle, ArrowRight, Search, X
} from 'lucide-react';
import { marketplaces } from '../data/marketplaces';
import { Globe3D } from '../components/Globe3D';
import { MallDirectory } from '../components/MallDirectory';
import { StorefrontCard } from '../components/StorefrontCard';
import { LiveTicker } from '../components/LiveTicker';
import { FastLane } from '../components/FastLane';
import { WingSelector } from '../components/WingSelector';
import { ConfidenceLayer } from '../components/ConfidenceLayer';

// Animated counter scoped to viewport entry
const AnimatedCounter = ({ end, suffix = '', duration = 2 }: { end: number; suffix?: string; duration?: number }) => {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started) setStarted(true);
    }, { threshold: 0.5 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    let start = 0;
    const timer = setInterval(() => {
      start += Math.ceil(end / (duration * 60));
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(start);
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [started, end, duration]);

  return <span ref={ref}>{count.toLocaleString(undefined, { maximumFractionDigits: suffix === 'M' && end < 200 ? 1 : 0 })}{suffix}</span>;
};

// Social proof ticker strip — shows recent buyer activity
const RECENT_ACTIVITY = [
  'Acme Corp submitted a $42K RFQ on MRODirect',
  'Kaiser Permanente sourced 18K units on MedSupplyOS',
  'Tesla procurement placed an order on VoltSource',
  'Sysco Foods completed a bulk quote on FoodOps',
  'US Army Corps submitted a bid on GovSource',
  'BASF sourced specialty chemicals via ChemOS',
  'Amazon Logistics ordered custom packaging on PackSource',
  'Johnson & Johnson verified a new supplier on LabSource',
];

const ActivityStrip: React.FC = () => {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % RECENT_ACTIVITY.length), 3500);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="flex items-center gap-3 overflow-hidden">
      <div className="flex items-center gap-1.5 shrink-0">
        <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
        <span className="text-green-400 text-[10px] font-black uppercase tracking-widest">Live</span>
      </div>
      <AnimatePresence mode="wait">
        <motion.p
          key={idx}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="text-surface-400 text-xs truncate"
        >
          {RECENT_ACTIVITY[idx]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
};

// Mall zone wrapper
const MallZone = ({ title, subtitle, zoneId, tier, stores }: {
  title: string; subtitle: string; zoneId: string; tier: number; stores: typeof marketplaces
}) => {
  const tierColors = { 1: '#EAB308', 2: '#2563EB', 3: '#0ABFBC' };
  const color = tierColors[tier as keyof typeof tierColors] || '#0ABFBC';

  return (
    <div id={zoneId} className="mb-40 scroll-mt-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 px-6">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-6 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-[10px] font-black tracking-widest uppercase" style={{ color }}>
              Zone 0{tier}
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-display font-black text-white uppercase tracking-tighter leading-none">
            {title}
          </h2>
          <p className="text-surface-400 max-w-md">{subtitle}</p>
        </div>
        <div className="flex items-center gap-8 shrink-0">
          <div className="text-right">
            <p className="text-[10px] text-surface-400 font-bold uppercase tracking-widest mb-1">Stores Open</p>
            <p className="text-3xl font-display font-black text-white">{stores.length}</p>
          </div>
          <div className="w-px h-12 bg-surface-200/50" />
          <div className="text-right">
            <p className="text-[10px] text-surface-400 font-bold uppercase tracking-widest mb-1">Zone GMV</p>
            <p className="text-3xl font-display font-black" style={{ color }}>
              ${stores.reduce((acc, s) => acc + s.gmvY3, 0)}M
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-6">
        {stores.map(m => <StorefrontCard key={m.id} marketplace={m} />)}
      </div>

      {/* Continue Shopping anchor */}
      <div className="text-center mt-12 px-6">
        <a
          href="#mall-floor"
          className="inline-flex items-center gap-2 text-surface-400 hover:text-primary transition-colors text-xs font-bold uppercase tracking-widest"
        >
          ↑ Back to Mall Directory
        </a>
      </div>
    </div>
  );
};

export const Hub: React.FC = () => {
  const tier1 = marketplaces.filter(m => m.tier === 1);
  const tier2 = marketplaces.filter(m => m.tier === 2);
  const tier3 = marketplaces.filter(m => m.tier === 3);

  const totalGMV = marketplaces.reduce((acc, m) => acc + m.gmvY3, 0);
  const totalRev = marketplaces.reduce((acc, m) => acc + m.revenueY3, 0);

  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 400], [1, 0.92]);

  return (
    <div className="min-h-screen bg-[#080C14] selection:bg-primary selection:text-black">

      {/* ── NAV ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#080C14]/80 backdrop-blur-md border-b border-surface-200/30">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <ShoppingBag className="w-4 h-4 text-black" />
            </div>
            <span className="font-display font-black text-lg tracking-tighter text-white">GRAHMOS MALL</span>
          </div>

          {/* Live activity strip — social proof in the nav */}
          <div className="hidden md:flex flex-1 max-w-md">
            <ActivityStrip />
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden md:flex items-center gap-2 text-[10px] font-black px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary uppercase tracking-widest">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              20 Live
            </span>
            <a
              href="#fast-lane"
              className="px-4 py-2 bg-primary text-black text-[11px] font-black uppercase tracking-widest rounded-full hover:bg-primary/90 transition-colors"
              onClick={e => { e.preventDefault(); document.getElementById('fast-lane')?.scrollIntoView({ behavior: 'smooth' }); }}
            >
              Start Sourcing
            </a>
          </div>
        </div>
      </nav>

      {/* ── HERO — Reframed around buyer outcome, not GMV ── */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden pt-16">
        <motion.div style={{ opacity: heroOpacity, scale: heroScale }} className="relative z-10 text-center px-6 max-w-5xl mx-auto">

          {/* Trust badge — social proof first */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-3 mb-8 px-5 py-2.5 bg-surface-50 border border-surface-200 rounded-full"
          >
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span className="text-white text-xs font-bold">Trusted by 2,400+ procurement teams worldwide</span>
            <span className="text-surface-400 text-[10px]">·</span>
            <span className="text-primary text-[10px] font-black">VERIFIED SUPPLIERS ONLY</span>
          </motion.div>

          {/* Globe */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mb-8"
          >
            <Globe3D />
          </motion.div>

          {/* Headline — buyer outcome, not metrics */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-5xl md:text-7xl font-display font-black text-white mb-5 leading-none tracking-tighter uppercase"
          >
            Source Anything.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-cyan-400 to-blue-500">
              In One Place.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-lg text-surface-400 max-w-xl mx-auto mb-10 font-medium leading-relaxed"
          >
            20 B2B vertical marketplaces. Submit an RFQ in 60 seconds.
            Get verified supplier quotes in under 2 hours. No cold emails.
          </motion.p>

          {/* Buyer-outcome stats — time-to-value, not GMV */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-10 mb-12"
          >
            {[
              { label: 'Avg RFQ response', value: '< 2 hrs', icon: Clock, color: '#0ABFBC' },
              { label: 'Verified suppliers', value: '14,000+', icon: CheckCircle, color: '#16A34A' },
              { label: 'Buyers transacting', value: '2,400+', icon: Users, color: '#2563EB' },
              { label: 'Sourcing volume', value: `$${totalGMV}M`, icon: TrendingUp, color: '#F97316' },
            ].map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className="text-center group">
                  <Icon className="w-4 h-4 mx-auto mb-2" style={{ color: s.color }} />
                  <div className="text-2xl font-display font-black text-white">{s.value}</div>
                  <div className="text-surface-400 text-[10px] uppercase tracking-widest font-bold">{s.label}</div>
                </div>
              );
            })}
          </motion.div>

          {/* CTAs — Primary: Start Sourcing (fast lane), Secondary: Browse */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
              onClick={() => document.getElementById('fast-lane')?.scrollIntoView({ behavior: 'smooth' })}
              className="group px-8 py-4 bg-primary text-black font-black uppercase tracking-[0.15em] text-xs rounded-full hover:bg-primary/90 transition-all duration-300 flex items-center gap-3 shadow-lg shadow-primary/25"
            >
              <Zap className="w-4 h-4" />
              Submit Your First RFQ — Free
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
            <button
              onClick={() => document.getElementById('mall-floor')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 bg-surface-50 border border-surface-200 text-white font-black uppercase tracking-[0.15em] text-xs rounded-full hover:border-primary transition-all duration-300 flex items-center gap-3"
            >
              <ShoppingBag className="w-4 h-4" />
              Browse All 20 Stores
              <ChevronDown className="w-4 h-4" />
            </button>
          </motion.div>

          <p className="mt-4 text-surface-500 text-[11px]">
            No credit card · No commitment · Cancel anytime
          </p>
        </motion.div>

        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_60%,rgba(10,191,188,0.04),transparent_60%)] pointer-events-none" />
      </section>

      {/* ── LIVE TICKER ── */}
      <section className="border-y border-surface-200/30">
        <LiveTicker />
      </section>

      {/* ── FAST LANE — First purchase in 90 seconds ── */}
      <div id="fast-lane">
        <FastLane />
      </div>

      {/* ── WING SELECTOR — aisle map ── */}
      <WingSelector />

      {/* ── CONFIDENCE LAYER — trust before entry ── */}
      <ConfidenceLayer />

      {/* ── MALL FLOOR ── */}
      <main id="mall-floor" className="relative z-10 pt-24 pb-40 scroll-mt-16">
        <div className="max-w-7xl mx-auto">
          {/* Mall Directory */}
          <MallDirectory />

          {/* Zone 1: Grand Concourse — Tier 1 Flagships */}
          <MallZone
            title="The Grand Concourse"
            subtitle="Flagship marketplaces. Highest volume, most verified suppliers, premium sourcing experience."
            zoneId="tier-1"
            tier={1}
            stores={tier1}
          />

          {/* Zone 2: Main Hall — Tier 2 */}
          <MallZone
            title="The Main Hall"
            subtitle="Professional-grade verticals. Sector-specific compliance, trusted supplier networks."
            zoneId="tier-2"
            tier={2}
            stores={tier2}
          />

          {/* Zone 3: Specialty Arcade — Tier 3 */}
          <MallZone
            title="The Specialty Arcade"
            subtitle="Boutique specialist marketplaces. Deep expertise, niche compliance, high-touch sourcing."
            zoneId="tier-3"
            tier={3}
            stores={tier3}
          />
        </div>
      </main>

      {/* ── ONBOARDING NUDGE — bottom of page, captures intent ── */}
      <section className="bg-surface-50 border-t border-surface-200/30 py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h3 className="text-3xl md:text-4xl font-display font-black text-white uppercase tracking-tighter mb-4">
            Ready to make your first purchase?
          </h3>
          <p className="text-surface-400 mb-8 max-w-lg mx-auto">
            Create a free buyer account. Access all 20 marketplaces with a single login.
            Your first RFQ is free — no payment required.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://marketplace-os-mrodirect.netlify.app/register"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-primary text-black font-black uppercase tracking-widest text-xs rounded-full hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
            >
              Create Free Buyer Account →
            </a>
            <a
              href="#mall-floor"
              onClick={e => { e.preventDefault(); document.getElementById('mall-floor')?.scrollIntoView({ behavior: 'smooth' }); }}
              className="text-surface-400 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors"
            >
              ← Continue Browsing
            </a>
          </div>
          <p className="mt-6 text-surface-500 text-[11px] uppercase tracking-widest">
            Trusted by teams at Boeing · Kaiser · Sysco · Amazon · Tesla · BASF
          </p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#080C14] border-t border-surface-200/20 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-5">
                <ShoppingBag className="w-6 h-6 text-primary" />
                <span className="font-display font-black text-2xl tracking-tighter text-white">GRAHMOS MALL</span>
              </div>
              <p className="text-surface-400 leading-relaxed text-sm max-w-sm">
                The world's first virtual B2B mall. 20 specialized marketplaces under one roof.
                Submit RFQs, discover suppliers, and transact — all in one session.
              </p>
              <div className="flex items-center gap-2 mt-5">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-green-400 text-[10px] font-black uppercase tracking-widest">All 20 stores live</span>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-white font-display font-black uppercase tracking-widest text-xs">Mall Zones</h4>
              <ul className="space-y-2.5">
                {[
                  { label: 'Grand Concourse', id: 'tier-1', color: '#EAB308' },
                  { label: 'Main Hall', id: 'tier-2', color: '#2563EB' },
                  { label: 'Specialty Arcade', id: 'tier-3', color: '#0ABFBC' },
                ].map(z => (
                  <li key={z.id}>
                    <a
                      href={`#${z.id}`}
                      onClick={e => { e.preventDefault(); document.getElementById(z.id)?.scrollIntoView({ behavior: 'smooth' }); }}
                      className="text-surface-400 hover:text-white text-xs font-medium transition-colors flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: z.color }} />
                      {z.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-white font-display font-black uppercase tracking-widest text-xs">Quick Actions</h4>
              <ul className="space-y-2.5">
                {[
                  { label: 'Submit an RFQ', id: 'fast-lane' },
                  { label: 'Browse Suppliers', id: 'mall-floor' },
                  { label: 'View All Stores', id: 'mall-floor' },
                ].map((a, i) => (
                  <li key={i}>
                    <a
                      href={`#${a.id}`}
                      onClick={e => { e.preventDefault(); document.getElementById(a.id)?.scrollIntoView({ behavior: 'smooth' }); }}
                      className="text-surface-400 hover:text-primary text-xs font-medium transition-colors"
                    >
                      {a.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-surface-200/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-surface-500 text-[10px] font-bold uppercase tracking-[0.25em]">
              GRAHMOS © 2026 · THE FUTURE OF B2B COMMERCE
            </p>
            <div className="flex items-center gap-4">
              <span className="text-surface-500 text-[10px]">${totalGMV}M GMV · ${totalRev.toFixed(0)}M Revenue · 20 Verticals</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
