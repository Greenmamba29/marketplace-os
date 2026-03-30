import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  ShieldCheck, 
  Users, 
  ArrowRight, 
  Zap,
  Globe,
  Search,
  CheckCircle2,
  ChevronRight,
  FileSearch,
  Lock,
  Award,
  BarChart3
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
  const vehicles = [
    { name: 'GSA Schedule', icon: Award, desc: 'Multiple Award Schedule (MAS) contracts' },
    { name: 'IDIQ / BPA', icon: FileSearch, desc: 'Indefinite delivery and blanket purchase' },
    { name: 'Socioeconomic', icon: Users, desc: '8(a), HUBZone, and SDVOSB set-asides' },
    { name: 'Security Clearances', icon: Lock, desc: 'Verified facility and personnel clearances' },
    { name: 'FedRAMP Cloud', icon: Globe, desc: 'Authorized cloud infrastructure services' },
    { name: 'FAR Compliance', icon: ShieldCheck, desc: 'Full federal acquisition regulation adherence' },
  ];

  return (
    <div className="min-h-screen bg-[#080C14] text-[#F8FAFC] font-['DM_Sans']">
      {/* Hero Section */}
      <section className="relative pt-32 pb-48 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(29,78,216,0.15),transparent_50%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-6 py-2 bg-[#1D4ED8]/10 border border-[#1D4ED8]/20 rounded-full mb-12"
          >
            <ShieldCheck className="w-4 h-4 text-[#1D4ED8]" />
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#1D4ED8] font-black">SAM.gov Registered & FedRAMP Authorized</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-['Syne'] font-extrabold text-white mb-10 tracking-tight leading-none"
          >
            GOVERNMENT <br />
            <span className="bg-gradient-to-r from-[#1D4ED8] to-[#3B82F6] bg-clip-text text-transparent">PROCUREMENT</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-2xl text-slate-400 mb-16 max-w-4xl mx-auto font-light leading-relaxed"
          >
            Connect government buyers with qualified vendors. Streamlined RFP matching, 
            automated FAR/DFARS compliance, and socioeconomic set-aside tracking.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-8"
          >
            <Link to="/register" className="group w-full sm:w-auto px-12 py-5 bg-[#1D4ED8] text-white font-black rounded-xl hover:shadow-[0_0_30px_rgba(29,78,216,0.4)] transition-all flex items-center justify-center gap-3 text-lg uppercase tracking-widest">
              Get Started
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/register" className="group w-full sm:w-auto px-12 py-5 bg-[#0F1623] text-white font-bold rounded-xl border border-slate-800 hover:border-[#1D4ED8]/50 transition-all flex items-center justify-center gap-3 text-lg uppercase tracking-widest">
              Set-Aside Filters
              <Users className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Trust & Stats */}
      <section className="py-24 bg-[#0F1623] border-y border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          <div>
            <div className="flex justify-center mb-4"><Award className="w-8 h-8 text-[#1D4ED8]" /></div>
            <p className="text-5xl font-['Syne'] font-black text-white mb-2"><AnimatedCounter end={12500} suffix="+" /></p>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Registered Vendors</p>
          </div>
          <div>
            <div className="flex justify-center mb-4"><Zap className="w-8 h-8 text-[#1D4ED8]" /></div>
            <p className="text-5xl font-['Syne'] font-black text-white mb-2"><AnimatedCounter end={2.4} suffix="B" /></p>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Contract Value</p>
          </div>
          <div>
            <div className="flex justify-center mb-4"><Building2 className="w-8 h-8 text-[#1D4ED8]" /></div>
            <p className="text-5xl font-['Syne'] font-black text-white mb-2"><AnimatedCounter end={850} suffix="+" /></p>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Agencies</p>
          </div>
          <div>
            <div className="flex justify-center mb-4"><ShieldCheck className="w-8 h-8 text-[#1D4ED8]" /></div>
            <p className="text-5xl font-['Syne'] font-black text-white mb-2"><AnimatedCounter end={99.9} suffix="%" /></p>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Uptime SLA</p>
          </div>
        </div>
      </section>

      {/* Contract Vehicles */}
      <section className="py-32 bg-[#080C14]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-20 text-center">
            <h2 className="text-4xl md:text-5xl font-['Syne'] font-bold text-white mb-6 uppercase tracking-tighter">Acquisition Infrastructure</h2>
            <div className="h-1.5 w-24 bg-[#1D4ED8] mx-auto rounded-full" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {vehicles.map((v, i) => (
              <Link key={i} to="/register" className="group p-8 bg-[#0F1623] border border-slate-800 rounded-2xl hover:border-[#1D4ED8]/50 transition-all">
                <div className="w-14 h-14 bg-[#1D4ED8]/10 rounded-xl flex items-center justify-center mb-6 text-[#1D4ED8] group-hover:bg-[#1D4ED8]/20 transition-colors">
                  <v.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-['Syne'] font-bold text-white mb-2 group-hover:text-[#1D4ED8] transition-colors">{v.name}</h3>
                <p className="text-slate-500 text-sm mb-6">{v.desc}</p>
                <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#1D4ED8]">
                  Learn More <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow Infrastructure */}
      <section className="py-32 bg-[#0F1623]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-20 text-center">
            <h2 className="text-4xl md:text-5xl font-['Syne'] font-bold text-white mb-6 uppercase tracking-tighter italic font-black">Procurement Protocol</h2>
            <div className="h-1 w-20 bg-[#1D4ED8] mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Requirement Spec', desc: 'Define your acquisition requirements and socioeconomic set-aside goals.' },
              { step: '02', title: 'Automated Match', desc: 'AI-powered matching connects you with verified vendors based on NAICS codes.' },
              { step: '03', title: 'Compliance Check', desc: 'Real-time synchronization with SAM.gov for exclusions and entity status.' },
              { step: '04', title: 'Digital Award', desc: 'Complete FAR-compliant documentation and execute digital contract awards.' },
            ].map((item, i) => (
              <div key={i} className="relative group p-8 bg-[#0F1623] border border-slate-800 rounded-2xl hover:border-[#1D4ED8]/30 transition-all">
                <span className="text-4xl font-black text-[#1D4ED8]/20 font-['Syne'] mb-4 block">{item.step}</span>
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
              { icon: Search, title: 'RFP Intelligence', desc: 'AI-driven analysis of government requirements to find the best match.' },
              { icon: ShieldCheck, title: 'FAR Compliance', desc: 'Automated verification against federal acquisition regulations.' },
              { icon: Users, title: 'Set-Aside Tracking', desc: 'Visibility into 8(a), HUBZone, SDVOSB, and WOSB socioeconomic goals.' },
              { icon: Lock, title: 'Security Vetting', desc: 'Verify facility clearances and personnel status for classified projects.' },
              { icon: Globe, title: 'SAM Integration', desc: 'Real-time data sync with SAM.gov entity and exclusion records.' },
              { icon: BarChart3, title: 'Procurement Data', desc: 'Comprehensive dashboards for agency-wide acquisition planning.' },
            ].map((f, i) => (
              <div key={i} className="group p-10 bg-[#0F1623] border border-slate-800 rounded-2xl hover:border-[#1D4ED8]/50 transition-all">
                <div className="w-14 h-14 bg-[#1D4ED8]/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-[#1D4ED8]/20 transition-colors">
                  <f.icon className="w-8 h-8 text-[#1D4ED8]" />
                </div>
                <h3 className="text-2xl font-['Syne'] font-bold text-white mb-4 group-hover:text-[#1D4ED8] transition-colors uppercase tracking-tight">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-40 bg-[#080C14] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(29,78,216,0.1),transparent_50%)]" />
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-5xl md:text-8xl font-['Syne'] font-black text-white mb-10 leading-none uppercase tracking-tighter">STREAMLINE <br /><span className="text-[#1D4ED8] italic">ACQUISITION</span></h2>
          <p className="text-xl text-slate-400 mb-16 font-light">The leading government procurement marketplace for federal agencies and qualified vendors.</p>
          <Link to="/register" className="inline-flex px-16 py-6 bg-[#1D4ED8] text-white font-black rounded-xl hover:shadow-[0_0_50px_rgba(29,78,216,0.4)] transition-all text-xl uppercase tracking-[0.2em]">
            Create Agency Account
          </Link>
        </div>
      </section>
    </div>
  );
}
