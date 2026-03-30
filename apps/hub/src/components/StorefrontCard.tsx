import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ExternalLink, TrendingUp, Package, Beaker, HardHat, Activity,
  Zap, Hexagon, Leaf, Box, FlaskConical, Wrench, Heart, Scale,
  Tag, Network, Shield, Shirt, Armchair, Martini, ArrowRight,
  ShoppingCart, FileText, Bookmark, Users
} from 'lucide-react';
import { Marketplace } from '../data/marketplaces';

const iconMap: Record<string, any> = {
  Package, Beaker, HardHat, Activity, Zap, Hexagon, Leaf, Box,
  FlaskConical, Wrench, Heart, Scale, Tag, Network, Shield, Shirt,
  Armchair, Martini
};

// Buyer-outcome copy per marketplace — what does the buyer get?
const BUYER_OUTCOMES: Record<string, { headline: string; action: string; stat: string }> = {
  mrodirect:    { headline: 'Source 2.4M parts with verified pricing',   action: 'Submit RFQ',       stat: '2h avg response' },
  cheemos:      { headline: 'Compliant chemicals with SDS on every order', action: 'Browse Catalog',  stat: '18K+ chemicals' },
  buildsource:  { headline: 'From concrete to steel — one order',          action: 'Get Materials',   stat: '92% on-time delivery' },
  medsupplyos:  { headline: 'FDA-cleared devices, GPO pricing',            action: 'Find Supplies',   stat: '180K+ SKUs' },
  voltsource:   { headline: 'EV & solar components, IEC-certified',        action: 'Source Energy',   stat: '$54M sourced' },
  lithiumbuy:   { headline: 'Live Li2CO3 spot prices, instant RFQ',        action: 'Check Prices',    stat: 'Real-time market' },
  foodops:      { headline: 'Cold-chain food sourcing, FSMA compliant',    action: 'Source Food',     stat: '320K food SKUs' },
  packsource:   { headline: 'Custom packaging quoted in 72 hours',         action: 'Get Packaging',   stat: '72h turnaround' },
  agroops:      { headline: 'EPA-registered agri-inputs, direct from mfg', action: 'Find Inputs',    stat: '400+ suppliers' },
  labsource:    { headline: 'ISO-certified lab supplies with lot tracking', action: 'Browse Lab',     stat: '2.1M lab items' },
  rigsource:    { headline: 'Heavy equipment, Tier 4 Final compliant',     action: 'Find Equipment', stat: 'Global delivery' },
  careops:      { headline: 'Credentialed care staff placed in 72 hours',  action: 'Find Staff',     stat: '4,200+ caregivers' },
  govsource:    { headline: 'FAR-compliant procurement, SAM registered',   action: 'Find Vendors',   stat: 'GSA schedule' },
  surplusos:    { headline: 'Surplus assets auctioned at real value',      action: 'Browse Auctions', stat: 'Live bidding' },
  netsource:    { headline: 'Cisco, Juniper, Aruba — new & refurb',       action: 'Find Hardware',   stat: 'NDAA compliant' },
  securesource: { headline: 'End-to-end security systems, NDAA-cleared',  action: 'Design System',   stat: 'UL/FIPS certified' },
  uniformos:    { headline: 'Branded uniforms for 10 to 10K employees',    action: 'Order Uniforms', stat: '450K styles' },
  workspaceos:  { headline: 'BIFMA-certified furniture, space planned',    action: 'Plan Space',     stat: '95K sqft installed' },
  ingredientos: { headline: 'Formula-ready ingredients, CoA on every lot', action: 'Source Ingredients', stat: '24h sample ship' },
  barrelhub:    { headline: 'Bulk spirits & barrels with DSP verification', action: 'Browse Barrels', stat: 'Escrow protected' },
};

interface StorefrontCardProps {
  marketplace: Marketplace;
}

