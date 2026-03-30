import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Beaker, 
  FlaskConical, 
  Microscope, 
  ShieldCheck, 
  ArrowRight, 
  Globe, 
  Zap,
  ClipboardCheck,
  Search,
  CheckCircle2,
  ChevronRight,
  Fingerprint,
  Stethoscope
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
    { name: 'Analytical Reagents', icon: Beaker, desc: 'High-purity solvents and chemical standards' },
    { name: 'Lab Equipment', icon: Microscope, desc: 'Centrifuges, incubators, and analytical tools' },
    { name: 'Glassware & Plastic', icon: FlaskConical, desc: 'Certified flasks, beakers, and pipettes' },
    { name: 'Clinical Supplies', icon: Stethoscope, desc: 'Diagnostic kits and specimen collection' },
    { name: 'Lab Consumables', icon: ClipboardCheck, desc: 'Filters, tips, and sterilization supplies' },
    { name: 'PPE & Safety', icon: ShieldCheck, desc: 'ISO-certified protective gear and disposal' },
  ];

  return (
    <div className="min-h-screen bg-[#080C14] text-[#F8FAFC] font-['DM_Sans']">
      {/* Hero Section */}
      <section className="relative pt-32 pb-48 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(79,70,229,0.15),transparent_50%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-6 py-2 bg-[#4F46E5]/10 border border-[#4F46E5]/20 rounded-full mb-12"
          >
            <ShieldCheck className="w-4 h-4 text-[#4F46E5]" />
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#4F46E5] font-black">ISO 17025 Certified Network</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-['Syne'] font-extrabold text-white mb-10 tracking-tight leading-none"
          >
            PRECISION LAB <br />
            <span className="bg-gradient-to-r from-[#4F46E5] to-[#818CF8] bg-clip-text text-transparent">PROCUREMENT</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-2xl text-slate-400 mb-16 max-w-4xl mx-auto font-light leading-relaxed"
          >
            Access 2.1 million products from 380+ verified brands. Streamlined sourcing 
            with full ISO certification and automated lot traceability for every batch.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-8"
          >
            <Link to="/register" className="group w-full sm:w-auto px-12 py-5 bg-[#4F46E5] text-white font-black rounded-xl hover:shadow-[0_0_30px_rgba(79,70,229,0.4)] transition-all flex items-center justify-center gap-3 text-lg uppercase tracking-widest">
              Search Catalog
              <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </Link>
            <Link to="/register" className="group w-full sm:w-auto px-12 py-5 bg-[#0F1623] text-white font-bold rounded-xl border border-slate-800 hover:border-[#4F46E5]/50 transition-all flex items-center justify-center gap-3 text-lg uppercase tracking-widest">
              Enable Lot Traceability
              <Fingerprint className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Trust & Stats */}
      <section className="py-24 bg-[#0F1623] border-y border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          <div>
            <div className="flex justify-center mb-4"><Package className="w-8 h-8 text-[#4F46E5]" /></div>
            <p className="text-5xl font-['Syne'] font-black text-white mb-2"><AnimatedCounter end={2100000} suffix="+" /></p>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Catalog Items</p>
          </div>
          <div>
            <div className="flex justify-center mb-4"><Globe className="w-8 h-8 text-[#4F46E5]" /></div>
            <p className="text-5xl font-['Syne'] font-black text-white mb-2"><AnimatedCounter end={380} suffix="+" /></p>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Verified Brands</p>
          </div>
          <div>
            <div className="flex justify-center mb-4"><ClipboardCheck className="w-8 h-8 text-[#4F46E5]" /></div>
            <p className="text-5xl font-['Syne'] font-black text-white mb-2"><AnimatedCounter end={9001} suffix="" /></p>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">ISO Certified Facilities</p>
          </div>
          <div>
            <div className="flex justify-center mb-4"><ShieldCheck className="w-8 h-8 text-[#4F46E5]" /></div>
            <p className="text-5xl font-['Syne'] font-black text-white mb-2"><AnimatedCounter end={100} suffix="%" /></p>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Quality Assured</p>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-32 bg-[#080C14]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-20 text-center">
            <h2 className="text-4xl md:text-5xl font-['Syne'] font-bold text-white mb-6 uppercase tracking-tighter">Product Infrastructure</h2>
            <div className="h-1.5 w-24 bg-[#4F46E5] mx-auto rounded-full" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((cat, i) => (
              <Link key={i} to="/register" className="group p-8 bg-[#0F1623] border border-slate-800 rounded-2xl hover:border-[#4F46E5]/50 transition-all">
                <div className="w-14 h-14 bg-[#4F46E5]/10 rounded-xl flex items-center justify-center mb-6 text-[#4F46E5] group-hover:bg-[#4F46E5]/20 transition-colors">
                  <cat.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-['Syne'] font-bold text-white mb-2 group-hover:text-[#4F46E5] transition-colors">{cat.name}</h3>
                <p className="text-slate-500 text-sm mb-6">{cat.desc}</p>
                <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#4F46E5]">
                  Browse Specs <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Lot Traceability Feature */}
      <section className="py-32 bg-[#0F1623]/50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#080C14] border border-slate-800 rounded-[3rem] p-12 md:p-20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#4F46E5]/10 blur-[120px] rounded-full" />
            <div className="relative z-10 grid md:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl font-['Syne'] font-bold text-white mb-8 uppercase tracking-tighter">Chain of Custody</h2>
                <p className="text-slate-400 mb-10 text-lg leading-relaxed font-light">
                  Our advanced lot traceability engine ensures that every reagent and consumable 
                  in your supply chain is tracked with its corresponding CoA and certification logs.
                </p>
                <div className="space-y-6">
                  {['Automated CoA Retrieval', 'Digital Chain of Custody', 'Expiration Management'].map((feature, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="w-6 h-6 bg-[#4F46E5]/20 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4 text-[#4F46E5]" />
                      </div>
                      <span className="text-white font-medium italic">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-[#0F1623] border border-slate-800 p-8 rounded-2xl relative">
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-[#4F46E5] rounded-xl flex items-center justify-center shadow-lg">
                  <Fingerprint className="text-white w-6 h-6" />
                </div>
                <div className="font-mono text-[10px] space-y-4 text-slate-500">
                  <div className="flex justify-between border-b border-slate-800 pb-2">
                    <span className="text-[#4F46E5] font-black uppercase tracking-[0.2em]">Batch ID: B92-410</span>
                    <span className="text-green-500">CERTIFIED</span>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                    <p className="text-white text-xs mb-1">Methanol Anhydrous 99.9%</p>
                    <p>Origin: CAS# 67-56-1</p>
                    <p>Exp: 2027-04-12</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full w-3/4 bg-[#4F46E5]" />
                    </div>
                    <span className="text-[8px]">75% STOCK</span>
                  </div>
                </div>
                <button className="w-full mt-8 py-4 bg-[#4F46E5] text-white font-black rounded-xl uppercase tracking-widest text-xs hover:bg-[#4338CA] transition-colors">
                  Generate Traceability Report
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
              { icon: Zap, title: 'B2B RFQ Engine', desc: 'Secure institutional pricing for bulk lab consumables and equipment capital projects.' },
              { icon: Globe, title: 'Cold Ship Network', desc: 'Validated temperature-controlled logistics for sensitive enzymes and reagents.' },
              { icon: Microscope, title: 'Demo Program', desc: 'Try high-value instruments in your lab environment before committing to purchase.' },
              { icon: CheckCircle2, title: 'ISO Verification', desc: 'Every manufacturer is vetted against ISO 17025 and ISO 9001 standards.' },
              { icon: Activity, title: 'Inventory Analytics', desc: 'Real-time spend reporting and consumption forecasting for academic labs.' },
              { icon: ShieldCheck, title: 'Hazardous Handling', desc: 'Expert logistics for dangerous goods, chemicals, and bio-sensitive materials.' },
            ].map((f, i) => (
              <div key={i} className="group p-10 bg-[#0F1623] border border-slate-800 rounded-2xl hover:border-[#4F46E5]/50 transition-all">
                <div className="w-14 h-14 bg-[#4F46E5]/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-[#4F46E5]/20 transition-colors">
                  <f.icon className="w-8 h-8 text-[#4F46E5]" />
                </div>
                <h3 className="text-2xl font-['Syne'] font-bold text-white mb-4 group-hover:text-[#4F46E5] transition-colors uppercase tracking-tight">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-40 bg-[#080C14] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(79,70,229,0.1),transparent_50%)]" />
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-5xl md:text-8xl font-['Syne'] font-black text-white mb-10 leading-none uppercase tracking-tighter">ADVANCE YOUR <br /><span className="text-[#4F46E5] italic underline">RESEARCH</span></h2>
          <p className="text-xl text-slate-400 mb-16 font-light">The operating system for the modern life sciences laboratory.</p>
          <Link to="/register" className="inline-flex px-16 py-6 bg-[#4F46E5] text-white font-black rounded-xl hover:shadow-[0_0_50px_rgba(79,70,229,0.4)] transition-all text-xl uppercase tracking-[0.2em]">
            Open Institution Account
          </Link>
        </div>
      </section>
    </div>
  );
}
