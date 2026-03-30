import { useParams, Link } from 'react-router-dom'
import { 
  ArrowLeft, MapPin, Calendar, Clock, User, Phone, 
  FileText, Edit, MessageSquare, CheckCircle, AlertCircle,
  ChevronRight, Star, Shield
} from 'lucide-react'
import { useCarePlan, useAssignCaregiver } from '../hooks/useCarePlans'
import { useCaregiver } from '../hooks/useCaregivers'
import { useAuthStore } from '../hooks/useAuth'
import toast from 'react-hot-toast'

const careTypeLabels: Record<string, string> = {
  companionship: 'Companionship',
  personal_care: 'Personal Care',
  skilled_nursing: 'Skilled Nursing',
  respite: 'Respite Care',
  hospice: 'Hospice Care',
  post_surgical: 'Post-Surgical Care',
}

const statusLabels: Record<string, { label: string; color: string; bg: string }> = {
  draft: { label: 'Draft', color: 'text-slate-700', bg: 'bg-slate-100' },
  submitted: { label: 'Submitted', color: 'text-blue-700', bg: 'bg-blue-100' },
  matched: { label: 'Matched', color: 'text-purple-700', bg: 'bg-purple-100' },
  active: { label: 'Active', color: 'text-green-700', bg: 'bg-green-100' },
  completed: { label: 'Completed', color: 'text-slate-700', bg: 'bg-slate-100' },
  cancelled: { label: 'Cancelled', color: 'text-red-700', bg: 'bg-red-100' },
}

const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

