import { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  Search, 
  Filter, 
  Snowflake, 
  Beaker, 
  Microscope, 
  Dna,
  TestTube,
  FileCheck,
  FlaskConical,
  ChevronRight,
  ArrowUpDown
} from 'lucide-react'
import StorageTempBadge from '../components/StorageTempBadge'
import CoABadge from '../components/CoABadge'
import { useReagents } from '../hooks/useReagents'
import { ReagentCategory } from '../types'

const categories: { id: ReagentCategory; name: string; icon: typeof Beaker }[] = [
  { id: 'antibodies', name: 'Antibodies', icon: Microscope },
  { id: 'cell-culture', name: 'Cell Culture', icon: Beaker },
  { id: 'molecular-biology', name: 'Molecular Biology', icon: Dna },
  { id: 'protein-biochemistry', name: 'Protein Biochemistry', icon: TestTube },
  { id: 'analytical-standards', name: 'Analytical Standards', icon: FileCheck },
  { id: 'lab-chemicals', name: 'Lab Chemicals', icon: FlaskConical },
]

const storageTemps = [
  { value: 'RT', label: 'Room Temperature' },
  { value: '2-8C', label: '2-8°C (Refrigerated)' },
  { value: '-20C', label: '-20°C (Frozen)' },
  { value: '-80C', label: '-80°C (Ultra-low)' },
  { value: 'LN2', label: 'Liquid Nitrogen' },
]

export default function ReagentDirectory() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<ReagentCategory | null>(null)
  const [selectedTemp, setSelectedTemp] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'purity'>('name')

  const { data: reagents, isLoading } = useReagents({
    category: selectedCategory || undefined,
    storageTemp: selectedTemp || undefined,
    search: searchQuery || undefined,
  })

  const filteredReagents = reagents?.data || []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="section-title">Reagent Directory</h1>
          <p className="text-slate-400 mt-1">Browse and search our catalog of laboratory reagents</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="btn-secondary"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </button>
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="input-field w-auto"
          >
            <option value="name">Sort by Name</option>
            <option value="price">Sort by Price</option>
            <option value="purity">Sort by Purity</option>
          </select>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
        <input
          type="text"
          placeholder="Search by name, catalog number, or CAS number..."
          className="input-field pl-12"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            !selectedCategory
              ? 'bg-science-600 text-white'
              : 'bg-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          All Categories
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === cat.id
                ? 'bg-science-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <cat.icon className="w-4 h-4" />
            {cat.name}
          </button>
        ))}
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-300 mb-3">Storage Temperature</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedTemp(null)}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                !selectedTemp
                  ? 'bg-science-950 text-science-400 border border-science-800'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              Any
            </button>
            {storageTemps.map((temp) => (
              <button
                key={temp.value}
                onClick={() => setSelectedTemp(temp.value)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  selectedTemp === temp.value
                    ? 'bg-science-950 text-science-400 border border-science-800'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {temp.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results Count */}
      <div className="text-sm text-slate-500">
        Showing {filteredReagents.length} reagents
      </div>

      {/* Reagent Grid */}
      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card p-6 animate-pulse">
              <div className="h-4 bg-slate-800 rounded w-3/4 mb-4" />
              <div className="h-3 bg-slate-800 rounded w-1/2 mb-2" />
              <div className="h-3 bg-slate-800 rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReagents.map((reagent: any) => (
            <Link
              key={reagent.id}
              to={`/reagents/${reagent.id}`}
              className="card card-hover p-6 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-display font-semibold text-slate-100 group-hover:text-science-400 transition-colors line-clamp-2">
                    {reagent.name}
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">{reagent.catalogNumber}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-science-500 transition-colors flex-shrink-0" />
              </div>

              <p className="text-sm text-slate-400 line-clamp-2 mb-4">
                {reagent.description}
              </p>

              <div className="flex flex-wrap items-center gap-2 mb-4">
                <StorageTempBadge temperature={reagent.storage?.temperature} size="sm" />
                {reagent.compliance?.cliaStatus === 'waived' && (
                  <span className="badge-science text-xs">CLIA Waived</span>
                )}
                {reagent.compliance?.animalFree && (
                  <span className="badge-success text-xs">Animal-Free</span>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <div>
                  <p className="text-lg font-semibold text-slate-100">
                    ${reagent.pricing?.unitPrice?.toFixed(2) || '0.00'}
                  </p>
                  <p className="text-xs text-slate-500">per {reagent.pricing?.unitSize}</p>
                </div>
                <CoABadge 
                  available={reagent.lots?.some((l: any) => l.coa)} 
                  size="sm"
                />
              </div>

              {reagent.specifications?.purity && (
                <div className="mt-3 text-xs text-slate-500">
                  Purity: {reagent.specifications.purity}%
                </div>
              )}
            </Link>
          ))}
        </div>
      )}

      {!isLoading && filteredReagents.length === 0 && (
        <div className="text-center py-16">
          <Search className="w-12 h-12 text-slate-700 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-300 mb-2">No reagents found</h3>
          <p className="text-slate-500">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  )
}
