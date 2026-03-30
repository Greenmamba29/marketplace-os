import { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  Search, 
  Filter, 
  Calendar, 
  DollarSign, 
  Building2,
  X,
  ChevronDown,
  ArrowRight,
  Users,
  Target
} from 'lucide-react'
import { useRFPs } from '@/hooks/useRFPs'
import { SetAsideBadge } from '@/components/SetAsideBadge'
import { SecurityClearanceBadge } from '@/components/SecurityClearanceBadge'
import { DataTable } from '@/components/DataTable'
import type { RFP, RFPFilter, SetAsideType } from '@/types'
import { format } from 'date-fns'

const setAsideOptions: SetAsideType[] = ['8(a)', 'HUBZone', 'SDVOSB', 'WOSB', 'EDWOSB', 'NONE']

export function RFPMatcher() {
  const [filter, setFilter] = useState<RFPFilter>({})
  const [showFilters, setShowFilters] = useState(false)
  const [searchInput, setSearchInput] = useState('')

  const { data: rfps, isLoading } = useRFPs(filter)

  const handleSearch = () => {
    setFilter(prev => ({ ...prev, search: searchInput }))
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(value)
  }

  const columns = [
    {
      key: 'solicitationNumber',
      header: 'Solicitation',
      width: 'w-1/5',
      render: (rfp: RFP) => (
        <div>
          <Link 
            to={`/rfps/${rfp.id}`}
            className="font-medium text-white hover:text-blue-400 transition-colors font-mono"
          >
            {rfp.solicitationNumber}
          </Link>
          <p className="text-sm text-slate-400 mt-0.5 line-clamp-1">{rfp.title}</p>
        </div>
      ),
    },
    {
      key: 'agency',
      header: 'Agency',
      render: (rfp: RFP) => (
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-slate-500" />
          <span className="text-slate-300">{rfp.agency.name}</span>
        </div>
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
      key: 'estimatedValue',
      header: 'Est. Value',
      render: (rfp: RFP) => (
        <div className="text-slate-300">
          {formatCurrency(rfp.estimatedValue.min)} - {formatCurrency(rfp.estimatedValue.max)}
        </div>
      ),
    },
    {
      key: 'securityClearanceRequired',
      header: 'Clearance',
      render: (rfp: RFP) => (
        <SecurityClearanceBadge 
          clearance={rfp.securityClearanceRequired} 
          size="sm" 
        />
      ),
    },
    {
      key: 'importantDates',
      header: 'Due Date',
      render: (rfp: RFP) => (
        <div className="flex items-center gap-2 text-slate-300">
          <Calendar className="w-4 h-4 text-slate-500" />
          {format(new Date(rfp.importantDates.proposalDue), 'MMM d, yyyy')}
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
  ]

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white">RFP Matcher</h1>
              <p className="text-slate-400 mt-1">
                Find and match RFPs with qualified vendors
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/rfq-wizard" className="btn btn-primary">
                <Target className="w-4 h-4 mr-2" />
                Create RFQ
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="text"
                placeholder="Search RFPs by solicitation number, title, or agency..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="form-input pl-10"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`btn btn-secondary flex items-center gap-2 ${showFilters ? 'bg-slate-700' : ''}`}
            >
              <Filter className="w-4 h-4" />
              Filters
              {(filter.setAside || filter.status || filter.securityClearance) && (
                <span className="w-5 h-5 bg-blue-600 rounded-full text-xs flex items-center justify-center">
                  {(filter.setAside ? 1 : 0) + (filter.status ? 1 : 0) + (filter.securityClearance ? 1 : 0)}
                </span>
              )}
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
            <button onClick={handleSearch} className="btn btn-primary">
              Search
            </button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="card p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-white">Filters</h3>
                <button
                  onClick={() => setFilter({})}
                  className="text-sm text-slate-400 hover:text-white flex items-center gap-1"
                >
                  <X className="w-4 h-4" />
                  Clear all
                </button>
              </div>

              <div className="grid sm:grid-cols-4 gap-4">
                <div>
                  <label className="form-label">Set-Aside</label>
                  <select
                    value={filter.setAside || ''}
                    onChange={(e) => setFilter(prev => ({ 
                      ...prev, 
                      setAside: e.target.value as any || undefined 
                    }))}
                    className="form-input"
                  >
                    <option value="">Any</option>
                    {setAsideOptions.map((sa) => (
                      <option key={sa} value={sa}>{sa}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="form-label">Status</label>
                  <select
                    value={filter.status || ''}
                    onChange={(e) => setFilter(prev => ({ 
                      ...prev, 
                      status: e.target.value as any || undefined 
                    }))}
                    className="form-input"
                  >
                    <option value="">Any</option>
                    <option value="DRAFT">Draft</option>
                    <option value="PUBLISHED">Published</option>
                    <option value="OPEN">Open</option>
                    <option value="CLOSED">Closed</option>
                    <option value="AWARDED">Awarded</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Security Clearance</label>
                  <select
                    value={filter.securityClearance || ''}
                    onChange={(e) => setFilter(prev => ({ 
                      ...prev, 
                      securityClearance: e.target.value as any || undefined 
                    }))}
                    className="form-input"
                  >
                    <option value="">Any</option>
                    <option value="TS/SCI">TS/SCI</option>
                    <option value="Top Secret">Top Secret</option>
                    <option value="Secret">Secret</option>
                    <option value="Confidential">Confidential</option>
                    <option value="None">None</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Min Value</label>
                  <select
                    value={filter.minValue || ''}
                    onChange={(e) => setFilter(prev => ({ 
                      ...prev, 
                      minValue: e.target.value ? Number(e.target.value) : undefined 
                    }))}
                    className="form-input"
                  >
                    <option value="">Any</option>
                    <option value="0">$0+</option>
                    <option value="100000">$100K+</option>
                    <option value="500000">$500K+</option>
                    <option value="1000000">$1M+</option>
                    <option value="10000000">$10M+</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Table */}
        <DataTable
          columns={columns}
          data={rfps || []}
          keyExtractor={(rfp) => rfp.id}
          loading={isLoading}
          emptyMessage="No RFPs found matching your criteria"
          onRowClick={(rfp) => window.location.href = `/rfps/${rfp.id}`}
        />
      </div>
    </div>
  )
}