export function CarePlanDetail() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuthStore()
  const { data: carePlanData, isLoading } = useCarePlan(id || '')
  const { data: caregiverData } = useCaregiver(carePlanData?.data?.assignedCaregiverId || '')
  const assignCaregiver = useAssignCaregiver()

  const carePlan = carePlanData?.data
  const caregiver = caregiverData?.data
  const status = carePlan ? statusLabels[carePlan.status] : null

  const isOwner = user?.id === carePlan?.familyId

  const handleAssignCaregiver = () => {
    if (!carePlan) return
    toast.success('Browse caregivers to assign to this care plan')
  }

  const handleEdit = () => {
    toast.success('Edit feature coming soon!')
  }

  const handleCancel = () => {
    toast.success('Cancel feature coming soon!')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  if (!carePlan) {
    return (
      <div className="min-h-screen bg-slate-50 py-12">
        <div className="container-custom text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Care plan not found</h1>
          <Link to="/portal" className="text-primary-600 hover:text-primary-700">
            Back to family portal
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="container-custom py-4">
          <Link
            to="/portal"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to portal
          </Link>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Card */}
            <div className="bg-white rounded-2xl shadow-card p-8">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-2xl font-bold text-slate-900">{carePlan.patientName}</h1>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${status?.bg} ${status?.color}`}>
                      {status?.label}
                    </span>
                  </div>
                  <p className="text-slate-600">{careTypeLabels[carePlan.careType]}</p>
                </div>
                {isOwner && (
                  <div className="flex gap-2">
                    <button
                      onClick={handleEdit}
                      className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    {carePlan.status !== 'cancelled' && (
                      <button
                        onClick={handleCancel}
                        className="flex items-center gap-2 px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Care Details */}
            <div className="bg-white rounded-2xl shadow-card p-8">
              <h2 className="text-lg font-semibold text-slate-900 mb-6">Care Details</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-slate-500 mb-2">Care Address</h3>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-5 h-5 text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-slate-900">{carePlan.address.street}</p>
                      <p className="text-slate-600">
                        {carePlan.address.city}, {carePlan.address.state} {carePlan.address.zipCode}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-slate-500 mb-2">Schedule</h3>
                  <div className="space-y-2">
                    <p className="flex items-center gap-2 text-slate-900">
                      <Calendar className="w-5 h-5 text-slate-400" />
                      Starts {new Date(carePlan.scheduleRequirements.startDate).toLocaleDateString()}
                    </p>
                    <p className="flex items-center gap-2 text-slate-900">
                      <Clock className="w-5 h-5 text-slate-400" />
                      {carePlan.scheduleRequirements.preferredStartTime} - {carePlan.scheduleRequirements.preferredEndTime}
                    </p>
                    <p className="text-slate-600">
                      {carePlan.scheduleRequirements.preferredDays.length} days/week · {carePlan.estimatedHoursPerWeek} hours/week
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-sm font-medium text-slate-500 mb-2">Preferred Days</h3>
                <div className="flex flex-wrap gap-2">
                  {daysOfWeek.map((day) => {
                    const isSelected = carePlan.scheduleRequirements.preferredDays.includes(day)
                    return (
                      <span
                        key={day}
                        className={`px-3 py-1 rounded-lg text-sm font-medium ${
                          isSelected
                            ? 'bg-primary-100 text-primary-700'
                            : 'bg-slate-100 text-slate-400'
                        }`}
                      >
                        {day.charAt(0).toUpperCase() + day.slice(1, 3)}
                      </span>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Care Needs */}
            <div className="bg-white rounded-2xl shadow-card p-8">
              <h2 className="text-lg font-semibold text-slate-900 mb-6">Care Needs</h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { key: 'mobilityAssistance', label: 'Mobility Assistance' },
                  { key: 'medicationReminders', label: 'Medication Reminders' },
                  { key: 'mealPreparation', label: 'Meal Preparation' },
                  { key: 'lightHousekeeping', label: 'Light Housekeeping' },
                  { key: 'bathingDressing', label: 'Bathing & Dressing' },
                  { key: 'toiletingIncontinence', label: 'Toileting/Incontinence' },
                  { key: 'transportation', label: 'Transportation' },
                ].map((need) => {
                  const isNeeded = carePlan.careNeeds[need.key as keyof typeof carePlan.careNeeds]
                  return (
                    <div
                      key={need.key}
                      className={`flex items-center gap-3 p-3 rounded-lg ${
                        isNeeded ? 'bg-green-50' : 'bg-slate-50'
                      }`}
                    >
                      <CheckCircle className={`w-5 h-5 ${isNeeded ? 'text-green-500' : 'text-slate-300'}`} />
                      <span className={isNeeded ? 'text-green-900' : 'text-slate-400'}>
                        {need.label}
                      </span>
                    </div>
                  )
                })}
              </div>

              {carePlan.careNeeds.specializedCare.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-slate-500 mb-2">Specialized Care</h3>
                  <div className="flex flex-wrap gap-2">
                    {carePlan.careNeeds.specializedCare.map((spec) => (
                      <span
                        key={spec}
                        className="px-3 py-1.5 bg-primary-50 text-primary-700 rounded-lg text-sm font-medium"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {carePlan.careNeeds.additionalNotes && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-slate-500 mb-2">Additional Notes</h3>
                  <p className="text-slate-700 bg-slate-50 p-4 rounded-lg">
                    {carePlan.careNeeds.additionalNotes}
                  </p>
                </div>
              )}
            </div>

            {/* Emergency Contact */}
            <div className="bg-white rounded-2xl shadow-card p-8">
              <h2 className="text-lg font-semibold text-slate-900 mb-6">Emergency Contact</h2>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                  <Phone className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">{carePlan.emergencyContact.name}</p>
                  <p className="text-sm text-slate-500">{carePlan.emergencyContact.relationship}</p>
                  <p className="text-slate-600 mt-1">{carePlan.emergencyContact.phone}</p>
                  {carePlan.emergencyContact.alternatePhone && (
                    <p className="text-sm text-slate-500">
                      Alt: {carePlan.emergencyContact.alternatePhone}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Assigned Caregiver */}
            <div className="bg-white rounded-2xl shadow-card p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Assigned Caregiver</h2>
              
              {caregiver ? (
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={caregiver.photoUrl || `https://ui-avatars.com/api/?name=${caregiver.firstName}+${caregiver.lastName}&background=random`}
                      alt={`${caregiver.firstName} ${caregiver.lastName}`}
                      className="w-16 h-16 rounded-xl object-cover"
                    />
                    <div>
                      <p className="font-semibold text-slate-900">
                        {caregiver.firstName} {caregiver.lastName}
                      </p>
                      <div className="flex items-center gap-1 text-sm text-slate-500">
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                        {caregiver.rating}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p className="flex items-center gap-2 text-slate-600">
                      <Shield className="w-4 h-4 text-green-500" />
                      Background checked
                    </p>
                    <p className="flex items-center gap-2 text-slate-600">
                      <FileText className="w-4 h-4 text-primary-500" />
                      {caregiver.certifications.join(', ')}
                    </p>
                  </div>
                  <div className="mt-4 space-y-2">
                    <Link
                      to={`/caregivers/${caregiver.id}`}
                      className="block w-full text-center px-4 py-2 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600"
                    >
                      View Profile
                    </Link>
                    <button
                      onClick={() => toast.success('Message sent!')}
                      className="flex items-center justify-center gap-2 w-full px-4 py-2 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Message
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <User className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-600 mb-4">No caregiver assigned yet</p>
                  <Link
                    to="/caregivers"
                    onClick={handleAssignCaregiver}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600"
                  >
                    Find Caregiver
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </div>

            {/* Budget */}
            {carePlan.hourlyBudget && (
              <div className="bg-white rounded-2xl shadow-card p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">Budget</h2>
                <div className="text-center">
                  <p className="text-3xl font-bold text-slate-900">
                    ${carePlan.hourlyBudget}
                    <span className="text-lg font-normal text-slate-500">/hr</span>
                  </p>
                  <p className="text-sm text-slate-500 mt-1">Maximum hourly rate</p>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <p className="text-sm text-slate-600">
                    Estimated weekly cost:{' '}
                    <span className="font-semibold text-slate-900">
                      ${carePlan.hourlyBudget * carePlan.estimatedHoursPerWeek}
                    </span>
                  </p>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-card p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Link
                  to="/scheduling"
                  className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                >
                  <Calendar className="w-5 h-5 text-primary-500" />
                  <span className="text-slate-700">View Schedule</span>
                </Link>
                <button
                  onClick={() => toast.success('Report an issue feature coming soon!')}
                  className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors w-full"
                >
                  <AlertCircle className="w-5 h-5 text-amber-500" />
                  <span className="text-slate-700">Report an Issue</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
