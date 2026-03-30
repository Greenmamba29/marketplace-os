import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Search,
  Filter,
  Snowflake,
  CheckCircle,
  Package,
  ChevronDown,
  Building2,
  ArrowRight,
  Loader2,
} from 'lucide-react'
import { useEquipmentList, useEquipmentSearch } from '../hooks/useEquipment'
import { FDAStatusBadge } from '../components/FDAStatusBadge'
import { DeviceClass, Equipment } from '../types'

interface FilterState {
  category: string[]
  deviceClass: DeviceClass[]
  manufacturer: string[]
  coldChain: boolean | null
  sterile: boolean | null
  inStock: boolean | null
}

export function EquipmentDirectory() {
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<FilterState>({
    category: [],
    deviceClass: [],
    manufacturer: [],
    coldChain: null,
    sterile: null,
    inStock: null,
  })

  const { data: equipment, isLoading } = useEquipmentList({ page: 1, perPage: 20 })
  const { data: searchResults } = useEquipmentSearch(searchQuery, filters)

  const displayData = searchQuery ? searchResults : equipment

  const categories = [
    'Imaging Equipment',
    'Surgical Instruments',
    'Patient Monitoring',
    'Infusion Pumps',
    'Ventilators',
    'Laboratory Equipment',
    'Sterilization',
    'Patient Care',
  ]

  const manufacturers = [
    'Medtronic',
    'Johnson & Johnson',
    'Siemens Healthineers',
    'GE Healthcare',
    'Philips Healthcare',
    'Stryker',
    'Boston Scientific',
    'Abbott',
  ]

  const toggleFilter = <K extends keyof FilterState>(key: K, value: FilterState[K] extends (infer U)[] ? U : never) => {
    setFilters(prev => {
      const current = prev[key] as unknown[]
      if (Array.isArray(current)) {
        const exists = current.includes(value)
        return {
          ...prev,
          [key]: exists ? current.filter(v => v !== value) : [...current, value],
        } as FilterState
      }
      return prev
    })
  }

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Header */}
      <div className="bg-white border-b border-surface-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-surface-900">Equipment Directory</h1>
              <p className="text-surface-600 mt-1">
                Browse FDA-verified medical equipment with UDI tracking
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="clinical-badge bg-clinical-100 text-clinical-700">
                <CheckCircle className="w-3.5 h-3.5 mr-1" />
                FDA Verified
              </span>
              <span className="clinical-badge bg-medical-green/10 text-medical-green">
                <Snowflake className="w-3.5 h-3.5 mr-1" />
                UDI Ready
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <aside className={`lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="clinical-card p-4 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-surface-900 flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filters
                </h3>
                <button
                  onClick={() => setFilters({
                    category: [],
                    deviceClass: [],
                    manufacturer: [],
                    coldChain: null,
                    sterile: null,
                    inStock: null,
                  })}
                  className="text-sm text-clinical-600 hover:text-clinical-700"
                >
                  Clear all
                </button>
              </div>

              {/* Device Class Filter */}
              <div>
                <h4 className="text-sm font-medium text-surface-700 mb-2">FDA Device Class</h4>
                <div className="space-y-2">
                  {(['I', 'II', 'III'] as DeviceClass[]).map(cls => (
                    <label key={cls} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.deviceClass.includes(cls)}
                        onChange={() => toggleFilter('deviceClass', cls)}
                        className="w-4 h-4 rounded border-surface-300 text-clinical-500 focus:ring-clinical-500"
                      />
                      <span className="text-sm text-surface-600">Class {cls}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <h4 className="text-sm font-medium text-surface-700 mb-2">Category</h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {categories.map(cat => (
                    <label key={cat} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.category.includes(cat)}
                        onChange={() => toggleFilter('category', cat)}
                        className="w-4 h-4 rounded border-surface-300 text-clinical-500 focus:ring-clinical-500"
                      />
                      <span className="text-sm text-surface-600">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Manufacturer Filter */}
              <div>
                <h4 className="text-sm font-medium text-surface-700 mb-2">Manufacturer</h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {manufacturers.map(mfg => (
                    <label key={mfg} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.manufacturer.includes(mfg)}
                        onChange={() => toggleFilter('manufacturer', mfg)}
                        className="w-4 h-4 rounded border-surface-300 text-clinical-500 focus:ring-clinical-500"
                      />
                      <span className="text-sm text-surface-600">{mfg}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Special Requirements */}
              <div>
                <h4 className="text-sm font-medium text-surface-700 mb-2">Special Requirements</h4>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.coldChain === true}
                      onChange={(e) => setFilters(prev => ({ ...prev, coldChain: e.target.checked ? true : null }))}
                      className="w-4 h-4 rounded border-surface-300 text-clinical-500 focus:ring-clinical-500"
                    />
                    <span className="text-sm text-surface-600 flex items-center gap-1">
                      <Snowflake className="w-3 h-3" />
                      Cold Chain Required
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.sterile === true}
                      onChange={(e) => setFilters(prev => ({ ...prev, sterile: e.target.checked ? true : null }))}
                      className="w-4 h-4 rounded border-surface-300 text-clinical-500 focus:ring-clinical-500"
                    />
                    <span className="text-sm text-surface-600">Sterile</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.inStock === true}
                      onChange={(e) => setFilters(prev => ({ ...prev, inStock: e.target.checked ? true : null }))}
                      className="w-4 h-4 rounded border-surface-300 text-clinical-500 focus:ring-clinical-500"
                    />
                    <span className="text-sm text-surface-600">In Stock</span>
                  </label>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search equipment by name, SKU, manufacturer, or FDA product code..."
                  className="w-full pl-12 pr-4 py-3 rounded-clinical border border-surface-200 focus:outline-none focus:ring-2 focus:ring-clinical-500 focus:border-clinical-500"
                />
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 lg:hidden clinical-button-secondary py-1.5 px-3 text-sm"
                >
                  <Filter className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Results */}
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-clinical-500 animate-spin" />
              </div>
            ) : (
              <div className="space-y-4">
                {/* Results Header */}
                <div className="flex items-center justify-between">
                  <p className="text-sm text-surface-600">
                    Showing {displayData?.data?.length || 0} results
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-surface-600">Sort by:</span>
                    <select className="text-sm border border-surface-200 rounded-clinical px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-clinical-500">
                      <option>Relevance</option>
                      <option>Price: Low to High</option>
                      <option>Price: High to Low</option>
                      <option>Device Class</option>
                    </select>
                  </div>
                </div>

                {/* Equipment Cards */}
                <div className="grid md:grid-cols-2 gap-4">
                  {displayData?.data?.map((item: Equipment) => (
                    <EquipmentCard key={item.id} equipment={item} />
                  ))}
                </div>

                {/* Empty State */}
                {(!displayData?.data || displayData.data.length === 0) && (
                  <div className="text-center py-12">
                    <Package className="w-12 h-12 text-surface-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-surface-900 mb-2">No equipment found</h3>
                    <p className="text-surface-600">Try adjusting your search or filters</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function EquipmentCard({ equipment }: { equipment: Equipment }) {
  return (
    <div className="clinical-card hover:shadow-clinical-lg transition-shadow">
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-surface-900 truncate">{equipment.name}</h3>
            <p className="text-sm text-surface-500">{equipment.manufacturer.name}</p>
          </div>
          <FDAStatusBadge
            deviceClass={equipment.regulatory.deviceClass}
            clearanceType={equipment.regulatory.fdaClearance?.type}
            status={equipment.regulatory.fdaClearance?.status}
          />
        </div>

        <p className="text-sm text-surface-600 line-clamp-2 mb-3">{equipment.description}</p>

        <div className="flex flex-wrap gap-2 mb-3">
          {equipment.physical.coldChainRequired && (
            <span className="clinical-badge bg-clinical-100 text-clinical-700">
              <Snowflake className="w-3 h-3 mr-1" />
              Cold Chain
            </span>
          )}
          {equipment.physical.sterility === 'sterile' && (
            <span className="clinical-badge bg-medical-green/10 text-medical-green">
              <CheckCircle className="w-3 h-3 mr-1" />
              Sterile
            </span>
          )}
          {equipment.supplyChain.lotTrackingRequired && (
            <span className="clinical-badge bg-surface-100 text-surface-600">
              Lot Tracked
            </span>
          )}
          {equipment.udi && (
            <span className="clinical-badge bg-clinical-100 text-clinical-700 font-mono text-xs">
              UDI Ready
            </span>
          )}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-surface-200">
          <div>
            <p className="text-lg font-bold text-clinical-600">
              ${equipment.pricing.listPrice.toFixed(2)}
            </p>
            {equipment.pricing.gpoPricing.length > 0 && (
              <p className="text-xs text-medical-green">
                GPO from ${Math.min(...equipment.pricing.gpoPricing.map(g => g.contractPrice)).toFixed(2)}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-surface-500">
              {equipment.supplyChain.availableInventory > 0 ? (
                <span className="text-medical-green">{equipment.supplyChain.availableInventory} in stock</span>
              ) : (
                <span className="text-medical-amber">Lead time: {equipment.supplyChain.leadTimeDays} days</span>
              )}
            </span>
          </div>
        </div>
      </div>

      <div className="px-4 py-3 bg-surface-50 border-t border-surface-200 rounded-b-clinical flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-surface-600">
          <Building2 className="w-4 h-4" />
          <span>{equipment.pricing.gpoPricing.length} GPO contracts</span>
        </div>
        <Link
          to={`/equipment/${equipment.id}`}
          className="clinical-button py-1.5 px-3 text-sm"
        >
          View Details
          <ArrowRight className="w-4 h-4 ml-1" />
        </Link>
      </div>
    </div>
  )
}
