import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusCircle, Tag, Camera, Truck, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';

const SellWizard = () => {
  const [step, setStep] = useState(1);
  const next = () => setStep(s => Math.min(s+1, 4));
  const back = () => setStep(s => Math.max(s-1, 1));

  return (
    <div className="max-w-2xl mx-auto px-4 py-24">
      <div className="mb-12 flex justify-between">
        {[1,2,3,4].map(i => <div key={i} className={`h-1 flex-grow mx-1 rounded ${step >= i ? 'bg-primary' : 'bg-surface-100'}`} />)}
      </div>

      <div className="bg-surface-50 border border-surface-100 rounded-[2.5rem] p-12">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="1" initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }} className="space-y-8">
              <div className="flex items-center gap-4"><Tag className="w-8 h-8 text-primary" /><h2 className="text-2xl font-black font-display uppercase italic">Asset Basics</h2></div>
              <div className="space-y-4">
                <input className="w-full bg-surface-100 border-surface-200 p-4 rounded-xl" placeholder="Listing Title (e.g. 20x Cisco Switches)" />
                <select className="w-full bg-surface-100 border-surface-200 p-4 rounded-xl">
                  <option>Select Category</option>
                  <option>Industrial</option>
                  <option>IT Assets</option>
                  <option>Vehicles</option>
                </select>
                <div className="grid grid-cols-2 gap-4">
                   <button className="p-4 border border-primary bg-primary/10 rounded-xl font-bold">Used</button>
                   <button className="p-4 border border-surface-200 rounded-xl font-bold">New</button>
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="2" initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }} className="space-y-8">
              <div className="flex items-center gap-4"><Camera className="w-8 h-8 text-primary" /><h2 className="text-2xl font-black font-display uppercase italic">Photos & Media</h2></div>
              <div className="aspect-video border-2 border-dashed border-surface-200 rounded-3xl flex flex-col items-center justify-center gap-4 hover:border-primary transition-colors cursor-pointer">
                <Camera className="w-12 h-12 text-surface-400" />
                <div className="text-sm font-bold text-surface-400">Drag & Drop photos or click to upload</div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="3" initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }} className="space-y-8">
              <div className="flex items-center gap-4"><Gavel className="w-8 h-8 text-primary" /><h2 className="text-2xl font-black font-display uppercase italic">Sale Configuration</h2></div>
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  {['Auction', 'Fixed', 'Lot'].map(type => <button key={type} className="p-4 border border-surface-200 rounded-xl font-black uppercase italic hover:border-primary">{type}</button>)}
                </div>
                <input className="w-full bg-surface-100 border-surface-200 p-4 rounded-xl" placeholder="Reserve / Asking Price (USD)" type="number" />
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="4" initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }} className="space-y-8">
              <div className="flex items-center gap-4"><Truck className="w-8 h-8 text-primary" /><h2 className="text-2xl font-black font-display uppercase italic">Logistics</h2></div>
              <div className="space-y-4">
                <input className="w-full bg-surface-100 border-surface-200 p-4 rounded-xl" placeholder="Pickup Address" />
                <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl text-xs font-bold leading-relaxed">
                  SurplusOS handles all logistics. Once the auction ends, our carrier will contact you for pickup within 48 hours.
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-12 flex justify-between">
          <button onClick={back} className={`btn btn-secondary ${step === 1 ? 'opacity-0' : ''}`}><ArrowLeft /></button>
          <button onClick={next} className="btn btn-primary px-10">{step === 4 ? 'Submit Listing' : 'Next'} <ArrowRight /></button>
        </div>
      </div>
    </div>
  );
};
export default SellWizard;
