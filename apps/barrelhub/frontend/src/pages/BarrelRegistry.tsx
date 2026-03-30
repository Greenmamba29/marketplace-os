import { useState } from 'react'
import { 
  Search, 
  Calendar, 
  MapPin, 
  Droplets, 
  TrendingDown, 
  History, 
  Beaker,
  ArrowRightLeft,
  ChevronDown,
  ChevronUp,
  FileText
} from 'lucide-react'
import { useRegistry, useBarrelHistory } from '../hooks/useBarrels'
import { LoadingSpinner } from '../components/LoadingSpinner'
import type { BarrelRegistry } from '../types'

function RegistryCard({ registry }: { registry: BarrelRegistry }) {
  const [showHistory, setShowHistory] = useState(false)
  const { data: history, isLoading: historyLoading } = useBarrelHistory(registry.barrel_id)

  const angelSharePercent = ((registry.angel_share_loss / registry.original_volume) * 100).toFixed(2)

  return (
    <div className="card overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-0.5 border-charcoal-800">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-display text-lg font-semibold text-gray-100">
              Barrel #{registry.barrel_number}
            </h3>
            <p className="text-gray-500 text-sm">ID: {registry.barrel_id}</p>
          </div>
          <div className="text-right">
            <span className="badge-amber">In Bond</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="p-5 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <p className="text-gray-500 text-xs mb-1">Fill Date</p>
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-amber-500" />
            <span className="text-gray-200 font-medium">
              {new Date(registry.fill_date).toLocaleDateString()}
            </span>
          </div>
        </div>
        <div>
          <p className="text-gray-500 text-xs mb-1">Warehouse Location</p>
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-amber-500" />
            <span className="text-gray-200 font-medium">{registry.warehouse_location}</span>
          </div>
        </div>
        <div>
          <p className="text-gray-500 text-xs mb-1">Rack / Tier</p>
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4 text-amber-500" />
            <span className="text-gray-200 font-medium">{registry.rack_number} / {registry.tier_position}</span>
          </div>
        </div>
        <div>
          <p className="text-gray-500 text-xs mb-1">Days in Bond</p>
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-amber-500" />
            <span className="text-gray-200 font-medium">
              {Math.floor((Date.now() - new Date(registry.fill_date).getTime()) / (1000 * 60 * 60 * 24))}
            </span>
          </div>
        </div>
      </div>

      {/* Volume & Proof Tracking */}
      <div className="px-5 pb-5">
        <div className="bg-charcoal-950 rounded-lg p-4">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Original */}
            <div className="text-center">
              <p className="text-gray-500 text-xs mb-2">Original Fill</p>
              <div className="space-y-1">
                <p className="text-gray-300 font-medium">{registry.original_volume.toFixed(2)} gal</p>
                <p className="text-gray-500 text-sm">{registry.original_proof} proof</p>
              </div>
            </div>

            {/* Angel's Share */}
            <div className="text-center border-x border-0.5 border-charcoal-800">
              <p className="text-gray-500 text-xs mb-2">Angel's Share Loss</p>
              <div className="space-y-1">
                <div className="flex items-center justify-center space-x-1 text-red-400">
                  <TrendingDown className="w-4 h-4" />
                  <span className="font-medium">{registry.angel_share_loss.toFixed(2)} gal</span>
                </div>
                <p className="text-red-400/70 text-sm">{angelSharePercent}%</p>
              </div>
            </div>

            {/* Current */}
            <div className="text-center">
              <p className="text-gray-500 text-xs mb-2">Current</p>
              <div className="space-y-1">
                <p className="text-amber-400 font-medium">{registry.current_volume.toFixed(2)} gal</p>
                <p className="text-gray-400 text-sm">{registry.current_proof} proof</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* History Toggle */}
      <button
        onClick={() => setShowHistory(!showHistory)}
        className="w-full flex items-center justify-center space-x-2 py-3 bg-charcoal-950 hover:bg-charcoal-900 transition-colors border-t border-0.5 border-charcoal-800"
      >
        <History className="w-4 h-4 text-gray-500" />
        <span className="text-gray-400 text-sm">View History</span>
        {showHistory ? (
          <ChevronUp className="w-4 h-4 text-gray-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-500" />
        )}
      </button>

      {/* History Panel */}
      {showHistory && (
        <div className="p-5 bg-charcoal-950 border-t border-0.5 border-charcoal-800">
          {historyLoading ? (
            <LoadingSpinner size="sm" text="Loading history..." />
          ) : history ? (
            <div className="space-y-6">
              {/* Sample History */}
              {history.samples && history.samples.length > 0 && (
                <div>
                  <h4 className="flex items-center space-x-2 text-gray-300 font-medium mb-3">
                    <Beaker className="w-4 h-4 text-amber-500" />
                    <span>Sample History</span>
                  </h4>
                  <div className="space-y-2">
                    {history.samples.map((sample, idx) => (
                      <div key={idx} className="flex items-center justify-between py-2 px-3 bg-charcoal-900 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <span className="text-gray-500 text-sm">
                            {new Date(sample.date).toLocaleDateString()}
                          </span>
                          <span className="badge-gray text-xs">{sample.sample_type}</span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm">
                          <span className="text-gray-400">{sample.proof} proof</span>
                          <span className="text-gray-400">{sample.volume.toFixed(2)} gal</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Movement History */}
              {history.movements && history.movements.length > 0 && (
                <div>
                  <h4 className="flex items-center space-x-2 text-gray-300 font-medium mb-3">
                    <ArrowRightLeft className="w-4 h-4 text-amber-500" />
                    <span>Movement History</span>
                  </h4>
                  <div className="space-y-2">
                    {history.movements.map((movement, idx) => (
                      <div key={idx} className="py-2 px-3 bg-charcoal-900 rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-gray-500 text-sm">
                            {new Date(movement.date).toLocaleDateString()}
                          </span>
                          <span className="text-gray-500 text-xs">by {movement.authorized_by}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <span className="text-gray-400">{movement.from_location}</span>
                          <ArrowRightLeft className="w-3 h-3 text-gray-600" />
                          <span className="text-amber-400">{movement.to_location}</span>
                        </div>
                        <p className="text-gray-500 text-xs mt-1">{movement.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No history available</p>
          )}
        </div>
      )}
    </div>
  )
}

export default function BarrelRegistry() {
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)

  const { data: registryData, isLoading } = useRegistry({ 
    page, 
    per_page: 10,
    search: searchQuery || undefined 
  })

  if (isLoading) {
    return <LoadingSpinner fullPage text="Loading registry..." />
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="page-title mb-2">Barrel Registry</h1>
        <p className="text-gray-400">
          Individual barrel tracking with complete lifecycle history and angel's share monitoring
        </p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search by barrel number or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-12"
          />
        </div>
      </div>

      {/* Registry List */}
      {registryData?.items && registryData.items.length > 0 ? (
        <div className="space-y-4">
          {registryData.items.map((registry: BarrelRegistry) => (
            <RegistryCard key={registry.id} registry={registry} />
          ))}

          {/* Pagination */}
          {registryData.total_pages > 1 && (
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-0.5 border-charcoal-800">
              <p className="text-gray-500 text-sm">
                Showing {((page - 1) * 10) + 1} - {Math.min(page * 10, registryData.total)} of {registryData.total} barrels
              </p>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="btn-secondary text-sm disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-gray-400 text-sm px-3">
                  Page {page} of {registryData.total_pages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(registryData.total_pages, p + 1))}
                  disabled={page === registryData.total_pages}
                  className="btn-secondary text-sm disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-charcoal-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-500" />
          </div>
          <h3 className="font-display text-lg font-semibold text-gray-300 mb-2">
            No barrels found
          </h3>
          <p className="text-gray-500">
            Try adjusting your search query
          </p>
        </div>
      )}
    </div>
  )
}
