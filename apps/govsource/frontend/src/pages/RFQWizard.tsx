import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { 
  ChevronRight, 
  ChevronLeft, 
  Plus, 
  Trash2, 
  Building2,
  FileText,
  Users,
  CheckCircle,
  AlertCircle,
  Calendar,
  DollarSign,
  MapPin
} from 'lucide-react'
import { useCreateRFQ } from '@/hooks/useRFQs'
import { useRFP } from '@/hooks/useRFPs'
import toast from 'react-hot-toast'

const rfqSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  lineItems: z.array(z.object({
    description: z.string().min(1, 'Description is required'),
    quantity: z.number().min(1, 'Quantity must be at least 1'),
    unit: z.string().min(1, 'Unit is required'),
    requiredDeliveryDate: z.string().min(1, 'Delivery date is required'),
  })).min(1, 'At least one line item is required'),
  deliveryAddress: z.object({
    street: z.string().min(1, 'Street is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    zipCode: z.string().min(5, 'ZIP code is required'),
    country: z.string().default('USA'),
  }),
  paymentTerms: z.string().default('Net 30'),
  invitedVendors: z.array(z.string()),
})

type RFQFormData = z.infer<typeof rfqSchema>

const steps = [
  { id: 1, name: 'Basic Info', icon: FileText },
  { id: 2, name: 'Line Items', icon: Plus },
  { id: 3, name: 'Delivery', icon: MapPin },
  { id: 4, name: 'Vendors', icon: Users },
  { id: 5, name: 'Review', icon: CheckCircle },
]

