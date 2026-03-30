import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Github, Database, ShoppingBag, Globe, Menu, ChevronDown, Zap, BarChart3, TrendingUp, Info } from 'lucide-react';
import { marketplaces } from '../data/marketplaces';
import { Globe3D } from '../components/Globe3D';
import { MallDirectory } from '../components/MallDirectory';
import { StorefrontCard } from '../components/StorefrontCard';
import { LiveTicker } from '../components/LiveTicker';

const AnimatedCounter = ({ end, suffix = '', duration = 2 }: { end: number; suffix?: string; duration?: number }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const endValue = end;
    if (start === endValue) return;

    let timer = setInterval(() => {
      start += Math.ceil(endValue / (duration * 60));
      if (start >= endValue) {
        setCount(endValue);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 1000 / 60);

    return () => clearInterval(timer);
  }, [end, duration]);

  return <span>{count.toLocaleString(undefined, { maximumFractionDigits: suffix === 'M' && end < 200 ? 1 : 0 })}{suffix}</span>;
};

const MallZone = ({ title, zoneId, tier, stores }: { title: string; zoneId: string; tier: number; stores: typeof marketplaces }) => (
  <div id={zoneId} className="mb-32">
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 px-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-6 bg-primary rounded-full" />
          <span className="text-primary font-mono text-xs font-black tracking-widest uppercase">Zone 0{tier}</span>
        </div>
        <h2 className="text-4xl md:text-6xl font-display font-black text-white uppercase tracking-tighter leading-none">{title}</h2>
      </div>
      <div className="flex items-center gap-8">
        <div className="text-right">
          <p className="text-[10px] text-surface-400 font-bold uppercase tracking-widest mb-1">Floor Occupancy</p>
          <p className="text-2xl font-display font-black text-white">{stores.length}/20 Stores</p>
        </div>
        <div className="w-px h-12 bg-surface-200" />
        <div className="text-right">
          <p className="text-[10px] text-surface-400 font-bold uppercase tracking-widest mb-1">Zone GMV</p>
          <p className="text-2xl font-display font-black text-primary">${stores.reduce((acc, s) => acc + s.gmvY3, 0)}M</p>
        </div>
      </div>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-6">
      {stores.map((m) => (
        <StorefrontCard key={m.id} marketplace={m} />
      ))}
    </div>
  </div>
);

