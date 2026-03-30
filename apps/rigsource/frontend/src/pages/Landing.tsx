import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Wrench, 
  Tractor, 
  ShieldCheck, 
  Truck, 
  ArrowRight, 
  Globe, 
  Zap,
  HardHat,
  Search,
  CheckCircle2,
  ChevronRight,
  Anchor,
  Cog
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
    { name: 'Earthmovers', icon: Tractor, desc: 'Excavators, dozers, and loaders' },
    { name: 'Lifting & Cranes', icon: Anchor, desc: 'Tower, mobile, and crawler cranes' },
    { name: 'Power & Air', icon: Zap, desc: 'Industrial generators and compressors' },
    { name: 'Roadwork', icon: Cog, desc: 'Pavers, rollers, and graders' },
    { name: 'Mining Rigs', icon: Wrench, desc: 'Drills, crushers, and haulers' },
    { name: 'Logistics Gear', icon: Truck, desc: 'Trailers and heavy haulage' },
  ];

  return (
    <div className="min-h-screen bg-[#080C14] text-[#F8FAFC] font-['DM_Sans']">
      {/* Hero Section */}
      <section className="relative pt-32 pb-48 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(220,38,38,0.15),transparent_50%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-6 py-2 bg-[#DC2626]/10 border border-[#DC2626]/20 rounded-full mb-12"
          >
            <ShieldCheck className="w-4 h-4 text-[#DC2626]" />
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#DC2626] font-black">Tier 4 Final Certified Equipment</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-['Syne'] font-extrabold text-white mb-10 tracking-tight leading-none"
          >
            HEAVY RIGS, <br />
            <span className="bg-gradient-to-r from-[#DC2626] to-[#EF4444] bg-clip-text text-transparent">DELIVERED TO SITE</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-2xl text-slate-400 mb-16 max-w-4xl mx-auto font-light leading-relaxed"
          >
            Source massive machinery globally through our verified dealer network. 
            Secure transactions, mechanical inspections, and end-to-end site logistics.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-8"
          >
            <Link to="/register" className="group w-full sm:w-auto px-12 py-5 bg-[#DC2626] text-white font-black rounded-xl hover:shadow-[0_0_30px_rgba(220,38,38,0.4)] transition-all flex items-center justify-center gap-3 text-lg uppercase tracking-widest">
              Browse Equipment
              <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </Link>
            <div className="group w-full sm:w-auto p-[1px] bg-gradient-to-r from-slate-800 to-slate-700 rounded-xl">
              <div className="flex bg-[#0F1623] rounded-xl overflow-hidden p-1">
                {['Purchase', 'Rental'].map((mode, i) => (
                  <button key={i} className={`px-8 py-3 rounded-lg text-sm font-black uppercase tracking-widest transition-all ${i === 0 ? 'bg-[#DC2626] text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>
                    {mode}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust & Stats */}
      <section className="py-24 bg-[#0F1623] border-y border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          <div>
            <div className="flex justify-center mb-4"><Tractor className="w-8 h-8 text-[#DC2626]" /></div>
            <p className="text-5xl font-['Syne'] font-black text-white mb-2"><AnimatedCounter end={85000} suffix="+" /></p>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Active Machines</p>
          </div>
          <div>
            <div className="flex justify-center mb-4"><Globe className="w-8 h-8 text-[#DC2626]" /></div>
            <p className="text-5xl font-['Syne'] font-black text-white mb-2"><AnimatedCounter end={140} suffix="+" /></p>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Countries Served</p>
          </div>
          <div>
            <div className="flex justify-center mb-4"><HardHat className="w-8 h-8 text-[#DC2626]" /></div>
            <p className="text-5xl font-['Syne'] font-black text-white mb-2"><AnimatedCounter end={1200} suffix="" /></p>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Certified Dealers</p>
          </div>
          <div>
            <div className="flex justify-center mb-4"><ShieldCheck className="w-8 h-8 text-[#DC2626]" /></div>
            <p className="text-5xl font-['Syne'] font-black text-white mb-2"><AnimatedCounter end={99.8} suffix="%" /></p>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Inspection Pass Rate</p>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-32 bg-[#080C14]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-20 text-center">
            <h2 className="text-4xl md:text-5xl font-['Syne'] font-bold text-white mb-6 uppercase tracking-tighter">Machine Infrastructure</h2>
            <div className="h-1.5 w-24 bg-[#DC2626] mx-auto rounded-full" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((cat, i) => (
              <Link key={i} to="/register" className="group p-8 bg-[#0F1623] border border-slate-800 rounded-2xl hover:border-[#DC2626]/50 transition-all">
                <div className="w-14 h-14 bg-[#DC2626]/10 rounded-xl flex items-center justify-center mb-6 text-[#DC2626] group-hover:bg-[#DC2626]/20 transition-colors">
                  <cat.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-['Syne'] font-bold text-white mb-2 group-hover:text-[#DC2626] transition-colors">{cat.name}</h3>
                <p className="text-slate-500 text-sm mb-6">{cat.desc}</p>
                <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#DC2626]">
                  Browse Listings <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-32 bg-[#0F1623]/50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-20 text-center">
            <h2 className="text-4xl md:text-5xl font-['Syne'] font-bold text-white mb-6 uppercase tracking-tighter italic">Mobilization Protocol</h2>
            <div className="h-1 w-20 bg-[#DC2626] mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Asset Spec', desc: 'Define your machine requirements, Tier certification, and work hours.' },
              { step: '02', title: 'Global Sourcing', desc: 'Direct matching with verified dealer inventories across 140 countries.' },
              { step: '03', title: 'Third-Party Inspection', desc: 'Certified mechanical audit and fluid analysis before any capital transfer.' },
              { step: '04', title: 'Site Logistics', desc: 'Heavy-haul transport and customs clearance managed end-to-end.' },
            ].map((item, i) => (
              <div key={i} className="relative group p-8 bg-[#0F1623] border border-slate-800 rounded-2xl hover:border-[#DC2626]/30 transition-all">
                <span className="text-4xl font-black text-[#DC2626]/20 font-['Syne'] mb-4 block">{item.step}</span>
                <h3 className="text-xl font-bold text-white mb-4">{item.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
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
              { icon: Zap, title: 'Rapid Quotes', desc: 'Receive binding quotes for machine and transport within 24 hours of RFQ submission.' },
              { icon: HardHat, title: 'Dealer Network', icon: Globe, desc: 'Connect with certified OEM dealers from Caterpillar, Komatsu, and John Deere.' },
              { icon: ShieldCheck, title: 'Asset Verification', desc: 'Title searches and lien verification for every used machine listed.' },
              { icon: Cog, title: 'Fleet Analytics', desc: 'Real-time monitoring and maintenance scheduling for your entire acquired fleet.' },
              { icon: Truck, title: 'Site Delivery', desc: 'Specialized logistics for oversized, heavy-haul, and multi-component machinery.' },
              { icon: Wrench, title: 'Field Service', desc: 'On-site setup and operator training available in most major project zones.' },
            ].map((f, i) => (
              <div key={i} className="group p-10 bg-[#0F1623] border border-slate-800 rounded-2xl hover:border-[#DC2626]/50 transition-all">
                <div className="w-14 h-14 bg-[#DC2626]/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-[#DC2626]/20 transition-colors">
                  <f.icon className="w-8 h-8 text-[#DC2626]" />
                </div>
                <h3 className="text-2xl font-['Syne'] font-bold text-white mb-4 group-hover:text-[#DC2626] transition-colors uppercase tracking-tight">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-40 bg-[#080C14] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(220,38,38,0.1),transparent_50%)]" />
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-5xl md:text-8xl font-['Syne'] font-black text-white mb-10 leading-none uppercase tracking-tighter">MOBILIZE YOUR <br /><span className="text-[#DC2626] italic">OPERATIONS</span></h2>
          <p className="text-xl text-slate-400 mb-16 font-light">The premier global infrastructure for industrial machinery and construction assets.</p>
          <Link to="/register" className="inline-flex px-16 py-6 bg-[#DC2626] text-white font-black rounded-xl hover:shadow-[0_0_50px_rgba(220,38,38,0.4)] transition-all text-xl uppercase tracking-[0.2em]">
            Join the Exchange
          </Link>
        </div>
      </section>
    </div>
  );
}