export const StorefrontCard: React.FC<StorefrontCardProps> = ({ marketplace }) => {
  const [saved, setSaved] = useState(false);
  const Icon = iconMap[marketplace.iconName] || Package;
  const netlifyUrl = `https://marketplace-os-${marketplace.id}.netlify.app`;
  const outcome = BUYER_OUTCOMES[marketplace.id] || {
    headline: `Source ${marketplace.vertical} at scale`,
    action: 'Enter Store',
    stat: `$${marketplace.gmvY3}M GMV`,
  };

  const tierLabel = marketplace.tier === 1
    ? 'FLAGSHIP'
    : marketplace.tier === 2
    ? 'PROFESSIONAL'
    : 'SPECIALIST';

  const tierBg = marketplace.tier === 1
    ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
    : marketplace.tier === 2
    ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
    : 'bg-surface-100 text-surface-400 border-surface-200';

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5 }}
      className="group relative bg-surface-50 border border-surface-200 rounded-2xl overflow-hidden hover:border-primary/60 transition-all duration-500 shadow-xl hover:shadow-primary/10 flex flex-col"
    >
      {/* Tier badge + save button */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between">
        <span className={`text-[9px] font-black px-2.5 py-1 rounded-full border uppercase tracking-widest ${tierBg}`}>
          {tierLabel}
        </span>
        <button
          onClick={(e) => { e.preventDefault(); setSaved(s => !s); }}
          className="w-7 h-7 rounded-full bg-surface-100/80 border border-surface-200 flex items-center justify-center hover:border-primary transition-colors"
        >
          <Bookmark
            className="w-3.5 h-3.5 transition-colors"
            style={{ color: saved ? marketplace.color : undefined }}
            fill={saved ? marketplace.color : 'none'}
          />
        </button>
      </div>

      {/* Storefront Header — illuminated signage */}
      <div
        className="relative h-36 flex flex-col items-center justify-center pt-8 overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${marketplace.color}12, transparent 60%), #0F1623` }}
      >
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
          style={{ background: `radial-gradient(ellipse at 50% 50%, ${marketplace.color}15, transparent 70%)` }}
        />
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mb-2 transition-transform group-hover:scale-110 duration-500 shadow-lg"
          style={{ backgroundColor: marketplace.color + '18', border: `1px solid ${marketplace.color}30` }}
        >
          <Icon className="w-7 h-7" style={{ color: marketplace.color }} />
        </div>
        <h3 className="text-lg font-display font-black text-white uppercase tracking-tighter group-hover:text-primary transition-colors">
          {marketplace.name}
        </h3>
        {/* Neon underline */}
        <motion.div
          className="h-0.5 mt-1.5 rounded-full"
          style={{ backgroundColor: marketplace.color }}
          initial={{ width: 0 }}
          whileInView={{ width: 40 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 gap-4">
        {/* Buyer outcome headline — what do I get? */}
        <p className="text-white text-sm font-semibold leading-snug">
          {outcome.headline}
        </p>

        {/* Key stat — buyer-oriented, not just GMV */}
        <div className="flex items-center gap-3">
          <div
            className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider"
            style={{ backgroundColor: marketplace.color + '15', color: marketplace.color }}
          >
            {outcome.stat}
          </div>
          <div className="flex items-center gap-1 text-surface-400 text-[10px]">
            <Users className="w-3 h-3" />
            {(marketplace.gmvY3 * 12).toLocaleString()} buyers
          </div>
        </div>

        {/* Volume bar — kept but reframed */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] text-surface-400 uppercase tracking-widest font-bold">
              Sourcing Volume
            </span>
            <span className="text-[10px] font-bold text-white">${marketplace.gmvY3}M/yr</span>
          </div>
          <div className="w-full h-1 bg-surface-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${(marketplace.gmvY3 / 85) * 100}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full rounded-full"
              style={{ backgroundColor: marketplace.color }}
            />
          </div>
        </div>

        {/* CTA pair — Primary + Secondary (OpenSea-style Buy Now + Continue Shopping) */}
        <div className="flex gap-2 mt-auto pt-2">
          <a
            href={`${netlifyUrl}/rfq`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 text-black"
            style={{ backgroundColor: marketplace.color }}
          >
            <FileText className="w-3.5 h-3.5" />
            {outcome.action}
          </a>
          <a
            href={`${netlifyUrl}/directory`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-3 bg-surface-100 hover:bg-surface-200 border border-surface-200 rounded-xl text-[11px] font-black uppercase tracking-widest text-white transition-all duration-300 flex items-center justify-center gap-2"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            Browse
          </a>
        </div>

        {/* Continue Shopping link — explicit return path */}
        <a
          href={netlifyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-center text-[10px] text-surface-400 hover:text-primary transition-colors flex items-center justify-center gap-1 pt-1"
        >
          <ExternalLink className="w-3 h-3" />
          Enter full store
        </a>
      </div>
    </motion.div>
  );
};
