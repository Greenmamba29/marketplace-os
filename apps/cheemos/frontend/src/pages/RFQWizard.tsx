import { useState } from 'react';
import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  ChevronLeft, 
  Plus, 
  Trash2, 
  Beaker, 
  CheckCircle,
  Loader2,
  FileText,
  Shield,
  Truck,
  CreditCard,
  Sparkles
} from 'lucide-react';
import { useChemical, useCreateRFQ } from '@/hooks';
import CASSearch from '@/components/CASSearch';
import toast from 'react-hot-toast';

// Form schema
const rfqItemSchema = z.object({
  cas_number: z.string().min(1, 'CAS number is required'),
  chemical_name: z.string().min(1, 'Chemical name is required'),
  grade: z.enum(['technical', 'reagent', 'acs', 'pharmacopeia', 'food', 'cosmetic', 'electronic', 'hplc', 'gc_ms']).optional(),
  purity_required: z.number().min(0).max(100).optional(),
  quantity: z.number().min(0.001, 'Quantity must be greater than 0'),
  unit: z.enum(['kg', 'g', 'mg', 'L', 'mL']),
  notes: z.string().optional(),
});

const rfqSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  delivery_country: z.string().min(1, 'Delivery country is required'),
  delivery_city: z.string().optional(),
  required_delivery_date: z.string().min(1, 'Delivery date is required'),
  incoterm: z.enum(['EXW', 'FOB', 'CIF', 'DAP', 'DDP']),
  payment_terms: z.enum(['NET_30', 'NET_60', 'NET_90', 'LC', 'PREPAID']),
  additional_requirements: z.string().optional(),
  compliance_requirements: z.array(z.string()),
  items: z.array(rfqItemSchema).min(1, 'At least one item is required'),
});

type RFQFormData = z.infer<typeof rfqSchema>;

const incoterms = [
  { value: 'EXW', label: 'EXW - Ex Works' },
  { value: 'FOB', label: 'FOB - Free On Board' },
  { value: 'CIF', label: 'CIF - Cost, Insurance & Freight' },
  { value: 'DAP', label: 'DAP - Delivered at Place' },
  { value: 'DDP', label: 'DDP - Delivered Duty Paid' },
];

const paymentTerms = [
  { value: 'NET_30', label: 'Net 30 days' },
  { value: 'NET_60', label: 'Net 60 days' },
  { value: 'NET_90', label: 'Net 90 days' },
  { value: 'LC', label: 'Letter of Credit' },
  { value: 'PREPAID', label: 'Prepaid' },
];

const complianceOptions = [
  'REACH Registered',
  'TSCA Listed',
  'FDA Approved',
  'ISO 9001',
  'GMP Certified',
  'Kosher',
  'Halal',
];

