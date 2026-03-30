import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, CheckCircle, Package, Settings, Globe, DollarSign } from 'lucide-react';

const RFQWizard = () => {
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  const nextStep = () => setStep(s => Math.min(s + 1, totalSteps));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  return (
    <div className="max-w-3xl mx-auto px-4 py-24">
      <div className="mb-12">
        <div className="flex items-center justify-between mb-8">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${
                step >= i ? 'bg-primary text-white' : 'bg-surface-50 text-surface-400'
              }`}>
                {step > i ? <CheckCircle className="w-6 h-6" /> : i}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-surface-50 border border-surface-100 rounded-3xl p-8 md:p-12 relative overflow-hidden">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-primary/10 rounded-xl text-primary"><Package /></div>
                <div>
                  <h2 className="text-2xl font-bold font-display">Equipment Type</h2>
                  <p className="text-surface-400 text-sm">What are you looking for?</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {['Excavator', 'Crane', 'Dozer', 'Loader', 'Generator', 'Other'].map(type => (
                  <button key={type} className="p-4 border border-surface-200 rounded-xl text-left hover:border-primary transition-colors">
                    {type}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
               <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-primary/10 rounded-xl text-primary"><Settings /></div>
                <div>
                  <h2 className="text-2xl font-bold font-display">Specifications</h2>
                  <p className="text-surface-400 text-sm">Technical requirements</p>
                </div>
              </div>
              <div className="space-y-4">
                <label className="block">
                  <span className="text-sm font-medium text-surface-400">Make / Model Preference</span>
                  <input className="w-full mt-1 bg-surface-100" placeholder="e.g. Caterpillar 320 GC" />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-surface-400">Max Operating Hours</span>
                  <input className="w-full mt-1 bg-surface-100" placeholder="e.g. 5000" type="number" />
                </label>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
               <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-primary/10 rounded-xl text-primary"><Globe /></div>
                <div>
                  <h2 className="text-2xl font-bold font-display">Deployment</h2>
                  <p className="text-surface-400 text-sm">Where and when?</p>
                </div>
              </div>
              <div className="space-y-4">
                <label className="block">
                  <span className="text-sm font-medium text-surface-400">Destination Country</span>
                  <input className="w-full mt-1 bg-surface-100" placeholder="e.g. Saudi Arabia" />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-surface-400">Timeline</span>
                  <select className="w-full mt-1 bg-surface-100">
                    <option>Immediate (Asap)</option>
                    <option>1-3 Months</option>
                    <option>3-6 Months</option>
                  </select>
                </label>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
               <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-primary/10 rounded-xl text-primary"><DollarSign /></div>
                <div>
                  <h2 className="text-2xl font-bold font-display">Budget & Terms</h2>
                  <p className="text-surface-400 text-sm">Financial overview</p>
                </div>
              </div>
              <div className="space-y-4">
                <label className="block">
                  <span className="text-sm font-medium text-surface-400">Estimated Budget (USD)</span>
                  <input className="w-full mt-1 bg-surface-100" placeholder="e.g. 200,000" type="number" />
                </label>
                <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl text-sm">
                  Your RFQ will be distributed to verified dealers matching these criteria.
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-12 flex justify-between">
          <button 
            onClick={prevStep} 
            className={`btn btn-secondary ${step === 1 ? 'opacity-0 pointer-events-none' : ''}`}
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <button 
            onClick={step === totalSteps ? undefined : nextStep} 
            className="btn btn-primary px-10"
          >
            {step === totalSteps ? 'Submit Request' : 'Next'} <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RFQWizard;
