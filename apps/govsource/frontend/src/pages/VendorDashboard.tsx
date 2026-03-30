import { Link } from 'react-router-dom'
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  DollarSign,
  TrendingUp,
  Search,
  Building2,
  ArrowRight,
  Award,
  AlertCircle
} from 'lucide-react'
import { useRFPs } from '@/hooks/useRFPs'
import { useRFQs } from '@/hooks/useRFQs'
import { useAuthStore } from '@/hooks/useAuth'
import { StatCard } from '@/components/StatCard'
import { DataTable } from '@/components/DataTable'
import { SetAsideBadge } from '@/components/SetAsideBadge'
import type { RFP, RFQ } from '@/types'
import { format } from 'date-fns'

export function VendorDashboard() {
  const { user } = useAuthStore()
  const { data: rfps } = useRFPs()
  const { data: rfqs } = useRFQs()

  // Filter RFPs that match vendor's capabilities
  const matchingRFPs = rfps?.filter(rfp => 
    rfp.status === 'OPEN'
  ) || []

  // RFQs where vendor is invited
  const invitedRFQs = rfqs?.filter(rfq => 
    rfq.invitedVendors.includes(user?.vendor?.id || '')
  ) || []

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
      key: 'setAside',
      header: 'Set-Aside',
      render: (rfp: RFP) => (
        <SetAsideBadge type={rfp.setAside} size="sm" />
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

  const rfqColumns = [
    {
      key: 'rfqNumber',
      header: 'RFQ Number',
      render: (rfq: RFQ) => (
        <div>
          <p className="font-mono text-blue-400">{rfq.rfqNumber}</p>
          <p className="text-sm text-slate-400 line-clamp-1">{rfq.title}</p>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (rfq: RFQ) => (
        <span className={`badge ${
          rfq.status === 'OPEN' ? 'badge-success' : 
          rfq.status === 'CLOSED' ? 'badge-error' : 
          rfq.status === 'AWARDED' ? 'badge-info' : 'badge-warning'
        }`}>
          {rfq.status}
        </span>
      ),
    },
    {
      key: 'lineItems',
      header: 'Items',
      render: (rfq: RFQ) => (
        <span className="text-slate-300">{rfq.lineItems.length} items</span>
      ),
    },
    {
      key: 'createdAt',
      header: 'Received',
      render: (rfq: RFQ) => (
        <span className="text-slate-400">
          {format(new Date(rfq.createdAt), 'MMM d, yyyy')}
        </span>
      ),
    },
  ]

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white">Vendor Dashboard</h1>
              <p className="text-slate-400 mt-1">
                Welcome back, {user?.firstName}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/rfps" className="btn btn-primary">
                <Search className="w-4 h-4 mr-2" />
                Find RFPs
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Open RFPs"
            value={matchingRFPs.length}
            icon={FileText}
            trend={{ value: 8, direction: 'up', label: 'new this week' }}
            color="blue"
          />
          <StatCard
            title="Pending Quotes"
            value={invitedRFQs.filter(r => r.status === 'OPEN').length}
            icon={Clock}
            color="amber"
          />
          <StatCard
            title="Win Rate"
            value="24%"
            icon={TrendingUp}
            trend={{ value: 5, direction: 'up', label: 'vs last quarter' }}
            color="emerald"
          />
          <StatCard
            title="YTD Revenue"
            value="$1.2M"
            icon={DollarSign}
            trend={{ value: 32, direction: 'up', label: 'vs last year' }}
            color="purple"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <Link 
            to="/rfps"
            className="card p-4 hover:border-blue-500/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <Search className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-white font-medium">Find Opportunities</p>
                <p className="text-sm text-slate-400">Browse open RFPs</p>
              </div>
            </div>
          </Link>
          <Link 
            to="/compliance"
            className="card p-4 hover:border-blue-500/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-white font-medium">Compliance</p>
                <p className="text-sm text-slate-400">Manage certifications</p>
              </div>
            </div>
          </Link>
          <Link 
            to={`/vendors/${user?.vendor?.id}`}
            className="card p-4 hover:border-blue-500/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-white font-medium">My Profile</p>
                <p className="text-sm text-slate-400">Update company info</p>
              </div>
            </div>
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Matching RFPs */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Matching RFPs</h2>
              <Link to="/rfps" className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1">
                View All
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <DataTable
              columns={rfpColumns}
              data={matchingRFPs.slice(0, 5)}
              keyExtractor={(r) => r.id}
              emptyMessage="No matching RFPs found"
            />
          </div>

          {/* Invited RFQs */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Invited RFQs</h2>
              <span className="text-sm text-slate-400">
                {invitedRFQs.length} total
              </span>
            </div>
            <DataTable
              columns={rfqColumns}
              data={invitedRFQs.slice(0, 5)}
              keyExtractor={(r) => r.id}
              emptyMessage="No RFQ invitations yet"
            />
          </div>
        </div>

        {/* Set-Aside Eligibility */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-white mb-4">Your Set-Aside Eligibility</h2>
          <div className="card p-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {user?.vendor?.setAsides.map((setAside) => (
                <div key={setAside} className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-lg">
                  <Award className="w-5 h-5 text-blue-400" />
                  <div>
                    <p className="text-white font-medium">{setAside}</p>
                    <p className="text-sm text-emerald-400">Verified</p>
                  </div>
                </div>
              ))}
              {(!user?.vendor?.setAsides || user.vendor.setAsides.length === 0) && (
                <div className="col-span-full text-center py-8">
                  <AlertCircle className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-400">No set-aside certifications on file</p>
                  <Link to="/compliance" className="text-blue-400 hover:text-blue-300 text-sm mt-2 inline-block">
                    Update certifications
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
