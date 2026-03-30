import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Hexagon, Layers, Ship, Building2, CheckCircle2, ArrowRight, ArrowLeft, FileText, Globe, Truck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

export default function RFQWizard() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [buyerType, setBuyerType] = useState<string | null>(null);
  
  const buyerTypes = [
    { id: 'Battery Manufacturer', icon: Layers, label: 'BATTERY PRODUCER', desc: 'Direct cathode manufacturing feedstock' },
    { id: 'Chemical Company', icon: Hexagon, label: 'CHEMICAL PROCESSOR', desc: 'Intermediate compound manufacturing' },
    { id: 'Trader', icon: Globe, label: 'COMMODITY TRADER', desc: 'Arbitrage & supply chain distribution' },
    { id: 'Research', icon: Ship, label: 'R&D INSTITUTION', desc: 'Sample quantities for prototyping' }
  ];

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);
  const handleSubmit = () => {
    toast.success('Trade Request Submitted');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-surface pt-24 pb-32">
      <div className="max-w-4xl mx-auto px-4">
        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-20">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex flex-col items-center gap-4 relative z-10">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-mono text-lg font-black border-2 transition-all duration-500 ${
                step >= s ? 'bg-primary border-primary text-white shadow-[0_0_20px_rgba(124,58,237,0.5)]' : 'bg-surface border-surface-200 text-surface-400'
              }`}>
                {step > s ? <CheckCircle2 className="w-6 h-6" /> : s}
              </div>
              <span className={`text-[10px] font-mono uppercase font-black tracking-[0.2em] ${step >= s ? 'text-primary' : 'text-surface-400'}`}>
                {s === 1 ? 'Entity' : s === 2 ? 'Terms' : 'Confirm'}
              </span>
            </div>
          ))}
          <div className="absolute left-1/2 -translate-x-1/2 w-full max-w-md h-0.5 bg-surface-200 -z-0">
            <div className="h-full bg-primary transition-all duration-500 shadow-[0_0_10px_rgba(124,58,237,0.3)]" style={{ width: `${((step - 1) / 2) * 100}%` }} />
          </div>
        </div>

        <div className="bg-surface-50 border border-surface-200 rounded-[2.5rem] p-12">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="s1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <h2 className="text-4xl font-display font-black text-white mb-4">WHO ARE YOU?</h2>
                <p className="text-surface-400 mb-12">Identify your role in the lithium value chain</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {buyerTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.id}
                        onClick={() => { setBuyerType(type.id); handleNext(); }}
                        className={`p-8 border-2 rounded-[2rem] flex flex-col gap-6 transition-all text-left ${
                          buyerType === type.id ? 'bg-primary/5 border-primary shadow-[0_0_30px_rgba(124,58,237,0.1)]' : 'bg-surface border-surface-200 hover:border-surface-300'
                        }`}
                      >
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${buyerType === type.id ? 'bg-primary text-white' : 'bg-surface-100 text-surface-400'}`}>
                          <Icon className="w-10 h-10" />
                        </div>
                        <div>
                          <p className="text-lg font-display font-bold text-white">{type.label}</p>
                          <p className="text-xs text-surface-400 leading-relaxed">{type.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="s2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <h2 className="text-4xl font-display font-black text-white mb-4">TRADE TERMS</h2>
                <p className="text-surface-400 mb-12">Specify volume, grade, and delivery requirements</p>
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-[10px] font-mono font-black text-primary uppercase mb-4 tracking-widest">Target Volume (MT)</label>
                      <input type="text" className="w-full bg-surface border border-surface-200 rounded-2xl p-5 text-white focus:border-primary outline-none" placeholder="e.g. 500" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono font-black text-primary uppercase mb-4 tracking-widest">Incoterms</label>
                      <select className="w-full bg-surface border border-surface-200 rounded-2xl p-5 text-white focus:border-primary outline-none appearance-none">
                        <option>CIF (Cost, Insurance, Freight)</option>
                        <option>FOB (Free on Board)</option>
                        <option>DDP (Delivered Duty Paid)</option>
                        <option>EXW (Ex Works)</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono font-black text-primary uppercase mb-4 tracking-widest">Technical Specifications</label>
                    <textarea className="w-full h-40 bg-surface border border-surface-200 rounded-2xl p-5 text-white focus:border-primary outline-none resize-none" placeholder="Enter purity requirements, trace element limits, etc..." />
                  </div>
                </div>
                <div className="flex justify-between mt-12">
                  <button onClick={handleBack} className="px-10 py-5 bg-surface-100 text-white font-bold rounded-2xl flex items-center gap-2 uppercase tracking-widest text-xs">
                    <ArrowLeft className="w-4 h-4" /> BACK
                  </button>
                  <button onClick={handleNext} className="px-12 py-5 bg-primary text-white font-black rounded-2xl flex items-center gap-2 uppercase tracking-widest text-xs">
                    REVIEW TERMS <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="s3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <h2 className="text-4xl font-display font-black text-white mb-4">CONFIRM QUOTE</h2>
                <p className="text-surface-400 mb-12">Verify your trade position details</p>
                <div className="bg-surface border border-surface-200 rounded-3xl p-8 mb-12 space-y-6">
                  <div className="flex justify-between py-4 border-b border-surface-200/50">
                    <span className="text-surface-400 uppercase text-xs font-black">Entity Type</span>
                    <span className="text-white font-bold">{buyerType}</span>
                  </div>
                  <div className="flex justify-between py-4 border-b border-surface-200/50">
                    <span className="text-surface-400 uppercase text-xs font-black">Market Route</span>
                    <span className="text-white font-bold">Direct from Source</span>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-primary/10 border border-primary/20 rounded-2xl">
                    <Truck className="w-6 h-6 text-primary" />
                    <p className="text-xs text-primary font-bold leading-relaxed">Quotes will include full logistics from extraction point to destination port.</p>
                  </div>
                </div>
                <div className="flex justify-between">
                  <button onClick={handleBack} className="px-10 py-5 bg-surface-100 text-white font-bold rounded-2xl flex items-center gap-2 uppercase tracking-widest text-xs">
                    <ArrowLeft className="w-4 h-4" /> BACK
                  </button>
                  <button onClick={handleSubmit} className="px-14 py-5 bg-primary text-white font-black rounded-2xl flex items-center gap-2 uppercase tracking-widest text-xs shadow-[0_0_40px_rgba(124,58,237,0.5)]">
                    ISSUE TRADE RFQ <FileText className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
