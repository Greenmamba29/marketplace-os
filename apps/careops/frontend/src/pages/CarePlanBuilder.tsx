import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { 
  ChevronRight, ChevronLeft, User, MapPin, Calendar, 
  Clock, Heart, Activity, FileText, CheckCircle, 
  Home, Pill, Utensils, Car, Sparkles, AlertCircle
} from 'lucide-react'
import { useCreateCarePlan } from '../hooks/useCarePlans'
import { useAuthStore } from '../hooks/useAuth'
import toast from 'react-hot-toast'

const carePlanSchema = z.object({
  patientName: z.string().min(2, 'Patient name is required'),
  patientAge: z.string().optional(),
  careType: z.enum(['companionship', 'personal_care', 'skilled_nursing', 'respite', 'hospice', 'post_surgical']),
  address: z.object({
    street: z.string().min(5, 'Street address is required'),
    city: z.string().min(2, 'City is required'),
    state: z.string().length(2, 'State code required'),
    zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, 'Valid ZIP code required'),
  }),
  scheduleRequirements: z.object({
    startDate: z.string().min(1, 'Start date is required'),
    ongoing: z.boolean(),
    durationWeeks: z.string().optional(),
    preferredDays: z.array(z.string()).min(1, 'Select at least one day'),
    preferredStartTime: z.string().min(1, 'Start time is required'),
    preferredEndTime: z.string().min(1, 'End time is required'),
    flexibility: z.enum(['strict', 'moderate', 'flexible']),
  }),
  careNeeds: z.object({
    mobilityAssistance: z.boolean(),
    medicationReminders: z.boolean(),
    mealPreparation: z.boolean(),
    lightHousekeeping: z.boolean(),
    bathingDressing: z.boolean(),
    toiletingIncontinence: z.boolean(),
    transportation: z.boolean(),
    specializedCare: z.array(z.string()),
    additionalNotes: z.string().optional(),
  }),
  emergencyContact: z.object({
    name: z.string().min(2, 'Contact name is required'),
    relationship: z.string().min(2, 'Relationship is required'),
    phone: z.string().min(10, 'Valid phone number required'),
    alternatePhone: z.string().optional(),
  }),
  hourlyBudget: z.string().optional(),
})

type CarePlanForm = z.infer<typeof carePlanSchema>

const careTypes = [
  { value: 'companionship', label: 'Companionship', icon: Heart, description: 'Social interaction and companionship' },
  { value: 'personal_care', label: 'Personal Care', icon: Sparkles, description: 'Assistance with daily activities' },
  { value: 'skilled_nursing', label: 'Skilled Nursing', icon: Activity, description: 'Medical care from licensed nurses' },
  { value: 'respite', label: 'Respite Care', icon: Home, description: 'Temporary relief for primary caregivers' },
  { value: 'hospice', label: 'Hospice Care', icon: Heart, description: 'End-of-life comfort and support' },
  { value: 'post_surgical', label: 'Post-Surgical', icon: Activity, description: 'Recovery assistance after surgery' },
]

const daysOfWeek = [
  { value: 'monday', label: 'Mon' },
  { value: 'tuesday', label: 'Tue' },
  { value: 'wednesday', label: 'Wed' },
  { value: 'thursday', label: 'Thu' },
  { value: 'friday', label: 'Fri' },
  { value: 'saturday', label: 'Sat' },
  { value: 'sunday', label: 'Sun' },
]

const specializations = [
  { value: 'dementia', label: 'Dementia/Alzheimer\'s', icon: Heart },
  { value: 'pediatric', label: 'Pediatric Care', icon: User },
  { value: 'post-surgical', label: 'Post-Surgical', icon: Activity },
  { value: 'mobility', label: 'Mobility Assistance', icon: Activity },
  { value: 'medication', label: 'Medication Management', icon: Pill },
  { value: 'hospice', label: 'Hospice/Palliative', icon: Heart },
  { value: 'autism', label: 'Autism Care', icon: User },
  { value: 'diabetes', label: 'Diabetes Care', icon: Activity },
]

