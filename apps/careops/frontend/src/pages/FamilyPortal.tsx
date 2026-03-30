import { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  Heart, Calendar, Users, Clock, FileText, Bell, 
  ChevronRight, Plus, MapPin, Phone, AlertCircle,
  CheckCircle, TrendingUp, Star, Shield
} from 'lucide-react'
import { useCarePlans } from '../hooks/useCarePlans'
import { useAuthStore } from '../hooks/useAuth'
import toast from 'react-hot-toast'

interface CareActivity {
  id: string
  type: 'shift_completed' | 'note_added' | 'medication' | 'incident'
  description: string
  caregiverName: string
  timestamp: string
  carePlanId: string
}

const mockActivities: CareActivity[] = [
  {
    id: '1',
    type: 'shift_completed',
    description: 'Completed 6-hour care shift. Patient was cooperative and in good spirits.',
    caregiverName: 'Maria Garcia',
    timestamp: '2024-01-15T15:30:00Z',
    carePlanId: '1',
  },
  {
    id: '2',
    type: 'note_added',
    description: 'Added care note: Patient enjoyed lunch and took medication on time.',
    caregiverName: 'Maria Garcia',
    timestamp: '2024-01-15T12:00:00Z',
    carePlanId: '1',
  },
  {
    id: '3',
    type: 'medication',
    description: 'Medication reminder: Blood pressure medication taken at 8:00 AM.',
    caregiverName: 'James Wilson',
    timestamp: '2024-01-14T08:00:00Z',
    carePlanId: '2',
  },
]

