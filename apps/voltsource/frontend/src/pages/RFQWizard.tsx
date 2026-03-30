import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Zap, Battery, Sun, Grid, Cpu, CheckCircle2, ArrowRight, ArrowLeft, FileText, Users, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

export default function RFQWizard() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [projectType, setProjectType] = useState<string | null>(null);
  
  const projectTypes = [
    { id: 'EV Fleet', icon: Zap, label: 'EV FLEET', desc: 'Charging networks & fleet management' },
    { id: 'Grid Storage', icon: Grid, label: 'GRID STORAGE', desc: 'Commercial & utility scale storage' },
    { id: 'Solar', icon: Sun, label: 'SOLAR ENERGY', desc: 'Photovoltaic & inverter systems' },
    { id: 'Mixed', icon: Cpu, label: 'MIXED INFRA', desc: 'Complex energy projects' }
  ];

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);
  
  const handleSubmit = () => {
    toast.success('RFQ Submitted Successfully!');
    setTimeout(() => navigate('/order-success'), 2000);
  };

  return (
    <div className="min-h-screen bg-surface pt-24 pb-32">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Bar */}
        <div className="flex items-center justify-between mb-16 px-4">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex flex-col items-center gap-3 relative z-10">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-mono text-sm font-bold border-2 transition-all duration-500 ${
                step >= s ? 'bg-primary border-primary text-black shadow-[0_0_20px_rgba(234,179,8,0.4)]' : 'bg-surface border-surface-200 text-surface-400'
              }`}>
                {step > s ? <CheckCircle2 className="w-5 h-5" /> : s}
              </div>
              <span className={`text-[10px] font-mono uppercase font-black tracking-widest ${step >= s ? 'text-primary' : 'text-surface-400'}`}>
                {s === 1 ? 'Project' : s === 2 ? 'Specs' : 'Review'}
              </span>
            </div>
          ))}
          <div className="absolute left-1/2 -translate-x-1/2 w-full max-w-lg h-0.5 bg-surface-200 -z-0">
            <div 
              className="h-full bg-primary transition-all duration-500 shadow-[0_0_10px_rgba(234,179,8,0.3)]" 
              style={{ width: `${((step - 1) / 2) * 100}%` }} 
            />
          </div>
        </div>

        <div className="bg-surface-50 border border-surface-200 rounded-3xl p-8 md:p-12">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-3xl font-display font-black text-white mb-2">SELECT PROJECT TYPE</h2>
                <p className="text-surface-400 mb-10">Choose the primary focus of your sourcing request</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {projectTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.id}
                        onClick={() => { setProjectType(type.id); handleNext(); }}
                        className={`p-6 border-2 rounded-2xl flex items-center gap-6 transition-all text-left ${
                          projectType === type.id ? 'bg-primary/5 border-primary shadow-[0_0_20px_rgba(234,179,8,0.1)]' : 'bg-surface border-surface-200 hover:border-surface-300'
                        }`}
                      >
                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${projectType === type.id ? 'bg-primary text-black' : 'bg-surface-100 text-surface-400'}`}>
                          <Icon className="w-8 h-8" />
                        </div>
                        <div>
                          <p className="text-sm font-display font-bold text-white">{type.label}</p>
                          <p className="text-xs text-surface-400">{type.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-3xl font-display font-black text-white mb-2">PROJECT SPECIFICATIONS</h2>
                <p className="text-surface-400 mb-10">Detail your requirements for {projectType}</p>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-mono font-black text-primary uppercase tracking-widest mb-3">Project Scope & Technical Needs</label>
                    <textarea 
                      className="w-full h-48 bg-surface border border-surface-200 rounded-xl p-4 text-white focus:outline-none focus:border-primary transition-all resize-none"
                      placeholder="Enter voltage requirements, cycle life targets, certifications needed, etc..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono font-black text-primary uppercase tracking-widest mb-3">Required By</label>
                      <input type="date" className="w-full bg-surface border border-surface-200 rounded-xl p-4 text-white focus:outline-none focus:border-primary" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono font-black text-primary uppercase tracking-widest mb-3">Budget Range (Est)</label>
                      <input type="text" placeholder="e.g. $50k - $100k" className="w-full bg-surface border border-surface-200 rounded-xl p-4 text-white focus:outline-none focus:border-primary" />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between mt-12">
                  <button onClick={handleBack} className="px-8 py-4 bg-surface-100 text-white font-bold rounded-xl flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> BACK
                  </button>
                  <button onClick={handleNext} className="px-10 py-4 bg-primary text-black font-bold rounded-xl flex items-center gap-2">
                    REVIEW <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-3xl font-display font-black text-white mb-2">REVIEW & SUBMIT</h2>
                <p className="text-surface-400 mb-10">Confirm your enterprise sourcing request</p>
                
                <div className="space-y-4 mb-10">
                  <div className="p-6 bg-surface border border-surface-200 rounded-2xl flex justify-between items-center">
                    <div>
                      <p className="text-[10px] font-mono text-primary uppercase font-black">Project Type</p>
                      <p className="text-xl font-bold text-white">{projectType}</p>
                    </div>
                    <button onClick={() => setStep(1)} className="text-xs text-primary underline">Change</button>
                  </div>
                  <div className="p-6 bg-surface border border-surface-200 rounded-2xl">
                    <p className="text-[10px] font-mono text-primary uppercase font-black mb-2">Technical Summary</p>
                    <p className="text-surface-400 text-sm italic">Standard grid-scale components including battery packs and smart inverters...</p>
                  </div>
                </div>

                <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6 mb-12 flex gap-4">
                  <Users className="w-6 h-6 text-primary shrink-0" />
                  <p className="text-xs text-surface-300 leading-relaxed">
                    By submitting, your RFQ will be broadcast to our <span className="text-white font-bold">Network of 280+ Verified Manufacturers</span>. 
                    Expect quotes within 24-48 business hours.
                  </p>
                </div>

                <div className="flex justify-between">
                  <button onClick={handleBack} className="px-8 py-4 bg-surface-100 text-white font-bold rounded-xl flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> BACK
                  </button>
                  <button onClick={handleSubmit} className="px-12 py-4 bg-primary text-black font-bold rounded-xl flex items-center gap-2 shadow-[0_0_30px_rgba(234,179,8,0.3)]">
                    SUBMIT RFQ <FileText className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