export function CarePlanBuilder() {
  const [step, setStep] = useState(1)
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const createCarePlan = useCreateCarePlan()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CarePlanForm>({
    resolver: zodResolver(carePlanSchema),
    defaultValues: {
      careType: 'personal_care',
      scheduleRequirements: {
        ongoing: true,
        preferredDays: [],
        flexibility: 'moderate',
      },
      careNeeds: {
        mobilityAssistance: false,
        medicationReminders: false,
        mealPreparation: false,
        lightHousekeeping: false,
        bathingDressing: false,
        toiletingIncontinence: false,
        transportation: false,
        specializedCare: [],
      },
    },
  })

  const selectedCareType = watch('careType')
  const selectedDays = watch('scheduleRequirements.preferredDays') || []
  const selectedSpecializations = watch('careNeeds.specializedCare') || []
  const isOngoing = watch('scheduleRequirements.ongoing')

  const toggleDay = (day: string) => {
    const current = selectedDays
    const updated = current.includes(day)
      ? current.filter((d) => d !== day)
      : [...current, day]
    setValue('scheduleRequirements.preferredDays', updated)
  }

  const toggleSpecialization = (spec: string) => {
    const current = selectedSpecializations
    const updated = current.includes(spec)
      ? current.filter((s) => s !== spec)
      : [...current, spec]
    setValue('careNeeds.specializedCare', updated)
  }

  const onSubmit = async (data: CarePlanForm) => {
    try {
      await createCarePlan.mutateAsync({
        ...data,
        familyId: user?.id || '',
        patientAge: data.patientAge ? parseInt(data.patientAge) : undefined,
        status: 'draft',
        estimatedHoursPerWeek: selectedDays.length * 4, // Rough estimate
        hourlyBudget: data.hourlyBudget ? parseInt(data.hourlyBudget) : undefined,
        scheduleRequirements: {
          ...data.scheduleRequirements,
          durationWeeks: data.scheduleRequirements.durationWeeks 
            ? parseInt(data.scheduleRequirements.durationWeeks) 
            : undefined,
        },
      })
      toast.success('Care plan created successfully!')
      navigate('/portal')
    } catch (error) {
      toast.error('Failed to create care plan. Please try again.')
    }
  }

  const steps = [
    { number: 1, title: 'Care Type', description: 'What type of care do you need?' },
    { number: 2, title: 'Patient Info', description: 'Tell us about the patient' },
    { number: 3, title: 'Schedule', description: 'When do you need care?' },
    { number: 4, title: 'Care Needs', description: 'What assistance is needed?' },
    { number: 5, title: 'Emergency Contact', description: 'Who should we contact?' },
    { number: 6, title: 'Review', description: 'Review and submit' },
  ]

  const nextStep = () => setStep(Math.min(step + 1, 6))
  const prevStep = () => setStep(Math.max(step - 1, 1))

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="container-custom max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Create Care Plan</h1>
          <p className="text-slate-600">Tell us about your care needs and we'll match you with qualified caregivers</p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((s, i) => (
              <div key={s.number} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                    step > s.number
                      ? 'bg-green-500 text-white'
                      : step === s.number
                      ? 'bg-primary-500 text-white'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {step > s.number ? <CheckCircle className="w-5 h-5" /> : s.number}
                </div>
                {i < steps.length - 1 && (
                  <div
                    className={`w-12 h-0.5 mx-2 ${
                      step > s.number ? 'bg-green-500' : 'bg-slate-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-4">
            <p className="text-sm text-slate-500">
              Step {step} of 6: <span className="font-medium text-slate-900">{steps[step - 1].title}</span>
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="bg-white rounded-2xl shadow-card p-8">
            {/* Step 1: Care Type */}
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-slate-900">What type of care do you need?</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {careTypes.map((type) => (
                    <label
                      key={type.value}
                      className={`relative flex items-start gap-4 p-6 border-2 rounded-xl cursor-pointer transition-all ${
                        selectedCareType === type.value
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <input
                        {...register('careType')}
                        type="radio"
                        value={type.value}
                        className="sr-only"
                      />
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        selectedCareType === type.value ? 'bg-primary-500' : 'bg-slate-100'
                      }`}>
                        <type.icon className={`w-6 h-6 ${selectedCareType === type.value ? 'text-white' : 'text-slate-500'}`} />
                      </div>
                      <div>
                        <p className={`font-medium ${selectedCareType === type.value ? 'text-primary-900' : 'text-slate-900'}`}>
                          {type.label}
                        </p>
                        <p className="text-sm text-slate-500">{type.description}</p>
                      </div>
                      {selectedCareType === type.value && (
                        <CheckCircle className="absolute top-4 right-4 w-5 h-5 text-primary-500" />
                      )}
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Patient Info */}
            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-slate-900">Tell us about the patient</h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="label">Patient Name</label>
                    <input
                      {...register('patientName')}
                      className={`input ${errors.patientName ? 'input-error' : ''}`}
                      placeholder="Full name"
                    />
                    {errors.patientName && (
                      <p className="mt-1 text-sm text-red-600">{errors.patientName.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="label">Age (optional)</label>
                    <input
                      {...register('patientAge')}
                      type="number"
                      className="input"
                      placeholder="Years"
                    />
                  </div>
                </div>

                <div>
                  <label className="label">Care Address</label>
                  <div className="space-y-4">
                    <input
                      {...register('address.street')}
                      className={`input ${errors.address?.street ? 'input-error' : ''}`}
                      placeholder="Street address"
                    />
                    <div className="grid grid-cols-3 gap-4">
                      <input
                        {...register('address.city')}
                        className={`input ${errors.address?.city ? 'input-error' : ''}`}
                        placeholder="City"
                      />
                      <input
                        {...register('address.state')}
                        className={`input ${errors.address?.state ? 'input-error' : ''}`}
                        placeholder="State"
                        maxLength={2}
                      />
                      <input
                        {...register('address.zipCode')}
                        className={`input ${errors.address?.zipCode ? 'input-error' : ''}`}
                        placeholder="ZIP code"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="label">Hourly Budget (optional)</label>
                  <input
                    {...register('hourlyBudget')}
                    type="number"
                    className="input"
                    placeholder="Maximum hourly rate you're willing to pay"
                  />
                </div>
              </div>
            )}

            {/* Step 3: Schedule */}
            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-slate-900">When do you need care?</h2>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="label">Start Date</label>
                    <input
                      {...register('scheduleRequirements.startDate')}
                      type="date"
                      className={`input ${errors.scheduleRequirements?.startDate ? 'input-error' : ''}`}
                    />
                  </div>
                  <div>
                    <label className="label">Duration</label>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2">
                        <input
                          {...register('scheduleRequirements.ongoing')}
                          type="checkbox"
                          className="w-4 h-4 text-primary-500"
                        />
                        <span className="text-sm">Ongoing</span>
                      </label>
                      {!isOngoing && (
                        <input
                          {...register('scheduleRequirements.durationWeeks')}
                          type="number"
                          className="input w-24"
                          placeholder="Weeks"
                        />
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="label">Preferred Days</label>
                  <div className="flex flex-wrap gap-2">
                    {daysOfWeek.map((day) => (
                      <button
                        key={day.value}
                        type="button"
                        onClick={() => toggleDay(day.value)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          selectedDays.includes(day.value)
                            ? 'bg-primary-500 text-white'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {day.label}
                      </button>
                    ))}
                  </div>
                  {errors.scheduleRequirements?.preferredDays && (
                    <p className="mt-1 text-sm text-red-600">{errors.scheduleRequirements.preferredDays.message}</p>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="label">Preferred Start Time</label>
                    <input
                      {...register('scheduleRequirements.preferredStartTime')}
                      type="time"
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="label">Preferred End Time</label>
                    <input
                      {...register('scheduleRequirements.preferredEndTime')}
                      type="time"
                      className="input"
                    />
                  </div>
                </div>

                <div>
                  <label className="label">Schedule Flexibility</label>
                  <div className="flex gap-4">
                    {['strict', 'moderate', 'flexible'].map((flex) => (
                      <label key={flex} className="flex items-center gap-2">
                        <input
                          {...register('scheduleRequirements.flexibility')}
                          type="radio"
                          value={flex}
                          className="w-4 h-4 text-primary-500"
                        />
                        <span className="text-sm capitalize">{flex}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Care Needs */}
            {step === 4 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-slate-900">What assistance is needed?</h2>

                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { key: 'mobilityAssistance', label: 'Mobility Assistance', icon: Activity },
                    { key: 'medicationReminders', label: 'Medication Reminders', icon: Pill },
                    { key: 'mealPreparation', label: 'Meal Preparation', icon: Utensils },
                    { key: 'lightHousekeeping', label: 'Light Housekeeping', icon: Home },
                    { key: 'bathingDressing', label: 'Bathing & Dressing', icon: Sparkles },
                    { key: 'toiletingIncontinence', label: 'Toileting/Incontinence', icon: AlertCircle },
                    { key: 'transportation', label: 'Transportation', icon: Car },
                  ].map((need) => (
                    <label
                      key={need.key}
                      className="flex items-center gap-3 p-4 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50"
                    >
                      <input
                        {...register(`careNeeds.${need.key as keyof CarePlanForm['careNeeds']}` as const)}
                        type="checkbox"
                        className="w-5 h-5 text-primary-500 rounded"
                      />
                      <need.icon className="w-5 h-5 text-slate-400" />
                      <span className="text-slate-700">{need.label}</span>
                    </label>
                  ))}
                </div>

                <div>
                  <label className="label">Specialized Care Needs</label>
                  <div className="flex flex-wrap gap-2">
                    {specializations.map((spec) => (
                      <button
                        key={spec.value}
                        type="button"
                        onClick={() => toggleSpecialization(spec.value)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          selectedSpecializations.includes(spec.value)
                            ? 'bg-primary-500 text-white'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        <spec.icon className="w-4 h-4" />
                        {spec.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="label">Additional Notes</label>
                  <textarea
                    {...register('careNeeds.additionalNotes')}
                    rows={4}
                    className="input"
                    placeholder="Any other details about care needs..."
                  />
                </div>
              </div>
            )}

            {/* Step 5: Emergency Contact */}
            {step === 5 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-slate-900">Emergency Contact</h2>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="label">Contact Name</label>
                    <input
                      {...register('emergencyContact.name')}
                      className={`input ${errors.emergencyContact?.name ? 'input-error' : ''}`}
                      placeholder="Full name"
                    />
                    {errors.emergencyContact?.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.emergencyContact.name.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="label">Relationship</label>
                    <input
                      {...register('emergencyContact.relationship')}
                      className={`input ${errors.emergencyContact?.relationship ? 'input-error' : ''}`}
                      placeholder="e.g., Son, Daughter, Spouse"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="label">Phone Number</label>
                    <input
                      {...register('emergencyContact.phone')}
                      className={`input ${errors.emergencyContact?.phone ? 'input-error' : ''}`}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                  <div>
                    <label className="label">Alternate Phone (optional)</label>
                    <input
                      {...register('emergencyContact.alternatePhone')}
                      className="input"
                      placeholder="(555) 987-6543"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 6: Review */}
            {step === 6 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-slate-900">Review Your Care Plan</h2>

                <div className="bg-slate-50 rounded-xl p-6 space-y-4">
                  <div className="flex justify-between py-2 border-b border-slate-200">
                    <span className="text-slate-500">Care Type</span>
                    <span className="font-medium text-slate-900">
                      {careTypes.find(t => t.value === selectedCareType)?.label}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-200">
                    <span className="text-slate-500">Patient</span>
                    <span className="font-medium text-slate-900">{watch('patientName')}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-200">
                    <span className="text-slate-500">Schedule</span>
                    <span className="font-medium text-slate-900">
                      {selectedDays.length} days/week, {watch('scheduleRequirements.preferredStartTime')} - {watch('scheduleRequirements.preferredEndTime')}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-200">
                    <span className="text-slate-500">Care Needs</span>
                    <span className="font-medium text-slate-900">
                      {selectedSpecializations.length} specializations selected
                    </span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-slate-500">Emergency Contact</span>
                    <span className="font-medium text-slate-900">{watch('emergencyContact.name')}</span>
                  </div>
                </div>

                <div className="bg-primary-50 rounded-xl p-4">
                  <p className="text-sm text-primary-800">
                    After submitting, we'll match you with qualified caregivers based on your requirements. 
                    You'll be able to review profiles and interview candidates before making a selection.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <button
              type="button"
              onClick={prevStep}
              disabled={step === 1}
              className="flex items-center gap-2 px-6 py-3 border border-slate-200 rounded-lg text-slate-700 font-medium hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
              Back
            </button>

            {step < 6 ? (
              <button
                type="button"
                onClick={nextStep}
                className="flex items-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600"
              >
                Continue
                <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={createCarePlan.isPending}
                className="flex items-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 disabled:opacity-50"
              >
                {createCarePlan.isPending ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Creating...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Submit Care Plan
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
