import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Truck, 
  Thermometer, 
  CheckCircle2, 
  ArrowRight, 
  Globe, 
  Zap,
  Activity,
  Package,
  FileCheck
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
  return (
    <div className="min-h-screen bg-[#080C14] text-[#F8FAFC] font-['DM_Sans']">
      {/* Hero Section */}
      <section className="relative pt-32 pb-48 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(22,163,74,0.15),transparent_50%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-6 py-2 bg-[#16A34A]/10 border border-[#16A34A]/20 rounded-full mb-12"
          >
            <ShieldCheck className="w-4 h-4 text-[#16A34A]" />
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#16A34A] font-black">SQF & FSMA Compliant Network</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-['Syne'] font-extrabold text-white mb-10 tracking-tight leading-none"
          >
            FOOD SOURCING <br />
            <span className="bg-gradient-to-r from-[#16A34A] to-[#4ADE80] bg-clip-text text-transparent">REAL-TIME VISIBILITY</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-2xl text-slate-400 mb-16 max-w-4xl mx-auto font-light leading-relaxed"
          >
            Compliant food sourcing with cold chain visibility. Connecting commercial 
            kitchens and retailers to a global network of verified, safety-certified distributors.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-8"
          >
            <Link to="/register" className="group w-full sm:w-auto px-12 py-5 bg-[#16A34A] text-white font-black rounded-xl hover:shadow-[0_0_30px_rgba(22,163,74,0.4)] transition-all flex items-center justify-center gap-3 text-lg uppercase tracking-widest">
              Start Sourcing
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <div className="flex items-center gap-6 px-8 py-4 bg-[#0F1623] border border-slate-800 rounded-xl">
              <div className="flex -space-x-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-[#0F1623] bg-slate-800 flex items-center justify-center overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-900" />
                  </div>
                ))}
              </div>
              <div className="text-left">
                <p className="text-white font-bold text-sm">850+ Suppliers</p>
                <p className="text-slate-500 text-xs uppercase tracking-tighter">Verified compliance</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust & Stats */}
      <section className="py-24 bg-[#0F1623] border-y border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          <div>
            <div className="flex justify-center mb-4"><Thermometer className="w-8 h-8 text-[#16A34A]" /></div>
            <p className="text-5xl font-['Syne'] font-black text-white mb-2"><AnimatedCounter end={99.8} suffix="%" /></p>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Cold Chain Integrity</p>
          </div>
          <div>
            <div className="flex justify-center mb-4"><Package className="w-8 h-8 text-[#16A34A]" /></div>
            <p className="text-5xl font-['Syne'] font-black text-white mb-2"><AnimatedCounter end={320000} suffix="+" /></p>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Available SKUs</p>
          </div>
          <div>
            <div className="flex justify-center mb-4"><FileCheck className="w-8 h-8 text-[#16A34A]" /></div>
            <p className="text-5xl font-['Syne'] font-black text-white mb-2"><AnimatedCounter end={100} suffix="%" /></p>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">FSMA Compliant</p>
          </div>
          <div>
            <div className="flex justify-center mb-4"><Truck className="w-8 h-8 text-[#16A34A]" /></div>
            <p className="text-5xl font-['Syne'] font-black text-white mb-2"><AnimatedCounter end={12000} suffix="+" /></p>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Daily Deliveries</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-32 bg-[#080C14]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-20 text-center">
            <h2 className="text-4xl md:text-5xl font-['Syne'] font-bold text-white mb-6 uppercase tracking-tighter">Sourcing Simplified</h2>
            <div className="h-1.5 w-24 bg-[#16A34A] mx-auto rounded-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { step: '01', title: 'Verify Specs', desc: 'Browse our SQF-verified catalog with full specification sheets and CoA records.' },
              { step: '02', title: 'Route Optimization', desc: 'Automated multi-supplier routing to minimize cold chain risk and lead times.' },
              { step: '03', title: 'Live Tracking', desc: 'Real-time IoT temperature monitoring from warehouse to your doorstep.' },
            ].map((item, i) => (
              <div key={i} className="relative group p-10 bg-[#0F1623] border border-slate-800 rounded-2xl hover:border-[#16A34A]/50 transition-all">
                <span className="absolute -top-6 -left-4 text-7xl font-black text-[#16A34A]/10 font-['Syne'] group-hover:text-[#16A34A]/20 transition-colors">{item.step}</span>
                <h3 className="text-2xl font-bold text-white mb-4 relative z-10">{item.title}</h3>
                <p className="text-slate-400 leading-relaxed relative z-10">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-32 bg-[#0F1623]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              { icon: Globe, title: 'Global Network', desc: 'Direct access to verified international growers and specialty manufacturers.' },
              { icon: Activity, title: 'Cold Chain IoT', desc: 'Live temperature and humidity tracking integrated into every shipment.' },
              { icon: Zap, title: 'Instant RFQ', desc: 'Receive competitive bulk quotes in minutes through our automated pricing engine.' },
              { icon: FileCheck, title: 'Auto-Compliance', desc: 'Document management for SQF, Organic, Fair Trade, and Non-GMO certifications.' },
              { icon: CheckCircle2, title: 'Quality Assurance', desc: 'Third-party inspection reports available for every high-volume order.' },
              { icon: Truck, title: 'Last-Mile Precision', desc: 'Dedicated refrigerated fleet network for sensitive perishable logistics.' },
            ].map((f, i) => (
              <div key={i} className="group p-10 bg-[#0F1623] border border-slate-800 rounded-2xl hover:border-[#16A34A]/50 transition-all">
                <div className="w-14 h-14 bg-[#16A34A]/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-[#16A34A]/20 transition-colors">
                  <f.icon className="w-8 h-8 text-[#16A34A]" />
                </div>
                <h3 className="text-2xl font-['Syne'] font-bold text-white mb-4 group-hover:text-[#16A34A] transition-colors uppercase tracking-tight">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-32 bg-[#080C14]">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="mb-20 text-center">
            <h2 className="text-4xl font-['Syne'] font-bold text-white mb-4 uppercase tracking-tighter">Market Segments</h2>
            <div className="h-1 w-20 bg-[#16A34A] mx-auto" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
            {['Perishables', 'Proteins', 'Dry Goods', 'Beverages', 'Specialty', 'Ingredients'].map((cat, i) => (
              <Link key={i} to="/register" className="p-8 bg-[#0F1623] border border-slate-800 rounded-2xl flex flex-col items-center gap-4 hover:border-[#16A34A] transition-all group">
                <span className="text-[10px] font-mono font-black text-slate-500 group-hover:text-[#16A34A] uppercase tracking-widest">{cat}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-40 bg-[#080C14] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(22,163,74,0.1),transparent_50%)]" />
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-5xl md:text-8xl font-['Syne'] font-black text-white mb-10 leading-none">OPTIMIZE YOUR <br /><span className="text-[#16A34A] italic">SUPPLY CHAIN</span></h2>
          <p className="text-xl text-slate-400 mb-16 font-light">The operating system for modern food & beverage enterprises.</p>
          <Link to="/register" className="inline-flex px-16 py-6 bg-[#16A34A] text-white font-black rounded-xl hover:shadow-[0_0_50px_rgba(22,163,74,0.4)] transition-all text-xl uppercase tracking-[0.2em]">
            Join the Network
          </Link>
        </div>
      </section>
    </div>
  );
}
