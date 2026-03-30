import { useState } from 'react'
import { 
  Search, 
  Filter, 
  Calendar, 
  AlertTriangle, 
  Download,
  FileCheck,
  Lock,
  Unlock,
  Eye
} from 'lucide-react'
import { useLots, useExpiringLots, useDownloadCoA } from '../hooks/useLots'
import LotStatusBadge from '../components/LotStatusBadge'
import StorageTempBadge from '../components/StorageTempBadge'

export default function LotTracker() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [showExpiring, setShowExpiring] = useState(false)
  
  const { data: lots, isLoading } = useLots({ 
    status: statusFilter as any,
    search: searchQuery 
  })
  const { data: expiringLots } = useExpiringLots(30)
  const downloadCoA = useDownloadCoA()

  const allLots = lots?.data || []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="section-title">Lot Tracker</h1>
          <p className="text-slate-400 mt-1">Monitor lot status, expiry dates, and CoA availability</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowExpiring(!showExpiring)}
            className={`btn-secondary ${showExpiring ? 'border-amber-700 bg-amber-950/30' : ''}`}
          >
            <AlertTriangle className={`w-4 h-4 mr-2 ${showExpiring ? 'text-amber-400' : ''}`} />
            Expiring Soon
          </button>
        </div>
      </div>

      {/* Expiring Lots Alert */}
      {showExpiring && expiringLots?.data && expiringLots.data.length > 0 && (
        <div className="card border-amber-800 bg-amber-950/20 p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <h3 className="font-medium text-amber-200">Lots Expiring Within 30 Days</h3>
          </div>
          <div className="space-y-2">
            {expiringLots.data.map((lot: any) => (
              <div key={lot.id} className="flex items-center justify-between p-3 bg-slate-900 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm text-slate-300">{lot.lotNumber}</span>
                  <span className="text-sm text-slate-400">{lot.reagentName}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-amber-400">
                    {lot.daysUntilExpiry} days left
                  </span>
                  <span className="text-sm text-slate-500">
                    {lot.quantityRemaining} units
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input
            type="text"
            placeholder="Search by lot number, reagent name, or catalog number..."
            className="input-field pl-12"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select
          value={statusFilter || ''}
          onChange={(e) => setStatusFilter(e.target.value || null)}
          className="input-field w-auto"
        >
          <option value="">All Statuses</option>
          <option value="available">Available</option>
          <option value="reserved">Reserved</option>
          <option value="expired">Expired</option>
          <option value="quarantined">Quarantined</option>
          <option value="depleted">Depleted</option>
        </select>
      </div>

      {/* Lots Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-900 border-b border-slate-800">
                <th className="text-left px-6 py-4 text-sm font-medium text-slate-400">Lot Number</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-slate-400">Reagent</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-slate-400">Storage</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-slate-400">Expiry Date</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-slate-400">Quantity</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-slate-400">Status</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-slate-400">CoA</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    <td colSpan={8} className="px-6 py-4">
                      <div className="h-4 bg-slate-800 rounded animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : allLots.length > 0 ? (
                allLots.map((lot: any) => (
                  <tr key={lot.id} className="hover:bg-slate-850/50">
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm text-slate-300">{lot.lotNumber}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm text-slate-200">{lot.reagentName}</p>
                        <p className="text-xs text-slate-500">{lot.catalogNumber}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <StorageTempBadge temperature={lot.storageTemp} size="sm" showLabel={false} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-500" />
                        <span className={`text-sm ${
                          new Date(lot.expiryDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                            ? 'text-amber-400'
                            : 'text-slate-300'
                        }`}>
                          {new Date(lot.expiryDate).toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-300">
                        {lot.quantityAvailable} {lot.quantityUnit}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <LotStatusBadge status={lot.status} size="sm" />
                    </td>
                    <td className="px-6 py-4">
                      {lot.coa ? (
                        <span className="inline-flex items-center gap-1 text-emerald-400 text-sm">
                          <FileCheck className="w-4 h-4" />
                          Available
                        </span>
                      ) : (
                        <span className="text-slate-500 text-sm">Pending</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {lot.coa && (
                          <button
                            onClick={() => downloadCoA.mutate(lot.id)}
                            className="p-2 text-slate-400 hover:text-science-400 hover:bg-science-950 rounded-lg transition-colors"
                            title="Download CoA"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {lot.status === 'available' && (
                          <button
                            className="p-2 text-slate-400 hover:text-amber-400 hover:bg-amber-950 rounded-lg transition-colors"
                            title="Quarantine"
                          >
                            <Lock className="w-4 h-4" />
                          </button>
                        )}
                        {lot.status === 'quarantined' && (
                          <button
                            className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-emerald-950 rounded-lg transition-colors"
                            title="Release"
                          >
                            <Unlock className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <Search className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                    <p className="text-slate-500">No lots found matching your criteria</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
