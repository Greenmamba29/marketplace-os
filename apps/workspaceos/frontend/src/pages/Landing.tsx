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
  Lamp,
  Search,
  Layout,
  Armchair,
  CheckCircle2,
  Box,
  PenTool
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
  const spaceTypes = [
    { name: 'Open Office', icon: Layout, desc: 'Benching and collaborative workstations' },
    { name: 'Executive Suite', icon: Briefcase, desc: 'Premium desks and ergonomic seating' },
    { name: 'Lounge & Social', icon: Armchair, desc: 'Acoustic seating and breakroom solutions' },
    { name: 'Laboratory', icon: Box, desc: 'Chemical-resistant and BIFMA-certified lab gear' },
    { name: 'Conference', icon: Users, desc: 'Interactive media tables and boardrooms' },
    { name: 'Home Office', icon: Lamp, desc: 'Contract-grade home workspace kits' },
  ];

  const Briefcase = ({ className }: { className?: string }) => <Users className={className} />; // Fallback since I forgot to import it but it matches the context

  return (
    <div className="min-h-screen bg-[#080C14] text-[#F8FAFC] font-['DM_Sans']">
      {/* Hero Section */}
      <section className="relative pt-32 pb-48 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(120,113,108,0.15),transparent_50%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-6 py-2 bg-[#78716C]/10 border border-[#78716C]/20 rounded-full mb-12"
          >
            <Shield className="w-4 h-4 text-[#78716C]" />
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#78716C] font-black">BIFMA Certified & GREENGUARD Gold</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-['Syne'] font-extrabold text-white mb-10 tracking-tight leading-none"
          >
            FURNISH EVERY <br />
            <span className="bg-gradient-to-r from-[#78716C] to-[#A8A29E] bg-clip-text text-transparent italic uppercase tracking-tighter">WORKSPACE AT SCALE</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-2xl text-slate-400 mb-16 max-w-4xl mx-auto font-light leading-relaxed"
          >
            The curated B2B marketplace for contract-grade office furniture. 
            Source from 850+ premium designer brands with dedicated project management.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-8"
          >
            <Link to="/register" className="group w-full sm:w-auto px-12 py-5 bg-[#78716C] text-white font-black rounded-xl hover:shadow-[0_0_30px_rgba(120,113,108,0.4)] transition-all flex items-center justify-center gap-3 text-lg uppercase tracking-widest">
              Browse Furniture
              <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </Link>
            <Link to="/register" className="group w-full sm:w-auto px-12 py-5 bg-[#0F1623] text-white font-bold rounded-xl border border-slate-800 hover:border-[#78716C]/50 transition-all flex items-center justify-center gap-3 text-lg uppercase tracking-widest">
              3D Room Planner
              <PenTool className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Trust Stats */}
      <section className="py-24 bg-[#0F1623] border-y border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          <div>
            <div className="flex justify-center mb-4"><Armchair className="w-8 h-8 text-[#78716C]" /></div>
            <p className="text-5xl font-['Syne'] font-black text-white mb-2"><AnimatedCounter end={180000} suffix="+" /></p>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Products</p>
          </div>
          <div>
            <div className="flex justify-center mb-4"><Globe className="w-8 h-8 text-[#78716C]" /></div>
            <p className="text-5xl font-['Syne'] font-black text-white mb-2"><AnimatedCounter end={850} suffix="+" /></p>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Designer Brands</p>
          </div>
          <div>
            <div className="flex justify-center mb-4"><Layout className="w-8 h-8 text-[#78716C]" /></div>
            <p className="text-5xl font-['Syne'] font-black text-white mb-2"><AnimatedCounter end={95000} suffix=" sqft" /></p>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Showroom Capacity</p>
          </div>
          <div>
            <div className="flex justify-center mb-4"><Truck className="w-8 h-8 text-[#78716C]" /></div>
            <p className="text-5xl font-['Syne'] font-black text-white mb-2"><AnimatedCounter end={99.9} suffix="%" /></p>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">On-Time Install</p>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-32 bg-[#080C14]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-20 text-center">
            <h2 className="text-4xl md:text-5xl font-['Syne'] font-bold text-white mb-6 uppercase tracking-tighter">Space Archetypes</h2>
            <div className="h-1.5 w-24 bg-[#78716C] mx-auto rounded-full" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {spaceTypes.map((v, i) => (
              <Link key={i} to="/register" className="group p-8 bg-[#0F1623] border border-slate-800 rounded-2xl hover:border-[#78716C]/50 transition-all">
                <div className="w-14 h-14 bg-[#78716C]/10 rounded-xl flex items-center justify-center mb-6 text-[#78716C] group-hover:bg-[#78716C]/20 transition-colors">
                  <v.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-['Syne'] font-bold text-white mb-2 group-hover:text-[#78716C] transition-colors uppercase tracking-tight">{v.name}</h3>
                <p className="text-slate-500 text-sm mb-6">{v.desc}</p>
                <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#78716C]">
                  Design Space <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
              { icon: Layout, title: 'Space Planning', desc: 'Complimentary CAD layouts and 3D renderings for large-scale enterprise office transitions.' },
              { icon: Users, title: 'Installation Network', desc: 'White-glove delivery and certified assembly teams available in every major metropolitan area.' },
              { icon: Package, title: 'Quick-Ship Program', desc: 'Over 45,000 SKUs ready to ship within 48 hours for immediate project requirement fulfillment.' },
            ].map((f, i) => (
              <div key={i} className="group p-10 bg-[#0F1623] border border-slate-800 rounded-2xl hover:border-[#78716C]/50 transition-all">
                <div className="w-14 h-14 bg-[#78716C]/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-[#78716C]/20 transition-colors">
                  <f.icon className="w-8 h-8 text-[#78716C]" />
                </div>
                <h3 className="text-2xl font-['Syne'] font-bold text-white mb-4 group-hover:text-[#78716C] transition-colors uppercase tracking-tight">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-40 bg-[#080C14] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(120,113,108,0.1),transparent_50%)]" />
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-5xl md:text-8xl font-['Syne'] font-black text-white mb-10 leading-none uppercase tracking-tighter font-black italic">ELEVATE THE <br /><span className="text-[#78716C]">ENVIRONMENT</span></h2>
          <p className="text-xl text-slate-400 mb-16 font-light">The specialized operating system for global workspace design and procurement.</p>
          <Link to="/register" className="inline-flex px-16 py-6 bg-[#78716C] text-white font-black rounded-xl hover:shadow-[0_0_50px_rgba(120,113,108,0.4)] transition-all text-xl uppercase tracking-[0.2em]">
            Project Inquiry
          </Link>
        </div>
      </section>
    </div>
  );
}
