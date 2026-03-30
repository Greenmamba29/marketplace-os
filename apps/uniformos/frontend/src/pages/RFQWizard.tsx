import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, 
  ChevronLeft, 
  Layers, 
  Users, 
  Truck, 
  CheckCircle2, 
  FileText,
  Building2,
  PackageSearch
} from 'lucide-react';
import { Link } from 'react-router-dom';

const steps = [
  { id: 1, name: 'Industry & Scale', icon: Building2 },
  { id: 2, name: 'Departments', icon: Users },
  { id: 3, name: 'Quantities', icon: Layers },
  { id: 4, name: 'Customization', icon: PackageSearch },
  { id: 5, name: 'Timeline', icon: Truck },
];

export default function RFQWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    industry: '',
    headcount: '',
    departments: [],
    customization: 'None',
    deadline: '',
  });

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps.length));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const industries = ['Healthcare', 'Hospitality', 'Public Safety', 'Manufacturing', 'Corporate', 'Logistics'];

  return (
    <div className="min-h-screen bg-surface pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-display font-bold text-white">Bulk Uniform RFQ</h1>
            <div className="text-sm text-surface-400 font-mono">Step {currentStep} of {steps.length}</div>
          </div>
          
          <div className="flex justify-between items-center relative px-2">
            <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full h-0.5 bg-surface-200 -z-10" />
            {steps.map((step) => (
              <div 
                key={step.id}
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  currentStep >= step.id ? 'bg-primary border-primary text-white' : 'bg-surface-50 border-surface-200 text-surface-400'
                }`}
              >
                <step.icon className="w-5 h-5" />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-surface-50 border border-surface-200 rounded-2xl p-8 min-h-[400px]">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div>
                  <h2 className="text-xl font-medium text-white mb-4">Select Your Industry</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {industries.map(ind => (
                      <button 
                        key={ind}
                        onClick={() => setFormData({...formData, industry: ind})}
                        className={`p-4 rounded-xl border transition-all text-center ${formData.industry === ind ? 'bg-primary/10 border-primary text-primary' : 'bg-surface-100 border-surface-200 text-surface-400 hover:border-surface-300 hover:text-white'}`}
                      >
                        {ind}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h2 className="text-xl font-medium text-white">Estimated Workforce Headcount</h2>
                  <select 
                    className="w-full"
                    value={formData.headcount}
                    onChange={(e) => setFormData({...formData, headcount: e.target.value})}
                  >
                    <option value="">Select range...</option>
                    <option value="10-50">10-50 employees</option>
                    <option value="51-200">51-200 employees</option>
                    <option value="201-500">201-500 employees</option>
                    <option value="500+">500+ employees</option>
                  </select>
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-medium text-white">Which departments need uniforms?</h2>
                <div className="space-y-3">
                  {['Front Desk / Admin', 'Operations / Field', 'Maintenance / Facilities', 'Management', 'Specialized / Technical'].map(dept => (
                    <label key={dept} className="flex items-center gap-3 p-4 bg-surface-100 border border-surface-200 rounded-xl cursor-pointer hover:border-primary/50 transition-colors">
                      <input type="checkbox" className="w-5 h-5 rounded border-surface-200 bg-surface-100 text-primary focus:ring-primary focus:ring-offset-surface-50" />
                      <span className="text-white">{dept}</span>
                    </label>
                  ))}
                </div>
              </motion.div>
            )}

            {currentStep === 5 && (
              <motion.div 
                key="step5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="text-center space-y-6 py-8"
              >
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl font-display font-bold text-white">Ready to Submit!</h2>
                <p className="text-surface-400 max-w-md mx-auto">Your RFQ has been prepared for our sourcing team. You'll receive a detailed quote with lead times within 24-48 hours.</p>
                <Link to="/dashboard" className="btn btn-primary mt-8 inline-flex">
                  <FileText className="w-5 h-5" /> Submit RFQ to Network
                </Link>
              </motion.div>
            )}
            
            {(currentStep > 2 && currentStep < 5) && (
              <motion.div key="generic" className="flex items-center justify-center min-h-[200px] text-surface-400 italic">
                Step {currentStep} implementation details...
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {currentStep < 5 && (
          <div className="flex justify-between mt-8">
            <button 
              onClick={prevStep}
              className={`btn btn-secondary ${currentStep === 1 ? 'invisible' : ''}`}
            >
              <ChevronLeft className="w-5 h-5" /> Previous
            </button>
            <button 
              onClick={nextStep}
              className="btn btn-primary"
            >
              Next Step <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
