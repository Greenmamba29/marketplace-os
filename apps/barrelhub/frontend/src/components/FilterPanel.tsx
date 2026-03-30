import { useState } from 'react'
import { SlidersHorizontal, ChevronDown, X } from 'lucide-react'
import type { FilterState, SpiritType, StorageType } from '../types'

interface FilterPanelProps {
  filters: FilterState
  onChange: (filters: FilterState) => void
  availableFilters: {
    spirit_types: string[]
    distilleries: string[]
    storage_types: string[]
    locations: string[]
    age_range: { min: number; max: number }
    proof_range: { min: number; max: number }
    price_range: { min: number; max: number }
  }
}

const spiritTypeLabels: Record<string, string> = {
  bourbon: 'Bourbon',
  rye: 'Rye',
  scotch: 'Scotch',
  rum: 'Rum',
  tequila: 'Tequila',
  brandy: 'Brandy',
  other: 'Other',
}

const storageTypeLabels: Record<string, string> = {
  new_charred_oak: 'New Charred Oak',
  used_bourbon: 'Used Bourbon',
  used_wine: 'Used Wine',
  sherry_cask: 'Sherry Cask',
  port_cask: 'Port Cask',
}

export function FilterPanel({ filters, onChange, availableFilters }: FilterPanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [expanded, setExpanded] = useState<string[]>(['spirit_type'])

  const toggleSection = (section: string) => {
    setExpanded(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    )
  }

  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    onChange({ ...filters, [key]: value })
  }

  const clearFilters = () => {
    onChange({})
  }

  const activeFilterCount = Object.values(filters).filter(v => 
    v !== undefined && (Array.isArray(v) ? v.length > 0 : true)
  ).length

  const FilterSection = ({ title, id, children }: { title: string; id: string; children: React.ReactNode }) => (
    <div className="border-b border-0.5 border-charcoal-800 last:border-b-0">
      <button
        onClick={() => toggleSection(id)}
        className="w-full flex items-center justify-between py-3 px-4 text-left"
      >
        <span className="font-medium text-gray-300">{title}</span>
        <ChevronDown 
          className={`w-4 h-4 text-gray-500 transition-transform ${expanded.includes(id) ? 'rotate-180' : ''}`} 
        />
      </button>
      {expanded.includes(id) && (
        <div className="px-4 pb-4">
          {children}
        </div>
      )}
    </div>
  )

  return (
    <div className="relative">
      {/* Mobile toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden w-full flex items-center justify-between px-4 py-3 bg-charcoal-900 rounded-lg border border-0.5 border-charcoal-800"
      >
        <div className="flex items-center space-x-2">
          <SlidersHorizontal className="w-4 h-4 text-gray-400" />
          <span className="text-gray-300 font-medium">Filters</span>
          {activeFilterCount > 0 && (
            <span className="badge-amber">{activeFilterCount}</span>
          )}
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Filter panel */}
      <div className={`
        ${isOpen ? 'block' : 'hidden'} lg:block
        absolute lg:relative z-20 lg:z-auto
        w-full mt-2 lg:mt-0
        bg-charcoal-900 lg:bg-transparent
        rounded-xl lg:rounded-none
        border border-0.5 border-charcoal-800 lg:border-0
        shadow-xl lg:shadow-none
      `}>
        <div className="card overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-0.5 border-charcoal-800">
            <div className="flex items-center space-x-2">
              <SlidersHorizontal className="w-4 h-4 text-gray-400" />
              <span className="font-medium text-gray-300">Filters</span>
            </div>
            {activeFilterCount > 0 && (
              <button
                onClick={clearFilters}
                className="flex items-center space-x-1 text-sm text-amber-500 hover:text-amber-400"
              >
                <X className="w-3 h-3" />
                <span>Clear all</span>
              </button>
            )}
          </div>

          {/* Spirit Type */}
          <FilterSection title="Spirit Type" id="spirit_type">
            <div className="space-y-2">
              {availableFilters.spirit_types.map((type) => (
                <label key={type} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.spirit_type?.includes(type as SpiritType) || false}
                    onChange={(e) => {
                      const current = filters.spirit_type || []
                      const updated = e.target.checked
                        ? [...current, type as SpiritType]
                        : current.filter(t => t !== type)
                      updateFilter('spirit_type', updated.length > 0 ? updated : undefined)
                    }}
                    className="w-4 h-4 rounded border-charcoal-600 bg-charcoal-950 text-amber-600 focus:ring-amber-600"
                  />
                  <span className="text-gray-400 text-sm">{spiritTypeLabels[type] || type}</span>
                </label>
              ))}
            </div>
          </FilterSection>

          {/* Age Range */}
          <FilterSection title="Age (Years)" id="age">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.age_min || ''}
                  onChange={(e) => updateFilter('age_min', e.target.value ? parseInt(e.target.value) : undefined)}
                  className="input text-sm py-2"
                />
                <span className="text-gray-500">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.age_max || ''}
                  onChange={(e) => updateFilter('age_max', e.target.value ? parseInt(e.target.value) : undefined)}
                  className="input text-sm py-2"
                />
              </div>
              <div className="text-xs text-gray-500">
                Range: {availableFilters.age_range.min} - {availableFilters.age_range.max} years
              </div>
            </div>
          </FilterSection>

          {/* Proof Range */}
          <FilterSection title="Proof" id="proof">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.proof_min || ''}
                  onChange={(e) => updateFilter('proof_min', e.target.value ? parseInt(e.target.value) : undefined)}
                  className="input text-sm py-2"
                />
                <span className="text-gray-500">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.proof_max || ''}
                  onChange={(e) => updateFilter('proof_max', e.target.value ? parseInt(e.target.value) : undefined)}
                  className="input text-sm py-2"
                />
              </div>
              <div className="text-xs text-gray-500">
                Range: {availableFilters.proof_range.min} - {availableFilters.proof_range.max} proof
              </div>
            </div>
          </FilterSection>

          {/* Price Range */}
          <FilterSection title="Price per PG ($)" id="price">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.price_min || ''}
                  onChange={(e) => updateFilter('price_min', e.target.value ? parseInt(e.target.value) : undefined)}
                  className="input text-sm py-2"
                />
                <span className="text-gray-500">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.price_max || ''}
                  onChange={(e) => updateFilter('price_max', e.target.value ? parseInt(e.target.value) : undefined)}
                  className="input text-sm py-2"
                />
              </div>
              <div className="text-xs text-gray-500">
                Range: ${availableFilters.price_range.min} - ${availableFilters.price_range.max} per proof gallon
              </div>
            </div>
          </FilterSection>

          {/* Storage Type */}
          <FilterSection title="Storage Type" id="storage_type">
            <div className="space-y-2">
              {availableFilters.storage_types.map((type) => (
                <label key={type} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.storage_type?.includes(type as StorageType) || false}
                    onChange={(e) => {
                      const current = filters.storage_type || []
                      const updated = e.target.checked
                        ? [...current, type as StorageType]
                        : current.filter(t => t !== type)
                      updateFilter('storage_type', updated.length > 0 ? updated : undefined)
                    }}
                    className="w-4 h-4 rounded border-charcoal-600 bg-charcoal-950 text-amber-600 focus:ring-amber-600"
                  />
                  <span className="text-gray-400 text-sm">{storageTypeLabels[type] || type}</span>
                </label>
              ))}
            </div>
          </FilterSection>

          {/* Distillery */}
          <FilterSection title="Distillery" id="distillery">
            <div className="space-y-2 max-h-40 overflow-y-auto scrollbar-thin">
              {availableFilters.distilleries.map((distillery) => (
                <label key={distillery} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.distillery?.includes(distillery) || false}
                    onChange={(e) => {
                      const current = filters.distillery || []
                      const updated = e.target.checked
                        ? [...current, distillery]
                        : current.filter(d => d !== distillery)
                      updateFilter('distillery', updated.length > 0 ? updated : undefined)
                    }}
                    className="w-4 h-4 rounded border-charcoal-600 bg-charcoal-950 text-amber-600 focus:ring-amber-600"
                  />
                  <span className="text-gray-400 text-sm truncate">{distillery}</span>
                </label>
              ))}
            </div>
          </FilterSection>
        </div>
      </div>
    </div>
  )
}