const activityIcons: Record<string, { icon: typeof CheckCircle; color: string; bg: string }> = {
  shift_completed: { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-100' },
  note_added: { icon: FileText, color: 'text-blue-500', bg: 'bg-blue-100' },
  medication: { icon: AlertCircle, color: 'text-amber-500', bg: 'bg-amber-100' },
  incident: { icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-100' },
}

export function FamilyPortal() {
  const { user } = useAuthStore()
  const { data: carePlansData } = useCarePlans(user?.id)
  const [activeTab, setActiveTab] = useState<'overview' | 'careplans' | 'activity'>('overview')

  const carePlans = carePlansData?.data || []
  const activeCarePlans = carePlans.filter(cp => cp.status === 'active')
  const pendingCarePlans = carePlans.filter(cp => cp.status === 'draft' || cp.status === 'submitted')

  const stats = {
    activeCarePlans: activeCarePlans.length,
    totalHours: 42,
    caregivers: new Set(carePlans.map(cp => cp.assignedCaregiverId).filter(Boolean)).size,
    upcomingVisits: 3,
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="container-custom py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Family Portal</h1>
              <p className="text-slate-600">Welcome back, {user?.firstName}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => toast.success('Notifications viewed')}
                className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <Link
                to="/care-plans/new"
                className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600"
              >
                <Plus className="w-4 h-4" />
                New Care Plan
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-slate-200">
        <div className="container-custom">
          <div className="flex gap-1">
            {[
              { id: 'overview', label: 'Overview', icon: TrendingUp },
              { id: 'careplans', label: 'Care Plans', icon: FileText },
              { id: 'activity', label: 'Activity', icon: Clock },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container-custom py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Active Care Plans', value: stats.activeCarePlans, icon: FileText, color: 'bg-blue-500' },
                { label: 'Hours This Month', value: stats.totalHours, icon: Clock, color: 'bg-green-500' },
                { label: 'Caregivers', value: stats.caregivers, icon: Users, color: 'bg-purple-500' },
                { label: 'Upcoming Visits', value: stats.upcomingVisits, icon: Calendar, color: 'bg-amber-500' },
              ].map((stat, index) => (
                <div key={index} className="bg-white rounded-xl shadow-card p-6">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                      <p className="text-sm text-slate-500">{stat.label}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Active Care Plans */}
              <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-slate-900">Active Care Plans</h2>
                  <Link to="/careplans" className="text-sm text-primary-600 hover:text-primary-700">
                    View all
                  </Link>
                </div>

                {activeCarePlans.length === 0 ? (
                  <div className="bg-white rounded-xl shadow-card p-8 text-center">
                    <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-600 mb-4">No active care plans yet</p>
                    <Link
                      to="/care-plans/new"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600"
                    >
                      <Plus className="w-4 h-4" />
                      Create Care Plan
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activeCarePlans.map((carePlan) => (
                      <Link
                        key={carePlan.id}
                        to={`/care-plans/${carePlan.id}`}
                        className="block bg-white rounded-xl shadow-card p-6 hover:shadow-soft transition-shadow"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-slate-900">{carePlan.patientName}</h3>
                              <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                                Active
                              </span>
                            </div>
                            <p className="text-sm text-slate-600 mb-3">
                              {carePlan.careType.replace('_', ' ')} · {carePlan.estimatedHoursPerWeek} hrs/week
                            </p>
                            <div className="flex items-center gap-4 text-sm text-slate-500">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {carePlan.address.city}, {carePlan.address.state}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                Started {new Date(carePlan.scheduleRequirements.startDate).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-slate-400" />
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                {/* Recent Activity */}
                <div className="mt-8">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-slate-900">Recent Activity</h2>
                    <button
                      onClick={() => setActiveTab('activity')}
                      className="text-sm text-primary-600 hover:text-primary-700"
                    >
                      View all
                    </button>
                  </div>

                  <div className="bg-white rounded-xl shadow-card p-6">
                    <div className="space-y-4">
                      {mockActivities.slice(0, 3).map((activity) => {
                        const style = activityIcons[activity.type]
                        const Icon = style.icon
                        return (
                          <div key={activity.id} className="flex items-start gap-4">
                            <div className={`w-10 h-10 ${style.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                              <Icon className={`w-5 h-5 ${style.color}`} />
                            </div>
                            <div className="flex-1">
                              <p className="text-slate-900">{activity.description}</p>
                              <p className="text-sm text-slate-500 mt-1">
                                {activity.caregiverName} · {new Date(activity.timestamp).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Quick Actions */}
                <div className="bg-white rounded-xl shadow-card p-6">
                  <h2 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h2>
                  <div className="space-y-3">
                    <Link
                      to="/care-plans/new"
                      className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                    >
                      <Plus className="w-5 h-5 text-primary-500" />
                      <span className="text-slate-700">Create Care Plan</span>
                    </Link>
                    <Link
                      to="/caregivers"
                      className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                    >
                      <Users className="w-5 h-5 text-primary-500" />
                      <span className="text-slate-700">Find Caregivers</span>
                    </Link>
                    <Link
                      to="/scheduling"
                      className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                    >
                      <Calendar className="w-5 h-5 text-primary-500" />
                      <span className="text-slate-700">View Schedule</span>
                    </Link>
                  </div>
                </div>

                {/* Care Tips */}
                <div className="bg-primary-50 rounded-xl p-6">
                  <h2 className="text-lg font-semibold text-primary-900 mb-4">Care Tips</h2>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2 text-sm text-primary-800">
                      <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      Keep a consistent routine for better care outcomes
                    </li>
                    <li className="flex items-start gap-2 text-sm text-primary-800">
                      <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      Communicate regularly with your caregiver
                    </li>
                    <li className="flex items-start gap-2 text-sm text-primary-800">
                      <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      Update care plans as needs change
                    </li>
                  </ul>
                </div>

                {/* Support */}
                <div className="bg-white rounded-xl shadow-card p-6">
                  <h2 className="text-lg font-semibold text-slate-900 mb-4">Need Help?</h2>
                  <p className="text-sm text-slate-600 mb-4">
                    Our care coordinators are available 24/7 to assist you.
                  </p>
                  <div className="space-y-2">
                    <a
                      href="tel:1-800-CAREOPS"
                      className="flex items-center gap-2 text-primary-600 hover:text-primary-700"
                    >
                      <Phone className="w-4 h-4" />
                      1-800-CAREOPS
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Care Plans Tab */}
        {activeTab === 'careplans' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">All Care Plans</h2>
              <Link
                to="/care-plans/new"
                className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600"
              >
                <Plus className="w-4 h-4" />
                New Care Plan
              </Link>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {carePlans.map((carePlan) => (
                <Link
                  key={carePlan.id}
                  to={`/care-plans/${carePlan.id}`}
                  className="bg-white rounded-xl shadow-card p-6 hover:shadow-soft transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-slate-900">{carePlan.patientName}</h3>
                      <p className="text-sm text-slate-500">
                        {carePlan.careType.replace('_', ' ')}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      carePlan.status === 'active' ? 'bg-green-100 text-green-700' :
                      carePlan.status === 'draft' ? 'bg-slate-100 text-slate-700' :
                      carePlan.status === 'matched' ? 'bg-blue-100 text-blue-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {carePlan.status}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm text-slate-600">
                    <p className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {carePlan.address.city}, {carePlan.address.state}
                    </p>
                    <p className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {carePlan.estimatedHoursPerWeek} hours/week
                    </p>
                    <p className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {carePlan.scheduleRequirements.preferredDays.length} days/week
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Activity Tab */}
        {activeTab === 'activity' && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-slate-900">Care Activity</h2>

            <div className="bg-white rounded-xl shadow-card p-6">
              <div className="space-y-6">
                {mockActivities.map((activity) => {
                  const style = activityIcons[activity.type]
                  const Icon = style.icon
                  return (
                    <div key={activity.id} className="flex items-start gap-4 pb-6 border-b border-slate-100 last:border-0 last:pb-0">
                      <div className={`w-12 h-12 ${style.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`w-6 h-6 ${style.color}`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-slate-900">{activity.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {activity.caregiverName}
                          </span>
                          <span>
                            {new Date(activity.timestamp).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
