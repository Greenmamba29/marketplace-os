import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, Store, Utensils, Building2, CheckCircle2, ArrowRight, ArrowLeft, FileText, Calendar, Truck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

export default function RFQWizard() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [businessType, setBusinessType] = useState<string | null>(null);
  
  const bizTypes = [
    { id: 'Restaurant', icon: Utensils, label: 'RESTAURANT GROUP', desc: 'Fine dining & quick service chains' },
    { id: 'Grocery', icon: Store, label: 'GROCERY RETAIL', desc: 'Supermarkets & boutique grocers' },
    { id: 'Food Service', icon: Building2, label: 'FOOD SERVICE', desc: 'Corporate, education, & medical dining' },
    { id: 'Distributor', icon: Truck, label: 'SUB-DISTRIBUTOR', desc: 'Regional wholesale distribution' }
  ];

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);
  const handleSubmit = () => {
    toast.success('Enterprise RFQ Created');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-surface pt-32 pb-32">
      <div className="max-w-4xl mx-auto px-4">
        {/* Progress */}
        <div className="flex items-center justify-between mb-24 px-8 relative">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex flex-col items-center gap-4 relative z-10">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center font-mono text-xl font-black border-2 transition-all duration-700 ${
                step >= s ? 'bg-primary border-primary text-white shadow-[0_0_30px_rgba(22,163,74,0.5)]' : 'bg-surface border-surface-200 text-surface-400'
              }`}>
                {step > s ? <CheckCircle2 className="w-8 h-8" /> : s}
              </div>
              <span className={`text-[10px] font-mono uppercase font-black tracking-[0.3em] ${step >= s ? 'text-primary' : 'text-surface-400'}`}>
                {s === 1 ? 'Vetting' : s === 2 ? 'Volume' : 'Logistics'}
              </span>
            </div>
          ))}
          <div className="absolute left-1/2 -translate-x-1/2 w-full max-w-sm h-0.5 bg-surface-200 -z-0">
            <div className="h-full bg-primary transition-all duration-700" style={{ width: `${((step - 1) / 2) * 100}%` }} />
          </div>
        </div>

        <div className="bg-surface-50 border border-surface-200 rounded-[3rem] p-16">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="s1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <h2 className="text-4xl font-display font-black text-white mb-4 uppercase tracking-tighter">Business Type</h2>
                <p className="text-surface-400 mb-12 text-lg">Select your primary operation category</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {bizTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.id}
                        onClick={() => { setBusinessType(type.id); handleNext(); }}
                        className={`p-10 border-2 rounded-[2.5rem] flex flex-col gap-8 transition-all text-left group ${
                          businessType === type.id ? 'bg-primary/5 border-primary shadow-[0_0_40px_rgba(22,163,74,0.1)]' : 'bg-surface border-surface-200 hover:border-surface-300'
                        }`}
                      >
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${businessType === type.id ? 'bg-primary text-white' : 'bg-surface-100 text-surface-400 group-hover:text-white'}`}>
                          <Icon className="w-10 h-10" />
                        </div>
                        <div>
                          <p className="text-xl font-display font-bold text-white uppercase tracking-tight">{type.label}</p>
                          <p className="text-sm text-surface-400 leading-relaxed mt-2">{type.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="s2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <h2 className="text-4xl font-display font-black text-white mb-4 uppercase tracking-tighter">Inventory Needs</h2>
                <p className="text-surface-400 mb-12 text-lg">Define weekly volume and product mix</p>
                <div className="space-y-10">
                  <div>
                    <label className="block text-xs font-mono font-black text-primary uppercase mb-4 tracking-widest">Weekly Unit Volume (Est.)</label>
                    <input type="text" className="w-full bg-surface border border-surface-200 rounded-[1.5rem] p-6 text-white text-xl font-mono outline-none focus:border-primary transition-all" placeholder="e.g. 5,000 Units" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono font-black text-primary uppercase mb-4 tracking-widest">Product Categories Required</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {['Produce', 'Proteins', 'Dairy', 'Dry Goods', 'Beverages', 'Packaging'].map(c => (
                        <label key={c} className="flex items-center gap-3 p-4 bg-surface border border-surface-200 rounded-xl cursor-pointer hover:border-primary transition-all">
                          <input type="checkbox" className="w-5 h-5 accent-primary" />
                          <span className="text-sm font-bold text-white uppercase">{c}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex justify-between mt-16">
                  <button onClick={handleBack} className="px-12 py-5 bg-surface-100 text-white font-bold rounded-2xl flex items-center gap-2 uppercase tracking-[0.2em] text-xs">
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <button onClick={handleNext} className="px-16 py-5 bg-primary text-white font-black rounded-2xl flex items-center gap-2 uppercase tracking-[0.2em] text-xs shadow-[0_0_30px_rgba(22,163,74,0.3)]">
                    Next Step <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="s3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <h2 className="text-4xl font-display font-black text-white mb-4 uppercase tracking-tighter">Delivery Protocol</h2>
                <p className="text-surface-400 mb-12 text-lg">Logistical constraints and compliance verification</p>
                <div className="space-y-8">
                  <div className="p-8 bg-surface border border-surface-200 rounded-[2rem] flex items-center gap-8">
                    <Calendar className="w-10 h-10 text-primary" />
                    <div className="flex-grow">
                      <p className="text-sm font-black text-white uppercase tracking-widest mb-1">Weekly Delivery Schedule</p>
                      <p className="text-xs text-surface-400">Specify preferred receiving hours for cold chain handover.</p>
                    </div>
                  </div>
                  <div className="bg-primary/5 border border-primary/20 rounded-[2rem] p-8">
                    <div className="flex items-center gap-4 mb-4">
                      <Leaf className="w-6 h-6 text-primary" />
                      <p className="text-sm font-black text-primary uppercase tracking-widest">Sustainability Audit</p>
                    </div>
                    <p className="text-xs text-surface-300 leading-relaxed italic">
                      "By submitting this RFQ, you agree to our Sustainable Sourcing Charter. FoodOps prioritize suppliers with regenerative agriculture and low-waste packaging certifications."
                    </p>
                  </div>
                </div>
                <div className="flex justify-between mt-16">
                  <button onClick={handleBack} className="px-12 py-5 bg-surface-100 text-white font-bold rounded-2xl flex items-center gap-2 uppercase tracking-[0.2em] text-xs">
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <button onClick={handleSubmit} className="px-16 py-5 bg-primary text-white font-black rounded-2xl flex items-center gap-2 uppercase tracking-[0.2em] text-xs shadow-[0_0_50px_rgba(22,163,74,0.5)]">
                    Broadcast RFQ <FileText className="w-5 h-5" />
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