export const Hub: React.FC = () => {
  const tier1 = marketplaces.filter(m => m.tier === 1);
  const tier2 = marketplaces.filter(m => m.tier === 2);
  const tier3 = marketplaces.filter(m => m.tier === 3);

  const totalGMV = marketplaces.reduce((acc, m) => acc + m.gmvY3, 0);
  const totalRev = marketplaces.reduce((acc, m) => acc + m.revenueY3, 0);

  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);
  const scale = useTransform(scrollY, [0, 500], [1, 0.8]);

  const scrollToMall = () => {
    document.getElementById('mall-floor')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#080C14] selection:bg-primary selection:text-black">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#080C14]/80 backdrop-blur-md border-b border-surface-200/50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <ShoppingBag className="w-6 h-6 text-black" />
            </div>
            <span className="font-display font-black text-2xl tracking-tighter text-white">GRAHM OS MALL</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <span className="bg-primary/10 text-primary text-[10px] font-black px-4 py-1.5 rounded-full border border-primary/20 flex items-center gap-2 tracking-widest uppercase">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              20 VERTICALS ONLINE
            </span>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-surface-400 hover:text-white transition-colors">
              <Github className="w-6 h-6" />
            </a>
          </div>
        </div>
      </nav>

      {/* 1. Landing: 3D Globe Section */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
        <motion.div style={{ opacity, scale }} className="relative z-10 text-center px-6">
          <div className="mb-8">
            <Globe3D />
          </div>
          
          <h1 className="text-5xl md:text-8xl font-display font-black text-white mb-6 leading-none tracking-tighter uppercase">
            The Virtual <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-500 to-teal-400">
              Economic Hub
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-surface-400 max-w-2xl mx-auto mb-12 font-medium">
            20 high-performance B2B marketplaces centralized in a 3D digital ecosystem. Real-time GMV tracking. Instant store access.
          </p>

          {/* Stats Bar */}
          <div className="flex flex-wrap justify-center gap-12 mb-12">
            <div className="text-center">
              <div className="text-surface-400 text-[10px] font-black uppercase tracking-widest mb-1">Portfolio Volume</div>
              <div className="text-3xl font-display font-black text-white">$<AnimatedCounter end={totalGMV} suffix="M" /></div>
            </div>
            <div className="text-center">
              <div className="text-surface-400 text-[10px] font-black uppercase tracking-widest mb-1">Active Hubs</div>
              <div className="text-3xl font-display font-black text-white"><AnimatedCounter end={20} /></div>
            </div>
            <div className="text-center">
              <div className="text-surface-400 text-[10px] font-black uppercase tracking-widest mb-1">Annual Rev</div>
              <div className="text-3xl font-display font-black text-primary">$<AnimatedCounter end={totalRev} suffix="M" /></div>
            </div>
          </div>

          <button 
            onClick={scrollToMall}
            className="group relative px-10 py-5 bg-white text-black font-black uppercase tracking-[0.2em] text-xs rounded-full hover:bg-primary transition-all duration-500 overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-3">
              Enter The Mall
              <ChevronDown className="w-4 h-4 transition-transform group-hover:translate-y-1" />
            </span>
            <div className="absolute inset-0 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
          </button>
        </motion.div>

        {/* Ambient background particles/grid could go here */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(10,191,188,0.05),transparent_70%)] pointer-events-none" />
      </section>

      {/* Live Ticker Break */}
      <section className="border-y border-surface-200/50">
        <LiveTicker />
      </section>

      {/* 2. Mall Floor Section */}
      <main id="mall-floor" className="relative z-10 pt-32 pb-64">
        <div className="max-w-7xl mx-auto">
          {/* Mall Directory (Sticky Sidebar) */}
          <MallDirectory />

          {/* Mall Wings */}
          <MallZone 
            title="The Grand Concourse" 
            zoneId="tier-1" 
            tier={1} 
            stores={tier1} 
          />
          
          <MallZone 
            title="The Main Hall" 
            zoneId="tier-2" 
            tier={2} 
            stores={tier2} 
          />
          
          <MallZone 
            title="The Specialty Arcade" 
            zoneId="tier-3" 
            tier={3} 
            stores={tier3} 
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 bg-surface-50 border-t border-surface-200/50 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-20">
            <div>
              <div className="flex items-center gap-3 mb-8">
                <ShoppingBag className="w-8 h-8 text-primary" />
                <span className="font-display font-black text-3xl tracking-tighter text-white">GRAHM OS MALL</span>
              </div>
              <p className="text-surface-400 leading-relaxed font-medium">
                The enterprise-grade architecture for vertical-specific commerce. 20 marketplaces, 1 unified experience. Built on Medusa, Saleor, and OroCommerce.
              </p>
            </div>
            
            <div className="space-y-6">
              <h4 className="text-white font-display font-black uppercase tracking-widest text-sm">Mall Zones</h4>
              <ul className="space-y-4 text-surface-400 text-sm font-bold uppercase tracking-wider">
                <li><a href="#tier-1" className="hover:text-primary transition-colors flex items-center gap-2">The Grand Concourse <Zap className="w-3 h-3" /></a></li>
                <li><a href="#tier-2" className="hover:text-primary transition-colors">The Main Hall</a></li>
                <li><a href="#tier-3" className="hover:text-primary transition-colors">The Specialty Arcade</a></li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-white font-display font-black uppercase tracking-widest text-sm">Ecosystem Stats</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-surface-100 rounded-xl border border-surface-200">
                  <p className="text-[10px] text-surface-400 mb-1">TOTAL GMV</p>
                  <p className="text-lg font-display font-black text-white">${totalGMV}M</p>
                </div>
                <div className="p-4 bg-surface-100 rounded-xl border border-surface-200">
                  <p className="text-[10px] text-surface-400 mb-1">STORES</p>
                  <p className="text-lg font-display font-black text-white">20</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-12 border-t border-surface-200/20 text-center flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-surface-500 text-[10px] font-black uppercase tracking-[0.3em]">
              GRAHM OS © 2026 | THE FUTURE OF B2B COMMERCE
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-surface-400 hover:text-white transition-colors"><Info className="w-5 h-5" /></a>
              <a href="#" className="text-surface-400 hover:text-white transition-colors"><Database className="w-5 h-5" /></a>
              <a href="#" className="text-surface-400 hover:text-white transition-colors"><Globe className="w-5 h-5" /></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
