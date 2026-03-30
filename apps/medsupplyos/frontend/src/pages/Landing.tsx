import React from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  ShieldCheck, 
  Heart, 
  Stethoscope, 
  ChevronRight, 
  ArrowRight, 
  Search, 
  Database, 
  Truck, 
  Lock, 
  FileCheck,
  Award,
  Users,
  Building,
  Mail,
  Linkedin,
  Twitter,
  Github,
  Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';

const MedSupplyLanding: React.FC = () => {
  return (
    <div className="flex flex-col bg-[#080C14] text-white font-sans selection:bg-blue-600/30">
      {/* Sticky Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#080C14]/80 backdrop-blur-xl border-b border-white/5 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Activity className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-display font-bold tracking-tight">MEDSUPPLY<span className="text-blue-600">OS</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400 uppercase tracking-widest">
            <a href="#solutions" className="hover:text-white transition-colors">Solutions</a>
            <a href="#categories" className="hover:text-white transition-colors">Categories</a>
            <a href="#compliance" className="hover:text-white transition-colors">Compliance</a>
          </div>
          <Link 
            to="/register" 
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-xs font-black transition-all shadow-lg shadow-blue-600/20 uppercase tracking-widest"
          >
            START SOURCING
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-32 pb-20 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 opacity-20 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-600 rounded-full blur-[140px] animate-pulse-slow" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-900 rounded-full blur-[140px] animate-pulse-slow" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black bg-blue-600/10 text-blue-500 border border-blue-600/20 mb-8 tracking-[0.2em] uppercase">
                Clinical Grade Procurement
              </span>
              <h1 className="text-6xl lg:text-8xl font-display font-extrabold text-white leading-[1.05] mb-8 tracking-tight">
                FDA-Cleared <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 animate-gradient">
                  Medical Supply.
                </span>
              </h1>
              <p className="text-xl text-gray-400 mb-10 max-w-lg leading-relaxed">
                The trusted B2B exchange for healthcare systems. 
                Join 1,200+ hospitals accessing 180K+ medical devices with GPO contract pricing.
              </p>

              <div className="flex items-center gap-10 mb-12">
                <div>
                  <div className="text-3xl font-display font-bold text-white">180K+</div>
                  <div className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Devices</div>
                </div>
                <div className="w-px h-10 bg-white/10" />
                <div>
                  <div className="text-3xl font-display font-bold text-white">450+</div>
                  <div className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Factories</div>
                </div>
                <div className="w-px h-10 bg-white/10" />
                <div>
                  <div className="text-3xl font-display font-bold text-white">100%</div>
                  <div className="text-[10px] text-gray-500 font-black uppercase tracking-widest">FDA Verified</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register" className="px-10 py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-lg font-black transition-all shadow-2xl shadow-blue-600/30 uppercase tracking-widest flex items-center justify-center gap-2">
                  REQUEST A DEMO <ArrowRight className="w-5 h-5" />
                </Link>
                <Link to="/register" className="px-10 py-5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-full text-lg font-black transition-all uppercase tracking-widest flex items-center justify-center gap-2">
                  VIEW GPO CONTRACTS
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative hidden lg:block"
            >
              <div id="categories" className="grid grid-cols-2 gap-4">
                 {[
                   { icon: Stethoscope, label: 'DIAGNOSTIC', count: '12k items' },
                   { icon: Heart, label: 'CARDIOLOGY', count: '8k items' },
                   { icon: Activity, label: 'SURGICAL', count: '45k items' },
                   { icon: Database, label: 'LABORATORY', count: 'Global' }
                 ].map((item, i) => (
                   <div key={i} className="group p-8 bg-[#0F1623] border border-white/5 rounded-[32px] hover:border-blue-600/50 transition-all card-hover">
                     <div className="w-14 h-14 bg-blue-600/10 rounded-2xl flex items-center justify-center mb-6 border border-blue-600/20 group-hover:scale-110 transition-transform">
                       <item.icon className="w-7 h-7 text-blue-600" />
                     </div>
                     <div className="text-lg font-display font-black text-white mb-1 uppercase tracking-tight">{item.label}</div>
                     <div className="text-xs text-gray-500 font-bold uppercase tracking-widest">{item.count}</div>
                   </div>
                 ))}
              </div>
              <div className="absolute -top-10 -right-10 bg-blue-600 p-6 rounded-3xl shadow-2xl animate-float">
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                     <ShieldCheck className="text-white w-6 h-6" />
                   </div>
                   <div>
                     <div className="text-[10px] text-white/70 font-black uppercase tracking-widest">Regulatory Status</div>
                     <div className="text-lg font-display font-bold text-white italic">FDA COMPLIANT</div>
                   </div>
                 </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Social Proof Bar */}
      <div className="bg-[#0F1623] border-y border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-4 overflow-hidden">
          <p className="text-center text-[10px] uppercase tracking-[0.3em] font-black text-gray-600 mb-10">Powering Leading Healthcare Networks</p>
          <div className="flex flex-wrap justify-center gap-12 md:gap-24 opacity-40 grayscale hover:grayscale-0 transition-all">
            {['Mayo Clinic', 'Cleveland Clinic', 'Kaiser Permanente', 'Mount Sinai', 'Mass General', 'Johns Hopkins'].map(brand => (
              <span key={brand} className="text-2xl font-display font-black tracking-tighter text-white">{brand}</span>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <section className="py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6 tracking-tight">Clinical Procurement <br />Refined</h2>
            <p className="text-gray-400 max-w-xl mx-auto leading-relaxed">Secure, traceable, and FDA-verified workflows for critical healthcare supply chains.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { 
                step: '01', 
                title: 'FDA Verification', 
                desc: 'Every item in our marketplace is cross-referenced with the FDA 510(k) and PMA databases.',
                icon: FileCheck
              },
              { 
                step: '02', 
                title: 'Contract Pricing', 
                desc: 'Automatically apply your GPO and IDN contract pricing to every purchase request.',
                icon: Award
              },
              { 
                step: '03', 
                title: 'Cold-Chain Delivery', 
                desc: 'Specialized medical logistics ensuring clinical integrity from factory to facility.',
                icon: Truck
              }
            ].map((item, idx) => (
              <div key={idx} className="relative group p-10 bg-[#0F1623] border border-white/5 rounded-[32px] hover:border-blue-600/50 transition-all">
                <div className="absolute top-8 right-10 text-6xl font-display font-black text-blue-600/5 group-hover:text-blue-600/10 transition-colors">
                  {item.step}
                </div>
                <div className="w-16 h-16 bg-blue-600/10 rounded-2xl flex items-center justify-center mb-8 border border-blue-600/20 group-hover:scale-110 transition-transform">
                  <item.icon className="text-blue-600 w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 font-display uppercase tracking-tight">{item.title}</h3>
                <p className="text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Compliance Section */}
      <section id="compliance" className="py-24 bg-[#0F1623]/50 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="max-w-md">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">Institutional Security</h2>
            <p className="text-gray-400 mb-6">Our platform is engineered to exceed the rigorous security and data privacy standards of the healthcare industry.</p>
            <div className="flex gap-4">
               <span className="flex items-center gap-1.5 text-xs font-bold text-blue-500 uppercase tracking-widest"><ShieldCheck className="w-4 h-4" /> HIPAA SECURE</span>
               <span className="flex items-center gap-1.5 text-xs font-bold text-blue-500 uppercase tracking-widest"><ShieldCheck className="w-4 h-4" /> ISO 13485</span>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {[
              { label: 'FDA', detail: 'VERIFIED' },
              { label: 'GPO', detail: 'ENABLED' },
              { label: 'HIPAA', detail: 'SECURE' },
              { label: 'SOC2', detail: 'TYPE II' }
            ].map(badge => (
              <div key={badge.label} className="px-8 py-6 bg-[#080C14] border border-white/10 rounded-2xl text-center group hover:border-blue-600/30 transition-colors">
                <div className="text-blue-600 font-display font-black text-xl mb-1">{badge.label}</div>
                <div className="text-[10px] text-gray-500 uppercase font-bold tracking-[0.2em]">{badge.detail}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[48px] p-12 md:p-24 overflow-hidden text-center shadow-2xl shadow-blue-600/20">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                 <circle cx="50" cy="50" r="40" fill="none" stroke="white" strokeWidth="0.1" strokeDasharray="1 2" />
                 <circle cx="50" cy="50" r="30" fill="none" stroke="white" strokeWidth="0.1" />
              </svg>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="relative z-10"
            >
              <h2 className="text-4xl md:text-6xl font-display font-extrabold text-white mb-8">Ready to Optimize Your <br />Health System's Supply Chain?</h2>
              <p className="text-white/80 text-xl mb-12 max-w-xl mx-auto">
                Join 1,200+ healthcare facilities who have streamlined their procurement and reduced operational friction.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link 
                  to="/register" 
                  className="px-12 py-5 bg-white text-blue-700 rounded-full text-xl font-black hover:bg-gray-100 transition-all shadow-2xl uppercase tracking-widest"
                >
                  START SOURCING
                </Link>
                <Link 
                  to="/register" 
                  className="px-12 py-5 bg-white/10 text-white border border-white/20 rounded-full text-xl font-black hover:bg-white/20 transition-all uppercase tracking-widest"
                >
                  REQUEST A DEMO
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
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Activity className="text-white w-5 h-5" />
                </div>
                <span className="text-xl font-display font-bold tracking-tight text-white">MEDSUPPLY<span className="text-blue-600">OS</span></span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed mb-8">
                The leading global B2B marketplace for clinical medical supplies. Verified, compliant, and institutional-ready.
              </p>
              <div className="flex gap-6">
                <Twitter className="w-5 h-5 text-gray-500 hover:text-blue-600 cursor-pointer transition-colors" />
                <Linkedin className="w-5 h-5 text-gray-500 hover:text-blue-600 cursor-pointer transition-colors" />
                <Github className="w-5 h-5 text-gray-500 hover:text-blue-600 cursor-pointer transition-colors" />
              </div>
            </div>
            <div>
              <h4 className="text-white font-bold mb-8 uppercase text-xs tracking-[0.2em]">Medical Supply</h4>
              <ul className="space-y-4 text-sm text-gray-500">
                <li className="hover:text-blue-600 cursor-pointer transition-colors">Catalog Directory</li>
                <li className="hover:text-blue-600 cursor-pointer transition-colors">GPO Contracts</li>
                <li className="hover:text-blue-600 cursor-pointer transition-colors">Manufacturer Portal</li>
                <li className="hover:text-blue-600 cursor-pointer transition-colors">Phased Logistics</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-8 uppercase text-xs tracking-[0.2em]">Compliance</h4>
              <ul className="space-y-4 text-sm text-gray-500">
                <li className="hover:text-blue-600 cursor-pointer transition-colors">FDA 510(k) Status</li>
                <li className="hover:text-blue-600 cursor-pointer transition-colors">HIPAA Compliance</li>
                <li className="hover:text-blue-600 cursor-pointer transition-colors">Traceability Reports</li>
                <li className="hover:text-blue-600 cursor-pointer transition-colors">Recall Management</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-8 uppercase text-xs tracking-[0.2em]">Newsletter</h4>
              <p className="text-xs text-gray-500 mb-6">Receive regulatory updates and supply chain alerts.</p>
              <div className="flex bg-[#0F1623] border border-white/10 rounded-xl p-1">
                <input type="email" placeholder="Email" className="bg-transparent border-none focus:ring-0 text-white text-sm px-4 flex-1" />
                <button className="bg-blue-600 hover:bg-blue-700 p-2.5 rounded-lg transition-colors"><Mail className="w-4 h-4 text-white" /></button>
              </div>
            </div>
          </div>
          <div className="border-t border-white/5 pt-12 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] text-gray-600 font-black uppercase tracking-[0.3em]">
            <p>© 2026 MedSupplyOS Exchange. All Rights Reserved.</p>
            <div className="flex gap-10">
              <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
              <span className="hover:text-white cursor-pointer transition-colors">Terms of Use</span>
              <span className="hover:text-white cursor-pointer transition-colors">Accessibility</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MedSupplyLanding;
