import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Network, 
  ShieldCheck, 
  Zap, 
  Globe, 
  Cpu, 
  Server, 
  Router, 
  ArrowRight,
  ShieldAlert,
  Search,
  CheckCircle2,
  ChevronRight,
  Wrench
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
  const brands = ['Cisco', 'Juniper', 'Aruba', 'Fortinet', 'Palo Alto', 'HPE', 'Dell', 'Ubiquiti'];
  
  const categories = [
    { name: 'Core Switching', icon: Network, desc: 'L2/L3 backbone infrastructure' },
    { name: 'Routing & Edge', icon: Router, desc: 'Enterprise and ISP grade gateways' },
    { name: 'Security & Firewalls', icon: ShieldAlert, desc: 'Next-gen threat protection' },
    { name: 'Wireless & APs', icon: Zap, desc: 'High-density Wi-Fi 6 solutions' },
    { name: 'Server & Compute', icon: Server, desc: 'Rackmount and blade architectures' },
    { name: 'Modules & Spares', icon: Cpu, desc: 'SFPs, power supplies, and optics' },
  ];

  return (
    <div className="min-h-screen bg-[#080C14] text-[#F8FAFC] font-['DM_Sans']">
      {/* Hero Section */}
      <section className="relative pt-32 pb-48 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(2,132,199,0.15),transparent_50%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-6 py-2 bg-[#0284C7]/10 border border-[#0284C7]/20 rounded-full mb-12"
          >
            <ShieldCheck className="w-4 h-4 text-[#0284C7]" />
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#0284C7] font-black">NDAA & TAA Compliant Inventory</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-['Syne'] font-extrabold text-white mb-10 tracking-tight leading-none"
          >
            ENTERPRISE <br />
            <span className="bg-gradient-to-r from-[#0284C7] to-[#38BDF8] bg-clip-text text-transparent italic">NETWORK HARDWARE</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-2xl text-slate-400 mb-16 max-w-4xl mx-auto font-light leading-relaxed"
          >
            The global marketplace for networking assets. Source new, certified refurbished, 
            and EOL equipment from 280+ resellers with lifetime warranty options.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-8"
          >
            <Link to="/register" className="group w-full sm:w-auto px-12 py-5 bg-[#0284C7] text-white font-black rounded-xl hover:shadow-[0_0_30px_rgba(2,132,199,0.4)] transition-all flex items-center justify-center gap-3 text-lg uppercase tracking-widest">
              Explore Inventory
              <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </Link>
            <Link to="/register" className="group w-full sm:w-auto px-12 py-5 bg-[#0F1623] text-white font-bold rounded-xl border border-slate-800 hover:border-[#0284C7]/50 transition-all flex items-center justify-center gap-3 text-lg uppercase tracking-widest">
              Lifetime Warranty
              <ShieldCheck className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Brand Cloud */}
      <section className="bg-[#0F1623] border-y border-slate-800/50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-center text-[10px] font-black uppercase tracking-[0.5em] text-slate-500 mb-12 italic">Authorized Resale Infrastructure</h2>
          <div className="flex flex-wrap justify-center gap-x-16 gap-y-10 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
            {brands.map(b => <span key={b} className="text-3xl font-['Syne'] font-black uppercase italic tracking-tighter text-white">{b}</span>)}
          </div>
        </div>
      </section>

      {/* Trust Stats */}
      <section className="py-24 bg-[#080C14]">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          <div>
            <div className="flex justify-center mb-4"><Server className="w-8 h-8 text-[#0284C7]" /></div>
            <p className="text-5xl font-['Syne'] font-black text-white mb-2"><AnimatedCounter end={320000} suffix="+" /></p>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Active SKUs</p>
          </div>
          <div>
            <div className="flex justify-center mb-4"><CheckCircle2 className="w-8 h-8 text-[#0284C7]" /></div>
            <p className="text-5xl font-['Syne'] font-black text-white mb-2"><AnimatedCounter end={98} suffix="%" /></p>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Genuine Guarantee</p>
          </div>
          <div>
            <div className="flex justify-center mb-4"><Globe className="w-8 h-8 text-[#0284C7]" /></div>
            <p className="text-5xl font-['Syne'] font-black text-white mb-2"><AnimatedCounter end={280} suffix="+" /></p>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Certified Resellers</p>
          </div>
          <div>
            <div className="flex justify-center mb-4"><Zap className="w-8 h-8 text-[#0284C7]" /></div>
            <p className="text-5xl font-['Syne'] font-black text-white mb-2"><AnimatedCounter end={4} suffix="h" /></p>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Spares Dispatch Time</p>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-32 bg-[#0F1623]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-20 text-center">
            <h2 className="text-4xl md:text-5xl font-['Syne'] font-bold text-white mb-6 uppercase tracking-tighter">Hardware Infrastructure</h2>
            <div className="h-1.5 w-24 bg-[#0284C7] mx-auto rounded-full" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((cat, i) => (
              <Link key={i} to="/register" className="group p-8 bg-[#0F1623] border border-slate-800 rounded-2xl hover:border-[#0284C7]/50 transition-all">
                <div className="w-14 h-14 bg-[#0284C7]/10 rounded-xl flex items-center justify-center mb-6 text-[#0284C7] group-hover:bg-[#0284C7]/20 transition-colors">
                  <cat.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-['Syne'] font-bold text-white mb-2 group-hover:text-[#0284C7] transition-colors uppercase tracking-tight">{cat.name}</h3>
                <p className="text-slate-500 text-sm mb-6">{cat.desc}</p>
                <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#0284C7]">
                  Browse Listings <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Specialty Features */}
      <section className="py-32 bg-[#080C14]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { icon: ShieldCheck, title: 'Compliance First', desc: 'Every SKU verified for NDAA Section 889 and TAA compliance for government use.' },
              { icon: Wrench, title: 'Tech Verification', desc: 'Certified 25-point physical and firmware diagnostic tests on all pre-owned units.' },
              { icon: Zap, title: 'Critical Spares', desc: 'Same-day global dispatch from regional logistics hubs for mission-critical failure.' },
            ].map((f, i) => (
              <div key={i} className="group p-10 bg-[#0F1623] border border-slate-800 rounded-2xl hover:border-[#0284C7]/50 transition-all">
                <div className="w-14 h-14 bg-[#0284C7]/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-[#0284C7]/20 transition-colors">
                  <f.icon className="w-8 h-8 text-[#0284C7]" />
                </div>
                <h3 className="text-2xl font-['Syne'] font-bold text-white mb-4 group-hover:text-[#0284C7] transition-colors uppercase tracking-tight">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-40 bg-[#080C14] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(2,132,199,0.1),transparent_50%)]" />
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-5xl md:text-8xl font-['Syne'] font-black text-white mb-10 leading-none uppercase tracking-tighter">UPGRADE YOUR <br /><span className="text-[#0284C7] italic">CORE FABRIC</span></h2>
          <p className="text-xl text-slate-400 mb-16 font-light">The institutional infrastructure for enterprise-grade networking assets.</p>
          <Link to="/register" className="inline-flex px-16 py-6 bg-[#0284C7] text-white font-black rounded-xl hover:shadow-[0_0_50px_rgba(2,132,199,0.4)] transition-all text-xl uppercase tracking-[0.2em]">
            Join the Network
          </Link>
        </div>
      </section>
    </div>
  );
}
