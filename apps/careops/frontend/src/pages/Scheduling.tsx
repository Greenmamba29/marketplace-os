import { useState } from 'react'
import { 
  Calendar as CalendarIcon, Clock, MapPin, User, 
  CheckCircle, XCircle, AlertCircle, ChevronLeft, 
  ChevronRight, Filter, Plus
} from 'lucide-react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import { useAuthStore } from '../hooks/useAuth'
import toast from 'react-hot-toast'

interface Shift {
  id: string
  date: Date
  startTime: string
  endTime: string
  caregiverName: string
  caregiverPhoto?: string
  patientName: string
  status: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
  address: string
  notes?: string
}

const mockShifts: Shift[] = [
  {
    id: '1',
    date: new Date(),
    startTime: '09:00',
    endTime: '15:00',
    caregiverName: 'Maria Garcia',
    caregiverPhoto: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face',
    patientName: 'Eleanor Thompson',
    status: 'confirmed',
    address: '123 Maple St, Beverly Hills, CA',
    notes: 'Regular care visit. Patient is doing well.',
  },
  {
    id: '2',
    date: new Date(Date.now() + 86400000),
    startTime: '10:00',
    endTime: '16:00',
    caregiverName: 'James Wilson',
    caregiverPhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    patientName: 'Robert Martinez',
    status: 'scheduled',
    address: '456 Oak Ave, Los Angeles, CA',
  },
  {
    id: '3',
    date: new Date(Date.now() - 86400000),
    startTime: '08:00',
    endTime: '14:00',
    caregiverName: 'Lisa Chen',
    caregiverPhoto: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    patientName: 'Sophie Williams',
    status: 'completed',
    address: '789 Pine Rd, San Francisco, CA',
    notes: 'All tasks completed successfully.',
  },
]

const statusColors: Record<string, { bg: string; text: string; icon: typeof CheckCircle }> = {
  scheduled: { bg: 'bg-blue-100', text: 'text-blue-700', icon: Clock },
  confirmed: { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle },
  in_progress: { bg: 'bg-amber-100', text: 'text-amber-700', icon: Clock },
  completed: { bg: 'bg-slate-100', text: 'text-slate-700', icon: CheckCircle },
  cancelled: { bg: 'bg-red-100', text: 'text-red-700', icon: XCircle },
}