// Step indicator
function StepIndicator({ currentStep, steps }: { currentStep: number; steps: string[] }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {steps.map((step, i) => (
        <div key={i} className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            i < currentStep ? 'bg-primary text-white' :
            i === currentStep ? 'bg-primary/20 text-primary border border-primary' :
            'bg-surface-100 text-surface-400'
          }`}>
            {i < currentStep ? <CheckCircle className="w-5 h-5" /> : i + 1}
          </div>
          <span className={`ml-2 text-sm hidden sm:block ${
            i <= currentStep ? 'text-white' : 'text-surface-400'
          }`}>
            {step}
          </span>
          {i < steps.length - 1 && (
            <div className={`w-8 h-0.5 mx-2 ${
              i < currentStep ? 'bg-primary' : 'bg-surface-200'
            }`} />
          )}
        </div>
      ))}
    </div>
  );
}

// ACCIO Work natural language input
function ACCIOInput({ onSubmit }: { onSubmit: (text: string) => void }) {
  const [text, setText] = useState('');
  
  return (
    <div className="bg-gradient-to-br from-primary/10 to-transparent border border-primary/30 rounded-xl p-6 mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-primary" />
        <h3 className="font-medium text-white">ACCIO Work™ Autonomous Sourcing</h3>
      </div>
      <p className="text-sm text-surface-400 mb-4">
        Describe what you need in plain English. Our AI will identify matching chemicals and prepare your RFQ.
      </p>
      <div className="flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="e.g., 'High purity acetone for HPLC analysis, 500L, delivered to Hamburg'"
          className="flex-1 px-4 py-3 bg-surface border border-surface-200 rounded-lg text-white placeholder-surface-400"
        />
        <button
          onClick={() => onSubmit(text)}
          disabled={!text.trim()}
          className="px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50"
        >
          Analyze
        </button>
      </div>
    </div>
  );
}

export default function RFQWizard() {
  const { chemicalId } = useParams<{ chemicalId?: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isACCIOProcessing, setIsACCIOProcessing] = useState(false);
  
  const { data: prefillChemical } = useChemical(chemicalId || '');
  const createRFQ = useCreateRFQ();
  
  const { register, control, handleSubmit, watch, setValue, formState: { errors } } = useForm<RFQFormData>({
    resolver: zodResolver(rfqSchema),
    defaultValues: {
      incoterm: 'EXW',
      payment_terms: 'NET_30',
      compliance_requirements: [],
      items: chemicalId && prefillChemical ? [{
        cas_number: prefillChemical.cas_number,
        chemical_name: prefillChemical.name,
        grade: prefillChemical.grade,
        purity_required: prefillChemical.purity_min,
        quantity: 1,
        unit: 'kg',
      }] : [],
    },
  });
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });
  
  const steps = ['Items', 'Delivery', 'Requirements', 'Review'];
  
  const handleACCIO = async (text: string) => {
    setIsACCIOProcessing(true);
    try {
      // Call ACCIO API to analyze the request
      const response = await fetch('/api/accio/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: text }),
      });
      
      if (!response.ok) throw new Error('Failed to analyze request');
      
      const result = await response.json();
      
      // Pre-fill form with ACCIO results
      if (result.matched_chemicals?.length > 0) {
        const chemical = result.matched_chemicals[0];
        append({
          cas_number: chemical.cas_number,
          chemical_name: chemical.name,
          quantity: result.extracted_quantity || 1,
          unit: result.extracted_unit || 'kg',
        });
        
        if (result.extracted_delivery_location) {
          setValue('delivery_country', result.extracted_delivery_location.country);
          setValue('delivery_city', result.extracted_delivery_location.city);
        }
        
        toast.success(`Found ${result.matched_chemicals.length} matching chemical(s)`);
      }
    } catch (error) {
      toast.error('Failed to analyze request. Please try again.');
    } finally {
      setIsACCIOProcessing(false);
    }
  };
  
  const onSubmit = async (data: RFQFormData) => {
    setIsSubmitting(true);
    try {
      await createRFQ.mutateAsync({
        ...data,
        status: 'submitted',
        expires_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      });
      
      toast.success('RFQ submitted successfully!');
      navigate('/order-success');
    } catch (error) {
      toast.error('Failed to submit RFQ. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const addItem = () => {
    append({
      cas_number: '',
      chemical_name: '',
      quantity: 1,
      unit: 'kg',
    });
  };
  
  const handleChemicalSelect = (index: number, casNumber: string, name: string) => {
    setValue(`items.${index}.cas_number`, casNumber);
    setValue(`items.${index}.chemical_name`, name);
  };
  
  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <div className="bg-surface-50 border-b border-surface-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link to="/cas" className="inline-flex items-center gap-2 text-surface-400 hover:text-white mb-4">
            <ChevronLeft className="w-4 h-4" />
            Back to Directory
          </Link>
          <h1 className="text-3xl font-display font-bold text-white">Submit RFQ</h1>
          <p className="text-surface-400 mt-1">Request quotes from multiple suppliers</p>
        </div>
      </div>
      
      {/* Main content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <StepIndicator currentStep={step} steps={steps} />
        
        {/* ACCIO Work - only on first step */}
        {step === 0 && fields.length === 0 && (
          <ACCIOInput onSubmit={handleACCIO} />
        )}
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Step 1: Items */}
          {step === 0 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-medium text-white">Chemical Items</h2>
                <button
                  type="button"
                  onClick={addItem}
                  className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Item
                </button>
              </div>
              
              {fields.length === 0 && (
                <div className="text-center py-12 bg-surface-50 border border-surface-200 rounded-xl border-dashed">
                  <Beaker className="w-12 h-12 text-surface-300 mx-auto mb-4" />
                  <p className="text-surface-400 mb-4">No items added yet</p>
                  <button
                    type="button"
                    onClick={addItem}
                    className="px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-600 transition-colors"
                  >
                    Add Your First Item
                  </button>
                </div>
              )}
              
              {fields.map((field, index) => (
                <div key={field.id} className="bg-surface-50 border border-surface-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-white">Item {index + 1}</h3>
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="p-2 text-accent-error hover:bg-accent-error/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm text-surface-400 mb-2">Chemical</label>
                      <CASSearch
                        onSelect={(cas, name) => handleChemicalSelect(index, cas, name || cas)}
                        placeholder="Search by CAS or name..."
                      />
                      <input type="hidden" {...register(`items.${index}.cas_number`)} />
                      <input type="hidden" {...register(`items.${index}.chemical_name`)} />
                    </div>
                    
                    <div>
                      <label className="block text-sm text-surface-400 mb-2">Grade (Optional)</label>
                      <select {...register(`items.${index}.grade`)} className="w-full">
                        <option value="">Select grade...</option>
                        <option value="technical">Technical</option>
                        <option value="reagent">Reagent</option>
                        <option value="acs">ACS</option>
                        <option value="pharmacopeia">Pharmacopeia</option>
                        <option value="food">Food Grade</option>
                        <option value="hplc">HPLC</option>
                        <option value="gc_ms">GC-MS</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm text-surface-400 mb-2">Min Purity % (Optional)</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="100"
                        {...register(`items.${index}.purity_required`, { valueAsNumber: true })}
                        placeholder="e.g., 99.9"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm text-surface-400 mb-2">Quantity *</label>
                      <input
                        type="number"
                        step="0.001"
                        min="0.001"
                        {...register(`items.${index}.quantity`, { valueAsNumber: true })}
                        placeholder="e.g., 100"
                      />
                      {errors.items?.[index]?.quantity && (
                        <p className="text-accent-error text-sm mt-1">{errors.items[index]?.quantity?.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm text-surface-400 mb-2">Unit *</label>
                      <select {...register(`items.${index}.unit`)}>
                        <option value="kg">Kilograms (kg)</option>
                        <option value="g">Grams (g)</option>
                        <option value="mg">Milligrams (mg)</option>
                        <option value="L">Liters (L)</option>
                        <option value="mL">Milliliters (mL)</option>
                      </select>
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm text-surface-400 mb-2">Notes (Optional)</label>
                      <textarea
                        {...register(`items.${index}.notes`)}
                        rows={2}
                        placeholder="Any special requirements..."
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Step 2: Delivery */}
          {step === 1 && (
            <div className="bg-surface-50 border border-surface-200 rounded-xl p-6 space-y-6">
              <h2 className="text-xl font-medium text-white flex items-center gap-2">
                <Truck className="w-5 h-5 text-primary" />
                Delivery Details
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-surface-400 mb-2">Delivery Country *</label>
                  <input
                    {...register('delivery_country')}
                    placeholder="e.g., Germany"
                  />
                  {errors.delivery_country && (
                    <p className="text-accent-error text-sm mt-1">{errors.delivery_country.message}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm text-surface-400 mb-2">Delivery City</label>
                  <input
                    {...register('delivery_city')}
                    placeholder="e.g., Hamburg"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-surface-400 mb-2">Required Delivery Date *</label>
                  <input
                    type="date"
                    {...register('required_delivery_date')}
                    min={new Date().toISOString().split('T')[0]}
                  />
                  {errors.required_delivery_date && (
                    <p className="text-accent-error text-sm mt-1">{errors.required_delivery_date.message}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm text-surface-400 mb-2">Incoterm *</label>
                  <select {...register('incoterm')}>
                    {incoterms.map((term) => (
                      <option key={term.value} value={term.value}>{term.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
          
          {/* Step 3: Requirements */}
          {step === 2 && (
            <div className="bg-surface-50 border border-surface-200 rounded-xl p-6 space-y-6">
              <h2 className="text-xl font-medium text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Requirements
              </h2>
              
              <div>
                <label className="block text-sm text-surface-400 mb-2">Compliance Requirements</label>
                <div className="flex flex-wrap gap-2">
                  {complianceOptions.map((option) => (
                    <label key={option} className="flex items-center gap-2 px-3 py-2 bg-surface rounded-lg cursor-pointer">
                      <input
                        type="checkbox"
                        value={option}
                        {...register('compliance_requirements')}
                        className="w-4 h-4 text-primary bg-surface-100 border-surface-200 rounded"
                      />
                      <span className="text-sm text-white">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm text-surface-400 mb-2">Payment Terms *</label>
                <select {...register('payment_terms')}>
                  {paymentTerms.map((term) => (
                    <option key={term.value} value={term.value}>{term.label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm text-surface-400 mb-2">Additional Requirements</label>
                <textarea
                  {...register('additional_requirements')}
                  rows={4}
                  placeholder="Any other requirements, certifications, or special instructions..."
                />
              </div>
            </div>
          )}
          
          {/* Step 4: Review */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="bg-surface-50 border border-surface-200 rounded-xl p-6">
                <h2 className="text-xl font-medium text-white mb-4">Review Your RFQ</h2>
                
                <div className="space-y-4">
                  <div>
                    <span className="text-sm text-surface-400">Title</span>
                    <p className="text-white">{watch('title') || 'Untitled RFQ'}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-surface-400">Delivery</span>
                      <p className="text-white">{watch('delivery_city')}, {watch('delivery_country')}</p>
                    </div>
                    <div>
                      <span className="text-sm text-surface-400">Required Date</span>
                      <p className="text-white">{watch('required_delivery_date')}</p>
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-sm text-surface-400">Items ({fields.length})</span>
                    <div className="mt-2 space-y-2">
                      {fields.map((field, i) => (
                        <div key={field.id} className="p-3 bg-surface rounded-lg">
                          <p className="text-white">{watch(`items.${i}.chemical_name`)}</p>
                          <p className="text-sm text-surface-400">
                            {watch(`items.${i}.quantity`)} {watch(`items.${i}.unit`)}
                            {watch(`items.${i}.grade`) && ` · ${watch(`items.${i}.grade`)}`}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 p-4 bg-accent-info/10 border border-accent-info/30 rounded-lg">
                <FileText className="w-5 h-5 text-accent-info" />
                <p className="text-sm text-white">
                  Your RFQ will be sent to verified suppliers. You'll receive quotes within 48 hours.
                </p>
              </div>
            </div>
          )}
          
          {/* Navigation buttons */}
          <div className="flex items-center justify-between pt-6">
            <button
              type="button"
              onClick={() => setStep(Math.max(0, step - 1))}
              disabled={step === 0}
              className="px-6 py-3 bg-surface-100 text-white font-medium rounded-lg hover:bg-surface-200 transition-colors disabled:opacity-50"
            >
              Previous
            </button>
            
            {step < steps.length - 1 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-600 transition-colors"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                Submit RFQ
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
