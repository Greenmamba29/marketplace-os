import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, 
  ChevronLeft, 
  Building2, 
  Users, 
  Truck, 
  CheckCircle2, 
  FileText,
  Briefcase,
  Layout,
  DollarSign
} from 'lucide-react';
import { Link } from 'react-router-dom';

const steps = [
  { id: 1, name: 'Project Type', icon: Briefcase },
  { id: 2, name: 'Space Metrics', icon: Layout },
  { id: 3, name: 'Budget Scope', icon: DollarSign },
  { id: 4, name: 'Furniture Mix', icon: Building2 },
  { id: 5, name: 'Timeline', icon: Truck },
];

export default function RFQWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    projectType: '',
    headcount: '',
    budget: '',
    deadline: '',
  });

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps.length));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const projectTypes = ['New Office Buildout', 'Office Renovation', 'Remote Work Kits', 'Conference Center', 'Lounge / Common Area'];

  return (
    <div className="min-h-screen bg-surface pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-display font-bold text-white mb-2">Workspace Project Planner</h1>
          <p className="text-surface-400">Define your furniture requirements for a custom proposal.</p>
        </div>
        
        <div className="flex justify-between items-center mb-12 relative px-4">
          <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full h-0.5 bg-surface-200 -z-10" />
          {steps.map((step) => (
            <div key={step.id} className="flex flex-col items-center gap-2">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  currentStep >= step.id ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' : 'bg-surface-50 border-surface-200 text-surface-400'
                }`}
              >
                <step.icon className="w-5 h-5" />
              </div>
              <span className={`text-[10px] uppercase tracking-wider font-bold ${currentStep >= step.id ? 'text-white' : 'text-surface-400'}`}>{step.name}</span>
            </div>
          ))}
        </div>

        <div className="bg-surface-50 border border-surface-200 rounded-3xl p-10 min-h-[450px] shadow-2xl">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="space-y-8"
              >
                <h2 className="text-2xl font-display font-bold text-white mb-6">Select Project Type</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {projectTypes.map(type => (
                    <button 
                      key={type}
                      onClick={() => setFormData({...formData, projectType: type})}
                      className={`p-5 rounded-2xl border text-left transition-all flex items-center justify-between ${formData.projectType === type ? 'bg-primary/10 border-primary text-white' : 'bg-surface-100 border-surface-200 text-surface-400 hover:border-surface-300 hover:text-white'}`}
                    >
                      <span className="font-medium">{type}</span>
                      {formData.projectType === type && <CheckCircle2 className="w-5 h-5 text-primary" />}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <h2 className="text-2xl font-display font-bold text-white">Estimated Headcount</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {['1-10', '11-50', '51-200', '201+'].map(hc => (
                    <button 
                      key={hc}
                      onClick={() => setFormData({...formData, headcount: hc})}
                      className={`py-4 rounded-xl border text-center transition-all ${formData.headcount === hc ? 'bg-primary border-primary text-white' : 'bg-surface-100 border-surface-200 text-surface-400'}`}
                    >
                      {hc}
                    </button>
                  ))}
                </div>
                
                <div className="space-y-4">
                  <h2 className="text-xl font-display font-bold text-white">Square Footage</h2>
                  <input type="text" placeholder="e.g. 5,000 sqft" className="w-full" />
                </div>
              </motion.div>
            )}

            {currentStep === 5 && (
              <motion.div 
                key="step5"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-8 py-10"
              >
                <div className="w-20 h-20 bg-primary/20 rounded-3xl flex items-center justify-center mx-auto mb-6 transform rotate-12">
                  <FileText className="w-10 h-10 text-primary" />
                </div>
                <div>
                  <h2 className="text-3xl font-display font-bold text-white mb-4">Project Ready for Review</h2>
                  <p className="text-surface-400 max-w-md mx-auto leading-relaxed">Your workspace requirements have been captured. Our design consultants will provide a preliminary layout and quote within 48 hours.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
                  <Link to="/dashboard" className="btn btn-primary px-10">
                    Submit Proposal Request
                  </Link>
                  <button className="btn btn-secondary px-10">
                    Schedule Design Call
                  </button>
                </div>
              </motion.div>
            )}

            {(currentStep > 2 && currentStep < 5) && (
              <motion.div key="generic" className="flex items-center justify-center min-h-[300px] text-surface-400 italic">
                Defining {steps[currentStep-1].name} parameters...
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {currentStep < 5 && (
          <div className="flex justify-between mt-10">
            <button 
              onClick={prevStep}
              className={`btn btn-secondary px-8 ${currentStep === 1 ? 'invisible' : ''}`}
            >
              <ChevronLeft className="w-5 h-5" /> Previous
            </button>
            <button 
              onClick={nextStep}
              className="btn btn-primary px-10"
            >
              Next Step <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
