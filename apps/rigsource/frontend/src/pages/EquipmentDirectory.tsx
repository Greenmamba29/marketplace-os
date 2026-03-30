import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Beaker, 
  ChevronRight, 
  Loader2,
  FlaskConical,
  Shield,
  TrendingUp,
  Download
} from 'lucide-react';
import { useChemicals, useCASLookup } from '@/hooks';
import CASSearch from '@/components/CASSearch';
import ComplianceBadge from '@/components/ComplianceBadge';
import type { ChemicalCategory, ChemicalGrade, SearchFilters } from '@/types';

const categories: { value: ChemicalCategory; label: string }[] = [
  { value: 'solvents', label: 'Solvents' },
  { value: 'reagents', label: 'Reagents' },
  { value: 'catalysts', label: 'Catalysts' },
  { value: 'polymers', label: 'Polymers' },
  { value: 'intermediates', label: 'Intermediates' },
  { value: 'active_pharmaceutical_ingredients', label: 'APIs' },
  { value: 'food_additives', label: 'Food Additives' },
  { value: 'cosmetic_ingredients', label: 'Cosmetic Ingredients' },
  { value: 'electronic_chemicals', label: 'Electronic Chemicals' },
  { value: 'agrochemicals', label: 'Agrochemicals' },
];

const grades: { value: ChemicalGrade; label: string }[] = [
  { value: 'technical', label: 'Technical' },
  { value: 'reagent', label: 'Reagent' },
  { value: 'acs', label: 'ACS' },
  { value: 'pharmacopeia', label: 'Pharmacopeia' },
  { value: 'food', label: 'Food Grade' },
  { value: 'cosmetic', label: 'Cosmetic' },
  { value: 'electronic', label: 'Electronic' },
  { value: 'hplc', label: 'HPLC' },
  { value: 'gc_ms', label: 'GC-MS' },
];

// Chemical card component
function ChemicalCard({ chemical }: { chemical: any }) {
  return (
    <Link 
      to={`/chemical/${chemical.id}`}
      className="group block p-6 bg-surface-50 border border-surface-200 rounded-xl hover:border-primary/50 transition-all duration-300 card-hover"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
          <Beaker className="w-6 h-6 text-primary" />
        </div>
        <span className="cas-number px-3 py-1 bg-surface-100 rounded-full text-sm font-mono text-primary">
          {chemical.cas_number}
        </span>
      </div>
      
      <h3 className="text-lg font-medium text-white mb-1 group-hover:text-primary transition-colors">
        {chemical.name}
      </h3>
      <p className="text-sm text-surface-400 mb-3 line-clamp-1">{chemical.iupac_name}</p>
      
      <div className="flex items-center gap-2 text-sm text-surface-400 mb-4">
        <FlaskConical className="w-4 h-4" />
        <span className="font-mono">{chemical.molecular_formula}</span>
        <span>·</span>
        <span>{chemical.molecular_weight} g/mol</span>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 bg-surface-100 rounded text-xs text-surface-400 capitalize">
            {chemical.category.replace(/_/g, ' ')}
          </span>
          <span className="px-2 py-1 bg-surface-100 rounded text-xs text-surface-400 uppercase">
            {chemical.grade}
          </span>
        </div>
        <ChevronRight className="w-5 h-5 text-surface-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
      </div>
    </Link>
  );
}

