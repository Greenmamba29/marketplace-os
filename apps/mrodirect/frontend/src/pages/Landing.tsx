import React from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  ChevronRight, 
  Package, 
  Truck, 
  ShieldCheck, 
  BarChart3, 
  Factory, 
  ShoppingCart, 
  ArrowRight,
  Globe,
  Zap,
  CheckCircle2,
  Lock,
  Mail,
  Linkedin,
  Twitter,
  Github
} from 'lucide-react';
import { Link } from 'react-router-dom';

const MRODirectLanding: React.FC = () => {
  return (
    <div className="flex flex-col bg-[#080C14] text-white font-sans selection:bg-orange-500/30">
      {/* Sticky Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#080C14]/80 backdrop-blur-xl border-b border-white/5 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <Factory className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-display font-bold tracking-tight">MRO<span className="text-orange-500">DIRECT</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
            <a href="#features" className="hover:text-white transition-colors">Solutions</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How it Works</a>
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
            className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-full text-sm font-bold transition-all shadow-lg shadow-orange-500/20"
          >
            START SOURCING
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-32 pb-20 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 opacity-20">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-orange-500 rounded-full blur-[120px] animate-pulse-slow" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600 rounded-full blur-[120px] animate-pulse-slow" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold bg-orange-500/10 text-orange-500 border border-orange-500/20 mb-8 tracking-widest uppercase">
                Enterprise Industrial Sourcing
              </span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-6xl md:text-8xl font-display font-extrabold leading-[1.05] mb-8 tracking-tight"
            >
              Source 2.4M Industrial <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 animate-gradient">
                Parts with Precision.
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed"
            >
              The world's most advanced B2B marketplace for MRO parts. 
              Join 2,400+ verified buyers managing global supply chains.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="relative max-w-2xl mx-auto mb-16"
            >
              <div className="absolute inset-0 bg-orange-500/20 blur-2xl -z-10 rounded-2xl" />
              <div className="flex p-2 bg-[#0F1623] border border-white/10 rounded-2xl shadow-2xl">
                <div className="flex-1 flex items-center px-4">
                  <Search className="text-gray-500 w-5 h-5 mr-3" />
                  <input 
                    type="text" 
                    placeholder="Search by part number, SKU, or keyword..." 
                    className="w-full bg-transparent border-none focus:ring-0 text-white placeholder-gray-500 py-3"
                  />
                </div>
                <Link to="/register" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2">
                  SEARCH <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="mt-4 flex flex-wrap justify-center gap-4 text-xs font-medium text-gray-500">
                <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-orange-500" /> Verified Pricing</span>
                <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-orange-500" /> Fast RFQ Response</span>
                <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-orange-500" /> OEM Certified</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Floating Badges */}
        <div className="absolute bottom-10 left-0 right-0 z-20">
          <div className="max-w-7xl mx-auto px-4 flex justify-between items-center opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
             {/* Stat badges */}
             <div className="flex gap-12">
                <div>
                  <div className="text-2xl font-bold font-mono text-white">$4.2B+</div>
                  <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Annual GMV</div>
                </div>
                <div>
                  <div className="text-2xl font-bold font-mono text-white">12,400+</div>
                  <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Suppliers</div>
                </div>
                <div>
                  <div className="text-2xl font-bold font-mono text-white">48hr</div>
                  <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Avg. Ship</div>
                </div>
             </div>
             <div className="flex gap-8 items-center">
                <span className="text-xs font-bold text-gray-400">PARTNERS:</span>
                <div className="flex gap-6">
                  <Globe className="w-6 h-6" />
                  <Zap className="w-6 h-6" />
                  <ShieldCheck className="w-6 h-6" />
                  <BarChart3 className="w-6 h-6" />
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Social Proof Bar */}
      <div className="bg-[#0F1623] border-y border-white/5 py-12 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-center text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500 mb-8">Trusted by Global Manufacturing Leaders</p>
          <div className="flex flex-wrap justify-center gap-12 md:gap-24 opacity-50">
            {['Siemens', 'Caterpillar', '3M', 'Honeywell', 'General Electric', 'Bosch'].map(brand => (
              <span key={brand} className="text-2xl font-display font-black tracking-tighter text-white">{brand}</span>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-32 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 italic">How MRODirect Elevates Sourcing</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Streamlined procurement workflows designed for the modern industrial enterprise.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { 
                step: '01', 
                title: 'Smart Search', 
                desc: 'Access 2.4M parts with real-time inventory and deep technical specifications.',
                icon: Search
              },
              { 
                step: '02', 
                title: 'Unified RFQ', 
                desc: 'Request quotes from multiple verified suppliers with a single click.',
                icon: Zap
              },
              { 
                step: '03', 
                title: 'Compliance-First', 
                desc: 'Every part comes with automated ISO/OSHA documentation and tracking.',
                icon: ShieldCheck
              }
            ].map((item, idx) => (
              <div key={idx} className="relative group p-10 bg-[#0F1623] border border-white/5 rounded-[32px] hover:border-orange-500/50 transition-all">
                <div className="absolute -top-6 left-10 text-6xl font-display font-black text-orange-500/10 group-hover:text-orange-500/20 transition-colors">
                  {item.step}
                </div>
                <div className="w-14 h-14 bg-orange-500/10 rounded-2xl flex items-center justify-center mb-8 border border-orange-500/20 group-hover:scale-110 transition-transform">
                  <item.icon className="text-orange-500 w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold mb-4 font-display">{item.title}</h3>
                <p className="text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Signals & Compliance */}
      <section id="compliance" className="py-24 bg-[#0F1623]/50 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-12">
          <div>
            <h2 className="text-3xl font-display font-bold mb-4">Industrial Grade Trust</h2>
            <p className="text-gray-400">Global compliance and security standards are baked into every transaction.</p>
          </div>
          <div className="flex flex-wrap gap-8 justify-center">
            {[
              { label: 'ISO 9001', detail: 'Certified' },
              { label: 'OSHA', detail: 'Compliant' },
              { label: 'NIST', detail: 'Security' },
              { label: 'SOC2', detail: 'Type II' }
            ].map(badge => (
              <div key={badge.label} className="px-6 py-4 bg-[#080C14] border border-white/10 rounded-xl flex flex-col items-center">
                <span className="text-orange-500 font-bold text-lg leading-none mb-1">{badge.label}</span>
                <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest">{badge.detail}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative bg-gradient-to-br from-orange-500 to-orange-700 rounded-[48px] p-12 md:p-24 overflow-hidden text-center">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
                </pattern>
                <rect width="100" height="100" fill="url(#grid)" />
              </svg>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="relative z-10"
            >
              <h2 className="text-4xl md:text-6xl font-display font-extrabold text-white mb-8">Ready to Optimize Your <br />Industrial Supply Chain?</h2>
              <p className="text-white/80 text-lg mb-12 max-w-xl mx-auto">
                Join 2,400+ procurement officers who have revolutionized their MRO sourcing with our platform.
              </p>
              <Link 
                to="/register" 
                className="inline-flex items-center gap-3 bg-white text-orange-600 px-10 py-5 rounded-full text-xl font-bold hover:bg-gray-100 transition-all shadow-2xl shadow-white/20"
              >
                REQUEST A DEMO <ArrowRight className="w-6 h-6" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#080C14] border-t border-white/5 pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                  <Factory className="text-white w-5 h-5" />
                </div>
                <span className="text-xl font-display font-bold tracking-tight text-white">MRO<span className="text-orange-500">DIRECT</span></span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                The leading B2B marketplace for MRO and industrial components. Powering Industry 4.0 globally.
              </p>
              <div className="flex gap-4">
                <Twitter className="w-5 h-5 text-gray-500 hover:text-orange-500 cursor-pointer" />
                <Linkedin className="w-5 h-5 text-gray-500 hover:text-orange-500 cursor-pointer" />
                <Github className="w-5 h-5 text-gray-500 hover:text-orange-500 cursor-pointer" />
              </div>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6">Marketplace</h4>
              <ul className="space-y-4 text-sm text-gray-500">
                <li className="hover:text-orange-500 cursor-pointer">Browse Categories</li>
                <li className="hover:text-orange-500 cursor-pointer">Supplier Directory</li>
                <li className="hover:text-orange-500 cursor-pointer">Live RFQs</li>
                <li className="hover:text-orange-500 cursor-pointer">Custom Solutions</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6">Company</h4>
              <ul className="space-y-4 text-sm text-gray-500">
                <li className="hover:text-orange-500 cursor-pointer">About Us</li>
                <li className="hover:text-orange-500 cursor-pointer">Compliance</li>
                <li className="hover:text-orange-500 cursor-pointer">Careers</li>
                <li className="hover:text-orange-500 cursor-pointer">Contact</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6">Subscribe</h4>
              <p className="text-sm text-gray-500 mb-4">Get the latest industrial insights and price trends.</p>
              <div className="flex bg-[#0F1623] border border-white/10 rounded-xl p-1">
                <input type="email" placeholder="Email" className="bg-transparent border-none focus:ring-0 text-white text-sm px-3 flex-1" />
                <button className="bg-orange-500 hover:bg-orange-600 p-2 rounded-lg"><Mail className="w-4 h-4 text-white" /></button>
              </div>
            </div>
          </div>
          <div className="border-t border-white/5 pt-10 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-gray-600 font-bold uppercase tracking-[0.2em]">
            <p>© 2026 MRODirect Marketplace OS. All rights reserved.</p>
            <div className="flex gap-8">
              <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
              <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MRODirectLanding;
