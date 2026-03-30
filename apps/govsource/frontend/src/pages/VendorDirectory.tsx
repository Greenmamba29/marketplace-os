import { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  Search, 
  Filter, 
  Building2, 
  MapPin, 
  CheckCircle,
  X,
  ChevronDown
} from 'lucide-react'
import { useVendors } from '@/hooks/useVendors'
import { SetAsideList } from '@/components/SetAsideBadge'
import { SamStatusBadge } from '@/components/SamStatusBadge'
import { CodeList } from '@/components/CodeBadge'
import { SecurityClearanceBadge } from '@/components/SecurityClearanceBadge'
import { DataTable } from '@/components/DataTable'
import type { Vendor, SetAsideType, VendorFilter } from '@/types'

const setAsideOptions: SetAsideType[] = ['8(a)', 'HUBZone', 'SDVOSB', 'WOSB', 'EDWOSB', 'VOSB', 'SDB']

export function VendorDirectory() {
  const [filter, setFilter] = useState<VendorFilter>({})
  const [showFilters, setShowFilters] = useState(false)
  const [searchInput, setSearchInput] = useState('')

  const { data: vendors, isLoading } = useVendors(filter)

  const handleSearch = () => {
    setFilter(prev => ({ ...prev, search: searchInput }))
  }

  const toggleSetAside = (setAside: SetAsideType) => {
    setFilter(prev => {
      const current = prev.setAsides || []
      if (current.includes(setAside)) {
        return { ...prev, setAsides: current.filter(s => s !== setAside) }
      }
      return { ...prev, setAsides: [...current, setAside] }
    })
  }

  const clearFilters = () => {
    setFilter({})
    setSearchInput('')
  }

  const columns = [
    {
      key: 'companyName',
      header: 'Company',
      width: 'w-1/4',
      render: (vendor: Vendor) => (
        <div>
          <Link 
            to={`/vendors/${vendor.id}`}
            className="font-medium text-white hover:text-blue-400 transition-colors"
          >
            {vendor.companyName}
          </Link>
          {vendor.dbaName && (
            <p className="text-sm text-slate-500">DBA: {vendor.dbaName}</p>
          )}
        </div>
      ),
    },
    {
      key: 'cageCode',
      header: 'CAGE Code',
      render: (vendor: Vendor) => (
        <code className="text-sm font-mono text-slate-300">{vendor.cageCode}</code>
      ),
    },
    {
      key: 'naicsCodes',
      header: 'NAICS Codes',
      render: (vendor: Vendor) => (
        <CodeList 
          codes={vendor.naicsCodes.map(n => ({ code: n.code, description: n.description, isPrimary: n.isPrimary }))}
          type="naics"
          maxDisplay={2}
          size="sm"
        />
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
      key: 'samRegistration',
      header: 'SAM Status',
      render: (vendor: Vendor) => (
        <SamStatusBadge status={vendor.samRegistration.status} size="sm" />
      ),
    },
    {
      key: 'securityClearance',
      header: 'Clearance',
      render: (vendor: Vendor) => (
        vendor.securityClearance ? (
          <SecurityClearanceBadge clearance={vendor.securityClearance} size="sm" />
        ) : (
          <span className="text-slate-500 text-sm">None</span>
        )
      ),
    },
    {
      key: 'contactInfo',
      header: 'Location',
      render: (vendor: Vendor) => (
        <div className="flex items-center gap-1 text-sm text-slate-400">
          <MapPin className="w-3.5 h-3.5" />
          {vendor.contactInfo.businessAddress.city}, {vendor.contactInfo.businessAddress.state}
        </div>
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
              <h1 className="text-2xl font-bold text-white">Vendor Directory</h1>
              <p className="text-slate-400 mt-1">
                Browse qualified government contractors
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-400">
                {vendors?.length || 0} vendors
              </span>
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
                placeholder="Search vendors by name, CAGE code, or NAICS..."
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
              {(filter.setAsides?.length || filter.smallBusiness !== undefined) && (
                <span className="w-5 h-5 bg-blue-600 rounded-full text-xs flex items-center justify-center">
                  {(filter.setAsides?.length || 0) + (filter.smallBusiness !== undefined ? 1 : 0)}
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
                  onClick={clearFilters}
                  className="text-sm text-slate-400 hover:text-white flex items-center gap-1"
                >
                  <X className="w-4 h-4" />
                  Clear all
                </button>
              </div>

              {/* Set-Aside Filters */}
              <div>
                <label className="form-label">Set-Aside Programs</label>
                <div className="flex flex-wrap gap-2">
                  {setAsideOptions.map((setAside) => (
                    <button
                      key={setAside}
                      onClick={() => toggleSetAside(setAside)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                        filter.setAsides?.includes(setAside)
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : 'bg-slate-800 border-slate-600 text-slate-400 hover:border-slate-500'
                      }`}
                    >
                      {setAside}
                    </button>
                  ))}
                </div>
              </div>

              {/* Other Filters */}
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="form-label">SAM Status</label>
                  <select
                    value={filter.samStatus || ''}
                    onChange={(e) => setFilter(prev => ({ 
                      ...prev, 
                      samStatus: e.target.value as any || undefined 
                    }))}
                    className="form-input"
                  >
                    <option value="">Any Status</option>
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                    <option value="EXPIRED">Expired</option>
                    <option value="PENDING">Pending</option>
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
                    <option value="">Any Clearance</option>
                    <option value="TS/SCI">TS/SCI</option>
                    <option value="Top Secret">Top Secret</option>
                    <option value="Secret">Secret</option>
                    <option value="Confidential">Confidential</option>
                    <option value="Public Trust">Public Trust</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Business Type</label>
                  <select
                    value={filter.smallBusiness === undefined ? '' : filter.smallBusiness ? 'small' : 'other'}
                    onChange={(e) => setFilter(prev => ({ 
                      ...prev, 
                      smallBusiness: e.target.value === '' ? undefined : e.target.value === 'small'
                    }))}
                    className="form-input"
                  >
                    <option value="">Any</option>
                    <option value="small">Small Business</option>
                    <option value="other">Other Than Small</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Table */}
        <DataTable
          columns={columns}
          data={vendors || []}
          keyExtractor={(vendor) => vendor.id}
          loading={isLoading}
          emptyMessage="No vendors found matching your criteria"
          onRowClick={(vendor) => window.location.href = `/vendors/${vendor.id}`}
        />
      </div>
    </div>
  )
}
