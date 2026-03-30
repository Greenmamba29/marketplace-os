import { useState } from 'react'
import { Search, Filter, ArrowUpDown, Calendar, Droplets, Gauge, MapPin, ExternalLink } from 'lucide-react'
import { useBarrels, useBarrelFilters } from '../hooks/useBarrels'
import { FilterPanel } from '../components/FilterPanel'
import { LoadingSpinner } from '../components/LoadingSpinner'
import type { FilterState, Barrel } from '../types'

const spiritTypeColors: Record<string, string> = {
  bourbon: 'bg-amber-700 text-amber-100',
  rye: 'bg-orange-700 text-orange-100',
  scotch: 'bg-yellow-700 text-yellow-100',
  rum: 'bg-amber-600 text-amber-100',
  tequila: 'bg-blue-700 text-blue-100',
  brandy: 'bg-purple-700 text-purple-100',
  other: 'bg-gray-700 text-gray-100',
}

const statusColors: Record<string, string> = {
  available: 'badge-green',
  reserved: 'badge-amber',
  sold: 'badge-gray',
  aging: 'badge-blue',
  bottled: 'badge-gray',
}

function BarrelCard({ barrel }: { barrel: Barrel }) {
  const age = barrel.age_statement || 
    Math.floor((Date.now() - new Date(barrel.entry_date).getTime()) / (365.25 * 24 * 60 * 60 * 1000))

  return (
    <div className="card p-5 hover:border-amber-800/50 transition-colors group">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <span className={`badge ${spiritTypeColors[barrel.spirit_type] || spiritTypeColors.other}`}>
              {barrel.spirit_type.charAt(0).toUpperCase() + barrel.spirit_type.slice(1)}
            </span>
            <span className={statusColors[barrel.status]}>
              {barrel.status.charAt(0).toUpperCase() + barrel.status.slice(1)}
            </span>
          </div>
          <h3 className="font-display text-lg font-semibold text-gray-100 group-hover:text-amber-400 transition-colors">
            Barrel #{barrel.barrel_number}
          </h3>
          <p className="text-gray-500 text-sm">{barrel.distillery_origin}</p>
        </div>
        {barrel.price_per_proof_gallon && (
          <div className="text-right">
            <p className="font-display text-xl font-bold text-amber-500">
              ${barrel.price_per_proof_gallon.toFixed(2)}
            </p>
            <p className="text-gray-500 text-xs">per proof gal</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-gray-500" />
          <div>
            <p className="text-gray-400 text-xs">Age</p>
            <p className="text-gray-200 text-sm font-medium">{age} years</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Gauge className="w-4 h-4 text-gray-500" />
          <div>
            <p className="text-gray-400 text-xs">Proof</p>
            <p className="text-gray-200 text-sm font-medium">{barrel.proof}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Droplets className="w-4 h-4 text-gray-500" />
          <div>
            <p className="text-gray-400 text-xs">Volume</p>
            <p className="text-gray-200 text-sm font-medium">{barrel.volume_proof_gallons.toFixed(0)} PG</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-0.5 border-charcoal-800">
        <div className="flex items-center space-x-2 text-gray-500 text-sm">
          <MapPin className="w-4 h-4" />
          <span>{barrel.warehouse_location}</span>
        </div>
        <button className="flex items-center space-x-1 text-amber-500 hover:text-amber-400 text-sm font-medium">
          <span>View Details</span>
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

export default function BarrelDirectory() {
  const [filters, setFilters] = useState<FilterState>({})
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)
  const [sortBy, setSortBy] = useState<'age' | 'proof' | 'price' | 'entry_date'>('entry_date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const { data: barrelsData, isLoading: barrelsLoading } = useBarrels(filters, page, 20)
  const { data: availableFilters, isLoading: filtersLoading } = useBarrelFilters()

  const isLoading = barrelsLoading || filtersLoading

  const handleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('desc')
    }
  }

  const sortedBarrels = barrelsData?.items?.slice().sort((a, b) => {
    let aVal: number, bVal: number
    switch (sortBy) {
      case 'age':
        aVal = a.age_statement || 0
        bVal = b.age_statement || 0
        break
      case 'proof':
        aVal = a.proof
        bVal = b.proof
        break
      case 'price':
        aVal = a.price_per_proof_gallon || 0
        bVal = b.price_per_proof_gallon || 0
        break
      case 'entry_date':
      default:
        aVal = new Date(a.entry_date).getTime()
        bVal = new Date(b.entry_date).getTime()
    }
    return sortOrder === 'asc' ? aVal - bVal : bVal - aVal
  })

  if (isLoading) {
    return <LoadingSpinner fullPage text="Loading barrels..." />
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="page-title mb-2">Barrel Directory</h1>
        <p className="text-gray-400">
          Browse {barrelsData?.total?.toLocaleString() || 'thousands of'} aged barrels from verified suppliers
        </p>
      </div>

      {/* Search and controls */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search by barrel number, distillery, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-12"
          />
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => handleSort('age')}
            className={`btn-secondary ${sortBy === 'age' ? 'border-amber-700 text-amber-400' : ''}`}
          >
            <Calendar className="w-4 h-4 mr-2" />
            Age
            {sortBy === 'age' && <ArrowUpDown className="w-3 h-3 ml-2" />}
          </button>
          <button 
            onClick={() => handleSort('proof')}
            className={`btn-secondary ${sortBy === 'proof' ? 'border-amber-700 text-amber-400' : ''}`}
          >
            <Gauge className="w-4 h-4 mr-2" />
            Proof
            {sortBy === 'proof' && <ArrowUpDown className="w-3 h-3 ml-2" />}
          </button>
          <button 
            onClick={() => handleSort('price')}
            className={`btn-secondary ${sortBy === 'price' ? 'border-amber-700 text-amber-400' : ''}`}
          >
            <Filter className="w-4 h-4 mr-2" />
            Price
            {sortBy === 'price' && <ArrowUpDown className="w-3 h-3 ml-2" />}
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filters sidebar */}
        <div className="lg:w-72 flex-shrink-0">
          {availableFilters && (
            <FilterPanel
              filters={filters}
              onChange={setFilters}
              availableFilters={availableFilters}
            />
          )}
        </div>

        {/* Results grid */}
        <div className="flex-1">
          {sortedBarrels && sortedBarrels.length > 0 ? (
            <>
              <div className="grid md:grid-cols-2 gap-4">
                {sortedBarrels.map((barrel) => (
                  <BarrelCard key={barrel.id} barrel={barrel} />
                ))}
              </div>

              {/* Pagination */}
              {barrelsData && barrelsData.total_pages > 1 && (
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-0.5 border-charcoal-800">
                  <p className="text-gray-500 text-sm">
                    Showing {((page - 1) * 20) + 1} - {Math.min(page * 20, barrelsData.total)} of {barrelsData.total} barrels
                  </p>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="btn-secondary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <span className="text-gray-400 text-sm px-3">
                      Page {page} of {barrelsData.total_pages}
                    </span>
                    <button
                      onClick={() => setPage(p => Math.min(barrelsData.total_pages, p + 1))}
                      disabled={page === barrelsData.total_pages}
                      className="btn-secondary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-charcoal-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-500" />
              </div>
              <h3 className="font-display text-lg font-semibold text-gray-300 mb-2">
                No barrels found
              </h3>
              <p className="text-gray-500">
                Try adjusting your filters or search query
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
