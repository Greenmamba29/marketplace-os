import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Network, Server, Shield, Globe, Cpu, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';

const RFQWizard = () => {
  const [step, setStep] = useState(1);
  const next = () => setStep(s => Math.min(s+1, 4));
  const back = () => setStep(s => Math.max(s-1, 1));

  return (
    <div className="max-w-2xl mx-auto px-4 py-24">
      <div className="flex items-center justify-between mb-16">
        {[1,2,3,4].map(i => (
          <div key={i} className={`w-12 h-1 rounded-full ${step >= i ? 'bg-primary' : 'bg-surface-100'}`} />
        ))}
      </div>

      <div className="bg-surface-50 border border-surface-100 rounded-[3rem] p-12">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="1" initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} exit={{opacity:0, x:-20}} className="space-y-8">
              <div className="flex items-center gap-4"><Network className="w-8 h-8 text-primary"/><h2 className="text-2xl font-black font-display uppercase italic">Network Type</h2></div>
              <div className="grid grid-cols-2 gap-4">
                {['Enterprise', 'Data Center', 'Carrier', 'SMB'].map(type => (
                  <button key={type} className="p-6 border border-surface-200 rounded-2xl font-black uppercase italic hover:border-primary transition-all text-left">
                    <div className="text-lg mb-1">{type}</div>
                    <div className="text-[10px] text-surface-400 normal-case font-medium">Core, Aggregation & Access</div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="2" initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} exit={{opacity:0, x:-20}} className="space-y-8">
               <div className="flex items-center gap-4"><Cpu className="w-8 h-8 text-primary"/><h2 className="text-2xl font-black font-display uppercase italic">Equipment List</h2></div>
               <div className="space-y-4">
                 <textarea className="w-full bg-surface-100 border-surface-200 p-4 rounded-2xl h-32" placeholder="Paste your BOM (Bill of Materials) here or list part numbers..."></textarea>
                 <div className="text-xs text-surface-400 font-bold italic">Example: 4x C9300-48P-A, 2x C9300-NM-8X</div>
               </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="3" initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} exit={{opacity:0, x:-20}} className="space-y-8">
               <div className="flex items-center gap-4"><Globe className="w-8 h-8 text-primary"/><h2 className="text-2xl font-black font-display uppercase italic">Deployment Timeline</h2></div>
               <div className="space-y-6">
                 {['Immediate (Critical Spares)', '1-2 Weeks', '1 Month', 'Project Based (3+ Months)'].map(t => (
                   <button key={t} className="w-full p-4 border border-surface-200 rounded-xl text-left font-bold hover:border-primary">{t}</button>
                 ))}
               </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="4" initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} exit={{opacity:0, x:-20}} className="space-y-8">
               <div className="flex items-center gap-4"><Shield className="w-8 h-8 text-primary"/><h2 className="text-2xl font-black font-display uppercase italic">Compliance & Budget</h2></div>
               <div className="space-y-6">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" className="w-5 h-5 accent-primary" />
                    <span className="font-bold text-sm">Require TAA / NDAA Compliant hardware</span>
                  </label>
                  <input className="w-full bg-surface-100 border-surface-200 p-4 rounded-xl" placeholder="Budget Estimate (Optional)" type="number" />
               </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-16 flex justify-between">
          <button onClick={back} className={`btn btn-secondary ${step === 1 ? 'opacity-0' : ''}`}><ArrowLeft /></button>
          <button onClick={next} className="btn btn-primary px-10 uppercase italic tracking-widest">{step === 4 ? 'Submit BOM' : 'Next'} <ArrowRight/></button>
        </div>
      </div>
    </div>
  );
};
export default RFQWizard;
