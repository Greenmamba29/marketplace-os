import { useState } from 'react'
import {
  Activity,
  Search,
  Filter,
  Calendar,
  Wrench,
  CheckCircle,
  AlertTriangle,
  Clock,
  Building2,
  MapPin,
  BarChart3,
  Download,
  Plus,
} from 'lucide-react'
import { useBiomedicalAssets, useMaintenanceSchedule, useUpcomingCalibrations } from '../hooks/useDashboard'

export function BiomedicalAssets() {
  const [activeTab, setActiveTab] = useState<'assets' | 'maintenance' | 'calibrations'>('assets')
  const [searchQuery, setSearchQuery] = useState('')
  const [facilityFilter, setFacilityFilter] = useState('')

  const { data: assets } = useBiomedicalAssets({ facilityId: facilityFilter })
  const { data: maintenanceSchedule } = useMaintenanceSchedule(facilityFilter || 'fac-1')
  const { data: upcomingCalibrations } = useUpcomingCalibrations(facilityFilter || 'fac-1')

  // Mock assets data
  const mockAssets = [
    {
      id: 'AST-001',
      name: 'Patient Monitor MX450',
      manufacturer: 'Philips',
      model: 'MX450',
      serialNumber: 'PH789456123',
      location: 'ICU Room 12',
      department: 'ICU',
      status: 'active',
      lastServiced: '2024-01-10',
      nextService: '2024-04-10',
      warrantyExpiry: '2026-01-10',
    },
    {
      id: 'AST-002',
      name: 'Infusion Pump Alaris',
      manufacturer: 'BD',
      model: 'Alaris PC',
      serialNumber: 'BD123456789',
      location: 'OR Suite 3',
      department: 'Operating Rooms',
      status: 'maintenance',
      lastServiced: '2023-12-15',
      nextService: '2024-01-20',
      warrantyExpiry: '2025-06-15',
    },
    {
      id: 'AST-003',
      name: 'Ventilator SV800',
      manufacturer: 'Medtronic',
      model: 'SV800',
      serialNumber: 'MT987654321',
      location: 'Emergency Bay 2',
      department: 'Emergency',
      status: 'active',
      lastServiced: '2024-01-05',
      nextService: '2024-04-05',
      warrantyExpiry: '2027-01-05',
    },
    {
      id: 'AST-004',
      name: 'Defibrillator LIFEPAK 15',
      manufacturer: 'Stryker',
      model: 'LIFEPAK 15',
      serialNumber: 'SK456789123',
      location: 'Cardiology Unit',
      department: 'Cardiology',
      status: 'calibration_due',
      lastServiced: '2023-11-20',
      nextService: '2024-01-18',
      warrantyExpiry: '2025-11-20',
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="clinical-badge bg-medical-green/10 text-medical-green"><CheckCircle className="w-3 h-3 mr-1" />Active</span>
      case 'maintenance':
        return <span className="clinical-badge bg-medical-amber/10 text-medical-amber"><Wrench className="w-3 h-3 mr-1" />In Maintenance</span>
      case 'calibration_due':
        return <span className="clinical-badge bg-clinical-100 text-clinical-700"><Clock className="w-3 h-3 mr-1" />Calibration Due</span>
      default:
        return <span className="clinical-badge bg-surface-200 text-surface-600">{status}</span>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 flex items-center gap-2">
            <Activity className="w-6 h-6 text-clinical-500" />
            Biomedical Assets
          </h1>
          <p className="text-surface-600 mt-1">
            Track and manage medical equipment across your facilities
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="clinical-button-secondary">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
          <button className="clinical-button">
            <Plus className="w-4 h-4 mr-2" />
            Add Asset
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Assets', value: '1,247', icon: Activity },
          { label: 'Active', value: '1,180', icon: CheckCircle, color: 'green' },
          { label: 'Maintenance Due', value: '42', icon: Wrench, color: 'amber' },
          { label: 'Calibration Due', value: '25', icon: Clock, color: 'clinical' },
        ].map((stat, idx) => {
          const Icon = stat.icon
          return (
            <div key={idx} className="clinical-card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-surface-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-surface-900 mt-1">{stat.value}</p>
                </div>
                <div className={`w-10 h-10 rounded-clinical flex items-center justify-center ${
                  stat.color === 'green' ? 'bg-medical-green/10' :
                  stat.color === 'amber' ? 'bg-medical-amber/10' :
                  'bg-clinical-100'
                }`}>
                  <Icon className={`w-5 h-5 ${
                    stat.color === 'green' ? 'text-medical-green' :
                    stat.color === 'amber' ? 'text-medical-amber' :
                    'text-clinical-600'
                  }`} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Tabs */}
      <div className="border-b border-surface-200">
        <nav className="flex gap-6">
          {[
            { id: 'assets', label: 'Assets', icon: Activity },
            { id: 'maintenance', label: 'Maintenance Schedule', icon: Wrench },
            { id: 'calibrations', label: 'Calibrations', icon: Calendar },
          ].map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 pb-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-clinical-500 text-clinical-600'
                    : 'border-transparent text-surface-600 hover:text-surface-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search assets..."
            className="clinical-input pl-10"
          />
        </div>
        <select
          value={facilityFilter}
          onChange={(e) => setFacilityFilter(e.target.value)}
          className="clinical-input w-full sm:w-48"
        >
          <option value="">All Facilities</option>
          <option value="fac-1">Metropolitan General</option>
          <option value="fac-2">University Medical</option>
          <option value="fac-3">Children's Hospital</option>
        </select>
        <button className="clinical-button-secondary">
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </button>
      </div>

      {/* Content */}
      {activeTab === 'assets' && (
        <div className="clinical-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-surface-600">Asset</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-surface-600">Location</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-surface-600">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-surface-600">Last Service</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-surface-600">Next Service</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-surface-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockAssets.map((asset) => (
                  <tr key={asset.id} className="border-b border-surface-100 last:border-b-0 hover:bg-surface-50">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-surface-900">{asset.name}</p>
                        <p className="text-xs text-surface-500 font-mono">{asset.id}</p>
                        <p className="text-xs text-surface-500">{asset.manufacturer} {asset.model}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1 text-sm text-surface-600">
                        <MapPin className="w-4 h-4" />
                        {asset.location}
                      </div>
                      <p className="text-xs text-surface-500">{asset.department}</p>
                    </td>
                    <td className="py-3 px-4">{getStatusBadge(asset.status)}</td>
                    <td className="py-3 px-4 text-sm text-surface-600">{asset.lastServiced}</td>
                    <td className="py-3 px-4 text-sm text-surface-600">{asset.nextService}</td>
                    <td className="py-3 px-4">
                      <button className="text-clinical-600 hover:text-clinical-700 text-sm font-medium">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'maintenance' && (
        <div className="space-y-4">
          {[
            { date: '2024-01-18', assets: 5, type: 'Preventive Maintenance' },
            { date: '2024-01-20', assets: 3, type: 'Calibration' },
            { date: '2024-01-25', assets: 8, type: 'Preventive Maintenance' },
            { date: '2024-02-01', assets: 12, type: 'Inspection' },
          ].map((schedule, idx) => (
            <div key={idx} className="clinical-card p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-clinical-100 rounded-clinical flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-clinical-600" />
                  </div>
                  <div>
                    <p className="font-medium text-surface-900">{schedule.date}</p>
                    <p className="text-sm text-surface-600">{schedule.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-clinical-600">{schedule.assets}</p>
                  <p className="text-sm text-surface-500">assets scheduled</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'calibrations' && (
        <div className="clinical-card">
          <div className="p-4 border-b border-surface-200">
            <h3 className="font-semibold text-surface-900">Upcoming Calibrations</h3>
          </div>
          <div className="divide-y divide-surface-200">
            {[
              { asset: 'Defibrillator LIFEPAK 15', due: '2024-01-18', daysLeft: 3, priority: 'urgent' },
              { asset: 'Patient Monitor MX450', due: '2024-01-22', daysLeft: 7, priority: 'normal' },
              { asset: 'Infusion Pump Alaris', due: '2024-01-25', daysLeft: 10, priority: 'normal' },
              { asset: 'Ventilator SV800', due: '2024-02-01', daysLeft: 17, priority: 'normal' },
            ].map((cal, idx) => (
              <div key={idx} className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-surface-900">{cal.asset}</p>
                  <p className="text-sm text-surface-600">Due: {cal.due}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`clinical-badge ${
                    cal.priority === 'urgent' ? 'bg-medical-red/10 text-medical-red' :
                    'bg-clinical-100 text-clinical-700'
                  }`}>
                    {cal.daysLeft} days left
                  </span>
                  <button className="clinical-button py-1.5 px-3 text-sm">
                    Schedule
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
