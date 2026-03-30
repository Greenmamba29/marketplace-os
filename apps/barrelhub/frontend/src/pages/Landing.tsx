import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Shield, 
  Zap, 
  Globe, 
  ArrowRight,
  ChevronRight,
  Users,
  Package,
  Truck,
  Wine,
  Search,
  BarChart3,
  TrendingUp,
  Landmark,
  BadgeCheck,
  Filter
} from 'lucide-react';
import { useEffect, useState } from 'react';

function AnimatedCounter({ end, duration = 2, suffix = '' }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let startTime: number;
    let frame: number;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [end, duration]);
  return <span>{count.toLocaleString()}{suffix}</span>;
}

export default function Landing() {
  const spiritTypes = [
    { name: 'Bourbon', icon: Wine, desc: 'Aged Kentucky and MGP barrels' },
    { name: 'Whiskey', icon: Package, desc: 'Rye, Malt, and Canadian blends' },
    { name: 'Rum', icon: Globe, desc: 'Caribbean and tropical aged stocks' },
    { name: 'Gin', icon: Zap, desc: 'Bulk neutral grain spirit and botanicals' },
    { name: 'Tequila', icon: Landmark, desc: 'Premium 100% Agave bulk options' },
    { name: 'Scotch', icon: Shield, desc: 'Single malt and blended cask stock' },
  ];

  return (
    <div className="min-h-screen bg-[#080C14] text-[#F8FAFC] font-['DM_Sans']">
      {/* Hero Section */}
      <section className="relative pt-32 pb-48 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(146,64,14,0.15),transparent_50%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-6 py-2 bg-[#92400E]/10 border border-[#92400E]/20 rounded-full mb-12"
          >
            <BadgeCheck className="w-4 h-4 text-[#92400E]" />
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#92400E] font-black">DSP Verified & Escrow Protected Trade</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-['Syne'] font-extrabold text-white mb-10 tracking-tight leading-none"
          >
            GLOBAL BULK <br />
            <span className="bg-gradient-to-r from-[#92400E] to-[#D97706] bg-clip-text text-transparent italic uppercase tracking-tighter">SPIRITS EXCHANGE</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-2xl text-slate-400 mb-16 max-w-4xl mx-auto font-light leading-relaxed"
          >
            The premier marketplace for aged barrels and bulk spirits. 
            Trade with institutional transparency, secure escrow, and age-verified analytics.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-8"
          >
            <Link to="/register" className="group w-full sm:w-auto px-12 py-5 bg-[#92400E] text-white font-black rounded-xl hover:shadow-[0_0_30px_rgba(146,64,14,0.4)] transition-all flex items-center justify-center gap-3 text-lg uppercase tracking-widest">
              Browse Barrels
              <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </Link>
            <Link to="/register" className="group w-full sm:w-auto px-12 py-5 bg-[#0F1623] text-white font-bold rounded-xl border border-slate-800 hover:border-[#92400E]/50 transition-all flex items-center justify-center gap-3 text-lg uppercase tracking-widest">
              Age Statement Filter
              <Filter className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Trust Stats */}
      <section className="py-24 bg-[#0F1623] border-y border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          <div>
            <div className="flex justify-center mb-4"><Package className="w-8 h-8 text-[#92400E]" /></div>
            <p className="text-5xl font-['Syne'] font-black text-white mb-2"><AnimatedCounter end={12000} suffix="+" /></p>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Barrels Listed</p>
          </div>
          <div>
            <div className="flex justify-center mb-4"><Landmark className="w-8 h-8 text-[#92400E]" /></div>
            <p className="text-5xl font-['Syne'] font-black text-white mb-2"><AnimatedCounter end={280} suffix="+" /></p>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Verified Distilleries</p>
          </div>
          <div>
            <div className="flex justify-center mb-4"><Globe className="w-8 h-8 text-[#92400E]" /></div>
            <p className="text-5xl font-['Syne'] font-black text-white mb-2"><AnimatedCounter end={65} suffix="+" /></p>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Countries Participating</p>
          </div>
          <div>
            <div className="flex justify-center mb-4"><TrendingUp className="w-8 h-8 text-[#92400E]" /></div>
            <p className="text-5xl font-['Syne'] font-black text-white mb-2"><AnimatedCounter end={2.4} suffix="B" /></p>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Annual Market Volume</p>
          </div>
        </div>
      </section>

      {/* Spirit Types Grid */}
      <section className="py-32 bg-[#080C14]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-20 text-center">
            <h2 className="text-4xl md:text-5xl font-['Syne'] font-bold text-white mb-6 uppercase tracking-tighter">Liquid Asset Classes</h2>
            <div className="h-1.5 w-24 bg-[#92400E] mx-auto rounded-full" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {spiritTypes.map((v, i) => (
              <Link key={i} to="/register" className="group p-8 bg-[#0F1623] border border-slate-800 rounded-2xl hover:border-[#92400E]/50 transition-all">
                <div className="w-14 h-14 bg-[#92400E]/10 rounded-xl flex items-center justify-center mb-6 text-[#92400E] group-hover:bg-[#92400E]/20 transition-colors">
                  <v.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-['Syne'] font-bold text-white mb-2 group-hover:text-[#92400E] transition-colors uppercase tracking-tight">{v.name}</h3>
                <p className="text-slate-500 text-sm mb-6">{v.desc}</p>
                <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#92400E]">
                  View Listings <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Specialist Credibility */}
      <section className="py-32 bg-[#0F1623]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { icon: BarChart3, title: 'Market Analytics', desc: 'Institutional-grade pricing data and historical yield trends for all major bulk spirit categories.' },
              { icon: Shield, title: 'Escrow & Logistics', desc: 'Secure transaction management and bonded, temperature-controlled global barrel transport.' },
              { icon: Landmark, title: 'Distillery Direct', desc: 'Exclusive access to distillery surplus and priority allocations for new-make spirit.' },
            ].map((f, i) => (
              <div key={i} className="group p-10 bg-[#0F1623] border border-slate-800 rounded-2xl hover:border-[#92400E]/50 transition-all">
                <div className="w-14 h-14 bg-[#92400E]/10 rounded-xl flex items-center justify-center mb-8 group-hover:bg-[#92400E]/20 transition-colors">
                  <f.icon className="w-8 h-8 text-[#92400E]" />
                </div>
                <h3 className="text-2xl font-['Syne'] font-bold text-white mb-4 group-hover:text-[#92400E] transition-colors uppercase tracking-tight">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-40 bg-[#080C14] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(146,64,14,0.1),transparent_50%)]" />
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-5xl md:text-8xl font-['Syne'] font-black text-white mb-10 leading-none uppercase tracking-tighter font-black italic">TRADE THE <br /><span className="text-[#92400E]">LIQUID MARKET</span></h2>
          <p className="text-xl text-slate-400 mb-16 font-light">The institutional infrastructure for global distillery trade and bulk spirit acquisition.</p>
          <Link to="/register" className="inline-flex px-16 py-6 bg-[#92400E] text-white font-black rounded-xl hover:shadow-[0_0_50px_rgba(146,64,14,0.4)] transition-all text-xl uppercase tracking-[0.2em]">
            Join the Exchange
          </Link>
        </div>
      </section>
    </div>
  );
}
