import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, 
  ChevronLeft, 
  Wine, 
  Users, 
  Truck, 
  CheckCircle2, 
  FileText,
  Briefcase,
  Layout,
  DollarSign,
  Landmark,
  ShieldCheck,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import { Link } from 'react-router-dom';

const steps = [
  { id: 1, name: 'Buyer Profile', icon: Briefcase },
  { id: 2, name: 'Spirit Portfolio', icon: Wine },
  { id: 3, name: 'Age Range', icon: Layout },
  { id: 4, name: 'Investment', icon: DollarSign },
  { id: 5, name: 'Logistics', icon: Truck },
];

export default function AcquisitionWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    buyerType: '',
    spiritType: '',
    volume: '',
    age: '',
    budget: '',
  });

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps.length));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const buyerTypes = ['Distillery', 'Bottler', 'Broker / Trader', 'Institutional Investor', 'Private Portfolio'];
  const spirits = ['Bourbon', 'Scotch', 'Irish Whiskey', 'Tequila / Agave', 'Rum', 'Brandy'];

  return (
    <div className="min-h-screen bg-surface pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-display font-bold text-white mb-2 italic">Acquisition Strategic Planner</h1>
          <p className="text-surface-400">Specify your procurement criteria for high-yield bulk spirit assets.</p>
        </div>
        
        <div className="flex justify-between items-center mb-16 relative px-4">
          <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full h-0.5 bg-surface-200 -z-10" />
          {steps.map((step) => (
            <div key={step.id} className="flex flex-col items-center gap-3">
              <div 
                className={`w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  currentStep >= step.id ? 'bg-primary border-primary text-white shadow-xl shadow-primary/20 scale-110' : 'bg-surface-50 border-surface-200 text-surface-400'
                }`}
              >
                <step.icon className="w-6 h-6" />
              </div>
              <span className={`text-[10px] uppercase tracking-widest font-bold ${currentStep >= step.id ? 'text-white' : 'text-surface-400'}`}>{step.name}</span>
            </div>
          ))}
        </div>

        <div className="bg-surface-50 border border-surface-200 rounded-3xl p-12 min-h-[500px] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-primary" />
          
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-10"
              >
                <h2 className="text-3xl font-display font-bold text-white mb-8">Identify Buyer Classification</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {buyerTypes.map(type => (
                    <button 
                      key={type}
                      onClick={() => setFormData({...formData, buyerType: type})}
                      className={`p-6 rounded-2xl border text-left transition-all relative ${formData.buyerType === type ? 'bg-primary/10 border-primary text-white' : 'bg-surface-100 border-surface-200 text-surface-400 hover:border-surface-300'}`}
                    >
                      <span className="text-lg font-medium">{type}</span>
                      {formData.buyerType === type && <div className="absolute top-4 right-4 w-3 h-3 bg-primary rounded-full" />}
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
                className="space-y-10"
              >
                <h2 className="text-3xl font-display font-bold text-white">Target Spirit Categories</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                  {spirits.map(s => (
                    <button 
                      key={s}
                      onClick={() => setFormData({...formData, spiritType: s})}
                      className={`aspect-square p-6 rounded-3xl border flex flex-col items-center justify-center gap-4 transition-all text-center ${formData.spiritType === s ? 'bg-primary border-primary text-white shadow-lg' : 'bg-surface-100 border-surface-200 text-surface-400'}`}
                    >
                      <Wine className="w-8 h-8" />
                      <span className="font-bold uppercase tracking-wider text-xs">{s}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {currentStep === 5 && (
              <motion.div 
                key="step5"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-10 py-12"
              >
                <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-10 shadow-inner">
                  <ShieldCheck className="w-12 h-12 text-primary" />
                </div>
                <div>
                  <h2 className="text-4xl font-display font-bold text-white mb-4 italic">Acquisition Strategy Formulated</h2>
                  <p className="text-surface-400 max-w-lg mx-auto leading-loose text-lg">Your portfolio expansion parameters have been locked. Our acquisition desk will match these requirements with available DSP stock and exclusive off-market listings.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-6 justify-center mt-12">
                  <Link to="/dashboard" className="btn btn-primary px-12 py-5 text-xl font-bold">
                    Open Portfolio Desk
                  </Link>
                  <button className="btn btn-secondary px-12 py-5 text-xl">
                    <BarChart3 className="w-6 h-6" /> Market Outlook
                  </button>
                </div>
              </motion.div>
            )}

            {(currentStep > 2 && currentStep < 5) && (
              <motion.div key="generic" className="flex items-center justify-center min-h-[350px] text-surface-400 italic text-xl">
                Analyzing market yield for {steps[currentStep-1].name}...
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {currentStep < 5 && (
          <div className="flex justify-between mt-12">
            <button 
              onClick={prevStep}
              className={`btn btn-secondary px-10 py-4 ${currentStep === 1 ? 'invisible' : ''}`}
            >
              <ChevronLeft className="w-6 h-6" /> Back
            </button>
            <button 
              onClick={nextStep}
              className="btn btn-primary px-14 py-4 text-lg font-bold"
            >
              Next Strategy <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
