import React from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  ChevronRight, 
  Building2, 
  ShieldCheck, 
  BarChart3, 
  HardHat, 
  Truck, 
  Globe, 
  ArrowRight,
  Calculator,
  CheckCircle2,
  Zap,
  Leaf,
  Mail,
  Twitter,
  Linkedin,
  Github,
  Award
} from 'lucide-react';
import { Link } from 'react-router-dom';

const BuildSourceLanding: React.FC = () => {
  return (
    <div className="flex flex-col bg-[#080C14] text-white font-sans selection:bg-amber-500/30">
      {/* Sticky Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#080C14]/80 backdrop-blur-xl border-b border-white/5 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-amber-600 rounded-lg flex items-center justify-center">
              <Building2 className="text-[#080C14] w-5 h-5 fill-current" />
            </div>
            <span className="text-xl font-display font-bold tracking-tight">BUILD<span className="text-amber-600">SOURCE</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400 uppercase tracking-widest">
            <a href="#categories" className="hover:text-white transition-colors">Materials</a>
            <a href="#calculator" className="hover:text-white transition-colors">Calculator</a>
            <a href="#projects" className="hover:text-white transition-colors">Projects</a>
          </div>
          <Link 
            to="/register" 
            className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-[#080C14] rounded-full text-xs font-black transition-all shadow-lg shadow-amber-600/20 uppercase tracking-widest"
          >
            START SOURCING
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-32 pb-20 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 opacity-20 pointer-events-none">
          <div className="absolute top-[-5%] left-[-5%] w-[60%] h-[60%] bg-amber-600 rounded-full blur-[140px] animate-pulse-slow" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-orange-900 rounded-full blur-[140px] animate-pulse-slow" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black bg-amber-600/10 text-amber-600 border border-amber-600/20 mb-8 tracking-[0.2em] uppercase">
                Direct-to-Jobsite Procurement
              </span>
              <h1 className="text-6xl lg:text-8xl font-display font-extrabold text-white leading-[1.05] mb-8 tracking-tight">
                From Foundation <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-amber-600 to-amber-700 animate-gradient">
                  to Finish.
                </span>
              </h1>
              <p className="text-xl text-gray-400 mb-10 max-w-lg leading-relaxed">
                The enterprise standard for construction material sourcing. 
                Join 1,800+ general contractors managing $12B+ in project volume.
              </p>

              <div className="flex items-center gap-12 mb-12">
                <div>
                  <div className="text-3xl font-display font-bold text-white">850K+</div>
                  <div className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Products</div>
                </div>
                <div className="w-px h-10 bg-white/10" />
                <div>
                  <div className="text-3xl font-display font-bold text-white">2.3K+</div>
                  <div className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Suppliers</div>
                </div>
                <div className="w-px h-10 bg-white/10" />
                <div>
                  <div className="text-3xl font-display font-bold text-white">35</div>
                  <div className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Countries</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register" className="px-10 py-5 bg-amber-600 hover:bg-amber-700 text-[#080C14] rounded-full text-lg font-black transition-all shadow-2xl shadow-amber-600/30 uppercase tracking-widest flex items-center justify-center gap-2">
                  REQUEST A DEMO <ArrowRight className="w-5 h-5" />
                </Link>
                <Link to="/register" className="px-10 py-5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-full text-lg font-black transition-all uppercase tracking-widest flex items-center justify-center">
                  VIEW CATALOG
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.8 }}
              className="relative hidden lg:block"
            >
              <div id="categories" className="grid grid-cols-2 gap-4">
                {[
                  { icon: Building2, label: 'CONCRETE', count: '12k SKUs' },
                  { icon: HardHat, label: 'STEEL', count: '8k SKUs' },
                  { icon: Truck, label: 'LUMBER', count: '45k SKUs' },
                  { icon: Globe, label: 'IMPORT', count: 'Global' }
                ].map((item, i) => (
                  <div key={i} className="group p-8 bg-[#0F1623] border border-white/5 rounded-[32px] hover:border-amber-600/50 transition-all card-hover">
                    <div className="w-14 h-14 bg-amber-600/10 rounded-2xl flex items-center justify-center mb-6 border border-amber-600/20 group-hover:scale-110 transition-transform">
                      <item.icon className="w-7 h-7 text-amber-600" />
                    </div>
                    <div className="text-lg font-display font-black text-white mb-1 uppercase tracking-tight">{item.label}</div>
                    <div className="text-xs text-gray-500 font-bold uppercase tracking-widest">{item.count}</div>
                  </div>
                ))}
              </div>
              {/* Decorative volume indicator */}
              <div className="absolute -bottom-10 -left-10 bg-[#0F1623] border border-white/5 p-6 rounded-2xl shadow-2xl animate-float">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center">
                    <BarChart3 className="text-green-500 w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 font-black uppercase tracking-widest">Project Savings</div>
                    <div className="text-xl font-display font-bold text-white">12.4% AVG</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Signal Bar */}
      <div className="bg-[#0F1623] border-y border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-center gap-12 md:gap-24 opacity-40 grayscale hover:grayscale-0 transition-all">
          {['TCL', 'PCL', 'AECOM', 'BECHTEL', 'SKANSKA', 'VINCI'].map(brand => (
            <span key={brand} className="text-2xl font-display font-black tracking-tighter text-white">{brand}</span>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <section className="py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6 italic tracking-tight">Project-Ready Sourcing</h2>
            <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed">Integrated procurement tools that take you from architectural specs to final delivery.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { 
                step: '01', 
                title: 'Spec Analysis', 
                desc: 'Upload your BOM and our AI identifies matching materials from global verified manufacturers.',
                icon: Calculator
              },
              { 
                step: '02', 
                title: 'Volume Pricing', 
                desc: 'Unlock direct factory pricing by leveraging project volume across our global network.',
                icon: Zap
              },
              { 
                step: '03', 
                title: 'Jobsite Delivery', 
                desc: 'Real-time logistics tracking and phased delivery schedules managed by our freight engine.',
                icon: Truck
              }
            ].map((item, idx) => (
              <div key={idx} className="relative group p-10 bg-[#0F1623] border border-white/5 rounded-[32px] hover:border-amber-600/50 transition-all">
                <div className="absolute -top-6 left-10 text-6xl font-display font-black text-amber-600/10 group-hover:text-amber-600/20 transition-colors">
                  {item.step}
                </div>
                <div className="w-16 h-16 bg-amber-600/10 rounded-2xl flex items-center justify-center mb-8 border border-amber-600/20 group-hover:rotate-6 transition-transform">
                  <item.icon className="text-amber-600 w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold mb-4 font-display uppercase tracking-tight">{item.title}</h3>
                <p className="text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Calculator CTA / Trust Signals */}
      <section id="calculator" className="py-24 bg-[#0F1623]/50 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-16">
          <div className="max-w-md">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-600/10 text-amber-600 border border-amber-600/20 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
              NEW: PROJECT CALCULATOR
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">Estimate Project Savings in Seconds</h2>
            <p className="text-gray-400 mb-8 leading-relaxed">See how much you can save by bypassing local distributors and sourcing directly from global factories.</p>
            <Link to="/register" className="inline-flex items-center gap-2 text-amber-600 font-black uppercase tracking-widest hover:gap-4 transition-all">
              CALCULATE SAVINGS <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-6 w-full md:w-auto">
            {[
              { icon: Leaf, label: 'LEED', detail: 'GOLD COMPLIANT' },
              { icon: ShieldCheck, label: 'ASTM', detail: 'VERIFIED QUALITY' },
              { icon: Award, label: 'ANSI', detail: 'CERTIFIED SOURCE' },
              { icon: Globe, label: 'ESG', detail: 'TRACEABLE ORIGIN' }
            ].map((badge, i) => (
              <div key={i} className="px-8 py-6 bg-[#080C14] border border-white/10 rounded-2xl flex flex-col items-center text-center group hover:border-amber-600/30 transition-colors">
                <badge.icon className="w-6 h-6 text-amber-600 mb-4 group-hover:scale-110 transition-transform" />
                <span className="text-white font-bold text-lg leading-none mb-1 font-display">{badge.label}</span>
                <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest">{badge.detail}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main CTA Section */}
      <section className="py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative bg-gradient-to-br from-amber-600 to-amber-800 rounded-[48px] p-12 md:p-24 overflow-hidden text-center shadow-2xl shadow-amber-600/20">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M 0 100 L 100 0" stroke="white" strokeWidth="0.1" />
                <path d="M 0 80 L 80 0" stroke="white" strokeWidth="0.1" />
                <path d="M 20 100 L 100 20" stroke="white" strokeWidth="0.1" />
              </svg>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="relative z-10"
            >
              <h2 className="text-4xl md:text-6xl font-display font-extrabold text-[#080C14] mb-8 leading-tight">Ready to Modernize Your <br />Procurement Stack?</h2>
              <p className="text-[#080C14]/80 text-xl mb-12 max-w-xl mx-auto font-medium">
                Join 1,800+ general contractors who have eliminated middleman markups and secured their material pipelines.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link 
                  to="/register" 
                  className="px-12 py-5 bg-[#080C14] text-white rounded-full text-xl font-black hover:bg-black transition-all shadow-2xl uppercase tracking-widest"
                >
                  START SOURCING
                </Link>
                <Link 
                  to="/register" 
                  className="px-12 py-5 bg-white/20 text-[#080C14] border border-[#080C14]/10 rounded-full text-xl font-black hover:bg-white/30 transition-all uppercase tracking-widest"
                >
                  PROJECT DEMO
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#080C14] border-t border-white/5 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
            <div>
              <div className="flex items-center gap-2 mb-8">
                <div className="w-8 h-8 bg-amber-600 rounded-lg flex items-center justify-center">
                  <Building2 className="text-[#080C14] w-5 h-5 fill-current" />
                </div>
                <span className="text-xl font-display font-bold tracking-tight text-white uppercase">Build<span className="text-amber-600">Source</span></span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed mb-8">
                The leading global B2B marketplace for construction materials. Engineering the future of procurement.
              </p>
              <div className="flex gap-6">
                <Twitter className="w-5 h-5 text-gray-500 hover:text-amber-600 cursor-pointer transition-colors" />
                <Linkedin className="w-5 h-5 text-gray-500 hover:text-amber-600 cursor-pointer transition-colors" />
                <Github className="w-5 h-5 text-gray-500 hover:text-amber-600 cursor-pointer transition-colors" />
              </div>
            </div>
            <div>
              <h4 className="text-white font-bold mb-8 uppercase text-xs tracking-[0.2em]">Supply Chain</h4>
              <ul className="space-y-4 text-sm text-gray-500">
                <li className="hover:text-amber-600 cursor-pointer transition-colors">Material Catalog</li>
                <li className="hover:text-amber-600 cursor-pointer transition-colors">Verified Factories</li>
                <li className="hover:text-amber-600 cursor-pointer transition-colors">Global Logistics</li>
                <li className="hover:text-amber-600 cursor-pointer transition-colors">Live Market Data</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-8 uppercase text-xs tracking-[0.2em]">Compliance</h4>
              <ul className="space-y-4 text-sm text-gray-500">
                <li className="hover:text-amber-600 cursor-pointer transition-colors">ASTM Standards</li>
                <li className="hover:text-amber-600 cursor-pointer transition-colors">LEED Tracking</li>
                <li className="hover:text-amber-600 cursor-pointer transition-colors">Quality Control</li>
                <li className="hover:text-amber-600 cursor-pointer transition-colors">ESG Reporting</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-8 uppercase text-xs tracking-[0.2em]">Updates</h4>
              <p className="text-xs text-gray-500 mb-6">Stay ahead of material price volatility.</p>
              <div className="flex bg-[#0F1623] border border-white/10 rounded-xl p-1">
                <input type="email" placeholder="Work Email" className="bg-transparent border-none focus:ring-0 text-white text-sm px-4 flex-1" />
                <button className="bg-amber-600 hover:bg-amber-700 p-2.5 rounded-lg transition-colors"><Mail className="w-4 h-4 text-[#080C14]" /></button>
              </div>
            </div>
          </div>
          <div className="border-t border-white/5 pt-12 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] text-gray-600 font-black uppercase tracking-[0.3em]">
            <p>© 2026 BuildSource Exchange. All Rights Reserved.</p>
            <div className="flex gap-10">
              <span className="hover:text-white cursor-pointer transition-colors">Legal</span>
              <span className="hover:text-white cursor-pointer transition-colors">Privacy</span>
              <span className="hover:text-white cursor-pointer transition-colors">Accessibility</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BuildSourceLanding;