// Filter sidebar
function FilterSidebar({ 
  filters, 
  onChange 
}: { 
  filters: SearchFilters; 
  onChange: (filters: SearchFilters) => void 
}) {
  return (
    <div className="space-y-6">
      <div>
        <h4 className="font-medium text-white mb-3">Category</h4>
        <div className="space-y-2">
          {categories.map((cat) => (
            <label key={cat.value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="category"
                checked={filters.category === cat.value}
                onChange={() => onChange({ ...filters, category: cat.value })}
                className="w-4 h-4 text-primary bg-surface-100 border-surface-200 rounded focus:ring-primary"
              />
              <span className="text-sm text-surface-400">{cat.label}</span>
            </label>
          ))}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="category"
              checked={!filters.category}
              onChange={() => onChange({ ...filters, category: undefined })}
              className="w-4 h-4 text-primary bg-surface-100 border-surface-200 rounded focus:ring-primary"
            />
            <span className="text-sm text-surface-400">All Categories</span>
          </label>
        </div>
      </div>
      
      <div>
        <h4 className="font-medium text-white mb-3">Grade</h4>
        <div className="space-y-2">
          {grades.map((grade) => (
            <label key={grade.value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="grade"
                checked={filters.grade === grade.value}
                onChange={() => onChange({ ...filters, grade: grade.value })}
                className="w-4 h-4 text-primary bg-surface-100 border-surface-200 rounded focus:ring-primary"
              />
              <span className="text-sm text-surface-400">{grade.label}</span>
            </label>
          ))}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="grade"
              checked={!filters.grade}
              onChange={() => onChange({ ...filters, grade: undefined })}
              className="w-4 h-4 text-primary bg-surface-100 border-surface-200 rounded focus:ring-primary"
            />
            <span className="text-sm text-surface-400">All Grades</span>
          </label>
        </div>
      </div>
      
      <div>
        <h4 className="font-medium text-white mb-3">Purity Range</h4>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min %"
            value={filters.min_purity || ''}
            onChange={(e) => onChange({ ...filters, min_purity: e.target.value ? parseFloat(e.target.value) : undefined })}
            className="w-20 px-3 py-2 bg-surface-100 border border-surface-200 rounded-lg text-sm"
          />
          <span className="text-surface-400">-</span>
          <input
            type="number"
            placeholder="Max %"
            value={filters.max_purity || ''}
            onChange={(e) => onChange({ ...filters, max_purity: e.target.value ? parseFloat(e.target.value) : undefined })}
            className="w-20 px-3 py-2 bg-surface-100 border border-surface-200 rounded-lg text-sm"
          />
        </div>
      </div>
    </div>
  );
}

export default function CASDirectory() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<SearchFilters>({
    query: searchParams.get('search') || undefined,
    category: (searchParams.get('category') as ChemicalCategory) || undefined,
    grade: (searchParams.get('grade') as ChemicalGrade) || undefined,
  });
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  
  const { data, isLoading, error } = useChemicals(filters, page, 24);
  
  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.query) params.set('search', filters.query);
    if (filters.category) params.set('category', filters.category);
    if (filters.grade) params.set('grade', filters.grade);
    setSearchParams(params);
  }, [filters]);
  
  const handleSearch = (query: string) => {
    setFilters({ ...filters, query });
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <div className="bg-surface-50 border-b border-surface-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-display font-bold text-white mb-2">CAS Directory</h1>
              <p className="text-surface-400">
                Browse {data?.total.toLocaleString() || '12,400+'} chemicals with complete specifications and compliance data
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden flex items-center gap-2 px-4 py-2 bg-surface-100 border border-surface-200 rounded-lg text-white"
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>
            </div>
          </div>
          
          {/* Search bar */}
          <div className="mt-6">
            <CASSearch 
              placeholder="Search by CAS number, chemical name, or application..."
              onSelect={(cas) => handleSearch(cas)}
            />
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar filters - desktop */}
          <aside className="hidden md:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-white">Filters</h3>
                <button 
                  onClick={() => setFilters({})}
                  className="text-sm text-primary hover:underline"
                >
                  Clear all
                </button>
              </div>
              <FilterSidebar filters={filters} onChange={setFilters} />
            </div>
          </aside>
          
          {/* Mobile filters */}
          {showFilters && (
            <div className="md:hidden fixed inset-0 z-50 bg-surface">
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-white">Filters</h3>
                  <button onClick={() => setShowFilters(false)}>
                    <span className="text-surface-400">Close</span>
                  </button>
                </div>
                <FilterSidebar filters={filters} onChange={setFilters} />
              </div>
            </div>
          )}
          
          {/* Results */}
          <div className="flex-1">
            {/* Results header */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-surface-400">
                {isLoading ? (
                  'Loading...'
                ) : (
                  <>
                    Showing <span className="text-white">{data?.results.length || 0}</span> of{' '}
                    <span className="text-white">{data?.total.toLocaleString() || 0}</span> chemicals
                  </>
                )}
              </p>
              <div className="flex items-center gap-2">
                <select className="px-3 py-2 bg-surface-100 border border-surface-200 rounded-lg text-sm text-white">
                  <option>Most Relevant</option>
                  <option>Name A-Z</option>
                  <option>Name Z-A</option>
                  <option>CAS Number</option>
                </select>
              </div>
            </div>
            
            {/* Chemicals grid */}
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              </div>
            ) : error ? (
              <div className="text-center py-20">
                <p className="text-accent-error">Failed to load chemicals</p>
              </div>
            ) : data?.results.length === 0 ? (
              <div className="text-center py-20">
                <Beaker className="w-16 h-16 text-surface-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-white mb-2">No chemicals found</h3>
                <p className="text-surface-400">Try adjusting your search or filters</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {data?.results.map((chemical) => (
                    <ChemicalCard key={chemical.id} chemical={chemical} />
                  ))}
                </div>
                
                {/* Pagination */}
                {data && data.total > 24 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-4 py-2 bg-surface-100 border border-surface-200 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <span className="text-surface-400">
                      Page {page} of {Math.ceil(data.total / 24)}
                    </span>
                    <button
                      onClick={() => setPage(p => p + 1)}
                      disabled={page >= Math.ceil(data.total / 24)}
                      className="px-4 py-2 bg-surface-100 border border-surface-200 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
