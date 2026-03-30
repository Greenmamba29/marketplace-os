import { useState } from 'react'
import { 
  Users, 
  Building2, 
  FileText, 
  ShieldCheck, 
  BarChart3,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  Search,
  Filter,
  MoreHorizontal,
  Settings
} from 'lucide-react'
import { useVendors } from '@/hooks/useVendors'
import { useRFPs } from '@/hooks/useRFPs'
import { useComplianceStats } from '@/hooks/useCompliance'
import { StatCard } from '@/components/StatCard'
import { DataTable } from '@/components/DataTable'
import { SamStatusBadge } from '@/components/SamStatusBadge'
import { SetAsideList } from '@/components/SetAsideBadge'
import type { Vendor, RFP } from '@/types'
import { format } from 'date-fns'

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'vendors' | 'rfps' | 'compliance'>('overview')
  
  const { data: vendors } = useVendors()
  const { data: rfps } = useRFPs()
  const { data: complianceStats } = useComplianceStats()

  const vendorColumns = [
    {
      key: 'companyName',
      header: 'Company',
      render: (vendor: Vendor) => (
        <div>
          <p className="font-medium text-white">{vendor.companyName}</p>
          <p className="text-sm text-slate-500">{vendor.cageCode}</p>
        </div>
      ),
    },
    {
      key: 'samRegistration',
      header: 'SAM Status',
      render: (vendor: Vendor) => (
        <SamStatusBadge status={vendor.samRegistration.status} size="sm" />
      ),
    },
    {
      key: 'setAsides',
      header: 'Set-Asides',
      render: (vendor: Vendor) => (
        <SetAsideList setAsides={vendor.setAsides} maxDisplay={2} size="sm" />
      ),
    },
    {
      key: 'complianceStatus',
      header: 'Compliance',
      render: (vendor: Vendor) => (
        <span className={`badge ${
          vendor.complianceStatus.overallStatus === 'COMPLIANT' ? 'badge-success' :
          vendor.complianceStatus.overallStatus === 'NON_COMPLIANT' ? 'badge-error' :
          'badge-warning'
        }`}>
          {vendor.complianceStatus.overallStatus}
        </span>
      ),
    },
    {
      key: 'createdAt',
      header: 'Registered',
      render: (vendor: Vendor) => (
        <span className="text-slate-400">
          {format(new Date(vendor.createdAt), 'MMM d, yyyy')}
        </span>
      ),
    },
  ]

  const rfpColumns = [
    {
      key: 'solicitationNumber',
      header: 'Solicitation',
      render: (rfp: RFP) => (
        <div>
          <p className="font-mono text-blue-400">{rfp.solicitationNumber}</p>
          <p className="text-sm text-slate-400 line-clamp-1">{rfp.title}</p>
        </div>
      ),
    },
    {
      key: 'agency',
      header: 'Agency',
      render: (rfp: RFP) => (
        <span className="text-slate-300">{rfp.agency.name}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (rfp: RFP) => (
        <span className={`badge ${
          rfp.status === 'OPEN' ? 'badge-success' : 
          rfp.status === 'CLOSED' ? 'badge-error' : 
          rfp.status === 'AWARDED' ? 'badge-info' : 'badge-warning'
        }`}>
          {rfp.status}
        </span>
      ),
    },
    {
      key: 'estimatedValue',
      header: 'Value',
      render: (rfp: RFP) => (
        <span className="text-slate-300">
          ${(rfp.estimatedValue.max / 1000000).toFixed(1)}M
        </span>
      ),
    },
    {
      key: 'importantDates',
      header: 'Due Date',
      render: (rfp: RFP) => (
        <span className="text-slate-400">
          {format(new Date(rfp.importantDates.proposalDue), 'MMM d, yyyy')}
        </span>
      ),
    },
  ]

  const stats = {
    totalVendors: vendors?.length || 0,
    activeRFPs: rfps?.filter(r => r.status === 'OPEN').length || 0,
    pendingApprovals: 12,
    totalContractValue: rfps?.reduce((sum, r) => sum + r.estimatedValue.max, 0) || 0,
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-slate-400 mt-1">
                Platform administration and oversight
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="btn btn-secondary">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="border-b border-slate-800 mb-8">
          <div className="flex gap-6">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'vendors', label: 'Vendors', icon: Building2 },
              { id: 'rfps', label: 'RFPs', icon: FileText },
              { id: 'compliance', label: 'Compliance', icon: ShieldCheck },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Total Vendors"
                value={stats.totalVendors.toLocaleString()}
                icon={Building2}
                trend={{ value: 12, direction: 'up', label: 'vs last month' }}
                color="blue"
              />
              <StatCard
                title="Active RFPs"
                value={stats.activeRFPs.toString()}
                icon={FileText}
                trend={{ value: 5, direction: 'up', label: 'vs last month' }}
                color="emerald"
              />
              <StatCard
                title="Pending Approvals"
                value={stats.pendingApprovals.toString()}
                icon={Clock}
                trend={{ value: 3, direction: 'down', label: 'vs last month' }}
                color="amber"
              />
              <StatCard
                title="Contract Value"
                value={`$${(stats.totalContractValue / 1000000000).toFixed(1)}B`}
                icon={DollarSign}
                trend={{ value: 18, direction: 'up', label: 'vs last month' }}
                color="purple"
              />
            </div>

            {/* Recent Activity */}
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Recent Vendor Registrations</h3>
                <div className="space-y-3">
                  {vendors?.slice(0, 5).map((vendor) => (
                    <div key={vendor.id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                      <div>
                        <p className="text-white font-medium">{vendor.companyName}</p>
                        <p className="text-sm text-slate-500">{vendor.cageCode}</p>
                      </div>
                      <SamStatusBadge status={vendor.samRegistration.status} size="sm" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="card p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Compliance Overview</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-slate-400">FAR Compliance</span>
                      <span className="text-emerald-400">92%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: '92%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-slate-400">DFARS Compliance</span>
                      <span className="text-blue-400">87%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: '87%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-slate-400">SAM Registration</span>
                      <span className="text-purple-400">96%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500 rounded-full" style={{ width: '96%' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Vendors Tab */}
        {activeTab === 'vendors' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white">All Vendors</h2>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search vendors..."
                    className="form-input pl-9 py-2 text-sm w-64"
                  />
                </div>
                <button className="btn btn-secondary text-sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </button>
              </div>
            </div>
            <DataTable
              columns={vendorColumns}
              data={vendors || []}
              keyExtractor={(v) => v.id}
              emptyMessage="No vendors found"
            />
          </div>
        )}

        {/* RFPs Tab */}
        {activeTab === 'rfps' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white">All RFPs</h2>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search RFPs..."
                    className="form-input pl-9 py-2 text-sm w-64"
                  />
                </div>
                <button className="btn btn-secondary text-sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </button>
              </div>
            </div>
            <DataTable
              columns={rfpColumns}
              data={rfps || []}
              keyExtractor={(r) => r.id}
              emptyMessage="No RFPs found"
            />
          </div>
        )}

        {/* Compliance Tab */}
        {activeTab === 'compliance' && (
          <div className="space-y-6">
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="card p-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Compliant</p>
                    <p className="text-xl font-semibold text-white">
                      {complianceStats?.compliantVendors || 0}
                    </p>
                  </div>
                </div>
              </div>
              <div className="card p-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Pending Review</p>
                    <p className="text-xl font-semibold text-white">
                      {complianceStats?.pendingReviews || 0}
                    </p>
                  </div>
                </div>
              </div>
              <div className="card p-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 text-red-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Non-Compliant</p>
                    <p className="text-xl font-semibold text-white">
                      {complianceStats?.nonCompliantVendors || 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Compliance Actions</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <button className="p-4 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-blue-500/50 transition-colors text-left">
                  <ShieldCheck className="w-8 h-8 text-blue-400 mb-3" />
                  <p className="text-white font-medium">Run Compliance Check</p>
                  <p className="text-sm text-slate-400 mt-1">Verify all vendor compliance statuses</p>
                </button>
                <button className="p-4 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-blue-500/50 transition-colors text-left">
                  <Search className="w-8 h-8 text-emerald-400 mb-3" />
                  <p className="text-white font-medium">SAM.gov Sync</p>
                  <p className="text-sm text-slate-400 mt-1">Update vendor registration data</p>
                </button>
                <button className="p-4 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-blue-500/50 transition-colors text-left">
                  <AlertCircle className="w-8 h-8 text-amber-400 mb-3" />
                  <p className="text-white font-medium">Review Exclusions</p>
                  <p className="text-sm text-slate-400 mt-1">Check debarred vendors list</p>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
