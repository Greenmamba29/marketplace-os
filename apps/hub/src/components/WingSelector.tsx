import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Star, TrendingUp, ShieldCheck } from 'lucide-react';
import { marketplaces } from '../data/marketplaces';

const WINGS = [
  {
    tier: 1,
    name: 'The Grand Concourse',
    tagline: 'Flagship verticals. Highest GMV. Premium sourcing.',
    anchor: 'tier-1',
    color: '#EAB308',
    badge: 'FLAGSHIP',
    stores: marketplaces.filter(m => m.tier === 1),
    features: ['2h avg RFQ response', 'ISO-verified suppliers', 'Volume pricing'],
  },
  {
    tier: 2,
    name: 'The Main Hall',
    tagline: 'Professional verticals. Sector compliance. Deep networks.',
    anchor: 'tier-2',
    color: '#2563EB',
    badge: 'PROFESSIONAL',
    stores: marketplaces.filter(m => m.tier === 2),
    features: ['Compliance-first', 'Credentialed suppliers', 'Category specialists'],
  },
  {
    tier: 3,
    name: 'The Specialty Arcade',
    tagline: 'Niche expertise. Boutique compliance. High-touch sourcing.',
    anchor: 'tier-3',
    color: '#0ABFBC',
    badge: 'SPECIALIST',
    stores: marketplaces.filter(m => m.tier === 3),
    features: ['Expert buyers only', 'Niche certifications', 'Relationship-driven'],
  },
];

export const WingSelector: React.FC = () => {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section className="py-24 px-6 bg-[#080C14]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-[10px] text-primary font-black uppercase tracking-widest mb-4">Mall Layout</p>
          <h2 className="text-4xl md:text-5xl font-display font-black text-white uppercase tracking-tighter">
            Choose Your Wing
          </h2>
          <p className="text-surface-400 mt-4 max-w-lg mx-auto">
            Three zones. Every B2B vertical. Walk into any wing and start sourcing in under 60 seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {WINGS.map((wing, i) => {
            const gmv = wing.stores.reduce((acc, s) => acc + s.gmvY3, 0);
            const isHovered = hovered === i;
            return (
              <motion.a
                key={i}
                href={`#${wing.anchor}`}
                onClick={e => {
                  e.preventDefault();
                  document.getElementById(wing.anchor)?.scrollIntoView({ behavior: 'smooth' });
                }}
                onHoverStart={() => setHovered(i)}
                onHoverEnd={() => setHovered(null)}
                whileHover={{ y: -8 }}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative group block p-8 bg-surface-50 border border-surface-200 rounded-3xl overflow-hidden cursor-pointer hover:border-primary/50 transition-all duration-500"
              >
                {/* Glow bg */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                  style={{ background: `radial-gradient(ellipse at 50% 0%, ${wing.color}10, transparent 70%)` }}
                />

                {/* Zone number watermark */}
                <div
                  className="absolute top-4 right-6 text-8xl font-display font-black opacity-5 leading-none select-none"
                  style={{ color: wing.color }}
                >
                  0{wing.tier}
                </div>

                {/* Badge */}
                <div
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border mb-6"
                  style={{ backgroundColor: wing.color + '15', borderColor: wing.color + '30', color: wing.color }}
                >
                  <Star className="w-2.5 h-2.5" fill="currentColor" />
                  {wing.badge}
                </div>

                {/* Name + tagline */}
                <h3 className="text-xl font-display font-black text-white uppercase tracking-tighter leading-tight mb-2 group-hover:text-primary transition-colors">
                  {wing.name}
                </h3>
                <p className="text-surface-400 text-xs leading-relaxed mb-6">{wing.tagline}</p>

                {/* Stats row */}
                <div className="flex items-center gap-6 mb-6">
                  <div>
                    <p className="text-[10px] text-surface-500 uppercase tracking-widest font-bold">Stores</p>
                    <p className="text-2xl font-display font-black text-white">{wing.stores.length}</p>
                  </div>
                  <div className="w-px h-8 bg-surface-200" />
                  <div>
                    <p className="text-[10px] text-surface-500 uppercase tracking-widest font-bold">Zone GMV</p>
                    <p className="text-2xl font-display font-black" style={{ color: wing.color }}>\${gmv}M</p>
                  </div>
                </div>

                {/* Feature pills */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {wing.features.map((f, fi) => (
                    <span
                      key={fi}
                      className="text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1"
                      style={{ backgroundColor: wing.color + '10', color: wing.color }}
                    >
                      <ShieldCheck className="w-2.5 h-2.5" />
                      {f}
                    </span>
                  ))}
                </div>

                {/* Store name chips */}
                <div className="flex flex-wrap gap-1.5 mb-8">
                  {wing.stores.map(s => (
                    <span key={s.id} className="text-[9px] font-bold px-2 py-0.5 bg-surface-100 border border-surface-200 rounded-full text-surface-400">
                      {s.name}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest" style={{ color: wing.color }}>
                  Enter Wing <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
};
