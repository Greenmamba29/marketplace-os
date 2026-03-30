import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { 
  Filter, 
  SlidersHorizontal, 
  X, 
  ChevronDown,
  Check,
  Sprout,
  Droplets,
  Beaker,
  Tractor,
  Search
} from 'lucide-react'
import { Navbar, Footer, InputCard, SearchBar, Pagination, LoadingSpinner } from '@/components'
import { useInputs, useCrops } from '@/hooks'
import { useInputStore } from '@/store'
import type { InputCategory, FormulationType } from '@/types'

const categories: { value: InputCategory; label: string; icon: React.ElementType }[] = [
  { value: 'seed', label: 'Seeds', icon: Sprout },
  { value: 'fertilizer', label: 'Fertilizers', icon: Droplets },
  { value: 'crop_protection', label: 'Crop Protection', icon: Beaker },
  { value: 'equipment', label: 'Equipment', icon: Tractor },
]

const formulationTypes: { value: FormulationType; label: string }[] = [
  { value: 'EC', label: 'Emulsifiable Concentrate' },
  { value: 'SC', label: 'Suspension Concentrate' },
  { value: 'WG', label: 'Water Dispersible Granules' },
  { value: 'granular', label: 'Granular' },
  { value: 'liquid', label: 'Liquid' },
  { value: 'powder', label: 'Powder' },
]

const usStates = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
]

