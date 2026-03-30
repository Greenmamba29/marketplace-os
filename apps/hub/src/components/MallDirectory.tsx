import React, { useState } from 'react';
import { Search, ChevronRight, X, Filter } from 'lucide-react';
import { marketplaces } from '../data/marketplaces';
import { motion, AnimatePresence } from 'framer-motion';

export const MallDirectory: React.FC = () => {
  const [search, setSearch] = useState('');
  const [tierFilter, setTierFilter] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(true);

  const filtered = marketplaces.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase()) || 
                          m.vertical.toLowerCase().includes(search.toLowerCase());
    const matchesTier = tierFilter === null || m.tier === tierFilter;
    return matchesSearch && matchesTier;
  });

  return (
    <div className={`fixed right-6 top-32 z-40 w-80 bg-surface-50 border border-surface-200 rounded-3xl shadow-2xl transition-all duration-500 overflow-hidden ${isOpen ? 'translate-x-0 opacity-100' : 'translate-x-[calc(100%-40px)] opacity-50'}`}>
      {/* Header */}
      <div className="p-5 border-b border-surface-200 flex items-center justify-between bg-surface-100/50 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <h3 className="font-display font-bold text-white uppercase tracking-wider text-sm">Mall Directory</h3>
        </div>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-1 hover:bg-surface-200 rounded-lg transition-colors text-surface-400"
        >
          {isOpen ? <X className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
      </div>

      {/* Search & Filters */}
      <div className="p-4 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
          <input 
            type="text" 
            placeholder="Search stores..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-surface-100 border border-surface-200 rounded-xl py-2 pl-10 pr-4 text-xs text-white placeholder:text-surface-500 focus:outline-none focus:border-primary/50 transition-all"
          />
        </div>
        <div className="flex gap-2">
          {[1, 2, 3].map(t => (
            <button
              key={t}
              onClick={() => setTierFilter(tierFilter === t ? null : t)}
              className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest border transition-all ${
                tierFilter === t 
                  ? 'bg-primary/20 border-primary text-primary' 
                  : 'bg-surface-100 border-surface-200 text-surface-400 hover:border-surface-300'
              }`}
            >
              Tier {t}
            </button>
          ))}
        </div>
      </div>

      {/* Store List */}
      <div className="max-h-[50vh] overflow-y-auto custom-scrollbar p-2">
        <div className="space-y-1">
          {filtered.map(m => (
            <a
              key={m.id}
              href={`https://marketplace-os-${m.id}.netlify.app`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 rounded-xl hover:bg-surface-100 group transition-colors border border-transparent hover:border-surface-200"
            >
              <div className="flex items-center gap-3">
                <div className="w-2 h-8 rounded-full" style={{ backgroundColor: m.color }} />
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-primary transition-colors">{m.name}</h4>
                  <p className="text-[10px] text-surface-400 uppercase tracking-tighter">{m.vertical}</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-surface-500 group-hover:text-white transition-all transform group-hover:translate-x-1" />
            </a>
          ))}
          {filtered.length === 0 && (
            <div className="p-8 text-center text-surface-500 text-xs italic">
              No stores found
            </div>
          )}
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-4 bg-surface-100/30 border-t border-surface-200 text-[10px] text-surface-400 flex justify-between">
        <span>Total: {filtered.length} stores</span>
        <span className="font-mono text-primary animate-pulse">LIVE CONNECTED</span>
      </div>
    </div>
  );
};
