import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, 
  ChevronLeft, 
  FlaskConical, 
  Users, 
  Truck, 
  CheckCircle2, 
  FileText,
  Briefcase,
  Layout,
  DollarSign,
  Beaker,
  TestTube2,
  AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

const steps = [
  { id: 1, name: 'Product Scope', icon: Briefcase },
  { id: 2, name: 'Functions', icon: FlaskConical },
  { id: 3, name: 'Volume/Frequency', icon: Layout },
  { id: 4, name: 'Regulatory', icon: CheckCircle2 },
  { id: 5, name: 'Samples', icon: Beaker },
];

export default function RFQWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    productType: '',
    functionNeeded: '',
    volume: '',
    frequency: '',
    regulatory: [],
    sampleRequest: false,
  });

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps.length));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const productTypes = ['Beverage', 'Dairy / Meat Alternative', 'Bakery / Snacks', 'Sauces / Condiments', 'Supplements / Nutraceuticals'];
  const functions = ['Thickening / Gelling', 'Emulsifying', 'Flavor Enhancement', 'Preservation', 'Nutritional Enrichment'];

  return (
    <div className="min-h-screen bg-surface pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-3xl font-display font-bold text-white mb-2">Technical Sourcing Request</h1>
          <p className="text-surface-400">Our food scientists will analyze your formula needs and provide matching ingredients.</p>
        </div>
        
        <div className="flex justify-between items-center mb-12 relative px-4">
          <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full h-0.5 bg-surface-200 -z-10" />
          {steps.map((step) => (
            <div key={step.id} className="flex flex-col items-center gap-2">
              <div 
                className={`w-12 h-12 rounded-2xl flex items-center justify-center border-2 transition-all duration-300 ${
                  currentStep >= step.id ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' : 'bg-surface-50 border-surface-200 text-surface-400'
                }`}
              >
                <step.icon className="w-6 h-6" />
              </div>
              <span className={`text-[10px] uppercase tracking-wider font-bold ${currentStep >= step.id ? 'text-white' : 'text-surface-400'}`}>{step.name}</span>
            </div>
          ))}
        </div>

        <div className="bg-surface-50 border border-surface-200 rounded-3xl p-10 min-h-[450px] shadow-2xl overflow-hidden relative">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="space-y-8"
              >
                <h2 className="text-2xl font-display font-bold text-white mb-6">Select End Product Category</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {productTypes.map(type => (
                    <button 
                      key={type}
                      onClick={() => setFormData({...formData, productType: type})}
                      className={`p-6 rounded-2xl border text-left transition-all ${formData.productType === type ? 'bg-primary/10 border-primary text-white ring-2 ring-primary/20' : 'bg-surface-100 border-surface-200 text-surface-400 hover:border-surface-300'}`}
                    >
                      <span className="font-medium">{type}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="space-y-8"
              >
                <h2 className="text-2xl font-display font-bold text-white">Desired Functional Properties</h2>
                <div className="space-y-3">
                  {functions.map(f => (
                    <label key={f} className="flex items-center gap-4 p-5 bg-surface-100 border border-surface-200 rounded-2xl cursor-pointer hover:border-primary/50 transition-colors">
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${formData.functionNeeded === f ? 'bg-primary border-primary' : 'border-surface-300'}`}>
                        {formData.functionNeeded === f && <CheckCircle2 className="w-4 h-4 text-white" />}
                      </div>
                      <input type="radio" name="function" className="hidden" onChange={() => setFormData({...formData, functionNeeded: f})} />
                      <span className="text-white font-medium">{f}</span>
                    </label>
                  ))}
                </div>
              </motion.div>
            )}

            {currentStep === 5 && (
              <motion.div 
                key="step5"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-10 py-10"
              >
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-primary/20 shadow-inner">
                  <TestTube2 className="w-10 h-10 text-primary" />
                </div>
                <div>
                  <h2 className="text-3xl font-display font-bold text-white mb-4">Request Sent to Lab</h2>
                  <p className="text-surface-400 max-w-md mx-auto leading-relaxed text-lg">Your technical request has been forwarded to our ingredient specialists. We will provide technical data sheets (TDS) and CoA for matching samples within 24 hours.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/dashboard" className="btn btn-primary px-12 py-4">
                    View Project Dashboard
                  </Link>
                  <button className="btn btn-secondary px-12 py-4">
                    Request Lab Support
                  </button>
                </div>
              </motion.div>
            )}

            {(currentStep > 2 && currentStep < 5) && (
              <motion.div key="generic" className="flex items-center justify-center min-h-[300px] text-surface-400 italic">
                Gathering {steps[currentStep-1].name} requirements...
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
              className="btn btn-primary px-12"
            >
              Continue <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
