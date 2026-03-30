import React from 'react';
import { marketplaces } from '../data/marketplaces';
import { TrendingUp, ArrowRight } from 'lucide-react';

export const LiveTicker: React.FC = () => {
  // Triple the list for a truly seamless infinite scroll
  const items = [...marketplaces, ...marketplaces, ...marketplaces];

  return (
    <div className="bg-surface-50 border-y border-surface-200 overflow-hidden py-3">
      <div className="animate-marquee whitespace-nowrap flex items-center gap-12 px-6">
        {items.map((m, i) => (
          <div key={`${m.id}-${i}`} className="flex items-center gap-4 group cursor-default">
            <span className="flex items-center gap-2">
              <div 
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: m.color }}
              />
              <span className="font-display font-bold text-white uppercase tracking-wider text-sm">
                {m.name}
              </span>
            </span>
            <div className="flex items-center gap-1.5 font-mono text-sm bg-surface-100/50 px-2 py-0.5 rounded border border-surface-200/50">
              <span className="text-surface-400">GMV</span>
              <span className="text-accent-success font-bold">${m.gmvY3}M</span>
              <TrendingUp className="w-3 h-3 text-accent-success" />
            </div>
            <div className="flex items-center gap-1.5 font-mono text-sm bg-surface-100/50 px-2 py-0.5 rounded border border-surface-200/50">
              <span className="text-surface-400">REV</span>
              <span className="text-primary font-bold">${m.revenueY3}M</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
