import { Link } from 'react-router-dom'
import { 
  Plus, 
  FileText, 
  Clock, 
  CheckCircle, 
  DollarSign,
  TrendingUp,
  AlertCircle,
  Building2,
  ArrowRight
} from 'lucide-react'
import { useRFQs } from '@/hooks/useRFQs'
import { useRFPs } from '@/hooks/useRFPs'
import { StatCard } from '@/components/StatCard'
import { DataTable } from '@/components/DataTable'
import type { RFQ, RFP } from '@/types'
import { format } from 'date-fns'

export function BuyerDashboard() {
  const { data: rfqs } = useRFQs()
  const { data: rfps } = useRFPs()

  const pendingRFQs = rfqs?.filter(r => r.status === 'PENDING_APPROVAL') || []
  const activeRFQs = rfqs?.filter(r => ['APPROVED', 'SENT', 'OPEN'].includes(r.status)) || []
  const closedRFQs = rfqs?.filter(r => ['CLOSED', 'AWARDED'].includes(r.status)) || []

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
          rfq.status === 'AWARDED' ? 'badge-success' : 
          rfq.status === 'CLOSED' ? 'badge-error' : 
          rfq.status === 'PENDING_APPROVAL' ? 'badge-warning' :
          'badge-info'
        }`}>
          {rfq.status.replace(/_/g, ' ')}
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
      key: 'quotes',
      header: 'Quotes',
      render: (rfq: RFQ) => (
        <span className="text-slate-300">{rfq.quotes.length} received</span>
      ),
    },
    {
      key: 'createdAt',
      header: 'Created',
      render: (rfq: RFQ) => (
        <span className="text-slate-400">
          {format(new Date(rfq.createdAt), 'MMM d, yyyy')}
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
      key: 'importantDates',
      header: 'Due Date',
      render: (rfp: RFP) => (
        <span className="text-slate-400">
          {format(new Date(rfp.importantDates.proposalDue), 'MMM d, yyyy')}
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
              <h1 className="text-2xl font-bold text-white">Buyer Dashboard</h1>
              <p className="text-slate-400 mt-1">
                Manage your procurement activities
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/rfq-wizard" className="btn btn-primary">
                <Plus className="w-4 h-4 mr-2" />
                Create RFQ
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Active RFQs"
            value={activeRFQs.length}
            icon={FileText}
            color="blue"
          />
          <StatCard
            title="Pending Approval"
            value={pendingRFQs.length}
            icon={Clock}
            color="amber"
          />
          <StatCard
            title="Completed"
            value={closedRFQs.length}
            icon={CheckCircle}
            color="emerald"
          />
          <StatCard
            title="Total Value"
            value="$2.4M"
            icon={DollarSign}
            trend={{ value: 15, direction: 'up', label: 'vs last month' }}
            color="purple"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <Link 
            to="/vendors"
            className="card p-4 hover:border-blue-500/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-white font-medium">Find Vendors</p>
                <p className="text-sm text-slate-400">Browse qualified contractors</p>
              </div>
            </div>
          </Link>
          <Link 
            to="/rfps"
            className="card p-4 hover:border-blue-500/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-white font-medium">Browse RFPs</p>
                <p className="text-sm text-slate-400">Find opportunities</p>
              </div>
            </div>
          </Link>
          <Link 
            to="/compliance"
            className="card p-4 hover:border-blue-500/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-white font-medium">Compliance</p>
                <p className="text-sm text-slate-400">Verify requirements</p>
              </div>
            </div>
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* My RFQs */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">My RFQs</h2>
              <Link to="/rfq-wizard" className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1">
                View All
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <DataTable
              columns={rfqColumns}
              data={rfqs?.slice(0, 5) || []}
              keyExtractor={(r) => r.id}
              emptyMessage="No RFQs created yet"
            />
          </div>

          {/* Available RFPs */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Available RFPs</h2>
              <Link to="/rfps" className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1">
                View All
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <DataTable
              columns={rfpColumns}
              data={rfps?.filter(r => r.status === 'OPEN').slice(0, 5) || []}
              keyExtractor={(r) => r.id}
              emptyMessage="No open RFPs available"
            />
          </div>
        </div>

        {/* Pending Approvals */}
        {pendingRFQs.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-white mb-4">Pending Your Approval</h2>
            <div className="card p-4">
              <div className="space-y-3">
                {pendingRFQs.map((rfq) => (
                  <div key={rfq.id} className="flex items-center justify-between p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 text-amber-400" />
                      <div>
                        <p className="text-white font-medium">{rfq.title}</p>
                        <p className="text-sm text-slate-400">
                          {rfq.lineItems.length} items • Awaiting approval
                        </p>
                      </div>
                    </div>
                    <Link 
                      to={`/rfqs/${rfq.id}`}
                      className="btn btn-primary text-sm"
                    >
                      Review
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
