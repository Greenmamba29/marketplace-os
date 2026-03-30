import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Package, 
  Truck, 
  ShieldCheck, 
  Leaf, 
  ArrowRight, 
  Globe, 
  Zap,
  Printer,
  LayoutGrid,
  Search,
  CheckCircle2,
  ChevronRight,
  Clock
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
    { name: 'Corrugated Boxes', icon: Package, desc: 'Eco-friendly shipping solutions' },
    { name: 'Flexible Pouches', icon: LayoutGrid, desc: 'Advanced barrier materials' },
    { name: 'Glass Containers', icon: CheckCircle2, desc: 'Premium food & beverage grade' },
    { name: 'Rigid Plastics', icon: Package, desc: 'Industrial and cosmetic storage' },
    { name: 'Custom Labels', icon: Printer, desc: 'High-precision print finishes' },
    { name: 'Industrial Tapes', icon: CheckCircle2, desc: 'High-strength structural adhesives' },
  ];

  return (
    <div className="min-h-screen bg-[#080C14] text-[#F8FAFC] font-['DM_Sans']">
      {/* Hero Section */}
      <section className="relative pt-32 pb-48 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(8,145,178,0.15),transparent_50%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-6 py-2 bg-[#0891B2]/10 border border-[#0891B2]/20 rounded-full mb-12"
          >
            <Leaf className="w-4 h-4 text-[#0891B2]" />
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#0891B2] font-black">Certified Sustainable Sourcing</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-['Syne'] font-extrabold text-white mb-10 tracking-tight leading-none"
          >
            CUSTOM PACKAGING <br />
            <span className="bg-gradient-to-r from-[#0891B2] to-[#22D3EE] bg-clip-text text-transparent">IN 72 HOURS</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-2xl text-slate-400 mb-16 max-w-4xl mx-auto font-light leading-relaxed"
          >
            Connect directly with 650+ global manufacturers. Access 95K+ SKUs, 
            request custom quotes, and upload print specs for rapid production.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-8"
          >
            <Link to="/register" className="group w-full sm:w-auto px-12 py-5 bg-[#0891B2] text-white font-black rounded-xl hover:shadow-[0_0_30px_rgba(8,145,178,0.4)] transition-all flex items-center justify-center gap-3 text-lg uppercase tracking-widest">
              Get Started
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/register" className="group w-full sm:w-auto px-12 py-5 bg-[#0F1623] text-white font-bold rounded-xl border border-slate-800 hover:border-[#0891B2]/50 transition-all flex items-center justify-center gap-3 text-lg uppercase tracking-widest">
              Upload Print Specs
              <Printer className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Trust & Stats */}
      <section className="py-24 bg-[#0F1623] border-y border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          <div>
            <div className="flex justify-center mb-4"><Package className="w-8 h-8 text-[#0891B2]" /></div>
            <p className="text-5xl font-['Syne'] font-black text-white mb-2"><AnimatedCounter end={95000} suffix="+" /></p>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Material SKUs</p>
          </div>
          <div>
            <div className="flex justify-center mb-4"><Clock className="w-8 h-8 text-[#0891B2]" /></div>
            <p className="text-5xl font-['Syne'] font-black text-white mb-2"><AnimatedCounter end={72} suffix="h" /></p>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Avg Sourcing Lead</p>
          </div>
          <div>
            <div className="flex justify-center mb-4"><Globe className="w-8 h-8 text-[#0891B2]" /></div>
            <p className="text-5xl font-['Syne'] font-black text-white mb-2"><AnimatedCounter end={650} suffix="+" /></p>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Manufacturers</p>
          </div>
          <div>
            <div className="flex justify-center mb-4"><ShieldCheck className="w-8 h-8 text-[#0891B2]" /></div>
            <p className="text-5xl font-['Syne'] font-black text-white mb-2"><AnimatedCounter end={99.9} suffix="%" /></p>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Spec Accuracy</p>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-32 bg-[#080C14]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-20 text-center">
            <h2 className="text-4xl md:text-5xl font-['Syne'] font-bold text-white mb-6 uppercase tracking-tighter">Material Categories</h2>
            <div className="h-1.5 w-24 bg-[#0891B2] mx-auto rounded-full" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((cat, i) => (
              <Link key={i} to="/register" className="group p-8 bg-[#0F1623] border border-slate-800 rounded-2xl hover:border-[#0891B2]/50 transition-all">
                <div className="w-14 h-14 bg-[#0891B2]/10 rounded-xl flex items-center justify-center mb-6 text-[#0891B2] group-hover:bg-[#0891B2]/20 transition-colors">
                  <cat.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-['Syne'] font-bold text-white mb-2 group-hover:text-[#0891B2] transition-colors">{cat.name}</h3>
                <p className="text-slate-500 text-sm mb-6">{cat.desc}</p>
                <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#0891B2]">
                  Explore Category <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-32 bg-[#0F1623]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-20 text-center">
            <h2 className="text-4xl md:text-5xl font-['Syne'] font-bold text-white mb-6 uppercase tracking-tighter">Workflow Infrastructure</h2>
            <div className="h-1 w-20 bg-[#0891B2] mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { step: '01', title: 'Upload Design', desc: 'Securely submit your Dielines, artwork, and material specifications for review.' },
              { step: '02', title: 'Global Matching', desc: 'Our engine identifies manufacturers with the right capacity and machine precision.' },
              { step: '03', title: 'Rapid Prototype', desc: 'Get physical or 3D samples produced and shipped within 48-72 hours.' },
            ].map((item, i) => (
              <div key={i} className="relative group p-10 bg-[#0F1623] border border-slate-800 rounded-2xl hover:border-[#0891B2]/50 transition-all">
                <span className="absolute -top-6 -left-4 text-7xl font-black text-[#0891B2]/10 font-['Syne'] group-hover:text-[#0891B2]/20 transition-colors">{item.step}</span>
                <h3 className="text-2xl font-bold text-white mb-4 relative z-10">{item.title}</h3>
                <p className="text-slate-400 leading-relaxed relative z-10">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-32 bg-[#080C14]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              { icon: Zap, title: 'Rapid Quoting', desc: 'Get custom production estimates in under 4 hours for standard corrugated and flexible orders.' },
              { icon: Leaf, title: 'Sustainability', desc: 'Every product includes a lifecycle carbon footprint and recyclability certification.' },
              { icon: Globe, title: 'Inventory Hub', desc: 'Manage global stock levels across our 12 regional distribution centers.' },
              { icon: CheckCircle2, title: 'Quality Audits', desc: 'Regular third-party facility audits for all Tier 1 manufacturing partners.' },
              { icon: Activity, title: 'Logistics Tracker', desc: 'Live port-to-door tracking for international bulk shipments and customs status.' },
              { icon: Printer, title: 'Print Management', desc: 'Pantone matching and automated color profile verification for consistent branding.' },
            ].map((f, i) => (
              <div key={i} className="group p-10 bg-[#0F1623] border border-slate-800 rounded-2xl hover:border-[#0891B2]/50 transition-all">
                <div className="w-14 h-14 bg-[#0891B2]/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-[#0891B2]/20 transition-colors">
                  <f.icon className="w-8 h-8 text-[#0891B2]" />
                </div>
                <h3 className="text-2xl font-['Syne'] font-bold text-white mb-4 group-hover:text-[#0891B2] transition-colors uppercase tracking-tight">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-40 bg-[#080C14] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(8,145,178,0.1),transparent_50%)]" />
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-5xl md:text-8xl font-['Syne'] font-black text-white mb-10 leading-none uppercase tracking-tighter">SCALE YOUR <br /><span className="text-[#0891B2] italic">PACKAGING</span></h2>
          <p className="text-xl text-slate-400 mb-16 font-light">The global infrastructure for agile consumer brands and industrial enterprises.</p>
          <Link to="/register" className="inline-flex px-16 py-6 bg-[#0891B2] text-white font-black rounded-xl hover:shadow-[0_0_50px_rgba(8,145,178,0.4)] transition-all text-xl uppercase tracking-[0.2em]">
            Join the Exchange
          </Link>
        </div>
      </section>
    </div>
  );
}
