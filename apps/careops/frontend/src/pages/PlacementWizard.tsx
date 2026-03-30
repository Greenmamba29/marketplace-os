import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, UserCircle2, HeartPulse, Calendar, DollarSign, ArrowRight, ArrowLeft, MapPin } from 'lucide-react';

const steps = [
  { id: 'patient', title: 'Care Needs', icon: UserCircle2 },
  { id: 'level', title: 'Care Level', icon: HeartPulse },
  { id: 'schedule', title: 'Schedule', icon: Calendar },
  { id: 'logistics', title: 'Location & Budget', icon: DollarSign },
];

export default function PlacementWizard() {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-display font-bold text-white mb-2">New Staff Placement</h1>
        <p className="text-surface-400">Assess your care needs and find the perfect match.</p>
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
                <label className="block text-sm font-medium text-surface-400">Who needs care?</label>
                <div className="grid grid-cols-2 gap-4">
                  {['Elderly Care', 'Post-Op Recovery', 'Chronic Condition', 'Disability Support'].map(type => (
                    <button key={type} className="p-6 text-left border border-surface-200 rounded-xl hover:border-primary/50 hover:bg-primary/5 transition-all">
                      <h3 className="font-bold text-white">{type}</h3>
                    </button>
                  ))}
                </div>
              </div>
            )}
            {currentStep === 1 && (
              <div className="space-y-4">
                <label className="block text-sm font-medium text-surface-400">Required Skill Level</label>
                <div className="space-y-3">
                  {[
                    { l: 'CNA', d: 'Certified Nursing Assistant - Basic medical & daily living support' },
                    { l: 'HHA', d: 'Home Health Aide - Non-medical companion & personal care' },
                    { l: 'RN / LPN', d: 'Registered/Practical Nurse - Specialized medical care' }
                  ].map(item => (
                    <label key={item.l} className="flex items-start gap-4 p-4 border border-surface-200 rounded-xl cursor-pointer hover:bg-surface-100">
                      <input type="radio" name="level" className="mt-1 w-5 h-5 text-primary" />
                      <div>
                        <div className="font-bold text-white">{item.l}</div>
                        <div className="text-xs text-surface-400">{item.d}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}
            {currentStep === 2 && (
              <div className="space-y-4">
                <label className="block text-sm font-medium text-surface-400">Requirement Frequency</label>
                <div className="grid grid-cols-2 gap-4">
                  {['24/7 Live-in', 'Full-time (40h)', 'Part-time', 'Short-term Respite'].map(freq => (
                    <button key={freq} className="p-4 border border-surface-200 rounded-xl text-white hover:bg-surface-100">{freq}</button>
                  ))}
                </div>
              </div>
            )}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-surface-400 mb-2">Location (Zip Code)</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
                    <input type="text" className="w-full pl-12" placeholder="e.g. 33101" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-400 mb-2">Hourly Budget Cap ($)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
                    <input type="number" className="w-full pl-12" placeholder="e.g. 35" />
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-between mt-8">
        <button onClick={prevStep} disabled={currentStep === 0} className="btn-secondary disabled:opacity-50">
          <ArrowLeft className="w-5 h-5" /> Back
        </button>
        <button onClick={currentStep === steps.length - 1 ? () => {} : nextStep} className="btn-primary">
          {currentStep === steps.length - 1 ? 'Find Matches' : 'Next Step'}
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