export function Scheduling() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const { user } = useAuthStore()

  const isCaregiver = user?.role === 'caregiver'

  const filteredShifts = mockShifts.filter((shift) => {
    if (filterStatus === 'all') return true
    return shift.status === filterStatus
  })

  const shiftsForSelectedDate = filteredShifts.filter(
    (shift) => shift.date.toDateString() === selectedDate.toDateString()
  )

  const upcomingShifts = filteredShifts.filter(
    (shift) => shift.date >= new Date() && shift.status !== 'cancelled'
  )

  const handleClockIn = (shiftId: string) => {
    toast.success('Clocked in successfully!')
  }

  const handleClockOut = (shiftId: string) => {
    toast.success('Clocked out successfully!')
  }

  const getTileContent = ({ date }: { date: Date }) => {
    const hasShift = mockShifts.some(
      (shift) => shift.date.toDateString() === date.toDateString()
    )
    if (hasShift) {
      return (
        <div className="flex justify-center mt-1">
          <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
        </div>
      )
    }
    return null
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="container-custom py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Schedule</h1>
              <p className="text-slate-600">
                {isCaregiver ? 'Manage your care shifts' : 'View and manage care schedules'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('calendar')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  viewMode === 'calendar'
                    ? 'bg-primary-500 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <CalendarIcon className="w-4 h-4 inline mr-2" />
                Calendar
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  viewMode === 'list'
                    ? 'bg-primary-500 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Filter className="w-4 h-4 inline mr-2" />
                List
              </button>
              {!isCaregiver && (
                <button
                  onClick={() => toast.success('Create shift feature coming soon!')}
                  className="px-4 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600"
                >
                  <Plus className="w-4 h-4 inline mr-2" />
                  New Shift
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Calendar / List View */}
          <div className="lg:col-span-2">
            {viewMode === 'calendar' ? (
              <div className="bg-white rounded-2xl shadow-card p-6">
                <Calendar
                  onChange={(value) => setSelectedDate(value as Date)}
                  value={selectedDate}
                  tileContent={getTileContent}
                  className="w-full border-0"
                />
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-slate-900">All Shifts</h2>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="text-sm border border-slate-200 rounded-lg px-3 py-2"
                  >
                    <option value="all">All Status</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div className="space-y-4">
                  {filteredShifts.map((shift) => (
                    <ShiftCard key={shift.id} shift={shift} isCaregiver={isCaregiver} />
                  ))}
                </div>
              </div>
            )}

            {/* Shifts for Selected Date */}
            {viewMode === 'calendar' && (
              <div className="mt-8">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">
                  Shifts for {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </h2>
                
                {shiftsForSelectedDate.length === 0 ? (
                  <div className="bg-white rounded-2xl shadow-card p-8 text-center">
                    <CalendarIcon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-600">No shifts scheduled for this date</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {shiftsForSelectedDate.map((shift) => (
                      <ShiftCard key={shift.id} shift={shift} isCaregiver={isCaregiver} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Shifts */}
            <div className="bg-white rounded-2xl shadow-card p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Upcoming Shifts</h2>
              {upcomingShifts.length === 0 ? (
                <p className="text-slate-500 text-center py-4">No upcoming shifts</p>
              ) : (
                <div className="space-y-4">
                  {upcomingShifts.slice(0, 3).map((shift) => (
                    <div key={shift.id} className="flex items-start gap-3 pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                      <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Clock className="w-5 h-5 text-primary-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-900 truncate">
                          {isCaregiver ? shift.patientName : shift.caregiverName}
                        </p>
                        <p className="text-sm text-slate-500">
                          {shift.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          {' · '}
                          {shift.startTime} - {shift.endTime}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[shift.status].bg} ${statusColors[shift.status].text}`}>
                        {shift.status.replace('_', ' ')}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            {isCaregiver && (
              <div className="bg-white rounded-2xl shadow-card p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h2>
                <div className="space-y-3">
                  <button
                    onClick={() => toast.success('Availability updated!')}
                    className="w-full flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                  >
                    <CalendarIcon className="w-5 h-5 text-slate-400" />
                    <span className="text-slate-700">Update Availability</span>
                  </button>
                  <button
                    onClick={() => toast.success('Time off request submitted!')}
                    className="w-full flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                  >
                    <AlertCircle className="w-5 h-5 text-slate-400" />
                    <span className="text-slate-700">Request Time Off</span>
                  </button>
                </div>
              </div>
            )}

            {/* Stats */}
            <div className="bg-white rounded-2xl shadow-card p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">
                {isCaregiver ? 'This Month' : 'Care Summary'}
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-slate-50 rounded-xl">
                  <p className="text-2xl font-bold text-slate-900">{upcomingShifts.length}</p>
                  <p className="text-sm text-slate-500">Upcoming</p>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-xl">
                  <p className="text-2xl font-bold text-slate-900">
                    {mockShifts.filter(s => s.status === 'completed').length * 6}
                  </p>
                  <p className="text-sm text-slate-500">Hours</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ShiftCard({ shift, isCaregiver }: { shift: Shift; isCaregiver: boolean }) {
  const statusStyle = statusColors[shift.status]
  const StatusIcon = statusStyle.icon

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-soft transition-shadow">
      <div className="flex items-start gap-4">
        <img
          src={shift.caregiverPhoto || `https://ui-avatars.com/api/?name=${shift.caregiverName}&background=random`}
          alt={shift.caregiverName}
          className="w-12 h-12 rounded-xl object-cover"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-semibold text-slate-900">
                {isCaregiver ? shift.patientName : shift.caregiverName}
              </p>
              <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                <Clock className="w-4 h-4" />
                {shift.startTime} - {shift.endTime}
              </p>
              <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                <MapPin className="w-4 h-4" />
                {shift.address}
              </p>
              {shift.notes && (
                <p className="text-sm text-slate-600 mt-2 bg-slate-50 p-2 rounded-lg">
                  {shift.notes}
                </p>
              )}
            </div>
            <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}>
              <StatusIcon className="w-3 h-3" />
              {shift.status.replace('_', ' ')}
            </span>
          </div>

          {/* Actions */}
          {isCaregiver && shift.status === 'confirmed' && (
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => toast.success('Clocked in successfully!')}
                className="flex-1 px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-lg hover:bg-green-600"
              >
                Clock In
              </button>
              <button
                onClick={() => toast.success('Shift details viewed')}
                className="px-4 py-2 border border-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50"
              >
                Details
              </button>
            </div>
          )}

          {isCaregiver && shift.status === 'in_progress' && (
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => toast.success('Clocked out successfully!')}
                className="flex-1 px-4 py-2 bg-amber-500 text-white text-sm font-medium rounded-lg hover:bg-amber-600"
              >
                Clock Out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