export default function InputDirectory() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [page, setPage] = useState(1)
  
  const { filters, setFilters, clearFilters, selectedCategory, setSelectedCategory } = useInputStore()
  const { data: crops } = useCrops()
  
  // Get initial category from URL
  useEffect(() => {
    const categoryParam = searchParams.get('category')
    if (categoryParam && !selectedCategory) {
      setSelectedCategory(categoryParam)
    }
  }, [searchParams])
  
  const { data: inputsData, isLoading } = useInputs(filters, page, 20)
  
  const handleSearch = (query: string) => {
    setFilters({ search: query || undefined })
    setPage(1)
  }
  
  const handleCategoryChange = (category: InputCategory | null) => {
    setSelectedCategory(category)
    setPage(1)
  }
  
  const handleFilterChange = (key: string, value: any) => {
    setFilters({ [key]: value })
    setPage(1)
  }
  
  const activeFiltersCount = Object.values(filters).filter(v => 
    v !== undefined && v !== false && v !== '' && 
    (!Array.isArray(v) || v.length > 0)
  ).length

  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />
      
      {/* Header */}
      <div className="bg-dark-800 border-b border-0.5 border-dark-600/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-display font-bold text-white mb-2">
            Agricultural Input Directory
          </h1>
          <p className="text-gray-400">
            Browse {inputsData?.total?.toLocaleString() || 'thousands of'} verified products from trusted suppliers
          </p>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className={`lg:w-64 ${isFilterOpen ? 'block' : 'hidden lg:block'}`}>
            <div className="space-y-6">
              {/* Search */}
              <div>
                <label className="form-label">Search</label>
                <SearchBar 
                  placeholder="Search products..."
                  onSearch={handleSearch}
                  initialValue={filters.search || ''}
                />
              </div>
              
              {/* Categories */}
              <div>
                <label className="form-label">Category</label>
                <div className="space-y-2">
                  <button
                    onClick={() => handleCategoryChange(null)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                      !selectedCategory 
                        ? 'bg-field-gold/20 text-field-gold' 
                        : 'text-gray-400 hover:bg-dark-700'
                    }`}
                  >
                    <Search className="w-4 h-4" />
                    All Categories
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => handleCategoryChange(cat.value)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedCategory === cat.value 
                          ? 'bg-field-gold/20 text-field-gold' 
                          : 'text-gray-400 hover:bg-dark-700'
                      }`}
                    >
                      <cat.icon className="w-4 h-4" />
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Formulation Type */}
              {(selectedCategory === 'crop_protection' || !selectedCategory) && (
                <div>
                  <label className="form-label">Formulation Type</label>
                  <div className="space-y-2">
                    {formulationTypes.map((type) => (
                      <label key={type.value} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.formulation_type?.includes(type.value) || false}
                          onChange={(e) => {
                            const current = filters.formulation_type || []
                            const updated = e.target.checked
                              ? [...current, type.value]
                              : current.filter(t => t !== type.value)
                            handleFilterChange('formulation_type', updated.length > 0 ? updated : undefined)
                          }}
                          className="w-4 h-4 rounded border-dark-600 bg-dark-800 text-field-gold focus:ring-field-gold/50"
                        />
                        <span className="text-sm text-gray-400">{type.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Crop Compatibility */}
              <div>
                <label className="form-label">Crop Compatibility</label>
                <select
                  value={filters.crop_compatibility?.[0] || ''}
                  onChange={(e) => handleFilterChange('crop_compatibility', e.target.value ? [e.target.value] : undefined)}
                  className="input-field"
                >
                  <option value="">All Crops</option>
                  {crops?.map((crop: any) => (
                    <option key={crop.id} value={crop.name}>{crop.name}</option>
                  ))}
                </select>
              </div>
              
              {/* State Registration */}
              <div>
                <label className="form-label">State Registration</label>
                <select
                  value={filters.state || ''}
                  onChange={(e) => handleFilterChange('state', e.target.value || undefined)}
                  className="input-field"
                >
                  <option value="">All States</option>
                  {usStates.map((state) => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>
              
              {/* Price Range */}
              <div>
                <label className="form-label">Price Range</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.price_min || ''}
                    onChange={(e) => handleFilterChange('price_min', e.target.value ? parseFloat(e.target.value) : undefined)}
                    className="input-field flex-1"
                  />
                  <span className="text-gray-500">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.price_max || ''}
                    onChange={(e) => handleFilterChange('price_max', e.target.value ? parseFloat(e.target.value) : undefined)}
                    className="input-field flex-1"
                  />
                </div>
              </div>
              
              {/* Checkboxes */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.in_stock_only || false}
                    onChange={(e) => handleFilterChange('in_stock_only', e.target.checked || undefined)}
                    className="w-4 h-4 rounded border-dark-600 bg-dark-800 text-field-gold focus:ring-field-gold/50"
                  />
                  <span className="text-sm text-gray-400">In Stock Only</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.epa_registered_only || false}
                    onChange={(e) => handleFilterChange('epa_registered_only', e.target.checked || undefined)}
                    className="w-4 h-4 rounded border-dark-600 bg-dark-800 text-field-gold focus:ring-field-gold/50"
                  />
                  <span className="text-sm text-gray-400">EPA Registered Only</span>
                </label>
              </div>
              
              {/* Clear Filters */}
              {activeFiltersCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                  Clear All Filters ({activeFiltersCount})
                </button>
              )}
            </div>
          </aside>
          
          {/* Main Content */}
          <main className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 bg-dark-800 border border-0.5 border-dark-600/50 rounded-lg text-gray-400"
                >
                  <Filter className="w-4 h-4" />
                  Filters
                  {activeFiltersCount > 0 && (
                    <span className="w-5 h-5 bg-field-gold rounded-full text-xs text-white flex items-center justify-center">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>
                
                <p className="text-sm text-gray-500">
                  {isLoading ? 'Loading...' : `${inputsData?.total?.toLocaleString() || 0} products found`}
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <select className="input-field py-2">
                  <option>Sort by: Relevance</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Rating: High to Low</option>
                  <option>Newest First</option>
                </select>
              </div>
            </div>
            
            {/* Active Filters */}
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedCategory && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-field-gold/20 text-field-gold text-sm rounded-full">
                    {categories.find(c => c.value === selectedCategory)?.label}
                    <button onClick={() => handleCategoryChange(null)}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {filters.state && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-dark-700 text-gray-300 text-sm rounded-full">
                    State: {filters.state}
                    <button onClick={() => handleFilterChange('state', undefined)}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {filters.crop_compatibility && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-dark-700 text-gray-300 text-sm rounded-full">
                    Crop: {filters.crop_compatibility[0]}
                    <button onClick={() => handleFilterChange('crop_compatibility', undefined)}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>
            )}
            
            {/* Products Grid */}
            {isLoading ? (
              <LoadingSpinner />
            ) : inputsData?.items?.length > 0 ? (
              <>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {inputsData.items.map((input: any) => (
                    <InputCard key={input.id} input={input} />
                  ))}
                </div>
                
                {/* Pagination */}
                {inputsData.total_pages > 1 && (
                  <div className="mt-8">
                    <Pagination
                      currentPage={page}
                      totalPages={inputsData.total_pages}
                      onPageChange={setPage}
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-dark-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-10 h-10 text-gray-500" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No products found</h3>
                <p className="text-gray-400 mb-4">Try adjusting your filters or search query</p>
                <button onClick={clearFilters} className="btn-outline">
                  Clear All Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
