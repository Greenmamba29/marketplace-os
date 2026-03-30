import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Lock, Map, Globe, Database, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';

const RFQWizard = () => {
  const [step, setStep] = useState(1);
  const next = () => setStep(s => Math.min(s+1, 4));
  const back = () => setStep(s => Math.max(s-1, 1));

  return (
    <div className="max-w-3xl mx-auto px-4 py-24">
      <div className="grid grid-cols-4 gap-4 mb-16">
        {[1,2,3,4].map(i => <div key={i} className={`h-1.5 rounded-full ${step >= i ? 'bg-primary' : 'bg-surface-100'}`} />)}
      </div>

      <div className="bg-surface-50 border border-surface-100 rounded-[3rem] p-16">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="1" initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-20}} className="space-y-10">
              <div className="flex items-center gap-5"><Map className="w-10 h-10 text-primary"/><h2 className="text-3xl font-black font-display uppercase italic">Facility Type</h2></div>
              <div className="grid grid-cols-2 gap-4">
                {['Office/Commercial', 'Data Center', 'Government', 'Retail', 'Healthcare', 'Critical Infra'].map(type => (
                  <button key={type} className="p-8 border border-surface-200 rounded-3xl font-black uppercase italic hover:border-primary text-left bg-surface/50 hover:bg-surface-100 transition-all">
                    {type}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="2" initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-20}} className="space-y-10">
               <div className="flex items-center gap-5"><Lock className="w-10 h-10 text-primary"/><h2 className="text-3xl font-black font-display uppercase italic">Security Zones</h2></div>
               <div className="space-y-4">
                 <p className="text-surface-400 font-bold uppercase text-[10px] tracking-[0.2em] mb-4">Select all that apply</p>
                 {['External Perimeter', 'Entry Points', 'Main Lobby', 'Restricted Server Rooms', 'Warehouse/Storage', 'Executive Suites'].map(zone => (
                   <label key={zone} className="flex items-center justify-between p-4 bg-surface-100 rounded-xl border border-surface-200 cursor-pointer group hover:border-primary transition-all">
                     <span className="font-bold uppercase italic text-sm">{zone}</span>
                     <input type="checkbox" className="w-6 h-6 accent-primary" />
                   </label>
                 ))}
               </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="3" initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-20}} className="space-y-10">
               <div className="flex items-center gap-5"><Shield className="w-10 h-10 text-primary"/><h2 className="text-3xl font-black font-display uppercase italic">Compliance</h2></div>
               <div className="space-y-4">
                 {['NDAA Compliant Hardware Only', 'FIPS 201 Level 3 Required', 'HIPAA/Privacy Compliance', 'SOC2 / Type II Verification'].map(c => (
                   <label key={c} className="flex items-center gap-4 p-4 border border-surface-200 rounded-xl font-bold text-sm italic uppercase tracking-wider cursor-pointer hover:bg-surface-100">
                     <input type="checkbox" className="w-5 h-5 accent-primary" /> {c}
                   </label>
                 ))}
               </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="4" initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-20}} className="space-y-10">
               <div className="flex items-center gap-5"><Database className="w-10 h-10 text-primary"/><h2 className="text-3xl font-black font-display uppercase italic">Project Scale</h2></div>
               <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-surface-400">Estimated Camera/Node Count</label>
                    <input className="w-full bg-surface-100 border-surface-200 p-4 rounded-xl" placeholder="e.g. 150" type="number" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-surface-400">Estimated Project Budget</label>
                    <input className="w-full bg-surface-100 border-surface-200 p-4 rounded-xl" placeholder="e.g. 50,000" type="number" />
                  </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-20 flex justify-between">
          <button onClick={back} className={`btn btn-secondary px-10 italic uppercase ${step === 1 ? 'opacity-0 pointer-events-none' : ''}`}><ArrowLeft className="mr-2"/> Previous</button>
          <button onClick={next} className="btn btn-primary px-16 italic uppercase font-black text-xl">{step === 4 ? 'Submit Project' : 'Continue'} <ArrowRight className="ml-2"/></button>
        </div>
      </div>
    </div>
  );
};
export default RFQWizard;