export function RFQWizard() {
  const { rfpId } = useParams()
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const createRFQ = useCreateRFQ()
  
  const { data: rfp } = useRFP(rfpId || '')

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RFQFormData>({
    resolver: zodResolver(rfqSchema),
    defaultValues: {
      title: rfp?.title || '',
      description: rfp?.description || '',
      lineItems: [{ description: '', quantity: 1, unit: 'EA', requiredDeliveryDate: '' }],
      deliveryAddress: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'USA',
      },
      paymentTerms: 'Net 30',
      invitedVendors: [],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'lineItems',
  })

  const formValues = watch()

  const onSubmit = async (data: RFQFormData) => {
    try {
      await createRFQ.mutateAsync({
        ...data,
        rfpId,
        status: 'DRAFT',
      })
      toast.success('RFQ created successfully!')
      navigate('/buyer-dashboard')
    } catch (error) {
      toast.error('Failed to create RFQ')
    }
  }

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const StepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <div className={`flex flex-col items-center ${
            step.id === currentStep 
              ? 'text-blue-400' 
              : step.id < currentStep 
                ? 'text-emerald-400' 
                : 'text-slate-500'
          }`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
              step.id === currentStep 
                ? 'border-blue-500 bg-blue-500/10' 
                : step.id < currentStep 
                  ? 'border-emerald-500 bg-emerald-500/10' 
                  : 'border-slate-600 bg-slate-800'
            }`}>
              <step.icon className="w-5 h-5" />
            </div>
            <span className="text-xs mt-1">{step.name}</span>
          </div>
          {index < steps.length - 1 && (
            <div className={`w-12 h-0.5 mx-2 ${
              step.id < currentStep ? 'bg-emerald-500' : 'bg-slate-700'
            }`} />
          )}
        </div>
      ))}
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Create RFQ</h1>
              <p className="text-slate-400 text-sm">
                {rfpId ? `Based on RFP: ${rfp?.solicitationNumber || rfpId}` : 'Create a new Request for Quote'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <StepIndicator />

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <div className="card p-6 space-y-6">
              <h2 className="text-lg font-semibold text-white">Basic Information</h2>
              
              <div>
                <label className="form-label">RFQ Title</label>
                <input
                  {...register('title')}
                  className="form-input"
                  placeholder="Enter RFQ title"
                />
                {errors.title && (
                  <p className="form-error">{errors.title.message}</p>
                )}
              </div>

              <div>
                <label className="form-label">Description</label>
                <textarea
                  {...register('description')}
                  rows={4}
                  className="form-input"
                  placeholder="Describe the requirements and scope of work"
                />
                {errors.description && (
                  <p className="form-error">{errors.description.message}</p>
                )}
              </div>

              <div>
                <label className="form-label">Payment Terms</label>
                <select {...register('paymentTerms')} className="form-input">
                  <option value="Net 15">Net 15</option>
                  <option value="Net 30">Net 30</option>
                  <option value="Net 45">Net 45</option>
                  <option value="Net 60">Net 60</option>
                </select>
              </div>
            </div>
          )}

          {/* Step 2: Line Items */}
          {currentStep === 2 && (
            <div className="card p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">Line Items</h2>
                <button
                  type="button"
                  onClick={() => append({ description: '', quantity: 1, unit: 'EA', requiredDeliveryDate: '' })}
                  className="btn btn-secondary text-sm"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Item
                </button>
              </div>

              <div className="space-y-4">
                {fields.map((field, index) => (
                  <div key={field.id} className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-medium text-slate-400">Item #{index + 1}</span>
                      {fields.length > 1 && (
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <label className="form-label">Description</label>
                        <input
                          {...register(`lineItems.${index}.description`)}
                          className="form-input"
                          placeholder="Item description"
                        />
                      </div>
                      <div>
                        <label className="form-label">Quantity</label>
                        <input
                          type="number"
                          {...register(`lineItems.${index}.quantity`, { valueAsNumber: true })}
                          className="form-input"
                          min={1}
                        />
                      </div>
                      <div>
                        <label className="form-label">Unit</label>
                        <select {...register(`lineItems.${index}.unit`)} className="form-input">
                          <option value="EA">Each (EA)</option>
                          <option value="BOX">Box</option>
                          <option value="CASE">Case</option>
                          <option value="LOT">Lot</option>
                          <option value="HR">Hour</option>
                          <option value="DAY">Day</option>
                        </select>
                      </div>
                      <div className="sm:col-span-2">
                        <label className="form-label">Required Delivery Date</label>
                        <input
                          type="date"
                          {...register(`lineItems.${index}.requiredDeliveryDate`)}
                          className="form-input"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Delivery */}
          {currentStep === 3 && (
            <div className="card p-6 space-y-6">
              <h2 className="text-lg font-semibold text-white">Delivery Information</h2>
              
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="form-label">Street Address</label>
                  <input
                    {...register('deliveryAddress.street')}
                    className="form-input"
                    placeholder="Street address"
                  />
                </div>
                <div>
                  <label className="form-label">City</label>
                  <input
                    {...register('deliveryAddress.city')}
                    className="form-input"
                    placeholder="City"
                  />
                </div>
                <div>
                  <label className="form-label">State</label>
                  <input
                    {...register('deliveryAddress.state')}
                    className="form-input"
                    placeholder="State"
                  />
                </div>
                <div>
                  <label className="form-label">ZIP Code</label>
                  <input
                    {...register('deliveryAddress.zipCode')}
                    className="form-input"
                    placeholder="ZIP code"
                  />
                </div>
                <div>
                  <label className="form-label">Country</label>
                  <input
                    {...register('deliveryAddress.country')}
                    className="form-input"
                    disabled
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Vendors */}
          {currentStep === 4 && (
            <div className="card p-6 space-y-6">
              <h2 className="text-lg font-semibold text-white">Select Vendors</h2>
              <p className="text-slate-400">
                Choose vendors to invite to this RFQ. You can search and filter by NAICS codes, 
                set-aside status, and location.
              </p>
              
              <div className="p-8 bg-slate-800/50 rounded-lg border border-slate-700 border-dashed text-center">
                <Users className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400 mb-4">
                  Vendor selection interface would be integrated here
                </p>
                <button type="button" className="btn btn-secondary">
                  Browse Vendors
                </button>
              </div>
            </div>
          )}

          {/* Step 5: Review */}
          {currentStep === 5 && (
            <div className="card p-6 space-y-6">
              <h2 className="text-lg font-semibold text-white">Review RFQ</h2>
              
              <div className="space-y-4">
                <div className="p-4 bg-slate-800/50 rounded-lg">
                  <h3 className="text-sm font-medium text-slate-400 mb-2">Title</h3>
                  <p className="text-white">{formValues.title}</p>
                </div>
                
                <div className="p-4 bg-slate-800/50 rounded-lg">
                  <h3 className="text-sm font-medium text-slate-400 mb-2">Description</h3>
                  <p className="text-white">{formValues.description}</p>
                </div>

                <div className="p-4 bg-slate-800/50 rounded-lg">
                  <h3 className="text-sm font-medium text-slate-400 mb-2">Line Items ({formValues.lineItems?.length || 0})</h3>
                  <ul className="space-y-2">
                    {formValues.lineItems?.map((item, idx) => (
                      <li key={idx} className="text-white text-sm">
                        {idx + 1}. {item.description} - {item.quantity} {item.unit}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 bg-slate-800/50 rounded-lg">
                  <h3 className="text-sm font-medium text-slate-400 mb-2">Delivery Address</h3>
                  <p className="text-white">
                    {formValues.deliveryAddress?.street}<br />
                    {formValues.deliveryAddress?.city}, {formValues.deliveryAddress?.state} {formValues.deliveryAddress?.zipCode}
                  </p>
                </div>

                <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-400 mt-0.5" />
                    <div>
                      <h3 className="text-amber-400 font-medium">Approval Required</h3>
                      <p className="text-slate-400 text-sm mt-1">
                        This RFQ will require approval from your contracting officer before being sent to vendors.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="btn btn-outline disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </button>

            {currentStep < steps.length ? (
              <button
                type="button"
                onClick={nextStep}
                className="btn btn-primary"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={createRFQ.isPending}
                className="btn btn-primary disabled:opacity-50"
              >
                {createRFQ.isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Creating...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Create RFQ
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
