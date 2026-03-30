import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  ShieldCheck, 
  Users, 
  Clock, 
  ArrowRight, 
  Zap,
  Star,
  Search,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  CalendarCheck,
  UserCheck
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
    { name: 'CNA & HHA', icon: Heart, desc: 'Certified assistants and home health aides' },
    { name: 'Registered Nurses', icon: ClipboardCheck, desc: 'Specialized care including RN and LPN' },
    { name: 'Physical Therapy', icon: Star, desc: 'PT, OT, and rehabilitation specialists' },
    { name: 'Specialty Care', icon: ShieldCheck, desc: 'Dementia, hospice, and pediatric care' },
    { name: 'Shift Support', icon: CalendarCheck, desc: 'On-demand per-diem staffing' },
    { name: 'Staff Vetting', icon: UserCheck, desc: 'Credentialing and background services' },
  ];

  return (
    <div className="min-h-screen bg-[#080C14] text-[#F8FAFC] font-['DM_Sans']">
      {/* Hero Section */}
      <section className="relative pt-32 pb-48 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(225,29,72,0.15),transparent_50%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-6 py-2 bg-[#E11D48]/10 border border-[#E11D48]/20 rounded-full mb-12"
          >
            <ShieldCheck className="w-4 h-4 text-[#E11D48]" />
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#E11D48] font-black">100% Background Checked & Verified</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-['Syne'] font-extrabold text-white mb-10 tracking-tight leading-none"
          >
            CREDENTIALED CARE <br />
            <span className="bg-gradient-to-r from-[#E11D48] to-[#FB7185] bg-clip-text text-transparent">IN UNDER 72H</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-2xl text-slate-400 mb-16 max-w-4xl mx-auto font-light leading-relaxed"
          >
            The world's most efficient marketplace for healthcare staffing. 
            Source, vet, and place qualified care professionals with zero friction.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-8"
          >
            <Link to="/register" className="group w-full sm:w-auto px-12 py-5 bg-[#E11D48] text-white font-black rounded-xl hover:shadow-[0_0_30px_rgba(225,29,72,0.4)] transition-all flex items-center justify-center gap-3 text-lg uppercase tracking-widest">
              Browse Staff
              <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </Link>
            <Link to="/register" className="group w-full sm:w-auto px-12 py-5 bg-[#0F1623] text-white font-bold rounded-xl border border-slate-800 hover:border-[#E11D48]/50 transition-all flex items-center justify-center gap-3 text-lg uppercase tracking-widest">
              Book a Shift
              <CalendarCheck className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Trust & Stats */}
      <section className="py-24 bg-[#0F1623] border-y border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          <div>
            <div className="flex justify-center mb-4"><Users className="w-8 h-8 text-[#E11D48]" /></div>
            <p className="text-5xl font-['Syne'] font-black text-white mb-2"><AnimatedCounter end={24000} suffix="+" /></p>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Active Caregivers</p>
          </div>
          <div>
            <div className="flex justify-center mb-4"><Clock className="w-8 h-8 text-[#E11D48]" /></div>
            <p className="text-5xl font-['Syne'] font-black text-white mb-2"><AnimatedCounter end={72} suffix="h" /></p>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Avg Placement Time</p>
          </div>
          <div>
            <div className="flex justify-center mb-4"><Star className="w-8 h-8 text-[#E11D48]" /></div>
            <p className="text-5xl font-['Syne'] font-black text-white mb-2"><AnimatedCounter end={98} suffix="%" /></p>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Success Rate</p>
          </div>
          <div>
            <div className="flex justify-center mb-4"><ShieldCheck className="w-8 h-8 text-[#E11D48]" /></div>
            <p className="text-5xl font-['Syne'] font-black text-white mb-2"><AnimatedCounter end={100} suffix="%" /></p>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Vetted Profiles</p>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-32 bg-[#080C14]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-20 text-center">
            <h2 className="text-4xl md:text-5xl font-['Syne'] font-bold text-white mb-6 uppercase tracking-tighter">Care Infrastructure</h2>
            <div className="h-1.5 w-24 bg-[#E11D48] mx-auto rounded-full" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((cat, i) => (
              <Link key={i} to="/register" className="group p-8 bg-[#0F1623] border border-slate-800 rounded-2xl hover:border-[#E11D48]/50 transition-all">
                <div className="w-14 h-14 bg-[#E11D48]/10 rounded-xl flex items-center justify-center mb-6 text-[#E11D48] group-hover:bg-[#E11D48]/20 transition-colors">
                  <cat.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-['Syne'] font-bold text-white mb-2 group-hover:text-[#E11D48] transition-colors">{cat.name}</h3>
                <p className="text-slate-500 text-sm mb-6">{cat.desc}</p>
                <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#E11D48]">
                  Find Personnel <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
            <h2 className="text-4xl md:text-5xl font-['Syne'] font-bold text-white mb-6 uppercase tracking-tighter italic">Staffing Protocol</h2>
            <div className="h-1 w-20 bg-[#E11D48] mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { step: '01', title: 'Registry Sync', desc: 'Our platform automatically verifies licenses against state registries in real-time.' },
              { step: '02', title: 'Background Check', desc: 'Mandatory criminal and health screen verification for every active profile.' },
              { step: '03', title: 'AI Matching', desc: 'Instant matching based on specialty, location radius, and shift availability.' },
            ].map((item, i) => (
              <div key={i} className="relative group p-10 bg-[#0F1623] border border-slate-800 rounded-2xl hover:border-[#E11D48]/50 transition-all">
                <span className="absolute -top-6 -left-4 text-7xl font-black text-[#E11D48]/10 font-['Syne'] group-hover:text-[#E11D48]/20 transition-colors">{item.step}</span>
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
              { icon: UserCheck, title: 'Credentialing', desc: 'Secure vault for license renewals, immunizations, and training certificates.' },
              { icon: Zap, title: 'Instant Placement', desc: 'Fill emergency shift openings in minutes through our broadcast alert system.' },
              { icon: ShieldCheck, title: 'Compliance Logs', desc: 'Automated audit trails for staffing agency compliance and state regulations.' },
              { icon: CalendarCheck, title: 'Shift Booking', desc: 'Mobile-first interface for caregivers to book and manage their weekly schedules.' },
              { icon: ClipboardCheck, title: 'Electronic Visit', desc: 'Integrated EVV (Electronic Visit Verification) for accurate time-tracking.' },
              { icon: Star, title: 'Rating Engine', desc: 'Verified feedback loop between facilities and care professionals.' },
            ].map((f, i) => (
              <div key={i} className="group p-10 bg-[#0F1623] border border-slate-800 rounded-2xl hover:border-[#E11D48]/50 transition-all">
                <div className="w-14 h-14 bg-[#E11D48]/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-[#E11D48]/20 transition-colors">
                  <f.icon className="w-8 h-8 text-[#E11D48]" />
                </div>
                <h3 className="text-2xl font-['Syne'] font-bold text-white mb-4 group-hover:text-[#E11D48] transition-colors uppercase tracking-tight">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-40 bg-[#080C14] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(225,29,72,0.1),transparent_50%)]" />
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-5xl md:text-8xl font-['Syne'] font-black text-white mb-10 leading-none uppercase tracking-tighter">REVOLUTIONIZE YOUR <br /><span className="text-[#E11D48] italic">CARE TEAM</span></h2>
          <p className="text-xl text-slate-400 mb-16 font-light">The healthcare-native infrastructure for modern home care and clinical agencies.</p>
          <Link to="/register" className="inline-flex px-16 py-6 bg-[#E11D48] text-white font-black rounded-xl hover:shadow-[0_0_50px_rgba(225,29,72,0.4)] transition-all text-xl uppercase tracking-[0.2em]">
            Join the Network
          </Link>
        </div>
      </section>
    </div>
  );
}
