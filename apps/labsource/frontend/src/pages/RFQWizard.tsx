import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Building2, FlaskConical, ClipboardList, Send, ArrowRight, ArrowLeft } from 'lucide-react';

const steps = [
  { id: 'institution', title: 'Institution', icon: Building2 },
  { id: 'lab', title: 'Lab Type', icon: FlaskConical },
  { id: 'items', title: 'Product List', icon: ClipboardList },
  { id: 'submit', title: 'Quantities', icon: Send },
];

export default function RFQWizard() {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-display font-bold text-white mb-2">Institutional RFQ</h1>
        <p className="text-surface-400">Bulk sourcing for research, clinical, and academic institutions.</p>
      </div>

      <div className="flex items-center justify-between mb-12 px-8">
        {steps.map((step, i) => (
          <div key={step.id} className="flex flex-col items-center relative z-10">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
              i <= currentStep ? 'bg-primary text-white' : 'bg-surface-100 text-surface-400 border border-surface-200'
            }`}>
              {i < currentStep ? <Check className="w-5 h-5" /> : <step.icon className="w-5 h-5" />}
            </div>
            <span className={`text-xs mt-2 font-medium ${i <= currentStep ? 'text-white' : 'text-surface-400'}`}>
              {step.title}
            </span>
            {i < steps.length - 1 && (
              <div className={`absolute top-5 left-full w-full h-0.5 -translate-y-1/2 -z-10 ${
                i < currentStep ? 'bg-primary' : 'bg-surface-200'
              }`} style={{ width: '120%' }} />
            )}
          </div>
        ))}
      </div>

      <div className="bg-surface-50 border border-surface-200 rounded-2xl p-8 min-h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {currentStep === 0 && (
              <div className="space-y-4">
                <label className="block text-sm font-medium text-surface-400">Select Institution Type</label>
                <div className="grid grid-cols-2 gap-4">
                  {['Academic', 'Biotech', 'Pharma', 'Government'].map(type => (
                    <button key={type} className="p-6 text-left border border-surface-200 rounded-xl hover:border-primary/50 hover:bg-primary/5 transition-all group">
                      <h3 className="font-bold text-white mb-1">{type}</h3>
                    </button>
                  ))}
                </div>
              </div>
            )}
            {currentStep === 1 && (
              <div className="space-y-4">
                <label className="block text-sm font-medium text-surface-400">Lab Classification</label>
                <select className="w-full">
                  <option>Analytical Chemistry</option>
                  <option>Molecular Biology</option>
                  <option>Clinical Diagnostic</option>
                  <option>Quality Control</option>
                </select>
              </div>
            )}
            {currentStep === 2 && (
              <div className="space-y-4">
                <label className="block text-sm font-medium text-surface-400">Paste Product List / Catalog Numbers</label>
                <textarea className="w-full h-32" placeholder="e.g. SIGMA-S7653, PYREX-4980-500..."></textarea>
                <div className="p-4 bg-surface-100 rounded-lg text-xs text-surface-400">
                  Tip: You can upload an Excel or CSV file instead.
                </div>
              </div>
            )}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-surface-400 mb-2">Required Delivery Date</label>
                  <input type="date" className="w-full" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-400 mb-2">Funding Reference / PO #</label>
                  <input type="text" className="w-full" placeholder="Optional" />
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-between mt-8">
        <button 
          onClick={prevStep} 
          disabled={currentStep === 0}
          className="btn-secondary disabled:opacity-50"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
        <button 
          onClick={currentStep === steps.length - 1 ? () => {} : nextStep} 
          className="btn-primary"
        >
          {currentStep === steps.length - 1 ? 'Submit RFQ' : 'Next Step'}
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
