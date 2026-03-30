import React from 'react';
import { ExternalLink, TrendingUp, BarChart, Package, Beaker, HardHat, Activity, Zap, Hexagon, Leaf, Box, FlaskConical, Wrench, Heart, Scale, Tag, Network, Shield, Shirt, Armchair, Martini } from 'lucide-react';
import { Marketplace } from '../data/marketplaces';
import { motion } from 'framer-motion';

const iconMap: Record<string, any> = {
  Package, Beaker, HardHat, Activity, Zap, Hexagon, Leaf, Box, FlaskConical, Wrench, Heart, Scale, Tag, Network, Shield, Shirt, Armchair, Martini
};

interface MarketplaceCardProps {
  marketplace: Marketplace;
}

export const MarketplaceCard: React.FC<MarketplaceCardProps> = ({ marketplace }) => {
  const Icon = iconMap[marketplace.iconName] || Package;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="group p-6 bg-surface-50 border border-surface-200 rounded-2xl hover:border-primary/50 transition-all duration-300 card-hover flex flex-col h-full"
    >
      <div className="flex items-start justify-between mb-4">
        <div 
          className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
          style={{ backgroundColor: `${marketplace.color}20` }}
        >
          <Icon className="w-6 h-6" style={{ color: marketplace.color }} />
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
            marketplace.tier === 1 ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20' :
            marketplace.tier === 2 ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
            'bg-slate-500/10 text-slate-400 border border-slate-500/20'
          }`}>
            Tier {marketplace.tier}
          </span>
          <span className="text-[10px] font-mono text-surface-400 bg-surface-100 px-2 py-0.5 rounded border border-surface-200">
            {marketplace.framework}
          </span>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors flex items-center gap-2">
          {marketplace.name}
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: marketplace.color }} />
        </h3>
        <p className="text-xs font-mono text-surface-400">{marketplace.domain}</p>
        <p className="text-sm text-surface-300 mt-1">{marketplace.vertical}</p>
      </div>

      <div className="mt-auto pt-4 border-t border-surface-200/50">
        <div className="grid grid-cols-2 gap-4 mb-5">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-surface-400 mb-1">
              <TrendingUp className="w-3 h-3" />
              <span>GMV Y3</span>
            </div>
            <p className="text-lg font-display font-bold text-white">${marketplace.gmvY3}M</p>
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-xs text-surface-400 mb-1">
              <BarChart className="w-3 h-3" />
              <span>Revenue Y3</span>
            </div>
            <p className="text-lg font-display font-bold text-white">${marketplace.revenueY3}M</p>
          </div>
        </div>

        <a
          href={`https://marketplace-os-${marketplace.id}.netlify.app`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-2.5 bg-surface-100 hover:bg-surface-200 text-white text-sm font-medium rounded-xl border border-surface-200 transition-all flex items-center justify-center gap-2 group/btn"
        >
          Launch Platform
          <ExternalLink className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
        </a>
      </div>
    </motion.div>
  );
};
