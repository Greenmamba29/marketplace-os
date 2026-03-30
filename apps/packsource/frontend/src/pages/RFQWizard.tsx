import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Package, Ruler, Printer, Truck, ArrowRight, ArrowLeft } from 'lucide-react';

const steps = [
  { id: 'type', title: 'Package Type', icon: Package },
  { id: 'specs', title: 'Dimensions & Specs', icon: Ruler },
  { id: 'print', title: 'Print Requirements', icon: Printer },
  { id: 'timeline', title: 'Quantity & Timeline', icon: Truck },
];

export default function RFQWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-display font-bold text-white mb-2">Request a Quote</h1>
        <p className="text-surface-400">Tell us your requirements and receive quotes from top manufacturers.</p>
      </div>

      {/* Progress Bar */}
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

      {/* Form Content */}
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
                {['Corrugated Boxes', 'Flexible Pouches', 'Glass Bottles', 'Plastic Tubs'].map(type => (
                  <button key={type} className="p-6 text-left border border-surface-200 rounded-xl hover:border-primary/50 hover:bg-primary/5 transition-all group">
                    <h3 className="font-bold text-white mb-1">{type}</h3>
                    <p className="text-sm text-surface-400">Standard and custom options available</p>
                  </button>
                ))}
              </div>
            )}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-surface-400 mb-2">Dimensions (LxWxH)</label>
                  <input type="text" className="w-full" placeholder="e.g. 12x12x12 inches" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-400 mb-2">Material Preference</label>
                  <select className="w-full">
                    <option>Standard Cardboard</option>
                    <option>Recycled Kraft</option>
                    <option>High-Gloss Plastic</option>
                  </select>
                </div>
              </div>
            )}
            {currentStep === 2 && (
              <div className="space-y-4">
                <label className="block text-sm font-medium text-surface-400 mb-2">Print Requirements</label>
                {['Full Color (CMYK)', 'Spot Color (Pantone)', 'No Print', 'Custom Embossing'].map(opt => (
                  <label key={opt} className="flex items-center gap-3 p-4 border border-surface-200 rounded-xl cursor-pointer hover:bg-surface-100">
                    <input type="checkbox" className="w-5 h-5 rounded border-surface-200 text-primary focus:ring-primary" />
                    <span className="text-white">{opt}</span>
                  </label>
                ))}
              </div>
            )}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-surface-400 mb-2">Total Quantity</label>
                  <input type="number" className="w-full" placeholder="Min 1000 units" min="1000" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-400 mb-2">Delivery Deadline</label>
                  <input type="date" className="w-full" />
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Buttons */}
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
