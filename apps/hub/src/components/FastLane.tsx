import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Search, ArrowRight, ChevronRight, Package, Beaker, HardHat, Activity, Hexagon, Leaf } from 'lucide-react';
import { marketplaces } from '../data/marketplaces';

const FAST_ACTIONS = [
  { label: 'Submit an RFQ', description: 'Get quotes from 40+ verified suppliers in 2 hours', icon: Zap, color: '#0ABFBC', store: 'mrodirect', path: '/rfq' },
  { label: 'Browse Top Products', description: 'See what 2,400+ buyers sourced this week', icon: Package, color: '#F97316', store: 'mrodirect', path: '/directory' },
  { label: 'Find a Supplier', description: 'Search verified suppliers by vertical and certification', icon: Search, color: '#2563EB', store: 'medsupplyos', path: '/directory' },
  { label: 'Create a Repeat List', description: 'Save your sourcing list for one-click reorder', icon: Leaf, color: '#16A34A', store: 'foodops', path: '/register' },
];

const TRENDING_CATEGORIES = [
  { name: 'Industrial MRO', store: 'mrodirect', icon: Package, color: '#F97316', trend: '+12%', buyers: '840' },
  { name: 'Specialty Chemicals', store: 'cheemos', icon: Beaker, color: '#0ABFBC', trend: '+8%', buyers: '612' },
  { name: 'Construction', store: 'buildsource', icon: HardHat, color: '#D97706', trend: '+19%', buyers: '530' },
  { name: 'Healthcare', store: 'medsupplyos', icon: Activity, color: '#2563EB', trend: '+6%', buyers: '480' },
  { name: 'Lithium/Energy', store: 'lithiumbuy', icon: Hexagon, color: '#7C3AED', trend: '+31%', buyers: '290' },
  { name: 'Food & Beverage', store: 'foodops', icon: Leaf, color: '#16A34A', trend: '+9%', buyers: '410' },
];

export const FastLane: React.FC = () => {
  const [query, setQuery] = useState('');
  const [activeAction, setActiveAction] = useState<number | null>(null);

  const filtered = query.length > 1
    ? marketplaces.filter(m =>
        m.name.toLowerCase().includes(query.toLowerCase()) ||
        m.vertical.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const handleGo = (store: string, path: string) => {
    window.open(`https://marketplace-os-${store}.netlify.app${path}`, '_blank');
  };

  return (
    <section className="relative py-24 border-y border-surface-200/30 bg-[#080C14]">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest mb-6">
            <Zap className="w-3 h-3" />
            Fast Lane — First Purchase in Under 90 Seconds
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-black text-white tracking-tighter uppercase leading-none">
            What do you want to <span className="text-primary">source today?</span>
          </h2>
          <p className="text-surface-400 mt-4 max-w-xl mx-auto">
            Skip the browsing. Jump straight to an RFQ, supplier search, or product list in one click.
          </p>
        </div>

        {/* Universal Search */}
        <div className="relative max-w-2xl mx-auto mb-16">
          <div className="relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search by product, category, or supplier..."
              className="w-full bg-surface-50 border border-surface-200 hover:border-primary/50 focus:border-primary text-white placeholder-surface-400 pl-14 pr-6 py-5 rounded-2xl text-sm font-medium outline-none transition-all duration-300 shadow-xl"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-surface-400 hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Search Dropdown */}
          <AnimatePresence>
            {filtered.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="absolute top-full mt-2 left-0 right-0 bg-surface-50 border border-surface-200 rounded-2xl overflow-hidden z-50 shadow-2xl"
              >
                {filtered.slice(0, 5).map(m => (
                  <a
                    key={m.id}
                    href={`https://marketplace-os-${m.id}.netlify.app/directory`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between px-5 py-4 hover:bg-surface-100 transition-colors border-b border-surface-200/50 last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: m.color }} />
                      <div>
                        <p className="text-white text-sm font-bold">{m.name}</p>
                        <p className="text-surface-400 text-[11px]">{m.vertical}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-primary font-bold">${m.gmvY3}M GMV</span>
                      <ArrowRight className="w-4 h-4 text-surface-400" />
                    </div>
                  </a>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Fast Action Buttons — "What should I do next as a buyer?" */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-20">
          {FAST_ACTIONS.map((action, i) => {
            const Icon = action.icon;
            return (
              <motion.button
                key={i}
                onHoverStart={() => setActiveAction(i)}
                onHoverEnd={() => setActiveAction(null)}
                onClick={() => handleGo(action.store, action.path)}
                whileTap={{ scale: 0.97 }}
                className="group relative text-left p-6 bg-surface-50 border border-surface-200 rounded-2xl hover:border-primary transition-all duration-300 overflow-hidden"
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500"
                  style={{ backgroundColor: action.color }}
                />
                <Icon className="w-6 h-6 mb-4 transition-transform group-hover:scale-110 duration-300" style={{ color: action.color }} />
                <p className="text-white font-bold text-sm mb-1">{action.label}</p>
                <p className="text-surface-400 text-[11px] leading-relaxed mb-4">{action.description}</p>
                <div className="flex items-center gap-1 text-primary text-[10px] font-black uppercase tracking-widest">
                  Go now <ChevronRight className="w-3 h-3" />
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Trending Categories — OpenSea-style "Trending Collections" */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-white font-display font-black text-xl uppercase tracking-tighter">
              Trending Verticals This Week
            </h3>
            <span className="text-surface-400 text-xs">Highest buyer activity</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {TRENDING_CATEGORIES.map((cat, i) => {
              const Icon = cat.icon;
              return (
                <motion.a
                  key={i}
                  href={`https://marketplace-os-${cat.store}.netlify.app/directory`}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -4 }}
                  className="group p-4 bg-surface-50 border border-surface-200 rounded-xl hover:border-primary transition-all duration-300 text-center"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3 transition-transform group-hover:scale-110 duration-300"
                    style={{ backgroundColor: cat.color + '20', border: `1px solid ${cat.color}30` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: cat.color }} />
                  </div>
                  <p className="text-white text-[11px] font-bold mb-1 leading-tight">{cat.name}</p>
                  <p className="text-primary text-[10px] font-black">{cat.trend}</p>
                  <p className="text-surface-400 text-[10px] mt-0.5">{cat.buyers} buyers</p>
                </motion.a>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
