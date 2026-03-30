import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Zap, 
  Battery, 
  Cpu, 
  Sun, 
  ShieldCheck, 
  TrendingUp, 
  ArrowRight,
  ChevronRight,
  Activity,
  CheckCircle2,
  Users,
  Package,
  Globe,
  Settings,
  Mail,
  Linkedin,
  Twitter,
  Github,
  Award,
  ZapOff
} from 'lucide-react';
import { useMarketStats } from '@/hooks';
import { useEffect, useState } from 'react';
import React from 'react';

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
  const { data: stats } = useMarketStats();

  return (
    <div className="min-h-screen bg-[#080C14] text-white selection:bg-yellow-500/30">
      {/* Sticky Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#080C14]/80 backdrop-blur-xl border-b border-white/5 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#EAB308] rounded-lg flex items-center justify-center">
              <Zap className="text-[#080C14] w-5 h-5 fill-current" />
            </div>
            <span className="text-xl font-display font-bold tracking-tight">VOLT<span className="text-[#EAB308]">SOURCE</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400 uppercase tracking-widest">
            <a href="#energy-stack" className="hover:text-white transition-colors">Energy Stack</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How it Works</a>
            <a href="#certifications" className="hover:text-white transition-colors">Certs</a>
          </div>
          <Link 
            to="/register" 
            className="px-6 py-2.5 bg-[#EAB308] hover:bg-yellow-500 text-[#080C14] rounded-full text-xs font-black transition-all shadow-lg shadow-yellow-500/20 uppercase tracking-widest"
          >
            START SOURCING
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-32 pb-20 overflow-hidden">
        {/* Animated Energy Flow Gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(234,179,8,0.1),transparent_50%)]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 opacity-20 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#EAB308] rounded-full blur-[140px] animate-pulse-slow" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-amber-900 rounded-full blur-[140px] animate-pulse-slow" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#EAB308]/10 border border-[#EAB308]/20 rounded-full mb-10"
            >
              <span className="w-2 h-2 bg-[#EAB308] rounded-full animate-ping" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#EAB308]">Grid Scale Infrastructure Enabled</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-6xl md:text-8xl font-display font-extrabold text-white mb-8 leading-[1.05] tracking-tight"
            >
              Power the Energy <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-600 animate-gradient italic">
                Transition.
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed"
            >
              The ultimate B2B exchange for EV components, high-density storage, 
              and next-gen grid equipment. Join 3,200+ verified buyers globally.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-20"
            >
              <Link 
                to="/register" 
                className="w-full sm:w-auto px-10 py-5 bg-[#EAB308] hover:bg-yellow-500 text-[#080C14] rounded-full text-lg font-black transition-all shadow-2xl shadow-yellow-500/40 uppercase tracking-widest flex items-center gap-3"
              >
                REQUEST A DEMO <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                to="/register" 
                className="w-full sm:w-auto px-10 py-5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-full text-lg font-black transition-all uppercase tracking-widest"
              >
                VIEW CATALOG
              </Link>
            </motion.div>

            {/* Live Energy Flow Graphic - Simplified Abstract */}
            <div className="relative h-24 max-w-3xl mx-auto overflow-hidden opacity-50">
               <div className="absolute inset-0 flex items-center justify-around">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                    <div key={i} className="w-px h-12 bg-gradient-to-t from-transparent via-yellow-500 to-transparent animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
                  ))}
               </div>
               <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-yellow-500 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Ticker */}
      <div className="bg-[#0F1623] border-y border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-12">
          <div className="text-center">
            <p className="text-4xl font-display font-black text-white mb-1 tracking-tight">
              <AnimatedCounter end={stats?.totalComponents || 45000} suffix="+" />
            </p>
            <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-black">EV Components</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-display font-black text-white mb-1 tracking-tight">
              <AnimatedCounter end={stats?.manufacturers || 280} />
            </p>
            <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-black">Manufacturers</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-display font-black text-white mb-1 tracking-tight">
              <AnimatedCounter end={stats?.onTimeDelivery || 94} suffix="%" />
            </p>
            <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-black">On-Time Rate</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-display font-black text-white mb-1 tracking-tight">
              <AnimatedCounter end={stats?.activeRFQs || 1200} suffix="+" />
            </p>
            <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-black">Monthly RFQs</p>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <section id="energy-stack" className="py-32 relative bg-[#080C14]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6 uppercase tracking-tight">The Full Energy Stack</h2>
            <p className="text-gray-400 max-w-xl mx-auto">Precision components for the world's most critical clean energy infrastructure.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {[
               { icon: Battery, title: 'Battery Systems', desc: 'LFP, NMC, and solid-state modules with integrated BMS and thermal management.', cat: 'BESS' },
               { icon: Cpu, title: 'EV Electronics', desc: 'High-voltage inverters, DC-DC converters, and onboard chargers (OBC) for any drivetrain.', cat: 'POWER' },
               { icon: Sun, title: 'Solar PV', desc: 'Tier-1 photovoltaic modules, bifacial panels, and grid-scale solar inverters.', cat: 'SOLAR' },
               { icon: Zap, title: 'Charging Infra', desc: 'CCS2, NACS, and CHAdeMO controllers, cables, and power modules.', cat: 'EVSE' },
               { icon: Settings, title: 'Grid Equipment', desc: 'Smart transformers, switchgear, and BESS enclosures for utility-scale deployment.', cat: 'GRID' },
               { icon: Globe, title: 'Global Sourcing', desc: 'Submit technical requirements and receive quotes from verified suppliers in 24h.', cat: 'PROCURE' }
             ].map((item, i) => (
               <div key={i} className="group p-10 bg-[#0F1623] border border-white/5 rounded-[32px] hover:border-[#EAB308]/50 transition-all card-hover">
                  <div className="flex justify-between items-start mb-8">
                    <div className="w-16 h-16 bg-[#EAB308]/10 rounded-2xl flex items-center justify-center border border-[#EAB308]/20 group-hover:scale-110 transition-transform">
                      <item.icon className="text-[#EAB308] w-8 h-8" />
                    </div>
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{item.cat}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 font-display uppercase tracking-tight">{item.title}</h3>
                  <p className="text-gray-400 leading-relaxed mb-8">{item.desc}</p>
                  <Link to="/register" className="text-[#EAB308] font-black text-xs uppercase tracking-widest flex items-center gap-2 group-hover:gap-4 transition-all">
                    EXPLORE <ChevronRight className="w-4 h-4" />
                  </Link>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-32 bg-[#0F1623]/30 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">Workflow Accelerated</h2>
            <p className="text-gray-400 max-w-xl mx-auto">Streamlined procurement for complex energy hardware projects.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {[
              { 
                step: '01', 
                title: 'Technical RFQ', 
                desc: 'Upload your technical drawings and BOM. Our engine identifies compatible verified manufacturers.',
                icon: FileCheck
              },
              { 
                step: '02', 
                title: 'Factory Match', 
                desc: 'Receive direct quotes from ISO/IATF certified factories matching your specific grade and lead-time.',
                icon: Factory
              },
              { 
                step: '03', 
                title: 'Quality Audit', 
                desc: 'Automated UL/IEC certification verification for every component before it leaves the factory floor.',
                icon: ShieldCheck
              }
            ].map((item, i) => (
              <div key={i} className="relative group text-center">
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 text-8xl font-display font-black text-white/5 -z-10 group-hover:text-white/10 transition-colors">
                   {item.step}
                 </div>
                 <div className="w-20 h-20 bg-[#EAB308] rounded-[24px] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-yellow-500/20 group-hover:rotate-6 transition-transform">
                    <item.icon className="text-[#080C14] w-10 h-10" />
                 </div>
                 <h3 className="text-2xl font-bold mb-4 font-display uppercase tracking-tight">{item.title}</h3>
                 <p className="text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications / Trust Section */}
      <section id="certifications" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="max-w-md">
              <h2 className="text-3xl font-display font-bold text-white mb-4">Industrial Grade Quality</h2>
              <p className="text-gray-400">VoltSource partners exclusively with manufacturers holding the industry's most rigorous certifications.</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
               {[
                 { label: 'UL', detail: 'CERTIFIED' },
                 { label: 'CE', detail: 'COMPLIANT' },
                 { label: 'ISO 9001', detail: 'QUALITY' },
                 { label: 'IEC 61851', detail: 'STANDARD' }
               ].map(badge => (
                 <div key={badge.label} className="px-8 py-6 bg-[#0F1623] border border-white/10 rounded-2xl text-center group hover:border-[#EAB308]/30 transition-colors">
                   <div className="text-[#EAB308] font-display font-black text-xl mb-1">{badge.label}</div>
                   <div className="text-[10px] text-gray-500 uppercase font-bold tracking-[0.2em]">{badge.detail}</div>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main CTA */}
      <section className="py-32 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-gradient-to-br from-[#0F1623] to-[#080C14] border border-white/10 rounded-[48px] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl shadow-yellow-500/10">
             <div className="absolute top-0 right-0 w-96 h-96 bg-[#EAB308]/10 blur-[100px] -z-10" />
             <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/5 blur-[100px] -z-10" />
             
             <h2 className="text-4xl md:text-6xl font-display font-extrabold text-white mb-8">Ready to Scale Your <br />Clean Energy Portfolio?</h2>
             <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto font-medium">
               Join 3,200+ enterprises who have secured their energy infrastructure pipelines with VoltSource.
             </p>
             <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link 
                  to="/register" 
                  className="px-12 py-5 bg-[#EAB308] hover:bg-yellow-500 text-[#080C14] rounded-full text-xl font-black transition-all shadow-2xl shadow-yellow-500/40 uppercase tracking-widest"
                >
                  START SOURCING
                </Link>
                <Link 
                  to="/register" 
                  className="px-12 py-5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-full text-xl font-black transition-all uppercase tracking-widest"
                >
                  PROJECT DEMO
                </Link>
             </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#080C14] border-t border-white/5 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
            <div>
              <div className="flex items-center gap-2 mb-8">
                <div className="w-8 h-8 bg-[#EAB308] rounded-lg flex items-center justify-center">
                  <Zap className="text-[#080C14] w-5 h-5 fill-current" />
                </div>
                <span className="text-xl font-display font-bold tracking-tight text-white uppercase">Volt<span className="text-[#EAB308]">Source</span></span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed mb-8">
                The global infrastructure for clean energy hardware. Powering the transition to a sustainable future.
              </p>
              <div className="flex gap-6">
                <Twitter className="w-5 h-5 text-gray-500 hover:text-[#EAB308] cursor-pointer transition-colors" />
                <Linkedin className="w-5 h-5 text-gray-500 hover:text-[#EAB308] cursor-pointer transition-colors" />
                <Github className="w-5 h-5 text-gray-500 hover:text-[#EAB308] cursor-pointer transition-colors" />
              </div>
            </div>
            <div>
              <h4 className="text-white font-bold mb-8 uppercase text-xs tracking-[0.2em]">Hardware Stack</h4>
              <ul className="space-y-4 text-sm text-gray-500">
                <li className="hover:text-[#EAB308] cursor-pointer transition-colors">Battery Systems</li>
                <li className="hover:text-[#EAB308] cursor-pointer transition-colors">EV Electronics</li>
                <li className="hover:text-[#EAB308] cursor-pointer transition-colors">Solar Modules</li>
                <li className="hover:text-[#EAB308] cursor-pointer transition-colors">Grid Transformers</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-8 uppercase text-xs tracking-[0.2em]">Ecosystem</h4>
              <ul className="space-y-4 text-sm text-gray-500">
                <li className="hover:text-[#EAB308] cursor-pointer transition-colors">Verified Factories</li>
                <li className="hover:text-[#EAB308] cursor-pointer transition-colors">Logistics Engine</li>
                <li className="hover:text-[#EAB308] cursor-pointer transition-colors">Market Pricing</li>
                <li className="hover:text-[#EAB308] cursor-pointer transition-colors">Sustainability Reports</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-8 uppercase text-xs tracking-[0.2em]">Subscribe</h4>
              <p className="text-xs text-gray-500 mb-6">Receive energy market hardware intelligence.</p>
              <div className="flex bg-[#0F1623] border border-white/10 rounded-xl p-1">
                <input type="email" placeholder="Email" className="bg-transparent border-none focus:ring-0 text-white text-sm px-4 flex-1" />
                <button className="bg-[#EAB308] hover:bg-yellow-500 p-2.5 rounded-lg transition-colors"><Mail className="w-4 h-4 text-[#080C14]" /></button>
              </div>
            </div>
          </div>
          <div className="border-t border-white/5 pt-12 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] text-gray-600 font-black uppercase tracking-[0.3em]">
            <p>© 2026 VoltSource Infrastructure. All Rights Reserved.</p>
            <div className="flex gap-10">
              <span className="hover:text-white cursor-pointer transition-colors">Privacy</span>
              <span className="hover:text-white cursor-pointer transition-colors">Terms</span>
              <span className="hover:text-white cursor-pointer transition-colors">Security</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

import { FileCheck, Factory } from 'lucide-react';
