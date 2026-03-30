import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Sprout, MapPin, LayoutGrid, Tractor, ArrowRight, ArrowLeft } from 'lucide-react';

const steps = [
  { id: 'crop', title: 'Crop Type', icon: Sprout },
  { id: 'region', title: 'Growing Region', icon: MapPin },
  { id: 'category', title: 'Input Category', icon: LayoutGrid },
  { id: 'volume', title: 'Acreage & Volume', icon: Tractor },
];

export default function RFQWizard() {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-display font-bold text-white mb-2">Request an Input Quote</h1>
        <p className="text-surface-400">Define your seasonal requirements and receive quotes from verified agro-suppliers.</p>
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
              <div className="grid grid-cols-2 gap-4">
                {['Corn', 'Soybeans', 'Wheat', 'Cotton', 'Specialty Crops'].map(type => (
                  <button key={type} className="p-6 text-left border border-surface-200 rounded-xl hover:border-primary/50 hover:bg-primary/5 transition-all group">
                    <h3 className="font-bold text-white mb-1">{type}</h3>
                    <p className="text-sm text-surface-400">Customized input packages available</p>
                  </button>
                ))}
              </div>
            )}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-surface-400 mb-2">State / Region</label>
                  <input type="text" className="w-full" placeholder="e.g. Iowa, US / Matto Grosso, BR" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-400 mb-2">Soil Type (Optional)</label>
                  <select className="w-full">
                    <option>Loam</option>
                    <option>Silt</option>
                    <option>Clay</option>
                    <option>Sandy</option>
                  </select>
                </div>
              </div>
            )}
            {currentStep === 2 && (
              <div className="space-y-4">
                <label className="block text-sm font-medium text-surface-400 mb-2">Product Category</label>
                {['Nitrogen Fertilizers', 'Selective Herbicides', 'Fungicides', 'Cover Crop Seeds'].map(opt => (
                  <label key={opt} className="flex items-center gap-3 p-4 border border-surface-200 rounded-xl cursor-pointer hover:bg-surface-100">
                    <input type="checkbox" className="w-5 h-5 rounded border-surface-200 text-primary focus:ring-primary" />
                    <span className="text-white">{opt}</span>
                  </label>
                ))}
              </div>
            )}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-surface-400 mb-2">Total Acreage</label>
                    <input type="number" className="w-full" placeholder="e.g. 500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-surface-400 mb-2">Delivery Season</label>
                    <select className="w-full">
                      <option>Spring 2026</option>
                      <option>Summer 2026</option>
                      <option>Fall 2026</option>
                      <option>Winter 2026</option>
                    </select>
                  </div>
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
