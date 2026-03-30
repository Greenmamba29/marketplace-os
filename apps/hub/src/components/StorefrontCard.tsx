import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, TrendingUp, Package, Beaker, HardHat, Activity, Zap, Hexagon, Leaf, Box, FlaskConical, Wrench, Heart, Scale, Tag, Network, Shield, Shirt, Armchair, Martini, ArrowRight } from 'lucide-react';
import { Marketplace } from '../data/marketplaces';

const iconMap: Record<string, any> = {
  Package, Beaker, HardHat, Activity, Zap, Hexagon, Leaf, Box, FlaskConical, Wrench, Heart, Scale, Tag, Network, Shield, Shirt, Armchair, Martini
};

interface StorefrontCardProps {
  marketplace: Marketplace;
}

export const StorefrontCard: React.FC<StorefrontCardProps> = ({ marketplace }) => {
  const Icon = iconMap[marketplace.iconName] || Package;
  const netlifyUrl = `https://marketplace-os-${marketplace.id}.netlify.app`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative h-[450px] bg-surface-50 border border-surface-200 rounded-2xl overflow-hidden hover:border-primary transition-all duration-500 shadow-2xl hover:shadow-primary/10"
    >
      {/* Illuminated Signage Area */}
      <div className="h-32 bg-surface-100 flex items-center justify-center p-6 relative overflow-hidden group-hover:bg-surface-200 transition-colors">
        <div 
          className="absolute inset-0 opacity-10 blur-2xl transition-transform group-hover:scale-125 duration-700"
          style={{ backgroundColor: marketplace.color }}
        />
        <div className="z-10 text-center">
          <Icon className="w-8 h-8 mx-auto mb-2 transition-transform group-hover:scale-110 duration-500" style={{ color: marketplace.color }} />
          <h3 className="text-xl font-display font-black text-white uppercase tracking-tighter group-hover:text-primary transition-colors">
            {marketplace.name}
          </h3>
          <div className="w-12 h-1 bg-primary mx-auto mt-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500" />
        </div>
      </div>

      {/* Main Display Area */}
      <div className="p-6 h-[calc(450px-128px)] flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider bg-surface-100 text-surface-400 border border-surface-200">
              {marketplace.vertical}
            </span>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 bg-surface-100/50 rounded-xl border border-surface-200 group-hover:border-primary/20 transition-all">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-surface-400 uppercase tracking-widest font-bold">Annual Volume</span>
                <TrendingUp className="w-3 h-3 text-primary" />
              </div>
              <p className="text-2xl font-display font-black text-white">${marketplace.gmvY3}M</p>
              <div className="w-full h-1 bg-surface-200 mt-2 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: `${(marketplace.gmvY3 / 85) * 100}%` }}
                  className="h-full bg-primary"
                />
              </div>
            </div>

            <div className="flex items-center justify-between px-2">
              <div className="text-center">
                <p className="text-[10px] text-surface-400 uppercase tracking-tighter">Revenue Y3</p>
                <p className="text-sm font-bold text-white">${marketplace.revenueY3}M</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] text-surface-400 uppercase tracking-tighter">Tier Level</p>
                <p className="text-sm font-bold text-primary">0{marketplace.tier}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <a
          href={netlifyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-4 bg-surface-100 group-hover:bg-primary group-hover:text-black text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all duration-500 flex items-center justify-center gap-3 border border-surface-200 group-hover:border-primary"
        >
          Enter Store
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </a>
      </div>

      {/* Glossy Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
    </motion.div>
  );
};
