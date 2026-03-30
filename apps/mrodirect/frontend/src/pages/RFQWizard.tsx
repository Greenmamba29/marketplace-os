import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, ClipboardList, Truck, CheckCircle2, ChevronRight, ChevronLeft, Building2, AlertCircle, ArrowLeft, ExternalLink } from 'lucide-react';
import { usePart, useRFQ } from '../hooks';
import { getContinueShoppingUrl, getContinueShoppingLabel } from '../hooks/useShoppingContext';
import toast from 'react-hot-toast';

const MALL_URL = 'https://marketplace-os-hub.netlify.app';

const STEPS = [
  { id: 1, title: 'Part Info', icon: Package },
  { id: 2, title: 'Quantity & Specs', icon: ClipboardList },
  { id: 3, title: 'Delivery & Shipping', icon: Truck },
  { id: 4, title: 'Review & Submit', icon: CheckCircle2 }
];

const RFQWizard: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const partId = searchParams.get('partId') || '1';
  const { data: part } = usePart(partId);
  const { submit } = useRFQ();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    partId: partId,
    quantity: 1,
    customSpecs: '',
    deliveryDate: '',
    shippingAddress: '',
    companyName: 'BuildTech Industries',
    urgency: 'Standard'
  });

  const handleNext = () => {
    if (currentStep < 4) setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    try {
      await submit.mutateAsync(formData);
      toast.success('RFQ Submitted Successfully!');
      navigate('/order-success');
    } catch (error) {
      toast.error('Failed to submit RFQ');
    }
  };

  const continueUrl = getContinueShoppingUrl();
  const continueLabel = getContinueShoppingLabel();

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      {/* Continue Shopping bar */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
        <Link to="/parts" className="flex items-center gap-2 text-xs text-surface-400 hover:text-primary transition-colors font-bold uppercase tracking-widest">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Directory
        </Link>
        <a
          href={continueUrl}
          target={continueUrl.startsWith('http') ? '_blank' : undefined}
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-xs text-surface-400 hover:text-primary transition-colors font-bold uppercase tracking-widest"
        >
          <ExternalLink className="w-3.5 h-3.5" />{continueLabel}
        </a>
      </div>

      {/* Step Indicator */}
      <div className="mb-12">
        <div className="flex justify-between relative">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-surface-200 -translate-y-1/2 z-0" />
          {STEPS.map((step) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            
            return (
              <div key={step.id} className="relative z-10 flex flex-col items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  isActive ? 'bg-primary border-primary text-white scale-110 shadow-lg shadow-primary/20' : 
                  isCompleted ? 'bg-surface-50 border-primary text-primary' : 
                  'bg-surface border-surface-200 text-surface-400'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className={`mt-3 text-xs font-bold uppercase tracking-wider ${isActive ? 'text-white' : 'text-surface-400'}`}>
                  {step.title}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="glass border border-surface-200 rounded-[32px] p-8 md:p-12 overflow-hidden relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-display font-bold text-white mb-2">Part Selection</h2>
                  <p className="text-surface-400">Review the part details for your request.</p>
                </div>
                {part && (
                  <div className="p-6 bg-surface-50 border border-surface-200 rounded-2xl flex items-center gap-6">
                    <div className="w-20 h-20 bg-surface-100 rounded-xl flex items-center justify-center">
                       <Package className="text-surface-400 w-10 h-10" />
                    </div>
                    <div>
                       <div className="text-xs font-mono text-primary mb-1 uppercase tracking-wider">{part.sku}</div>
                       <div className="text-lg font-bold text-white">{part.name}</div>
                       <div className="text-sm text-surface-400">{part.brand} Industrial</div>
                    </div>
                  </div>
                )}
                <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-primary mt-0.5" />
                  <p className="text-xs text-surface-400 leading-relaxed">
                    If this is not the correct part, please return to the directory to select a different one. 
                    MRODirect RFQs are precision-bound to specific SKUs.
                  </p>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-display font-bold text-white mb-2">Quantity & Custom Specs</h2>
                  <p className="text-surface-400">Specify requirements for your bulk order.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                     <label className="text-sm font-medium text-surface-400">Required Quantity</label>
                     <input 
                       type="number" 
                       className="w-full" 
                       value={formData.quantity} 
                       onChange={e => setFormData({...formData, quantity: parseInt(e.target.value)})} 
                     />
                   </div>
                   <div className="space-y-2">
                     <label className="text-sm font-medium text-surface-400">Order Urgency</label>
                     <select 
                       className="w-full"
                       value={formData.urgency}
                       onChange={e => setFormData({...formData, urgency: e.target.value})}
                     >
                       <option>Standard</option>
                       <option>Expedited</option>
                       <option>Critical (Down Machine)</option>
                     </select>
                   </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-surface-400">Additional Specifications / Requirements</label>
                  <textarea 
                    className="w-full h-32" 
                    placeholder="E.g. Specific material grade, certification requirements, or technical tolerances..."
                    value={formData.customSpecs}
                    onChange={e => setFormData({...formData, customSpecs: e.target.value})}
                  />
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-display font-bold text-white mb-2">Delivery & Logistics</h2>
                  <p className="text-surface-400">Help us coordinate your shipment logistics.</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-surface-400">Requested Delivery Date</label>
                  <input 
                    type="date" 
                    className="w-full"
                    value={formData.deliveryDate}
                    onChange={e => setFormData({...formData, deliveryDate: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-surface-400">Shipping Destination</label>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-4 text-surface-400 w-5 h-5" />
                    <textarea 
                      className="w-full pl-12 h-32" 
                      placeholder="Enter full facility address..."
                      value={formData.shippingAddress}
                      onChange={e => setFormData({...formData, shippingAddress: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-display font-bold text-white mb-2">Review Your Request</h2>
                  <p className="text-surface-400">Ensure all details are accurate before submitting.</p>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                     <div className="p-4 bg-surface-50 border border-surface-200 rounded-xl">
                        <div className="text-xs text-surface-400 mb-1 uppercase tracking-wider">Part</div>
                        <div className="text-sm font-bold text-white">{part?.name}</div>
                     </div>
                     <div className="p-4 bg-surface-50 border border-surface-200 rounded-xl">
                        <div className="text-xs text-surface-400 mb-1 uppercase tracking-wider">Quantity</div>
                        <div className="text-sm font-bold text-white">{formData.quantity} Units</div>
                     </div>
                     <div className="p-4 bg-surface-50 border border-surface-200 rounded-xl">
                        <div className="text-xs text-surface-400 mb-1 uppercase tracking-wider">Delivery</div>
                        <div className="text-sm font-bold text-white">{formData.deliveryDate || 'Flexible'}</div>
                     </div>
                     <div className="p-4 bg-surface-50 border border-surface-200 rounded-xl">
                        <div className="text-xs text-surface-400 mb-1 uppercase tracking-wider">Urgency</div>
                        <div className="text-sm font-bold text-white">{formData.urgency}</div>
                     </div>
                  </div>
                  <div className="p-4 bg-surface-50 border border-surface-200 rounded-xl">
                     <div className="text-xs text-surface-400 mb-1 uppercase tracking-wider">Shipping To</div>
                     <div className="text-sm font-bold text-white">{formData.shippingAddress || 'N/A'}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-accent-info/5 border border-accent-info/30 rounded-xl">
                   <div className="w-10 h-10 bg-accent-info/10 rounded-full flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-5 h-5 text-accent-info" />
                   </div>
                   <p className="text-xs text-surface-400 leading-relaxed">
                     By submitting, your RFQ will be broadcasted to our network of verified suppliers. 
                     You will receive initial quotes within 4-12 hours.
                   </p>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="mt-12 pt-8 border-t border-surface-200 flex justify-between">
           <button 
             onClick={handleBack} 
             disabled={currentStep === 1}
             className="btn btn-secondary px-6 flex items-center gap-2 disabled:opacity-30"
           >
             <ChevronLeft className="w-4 h-4" /> Back
           </button>
           
           {currentStep < 4 ? (
             <button onClick={handleNext} className="btn btn-primary px-8 flex items-center gap-2">
               Next Step <ChevronRight className="w-4 h-4" />
             </button>
           ) : (
             <button onClick={handleSubmit} className="btn btn-primary px-10 shadow-lg shadow-primary/20">
               Submit Request
             </button>
           )}
        </div>
      </div>
    </div>
  );
};

export default RFQWizard;
