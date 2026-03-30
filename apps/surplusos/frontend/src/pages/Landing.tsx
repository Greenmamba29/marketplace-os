import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Tag, 
  TrendingDown, 
  ShieldCheck, 
  Truck, 
  Zap, 
  Gavel, 
  ArrowRight, 
  Clock, 
  Globe, 
  Search, 
  ChevronRight, 
  Lock,
  BarChart3,
  BadgeCheck
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

function CountdownTimer({ initialTime }: { initialTime: string }) {
  const [time, setTime] = useState(initialTime);
  useEffect(() => {
    const interval = setInterval(() => {
      // Simple logic for the demo visual
      const [h, m, s] = time.split(':').map(Number);
      let totalSeconds = h * 3600 + m * 60 + s - 1;
      if (totalSeconds < 0) totalSeconds = 3600 * 5;
      const newH = Math.floor(totalSeconds / 3600);
      const newM = Math.floor((totalSeconds % 3600) / 60);
      const newS = totalSeconds % 60;
      setTime(`${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}:${String(newS).padStart(2, '0')}`);
    }, 1000);
    return () => clearInterval(interval);
  }, [time]);
  return <span className="font-mono font-black text-[#B45309]">{time}</span>;
}

export default function Landing() {
  const categories = [
    { name: 'Industrial Rigs', icon: Gavel, desc: 'CNC machines and manufacturing lines' },
    { name: 'IT Infrastructure', icon: Zap, desc: 'Servers, networking, and storage lots' },
    { name: 'Lab Equipment', icon: BadgeCheck, desc: 'Spectrometers and medical diagnostic gear' },
    { name: 'Commercial Fleet', icon: Truck, desc: 'Box trucks, vans, and utility vehicles' },
    { name: 'Office Overstock', icon: Tag, desc: 'Bulk furniture and high-end workstations' },
    { name: 'Raw Materials', icon: Globe, desc: 'Surplus metal, plastic, and chemical stock' },
  ];

  return (
    <div className="min-h-screen bg-[#080C14] text-[#F8FAFC] font-['DM_Sans']">
      {/* Hero Section */}
      <section className="relative pt-32 pb-48 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(180,83,9,0.15),transparent_50%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-6 py-2 bg-[#B45309]/10 border border-[#B45309]/20 rounded-full mb-12"
          >
            <Lock className="w-4 h-4 text-[#B45309]" />
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#B45309] font-black">Secure Escrow & Verified Appraisals</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-['Syne'] font-extrabold text-white mb-10 tracking-tight leading-none"
          >
            LIQUIDATE ASSETS <br />
            <span className="bg-gradient-to-r from-[#B45309] to-[#F59E0B] bg-clip-text text-transparent">AT AUCTION SPEED</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-2xl text-slate-400 mb-16 max-w-4xl mx-auto font-light leading-relaxed"
          >
            Buy and sell industrial surplus globally. Access 150K+ verified listings 
            with secure escrow, professional appraisals, and rapid liquidation cycles.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-8"
          >
            <Link to="/register" className="group w-full sm:w-auto px-12 py-5 bg-[#B45309] text-white font-black rounded-xl hover:shadow-[0_0_30px_rgba(180,83,9,0.4)] transition-all flex items-center justify-center gap-3 text-lg uppercase tracking-widest">
              Browse Auctions
              <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </Link>
            <Link to="/register" className="group w-full sm:w-auto px-12 py-5 bg-[#0F1623] text-white font-bold rounded-xl border border-slate-800 hover:border-[#B45309]/50 transition-all flex items-center justify-center gap-3 text-lg uppercase tracking-widest">
              Liquidate Now
              <Zap className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Trust & Stats */}
      <section className="py-24 bg-[#0F1623] border-y border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          <div>
            <div className="flex justify-center mb-4"><Gavel className="w-8 h-8 text-[#B45309]" /></div>
            <p className="text-5xl font-['Syne'] font-black text-white mb-2"><AnimatedCounter end={150000} suffix="+" /></p>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Active Listings</p>
          </div>
          <div>
            <div className="flex justify-center mb-4"><TrendingDown className="w-8 h-8 text-[#B45309]" /></div>
            <p className="text-5xl font-['Syne'] font-black text-white mb-2"><AnimatedCounter end={65} suffix="%" /></p>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Avg Discount vs Market</p>
          </div>
          <div>
            <div className="flex justify-center mb-4"><ShieldCheck className="w-8 h-8 text-[#B45309]" /></div>
            <p className="text-5xl font-['Syne'] font-black text-white mb-2"><AnimatedCounter end={100} suffix="%" /></p>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Escrow Protected</p>
          </div>
          <div>
            <div className="flex justify-center mb-4"><Zap className="w-8 h-8 text-[#B45309]" /></div>
            <p className="text-5xl font-['Syne'] font-black text-white mb-2"><AnimatedCounter end={14} suffix=" Days" /></p>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Avg Liquidation Cycle</p>
          </div>
        </div>
      </section>

      {/* Live Auctions Widget */}
      <section className="py-32 bg-[#080C14] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 flex items-center gap-4">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
            <h2 className="text-2xl font-['Syne'] font-bold text-white uppercase tracking-widest italic">Live Auctions Ending Soon</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { item: 'Industrial CNC Lathe', price: 42500, time: '02:14:05' },
              { item: 'IT Server Lot (Dell)', price: 12800, time: '00:45:12' },
              { item: 'Lab Analyzer (Shimadzu)', price: 34200, time: '01:12:48' }
            ].map((auction, i) => (
              <div key={i} className="bg-[#0F1623] border border-slate-800 p-8 rounded-2xl flex justify-between items-center group hover:border-[#B45309]/50 transition-all">
                <div>
                  <h3 className="font-bold text-white text-lg mb-1 group-hover:text-[#B45309] transition-colors">{auction.item}</h3>
                  <div className="text-xs text-slate-500 uppercase tracking-widest">High Bid: <span className="text-white font-mono">${auction.price.toLocaleString()}</span></div>
                </div>
                <div className="text-right">
                  <div className="text-lg"><CountdownTimer initialTime={auction.time} /></div>
                  <Link to="/register" className="text-[10px] font-black uppercase text-slate-600 hover:text-white transition-colors">Place Bid</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Asset Grid */}
      <section className="py-32 bg-[#0F1623]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-20 text-center">
            <h2 className="text-4xl md:text-5xl font-['Syne'] font-bold text-white mb-6 uppercase tracking-tighter">Market Segments</h2>
            <div className="h-1.5 w-24 bg-[#B45309] mx-auto rounded-full" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((cat, i) => (
              <Link key={i} to="/register" className="group p-8 bg-[#0F1623] border border-slate-800 rounded-2xl hover:border-[#B45309]/50 transition-all">
                <div className="w-14 h-14 bg-[#B45309]/10 rounded-xl flex items-center justify-center mb-6 text-[#B45309] group-hover:bg-[#B45309]/20 transition-colors">
                  <cat.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-['Syne'] font-bold text-white mb-2 group-hover:text-[#B45309] transition-colors">{cat.name}</h3>
                <p className="text-slate-500 text-sm mb-6">{cat.desc}</p>
                <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#B45309]">
                  View Category <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-32 bg-[#080C14]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              { icon: Zap, title: 'Rapid Liquidation', desc: 'Move surplus assets to cash in under 14 days through our high-velocity marketplace.' },
              { icon: ShieldCheck, title: 'Verified Appraisals', desc: 'Third-party appraisal reports and physical inspection logs for every major listing.' },
              { icon: Lock, title: 'Escrow Security', desc: 'Institutional-grade escrow protection for all multi-unit capital asset transfers.' },
              { icon: BarChart3, title: 'Value Analytics', desc: 'Real-time pricing data benchmarks your assets against global market trends.' },
              { icon: Truck, title: 'Global Logistics', desc: 'Nationwide pickup and international heavy-haul transport coordination.' },
              { icon: BadgeCheck, title: 'Asset Verification', desc: 'Title searches and lien verification for all high-value machinery and vehicles.' },
            ].map((f, i) => (
              <div key={i} className="group p-10 bg-[#0F1623] border border-slate-800 rounded-2xl hover:border-[#B45309]/50 transition-all">
                <div className="w-14 h-14 bg-[#B45309]/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-[#B45309]/20 transition-colors">
                  <f.icon className="w-8 h-8 text-[#B45309]" />
                </div>
                <h3 className="text-2xl font-['Syne'] font-bold text-white mb-4 group-hover:text-[#B45309] transition-colors uppercase tracking-tight">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-40 bg-[#080C14] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(180,83,9,0.1),transparent_50%)]" />
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-5xl md:text-8xl font-['Syne'] font-black text-white mb-10 leading-none uppercase tracking-tighter">CLEAR YOUR <br /><span className="text-[#B45309] italic">INVENTORY</span></h2>
          <p className="text-xl text-slate-400 mb-16 font-light">The industrial operating system for efficient asset lifecycle management.</p>
          <Link to="/register" className="inline-flex px-16 py-6 bg-[#B45309] text-white font-black rounded-xl hover:shadow-[0_0_50px_rgba(180,83,9,0.4)] transition-all text-xl uppercase tracking-[0.2em]">
            Join the Exchange
          </Link>
        </div>
      </section>
    </div>
  );
}
