import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Beaker, 
  Search, 
  Shield, 
  TrendingUp, 
  Zap, 
  Globe, 
  FileCheck,
  ArrowRight,
  ChevronRight,
  Activity,
  BarChart3,
  Users,
  Package,
  Mail,
  Linkedin,
  Twitter,
  Github,
  CheckCircle2,
  Lock,
  Boxes
} from 'lucide-react';
import { motion } from 'framer-motion';
import CASSearch from '@/components/CASSearch';
import { useMarketOverview } from '@/hooks';

// Animated counter component
function AnimatedCounter({ end, duration = 2, suffix = '' }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let startTime: number;
    let animationFrame: number;
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      setCount(Math.floor(progress * end));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };
    
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);
  
  return <span>{count.toLocaleString()}{suffix}</span>;
}

// Live market data ticker
function MarketTicker() {
  const { data: overview } = useMarketOverview();
  
  return (
    <div className="bg-[#0F1623] border-y border-white/5 overflow-hidden">
      <div className="flex items-center gap-12 py-4 animate-marquee whitespace-nowrap px-8">
        {[1, 2, 3].map((i) => (
          <React.Fragment key={i}>
            <span className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase">
              <Activity className="w-4 h-4 text-[#0ABFBC]" />
              <span className="text-gray-500">Chemicals:</span>
              <span className="font-mono text-white">{overview?.total_chemicals_tracked.toLocaleString() || '12,400+'}</span>
            </span>
            <span className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-gray-500">24h Change:</span>
              <span className={`font-mono ${(overview?.avg_price_change_24h || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {(overview?.avg_price_change_24h || 0) >= 0 ? '+' : ''}{overview?.avg_price_change_24h.toFixed(2) || '+1.42'}%
              </span>
            </span>
            <span className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase">
              <Package className="w-4 h-4 text-[#0ABFBC]" />
              <span className="text-gray-500">Active RFQs:</span>
              <span className="font-mono text-white">{overview?.active_rfqs.toLocaleString() || '412'}</span>
            </span>
            <span className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase">
              <BarChart3 className="w-4 h-4 text-[#0ABFBC]" />
              <span className="text-gray-500">Sentiment:</span>
              <span className="font-mono text-[#0ABFBC] uppercase">{overview?.market_sentiment || 'Bullish'}</span>
            </span>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

import React from 'react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#080C14] text-white selection:bg-[#0ABFBC]/30">
      {/* Sticky Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#080C14]/80 backdrop-blur-xl border-b border-white/5 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#0ABFBC] rounded-lg flex items-center justify-center">
              <Beaker className="text-[#080C14] w-5 h-5 fill-current" />
            </div>
            <span className="text-xl font-display font-bold tracking-tight">Chem<span className="text-[#0ABFBC]">OS</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400 uppercase tracking-widest">
            <a href="#directory" className="hover:text-white transition-colors">Directory</a>
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
            className="px-6 py-2.5 bg-[#0ABFBC] hover:bg-[#08a8a5] text-[#080C14] rounded-full text-xs font-black transition-all shadow-lg shadow-[#0ABFBC]/20 uppercase tracking-widest"
          >
            START SOURCING
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-32 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 opacity-20 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#0ABFBC] rounded-full blur-[140px] animate-pulse-slow" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-900 rounded-full blur-[140px] animate-pulse-slow" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#0ABFBC]/10 border border-[#0ABFBC]/20 rounded-full mb-10"
            >
              <Zap className="w-4 h-4 text-[#0ABFBC]" />
              <span className="text-[10px] text-[#0ABFBC] font-black uppercase tracking-[0.2em]">Enterprise Chemical Exchange</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-6xl md:text-8xl font-display font-extrabold text-white mb-8 leading-[1.05] tracking-tight"
            >
              Compliant Sourcing at <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#0ABFBC] via-[#2DD4BF] to-[#5EEAD4] animate-gradient italic">
                Enterprise Scale.
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed"
            >
              The world's largest CAS directory with AI-powered compliance, 
              live market intelligence, and automated RFQ management.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="max-w-2xl mx-auto mb-16 relative group"
            >
              <div className="absolute inset-0 bg-[#0ABFBC]/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl -z-10" />
              <CASSearch />
              <div className="mt-6 flex flex-wrap justify-center gap-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#0ABFBC]" /> REACH Compliant</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#0ABFBC]" /> SDS Managed</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#0ABFBC]" /> Verified Suppliers</span>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center justify-center gap-16 border-t border-white/5 pt-12"
            >
               <div>
                  <div className="text-3xl font-display font-bold text-white mb-1 tracking-tight">
                    <AnimatedCounter end={12400} suffix="+" />
                  </div>
                  <div className="text-[10px] text-gray-500 font-black uppercase tracking-widest">CAS Numbers</div>
               </div>
               <div className="w-px h-10 bg-white/10" />
               <div>
                  <div className="text-3xl font-display font-bold text-white mb-1 tracking-tight">
                    <AnimatedCounter end={850} suffix="+" />
                  </div>
                  <div className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Global Suppliers</div>
               </div>
               <div className="w-px h-10 bg-white/10" />
               <div>
                  <div className="text-3xl font-display font-bold text-white mb-1 tracking-tight">
                    <AnimatedCounter end={99.9} suffix="%" />
                  </div>
                  <div className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Compliance Rate</div>
               </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Market Ticker */}
      <MarketTicker />
      
      {/* Social Proof Bar */}
      <div className="py-12 bg-[#080C14]">
        <div className="max-w-7xl mx-auto px-4 overflow-hidden">
          <p className="text-center text-[10px] uppercase tracking-[0.3em] font-black text-gray-600 mb-10">Trusted by Global Chemical Enterprises</p>
          <div className="flex flex-wrap justify-center gap-12 md:gap-24 opacity-40 grayscale hover:grayscale-0 transition-all">
            {['BASF', 'Dow', 'Sinopec', 'LyondellBasell', 'Inovyn', 'Nutrien'].map(brand => (
              <span key={brand} className="text-2xl font-display font-black tracking-tighter text-white">{brand}</span>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <section className="py-32 relative bg-[#0F1623]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">Autonomous Sourcing <br />Flow</h2>
            <p className="text-gray-400 max-w-xl mx-auto">Precision chemical procurement engineered for speed and absolute compliance.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { 
                step: '01', 
                title: 'CAS Identification', 
                desc: 'Locate chemicals with surgical precision using our multi-index CAS directory.',
                icon: Search
              },
              { 
                step: '02', 
                title: 'Auto-Compliance', 
                desc: 'Instant REACH, RoHS, and SDS validation for every quote requested.',
                icon: Shield
              },
              { 
                step: '03', 
                title: 'Global Fulfillment', 
                desc: 'Streamlined logistics and hazardous material handling from factory to lab.',
                icon: Globe
              },
            ].map((item, i) => (
              <div key={i} className="group relative p-10 bg-[#0F1623] border border-white/5 rounded-[32px] hover:border-[#0ABFBC]/50 transition-all">
                <div className="absolute top-8 right-10 text-6xl font-display font-black text-[#0ABFBC]/5 group-hover:text-[#0ABFBC]/10 transition-colors">
                  {item.step}
                </div>
                <div className="w-16 h-16 bg-[#0ABFBC]/10 rounded-2xl flex items-center justify-center mb-8 border border-[#0ABFBC]/20 group-hover:scale-110 transition-transform">
                  <item.icon className="text-[#0ABFBC] w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 font-display">{item.title}</h3>
                <p className="text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Trust Signals Section */}
      <section id="compliance" className="py-24 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="max-w-md">
            <h2 className="text-3xl font-display font-bold text-white mb-4">Certified Compliance</h2>
            <p className="text-gray-400">Our platform ensures all transactions meet the highest international safety and regulatory standards.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {[
              { label: 'REACH', detail: 'EU Standard' },
              { label: 'RoHS', detail: 'Electronic' },
              { label: 'SDS', detail: 'Compliant' },
              { label: 'ISO 14001', detail: 'Environment' }
            ].map(badge => (
              <div key={badge.label} className="px-8 py-6 bg-[#0F1623] border border-white/10 rounded-2xl text-center">
                <div className="text-[#0ABFBC] font-display font-black text-xl mb-1">{badge.label}</div>
                <div className="text-[10px] text-gray-500 uppercase font-bold tracking-[0.2em]">{badge.detail}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-32 bg-[#080C14] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-gradient-to-br from-[#0F1623] to-[#080C14] border border-white/10 rounded-[48px] p-12 md:p-24 text-center relative overflow-hidden">
             <div className="absolute top-0 right-0 w-96 h-96 bg-[#0ABFBC]/10 blur-[100px] -z-10" />
             <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 blur-[100px] -z-10" />
             
             <h2 className="text-4xl md:text-6xl font-display font-extrabold text-white mb-8">Ready to Scale Your <br />Chemical Procurement?</h2>
             <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
               Join 4,200+ enterprises using ChemOS to source specialized materials with zero compliance friction.
             </p>
             <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link 
                  to="/register" 
                  className="px-10 py-5 bg-[#0ABFBC] hover:bg-[#08a8a5] text-[#080C14] rounded-full text-lg font-black transition-all shadow-2xl shadow-[#0ABFBC]/40 uppercase tracking-widest"
                >
                  REQUEST A DEMO
                </Link>
                <Link 
                  to="/register" 
                  className="px-10 py-5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-full text-lg font-black transition-all uppercase tracking-widest"
                >
                  START SOURCING
                </Link>
             </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-[#080C14] border-t border-white/5 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
            <div>
              <div className="flex items-center gap-2 mb-8">
                <div className="w-8 h-8 bg-[#0ABFBC] rounded-lg flex items-center justify-center">
                  <Beaker className="text-[#080C14] w-5 h-5 fill-current" />
                </div>
                <span className="text-xl font-display font-bold tracking-tight text-white">Chem<span className="text-[#0ABFBC]">OS</span></span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed mb-8">
                The leading B2B marketplace for specialty chemicals. Powering the global material sciences supply chain.
              </p>
              <div className="flex gap-5">
                <Twitter className="w-5 h-5 text-gray-500 hover:text-[#0ABFBC] cursor-pointer transition-colors" />
                <Linkedin className="w-5 h-5 text-gray-500 hover:text-[#0ABFBC] cursor-pointer transition-colors" />
                <Github className="w-5 h-5 text-gray-500 hover:text-[#0ABFBC] cursor-pointer transition-colors" />
              </div>
            </div>
            <div>
              <h4 className="text-white font-bold mb-8 uppercase text-xs tracking-[0.2em]">Exchange</h4>
              <ul className="space-y-4 text-sm text-gray-500">
                <li className="hover:text-[#0ABFBC] cursor-pointer transition-colors">CAS Directory</li>
                <li className="hover:text-[#0ABFBC] cursor-pointer transition-colors">Market Indices</li>
                <li className="hover:text-[#0ABFBC] cursor-pointer transition-colors">Global RFQs</li>
                <li className="hover:text-[#0ABFBC] cursor-pointer transition-colors">Supplier Portal</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-8 uppercase text-xs tracking-[0.2em]">Safety</h4>
              <ul className="space-y-4 text-sm text-gray-500">
                <li className="hover:text-[#0ABFBC] cursor-pointer transition-colors">Compliance Verification</li>
                <li className="hover:text-[#0ABFBC] cursor-pointer transition-colors">SDS Management</li>
                <li className="hover:text-[#0ABFBC] cursor-pointer transition-colors">Regulatory News</li>
                <li className="hover:text-[#0ABFBC] cursor-pointer transition-colors">Logistics Support</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-8 uppercase text-xs tracking-[0.2em]">Newsletter</h4>
              <p className="text-xs text-gray-500 mb-6">Receive weekly chemical market intelligence.</p>
              <div className="flex bg-[#0F1623] border border-white/10 rounded-xl p-1">
                <input type="email" placeholder="Email" className="bg-transparent border-none focus:ring-0 text-white text-sm px-4 flex-1" />
                <button className="bg-[#0ABFBC] hover:bg-[#08a8a5] p-2.5 rounded-lg transition-colors"><Mail className="w-4 h-4 text-[#080C14]" /></button>
              </div>
            </div>
          </div>
          <div className="border-t border-white/5 pt-12 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] text-gray-600 font-black uppercase tracking-[0.3em]">
            <p>© 2026 ChemOS Marketplace OS. All Rights Reserved.</p>
            <div className="flex gap-10">
              <span className="hover:text-white cursor-pointer transition-colors">Privacy</span>
              <span className="hover:text-white cursor-pointer transition-colors">Terms</span>
              <span className="hover:text-white cursor-pointer transition-colors">Cookies</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
