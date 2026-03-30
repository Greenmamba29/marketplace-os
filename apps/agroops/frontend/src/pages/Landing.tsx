import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Sprout, 
  Droplets, 
  ShieldCheck, 
  Tractor, 
  ArrowRight, 
  Globe, 
  Zap,
  Calendar,
  Layers,
  Search,
  CheckCircle2,
  ChevronRight,
  Wind
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
  const categories = [
    { name: 'Hybrid Seeds', icon: Sprout, desc: 'High-yield corn, soy, and specialty seeds' },
    { name: 'Liquid Fertilizers', icon: Droplets, desc: 'N-P-K formulations and micronutrients' },
    { name: 'Pest Management', icon: ShieldCheck, desc: 'EPA-registered pesticides and bio-controls' },
    { name: 'Precision Gear', icon: Tractor, desc: 'GPS-guided spraying and sensor equipment' },
    { name: 'Irrigation Hub', icon: Droplets, desc: 'Low-flow and automated water systems' },
    { name: 'Soil Health', icon: Layers, desc: 'Biological soil amendments and cover crops' },
  ];

  return (
    <div className="min-h-screen bg-[#080C14] text-[#F8FAFC] font-['DM_Sans']">
      {/* Hero Section */}
      <section className="relative pt-32 pb-48 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(101,163,13,0.15),transparent_50%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-6 py-2 bg-[#65A30D]/10 border border-[#65A30D]/20 rounded-full mb-12"
          >
            <ShieldCheck className="w-4 h-4 text-[#65A30D]" />
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#65A30D] font-black">EPA Registered & Certified Sourcing</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-['Syne'] font-extrabold text-white mb-10 tracking-tight leading-none"
          >
            PRECISION AG <br />
            <span className="bg-gradient-to-r from-[#65A30D] to-[#BEF264] bg-clip-text text-transparent">DIRECT TO FARM</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-2xl text-slate-400 mb-16 max-w-4xl mx-auto font-light leading-relaxed"
          >
            Source high-performance seeds, fertilizers, and equipment directly from 
            verified global manufacturers. EPA-registered products with total transparency.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-8"
          >
            <Link to="/register" className="group w-full sm:w-auto px-12 py-5 bg-[#65A30D] text-white font-black rounded-xl hover:shadow-[0_0_30px_rgba(101,163,13,0.4)] transition-all flex items-center justify-center gap-3 text-lg uppercase tracking-widest">
              Join the Exchange
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/register" className="group w-full sm:w-auto px-12 py-5 bg-[#0F1623] text-white font-bold rounded-xl border border-slate-800 hover:border-[#65A30D]/50 transition-all flex items-center justify-center gap-3 text-lg uppercase tracking-widest">
              Growing Season Tool
              <Calendar className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Trust & Stats */}
      <section className="py-24 bg-[#0F1623] border-y border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          <div>
            <div className="flex justify-center mb-4"><Globe className="w-8 h-8 text-[#65A30D]" /></div>
            <p className="text-5xl font-['Syne'] font-black text-white mb-2"><AnimatedCounter end={420} suffix="+" /></p>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Verified Suppliers</p>
          </div>
          <div>
            <div className="flex justify-center mb-4"><Sprout className="w-8 h-8 text-[#65A30D]" /></div>
            <p className="text-5xl font-['Syne'] font-black text-white mb-2"><AnimatedCounter end={28000} suffix="+" /></p>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Active Inputs</p>
          </div>
          <div>
            <div className="flex justify-center mb-4"><Layers className="w-8 h-8 text-[#65A30D]" /></div>
            <p className="text-5xl font-['Syne'] font-black text-white mb-2"><AnimatedCounter end={85} suffix="+" /></p>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Crop Categories</p>
          </div>
          <div>
            <div className="flex justify-center mb-4"><ShieldCheck className="w-8 h-8 text-[#65A30D]" /></div>
            <p className="text-5xl font-['Syne'] font-black text-white mb-2"><AnimatedCounter end={99.9} suffix="%" /></p>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Purity Integrity</p>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-32 bg-[#080C14]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-20 text-center">
            <h2 className="text-4xl md:text-5xl font-['Syne'] font-bold text-white mb-6 uppercase tracking-tighter">Input Infrastructure</h2>
            <div className="h-1.5 w-24 bg-[#65A30D] mx-auto rounded-full" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((cat, i) => (
              <Link key={i} to="/register" className="group p-8 bg-[#0F1623] border border-slate-800 rounded-2xl hover:border-[#65A30D]/50 transition-all">
                <div className="w-14 h-14 bg-[#65A30D]/10 rounded-xl flex items-center justify-center mb-6 text-[#65A30D] group-hover:bg-[#65A30D]/20 transition-colors">
                  <cat.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-['Syne'] font-bold text-white mb-2 group-hover:text-[#65A30D] transition-colors">{cat.name}</h3>
                <p className="text-slate-500 text-sm mb-6">{cat.desc}</p>
                <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#65A30D]">
                  Explore Inputs <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Growing Season Widget Concept */}
      <section className="py-32 bg-[#0F1623]/50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#080C14] border border-slate-800 rounded-[3rem] p-12 md:p-20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#65A30D]/10 blur-[120px] rounded-full" />
            <div className="relative z-10 grid md:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl font-['Syne'] font-bold text-white mb-8 uppercase tracking-tighter">Plan Your Season</h2>
                <p className="text-slate-400 mb-10 text-lg leading-relaxed">
                  Our Season Planner syncs your crop choice with optimal chemical application windows, 
                  automatically recommending EPA-compliant inputs based on your soil profile.
                </p>
                <div className="space-y-6">
                  {['Optimal Sowing Windows', 'Chemical Application Alerts', 'Yield Prediction Models'].map((feature, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="w-6 h-6 bg-[#65A30D]/20 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4 text-[#65A30D]" />
                      </div>
                      <span className="text-white font-medium italic">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-[#0F1623] border border-slate-800 p-8 rounded-2xl">
                <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-800">
                  <span className="text-white font-bold uppercase tracking-widest">Growing Calendar</span>
                  <Wind className="text-[#65A30D] w-5 h-5 animate-pulse" />
                </div>
                <div className="grid grid-cols-4 gap-4">
                  {['Mar', 'Apr', 'May', 'Jun'].map((month, i) => (
                    <div key={i} className={`h-24 rounded-lg flex flex-col items-center justify-center gap-2 ${i === 1 ? 'bg-[#65A30D]/20 border border-[#65A30D]/30' : 'bg-slate-900 border border-slate-800'}`}>
                      <span className="text-[10px] text-slate-500 font-bold uppercase">{month}</span>
                      <div className={`w-3 h-3 rounded-full ${i === 1 ? 'bg-[#65A30D]' : 'bg-slate-700'}`} />
                    </div>
                  ))}
                </div>
                <button className="w-full mt-8 py-4 bg-[#65A30D] text-white font-black rounded-xl uppercase tracking-widest text-xs hover:bg-[#4D7C0F] transition-colors">
                  Initialize Plan
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-32 bg-[#080C14]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              { icon: Zap, title: 'Bulk Pricing', desc: 'Direct-to-manufacturer volume discounts that outperform local retail by 15-25%.' },
              { icon: Sprout, title: 'Seed Sourcing', desc: 'Secure the exact genetic specs you need, even in tight supply seasons.' },
              { icon: Globe, title: 'Export Logistics', desc: 'Full customs and phytosanitary certification management for global imports.' },
              { icon: CheckCircle2, title: 'Verification', desc: 'Every input batch is verified against manufacturer CoA records automatically.' },
              { icon: Wind, title: 'Smart Delivery', desc: 'Coordinated logistics for liquid and dry bulk delivered directly to farm silos.' },
              { icon: ShieldCheck, title: 'Regulatory', desc: 'Automated EPA registration tracking and state-level compliance alerts.' },
            ].map((f, i) => (
              <div key={i} className="group p-10 bg-[#0F1623] border border-slate-800 rounded-2xl hover:border-[#65A30D]/50 transition-all">
                <div className="w-14 h-14 bg-[#65A30D]/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-[#65A30D]/20 transition-colors">
                  <f.icon className="w-8 h-8 text-[#65A30D]" />
                </div>
                <h3 className="text-2xl font-['Syne'] font-bold text-white mb-4 group-hover:text-[#65A30D] transition-colors uppercase tracking-tight">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-40 bg-[#080C14] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(101,163,13,0.1),transparent_50%)]" />
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-5xl md:text-8xl font-['Syne'] font-black text-white mb-10 leading-none uppercase tracking-tighter italic">BOOST YOUR <br /><span className="text-[#65A30D]">YIELD POTENTIAL</span></h2>
          <p className="text-xl text-slate-400 mb-16 font-light">The modern operating system for the industrial agriculture professional.</p>
          <Link to="/register" className="inline-flex px-16 py-6 bg-[#65A30D] text-white font-black rounded-xl hover:shadow-[0_0_50px_rgba(101,163,13,0.4)] transition-all text-xl uppercase tracking-[0.2em]">
            Apply for Access
          </Link>
        </div>
      </section>
    </div>
  );
}
