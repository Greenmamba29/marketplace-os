import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Hexagon, 
  TrendingUp, 
  Globe, 
  ArrowRight,
  ChevronRight,
  Activity,
  CheckCircle2,
  Users,
  Package,
  Layers,
  ShieldAlert,
  BarChart3,
  Search,
  Zap,
  ShieldCheck,
  Truck,
  Mail,
  Linkedin,
  Twitter,
  Github,
  Award,
  Box
} from 'lucide-react';
import { useMarketStats } from '@/hooks';
import { useEffect, useState } from 'react';
import React from 'react';

function AnimatedCounter({ end, duration = 2, prefix = '', suffix = '' }: { end: number; duration?: number; prefix?: string; suffix?: string }) {
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
  return <span>{prefix}{count.toLocaleString()}{suffix}</span>;
}

export default function Landing() {
  const { data: stats } = useMarketStats();

  return (
    <div className="min-h-screen bg-[#080C14] text-white selection:bg-violet-600/30">
      {/* Sticky Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#080C14]/80 backdrop-blur-xl border-b border-white/5 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#7C3AED] rounded-lg flex items-center justify-center">
              <Hexagon className="text-white w-5 h-5 fill-current" />
            </div>
            <span className="text-xl font-display font-bold tracking-tight uppercase">LITHIUM<span className="text-[#7C3AED]">BUY</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400 uppercase tracking-widest">
            <a href="#exchange" className="hover:text-white transition-colors">Exchange</a>
            <a href="#intelligence" className="hover:text-white transition-colors">Intelligence</a>
            <a href="#compliance" className="hover:text-white transition-colors">Compliance</a>
          </div>
          
          {/* Back to Mall — always visible in nav */}
          <a
            href="https://marketplace-os-hub.netlify.app"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-surface-400 hover:text-white border border-surface-200/50 hover:border-white/20 px-3 py-1.5 rounded-full transition-colors"
          >
            ← GrahmOS Mall
          </a>
<Link 
            to="/register" 
            className="px-6 py-2.5 bg-[#7C3AED] hover:bg-violet-600 text-white rounded-full text-xs font-black transition-all shadow-lg shadow-violet-600/20 uppercase tracking-widest"
          >
            START SOURCING
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-32 pb-20 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 opacity-20 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#7C3AED] rounded-full blur-[140px] animate-pulse-slow" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-900 rounded-full blur-[140px] animate-pulse-slow" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-6 py-2 bg-[#7C3AED]/10 border border-[#7C3AED]/20 rounded-full mb-12"
            >
              <Activity className="w-4 h-4 text-[#7C3AED] animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#7C3AED]">Global Commodity Exchange Connected</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl md:text-9xl font-display font-extrabold text-white mb-10 tracking-tight leading-[1.05]"
            >
              The World's <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-violet-500 to-violet-700 animate-gradient italic">
                Lithium Market.
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-gray-400 mb-16 max-w-2xl mx-auto leading-relaxed"
            >
              The definitive B2B exchange for high-purity battery materials. 
              Join 2,400+ verified buyers securing global lithium pipelines.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-20"
            >
              <Link to="/register" className="w-full sm:w-auto px-12 py-5 bg-[#7C3AED] hover:bg-violet-600 text-white font-black rounded-full shadow-2xl shadow-violet-600/40 transition-all flex items-center justify-center gap-3 text-lg uppercase tracking-widest">
                REQUEST A DEMO <ArrowRight className="w-6 h-6" />
              </Link>
              <Link to="/register" className="w-full sm:w-auto px-12 py-5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-full font-black transition-all text-lg uppercase tracking-widest">
                START SOURCING
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Live Spot Price Ticker */}
      <div id="intelligence" className="bg-[#0F1623] border-y border-white/5 py-6 overflow-hidden">
        <div className="flex items-center gap-16 py-2 animate-marquee whitespace-nowrap px-8">
           {[1, 2].map((group) => (
             <React.Fragment key={group}>
               <div className="flex items-center gap-6">
                 <span className="text-xs font-black text-gray-500 uppercase tracking-widest">Li2CO3 99.5%</span>
                 <span className="text-xl font-mono font-bold text-white">$14,250</span>
                 <span className="text-xs font-mono font-black text-green-500">+1.2%</span>
               </div>
               <div className="flex items-center gap-6">
                 <span className="text-xs font-black text-gray-500 uppercase tracking-widest">LiOH·H2O</span>
                 <span className="text-xl font-mono font-bold text-white">$12,800</span>
                 <span className="text-xs font-mono font-black text-red-500">-0.8%</span>
               </div>
               <div className="flex items-center gap-6">
                 <span className="text-xs font-black text-gray-500 uppercase tracking-widest">SC6 Spodumene</span>
                 <span className="text-xl font-mono font-bold text-white">$1,100</span>
                 <span className="text-xs font-mono font-black text-green-500">+0.4%</span>
               </div>
               <div className="flex items-center gap-6">
                 <span className="text-xs font-black text-gray-500 uppercase tracking-widest">Li Metal 99.9%</span>
                 <span className="text-xl font-mono font-bold text-white">$65,000</span>
                 <span className="text-xs font-mono font-black text-gray-500">0.0%</span>
               </div>
             </React.Fragment>
           ))}
        </div>
      </div>

      {/* Stats Section */}
      <section className="py-32 bg-[#080C14]">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <div className="flex flex-col items-center group">
              <p className="text-7xl font-display font-black text-white mb-4 group-hover:text-[#7C3AED] transition-colors"><AnimatedCounter end={stats?.miners || 850} suffix="+" /></p>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Verified Miners</p>
            </div>
            <div className="flex flex-col items-center group">
              <p className="text-7xl font-display font-black text-white mb-4 group-hover:text-[#7C3AED] transition-colors"><AnimatedCounter end={stats?.countries || 45} /></p>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Origin Countries</p>
            </div>
            <div className="flex flex-col items-center group">
              <p className="text-7xl font-display font-black text-white mb-4 group-hover:text-[#7C3AED] transition-colors"><AnimatedCounter end={48} prefix="$" suffix="M" /></p>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Traded Volume (Q1)</p>
            </div>
          </div>
        </div>
      </section>

      {/* Catalog / How It Works */}
      <section id="exchange" className="py-32 bg-[#0F1623]/30 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6 uppercase tracking-tight">Standardized Exchange Grades</h2>
            <p className="text-gray-400 max-w-xl mx-auto">Access high-purity materials with verified assay reports from global origins.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {[
               { title: 'Lithium Carbonate', desc: 'Battery Grade 99.5% min purity. Primary feedstock for NMC/LFP cathodes.', code: 'Li2CO3', icon: Box },
               { title: 'Lithium Hydroxide', desc: 'Monohydrate crystal. Essential for high-nickel (NCM 811) chemistries.', code: 'LiOH', icon: Layers },
               { title: 'Spodumene Concentrate', desc: '6% Li2O SC6 grade. Mineral source for industrial lithium production.', code: 'SC6', icon: Hexagon },
             ].map((item, i) => (
               <div key={i} className="group p-10 bg-[#0F1623] border border-white/5 rounded-[32px] hover:border-[#7C3AED]/50 transition-all card-hover">
                  <div className="flex justify-between items-start mb-8">
                    <div className="w-16 h-16 bg-[#7C3AED]/10 rounded-2xl flex items-center justify-center border border-[#7C3AED]/20 group-hover:scale-110 transition-transform">
                      <item.icon className="text-[#7C3AED] w-8 h-8" />
                    </div>
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{item.code}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 font-display uppercase tracking-tight">{item.title}</h3>
                  <p className="text-gray-400 leading-relaxed mb-10">{item.desc}</p>
                  <Link to="/register" className="text-[#7C3AED] font-black text-xs uppercase tracking-widest flex items-center gap-2 group-hover:gap-4 transition-all">
                    VIEW CONTRACTS <ChevronRight className="w-4 h-4" />
                  </Link>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* Trust & Compliance Section */}
      <section id="compliance" className="py-24 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="max-w-md">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4 uppercase">Chain of Custody</h2>
            <p className="text-gray-400">Every trade on LithiumBuy includes end-to-end traceability and verified chemical assay reports.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {[
              { label: 'REACH', detail: 'COMPLIANT' },
              { label: 'IRMA', detail: 'AUDITED' },
              { label: 'LME', detail: 'GRADED' },
              { label: 'ISO 9001', detail: 'CERTIFIED' }
            ].map(badge => (
              <div key={badge.label} className="px-8 py-6 bg-[#0F1623] border border-white/10 rounded-2xl text-center group hover:border-[#7C3AED]/30 transition-colors">
                <div className="text-[#7C3AED] font-display font-black text-xl mb-1">{badge.label}</div>
                <div className="text-[10px] text-gray-500 uppercase font-bold tracking-[0.2em]">{badge.detail}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main CTA Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-gradient-to-br from-[#0F1623] to-[#080C14] border border-white/10 rounded-[48px] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl shadow-violet-600/10">
             <div className="absolute top-0 right-0 w-96 h-96 bg-[#7C3AED]/10 blur-[100px] -z-10" />
             <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 blur-[100px] -z-10" />
             
             <h2 className="text-4xl md:text-6xl font-display font-extrabold text-white mb-8">Secure Your High-Purity <br />Lithium Supply Today.</h2>
             <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
               Join 2,400+ battery manufacturers who have streamlined their material procurement with LithiumBuy.
             </p>
             <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link 
                  to="/register" 
                  className="px-12 py-5 bg-[#7C3AED] hover:bg-violet-600 text-white rounded-full text-xl font-black transition-all shadow-2xl shadow-violet-600/40 uppercase tracking-widest"
                >
                  START SOURCING
                </Link>
                <Link 
                  to="/register" 
                  className="px-12 py-5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-full text-xl font-black transition-all uppercase tracking-widest"
                >
                  REQUEST A DEMO
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
                <div className="w-8 h-8 bg-[#7C3AED] rounded-lg flex items-center justify-center">
                  <Hexagon className="text-white w-5 h-5 fill-current" />
                </div>
                <span className="text-xl font-display font-bold tracking-tight text-white uppercase">Lithium<span className="text-[#7C3AED]">Buy</span></span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed mb-8">
                The leading global B2B exchange for battery-grade lithium compounds. Powering the electric revolution.
              </p>
              <div className="flex gap-6">
                <Twitter className="w-5 h-5 text-gray-500 hover:text-[#7C3AED] cursor-pointer transition-colors" />
                <Linkedin className="w-5 h-5 text-gray-500 hover:text-[#7C3AED] cursor-pointer transition-colors" />
                <Github className="w-5 h-5 text-gray-500 hover:text-[#7C3AED] cursor-pointer transition-colors" />
              </div>
            </div>
            <div>
              <h4 className="text-white font-bold mb-8 uppercase text-xs tracking-[0.2em]">Exchange</h4>
              <ul className="space-y-4 text-sm text-gray-500">
                <li className="hover:text-[#7C3AED] cursor-pointer transition-colors">Spot Trading</li>
                <li className="hover:text-[#7C3AED] cursor-pointer transition-colors">Off-take Agreements</li>
                <li className="hover:text-[#7C3AED] cursor-pointer transition-colors">Assay Reports</li>
                <li className="hover:text-[#7C3AED] cursor-pointer transition-colors">Global Inventory</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-8 uppercase text-xs tracking-[0.2em]">Intelligence</h4>
              <ul className="space-y-4 text-sm text-gray-500">
                <li className="hover:text-[#7C3AED] cursor-pointer transition-colors">Price Indices</li>
                <li className="hover:text-[#7C3AED] cursor-pointer transition-colors">Supply Analysis</li>
                <li className="hover:text-[#7C3AED] cursor-pointer transition-colors">Geopolitical Alerts</li>
                <li className="hover:text-[#7C3AED] cursor-pointer transition-colors">Sustainability ESG</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-8 uppercase text-xs tracking-[0.2em]">Newsletter</h4>
              <p className="text-xs text-gray-500 mb-6">Receive daily lithium spot price movements.</p>
              <div className="flex bg-[#0F1623] border border-white/10 rounded-xl p-1">
                <input type="email" placeholder="Email" className="bg-transparent border-none focus:ring-0 text-white text-sm px-4 flex-1" />
                <button className="bg-[#7C3AED] hover:bg-violet-600 p-2.5 rounded-lg transition-colors"><Mail className="w-4 h-4 text-white" /></button>
              </div>
            </div>
          </div>
          <div className="border-t border-white/5 pt-12 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] text-gray-600 font-black uppercase tracking-[0.3em]">
            <p>© 2026 LithiumBuy Commodity Exchange. All Rights Reserved.</p>
            <div className="flex gap-10">
              <span className="hover:text-white cursor-pointer transition-colors">Privacy</span>
              <span className="hover:text-white cursor-pointer transition-colors">Terms</span>
              <span className="hover:text-white cursor-pointer transition-colors">Compliance</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
