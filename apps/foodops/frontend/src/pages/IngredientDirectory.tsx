import { useState, useMemo } from 'react'
import { 
  Search, 
  Filter, 
  Snowflake, 
  Thermometer, 
  Flame,
  AlertTriangle,
  Check,
  X,
  ChevronDown,
  Grid3X3,
  List
} from 'lucide-react'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'
import { IngredientCard } from '../components/ui/IngredientCard'
import type { Ingredient, TemperatureZone, Allergen, Certification } from '../types'

// Mock data
const mockIngredients: Ingredient[] = [
  {
    id: '1',
    name: 'Organic Chicken Breast',
    description: 'Premium organic chicken breast, boneless and skinless. Perfect for grilling, baking, or sautéing.',
    sku: 'CHX-BR-ORG-001',
    gtin: '00856000001234',
    category: 'Poultry',
    subcategory: 'Chicken',
    supplierId: 'sup-1',
    supplierName: 'Premium Poultry Farms',
    temperatureZone: 'refrigerated',
    foodSafetyCategory: 'raw',
    allergens: [],
    mayContain: [],
    certifications: ['organic', 'non_gmo'],
    shelfLifeDays: 5,
    minDaysToExpiry: 3,
    countryOfOrigin: 'USA',
    unitPrice: 8.99,
    unitOfMeasure: 'lb',
    minOrderQuantity: 10,
    availableQuantity: 500,
    images: [],
    documents: [],
    status: 'active',
    isAvailable: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'Atlantic Salmon Fillet',
    description: 'Fresh Atlantic salmon fillets, sustainably sourced. Rich in omega-3 fatty acids.',
    sku: 'SAL-FIL-ATL-001',
    gtin: '00856000001235',
    category: 'Seafood',
    subcategory: 'Salmon',
    supplierId: 'sup-2',
    supplierName: 'Ocean Fresh Seafood',
    temperatureZone: 'refrigerated',
    foodSafetyCategory: 'raw',
    allergens: ['fish'],
    mayContain: ['shellfish'],
    certifications: ['non_gmo'],
    shelfLifeDays: 3,
    minDaysToExpiry: 2,
    countryOfOrigin: 'Norway',
    unitPrice: 16.99,
    unitOfMeasure: 'lb',
    minOrderQuantity: 5,
    availableQuantity: 200,
    images: [],
    documents: [],
    status: 'active',
    isAvailable: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '3',
    name: 'Frozen Green Beans',
    description: 'IQF green beans, flash-frozen at peak freshness. Perfect for sides and stir-fries.',
    sku: 'VEG-GB-IQF-001',
    gtin: '00856000001236',
    category: 'Vegetables',
    subcategory: 'Frozen Vegetables',
    supplierId: 'sup-3',
    supplierName: 'Valley Fresh Produce',
    temperatureZone: 'frozen',
    foodSafetyCategory: 'RTE',
    allergens: [],
    mayContain: [],
    certifications: ['organic', 'non_gmo'],
    shelfLifeDays: 365,
    minDaysToExpiry: 300,
    countryOfOrigin: 'USA',
    unitPrice: 3.49,
    unitOfMeasure: 'lb',
    minOrderQuantity: 20,
    availableQuantity: 1000,
    images: [],
    documents: [],
    status: 'active',
    isAvailable: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '4',
    name: 'All-Purpose Flour',
    description: 'Premium all-purpose flour, unbleached. Perfect for baking bread, pastries, and more.',
    sku: 'BAK-FLR-AP-001',
    gtin: '00856000001237',
    category: 'Bakery',
    subcategory: 'Flour',
    supplierId: 'sup-4',
    supplierName: 'Millstone Baking Co.',
    temperatureZone: 'ambient',
    foodSafetyCategory: 'raw',
    allergens: ['wheat'],
    mayContain: ['soy', 'tree_nuts'],
    certifications: ['kosher'],
    shelfLifeDays: 180,
    minDaysToExpiry: 150,
    countryOfOrigin: 'USA',
    unitPrice: 1.99,
    unitOfMeasure: 'lb',
    minOrderQuantity: 50,
    availableQuantity: 2000,
    images: [],
    documents: [],
    status: 'active',
    isAvailable: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '5',
    name: 'Heavy Cream',
    description: 'Fresh heavy cream with 36% fat content. Perfect for sauces, soups, and desserts.',
    sku: 'DAI-CRM-HVY-001',
    gtin: '00856000001238',
    category: 'Dairy',
    subcategory: 'Cream',
    supplierId: 'sup-5',
    supplierName: 'Dairyland Farms',
    temperatureZone: 'refrigerated',
    foodSafetyCategory: 'raw',
    allergens: ['milk'],
    mayContain: [],
    certifications: ['kosher'],
    shelfLifeDays: 14,
    minDaysToExpiry: 10,
    countryOfOrigin: 'USA',
    unitPrice: 4.99,
    unitOfMeasure: 'qt',
    minOrderQuantity: 12,
    availableQuantity: 300,
    images: [],
    documents: [],
    status: 'active',
    isAvailable: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '6',
    name: 'Frozen Shrimp 16/20',
    description: 'Raw peeled and deveined shrimp, 16-20 count per pound. IQF frozen.',
    sku: 'SEA-SHR-1620-001',
    gtin: '00856000001239',
    category: 'Seafood',
    subcategory: 'Shrimp',
    supplierId: 'sup-2',
    supplierName: 'Ocean Fresh Seafood',
    temperatureZone: 'frozen',
    foodSafetyCategory: 'raw',
    allergens: ['shellfish'],
    mayContain: ['fish'],
    certifications: [],
    shelfLifeDays: 180,
    minDaysToExpiry: 150,
    countryOfOrigin: 'Vietnam',
    unitPrice: 12.99,
    unitOfMeasure: 'lb',
    minOrderQuantity: 10,
    availableQuantity: 400,
    images: [],
    documents: [],
    status: 'active',
    isAvailable: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
]

const categories = ['All', 'Poultry', 'Seafood', 'Vegetables', 'Bakery', 'Dairy']
const suppliers = ['All', 'Premium Poultry Farms', 'Ocean Fresh Seafood', 'Valley Fresh Produce', 'Millstone Baking Co.', 'Dairyland Farms']

export const IngredientDirectory = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedSupplier, setSelectedSupplier] = useState('All')
  const [selectedTempZones, setSelectedTempZones] = useState<TemperatureZone[]>([])
  const [selectedAllergens, setSelectedAllergens] = useState<Allergen[]>([])
  const [selectedCertifications, setSelectedCertifications] = useState<Certification[]>([])
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)

  const filteredIngredients = useMemo(() => {
    return mockIngredients.filter((ingredient) => {
      // Search
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesSearch = 
          ingredient.name.toLowerCase().includes(query) ||
          ingredient.description.toLowerCase().includes(query) ||
          ingredient.sku.toLowerCase().includes(query) ||
          ingredient.supplierName.toLowerCase().includes(query)
        if (!matchesSearch) return false
      }

      // Category
      if (selectedCategory !== 'All' && ingredient.category !== selectedCategory) {
        return false
      }

      // Supplier
      if (selectedSupplier !== 'All' && ingredient.supplierName !== selectedSupplier) {
        return false
      }

      // Temperature Zone
      if (selectedTempZones.length > 0 && !selectedTempZones.includes(ingredient.temperatureZone)) {
        return false
      }

      // Allergens (exclude ingredients containing selected allergens)
      if (selectedAllergens.length > 0) {
        const hasAllergen = ingredient.allergens.some(a => selectedAllergens.includes(a))
        if (hasAllergen) return false
      }

      // Certifications
      if (selectedCertifications.length > 0) {
        const hasAllCerts = selectedCertifications.every(c => ingredient.certifications.includes(c))
        if (!hasAllCerts) return false
      }

      return true
    })
  }, [searchQuery, selectedCategory, selectedSupplier, selectedTempZones, selectedAllergens, selectedCertifications])

  const toggleTempZone = (zone: TemperatureZone) => {
    setSelectedTempZones(prev => 
      prev.includes(zone) 
        ? prev.filter(z => z !== zone)
        : [...prev, zone]
    )
  }

  const toggleAllergen = (allergen: Allergen) => {
    setSelectedAllergens(prev => 
      prev.includes(allergen)
        ? prev.filter(a => a !== allergen)
        : [...prev, allergen]
    )
  }

  const toggleCertification = (cert: Certification) => {
    setSelectedCertifications(prev => 
      prev.includes(cert)
        ? prev.filter(c => c !== cert)
        : [...prev, cert]
    )
  }

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedCategory('All')
    setSelectedSupplier('All')
    setSelectedTempZones([])
    setSelectedAllergens([])
    setSelectedCertifications([])
  }

  const activeFiltersCount = 
    (selectedCategory !== 'All' ? 1 : 0) +
    (selectedSupplier !== 'All' ? 1 : 0) +
    selectedTempZones.length +
    selectedAllergens.length +
    selectedCertifications.length

  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-white mb-2">
            Ingredient Directory
          </h1>
          <p className="text-neutral-400">
            Browse and source ingredients from verified suppliers
          </p>
        </div>

        {/* Search and Filters Bar */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Search ingredients, SKUs, suppliers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-5 h-5" />}
              fullWidth
            />
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="secondary"
              leftIcon={<Filter className="w-4 h-4" />}
              rightIcon={activeFiltersCount > 0 ? (
                <span className="w-5 h-5 rounded-full bg-[#65A30D] text-white text-xs flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              ) : undefined}
              onClick={() => setShowFilters(!showFilters)}
            >
              Filters
            </Button>
            
            <div className="flex bg-neutral-800 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-neutral-700 text-white' : 'text-neutral-400'}`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-neutral-700 text-white' : 'text-neutral-400'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <Card className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-white">Filters</h3>
              <button
                onClick={clearFilters}
                className="text-sm text-neutral-400 hover:text-white flex items-center gap-1"
              >
                <X className="w-4 h-4" />
                Clear all
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-800 border border-white/10 text-white text-sm"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Supplier */}
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Supplier</label>
                <select
                  value={selectedSupplier}
                  onChange={(e) => setSelectedSupplier(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-800 border border-white/10 text-white text-sm"
                >
                  {suppliers.map(sup => (
                    <option key={sup} value={sup}>{sup}</option>
                  ))}
                </select>
              </div>

              {/* Temperature Zone */}
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Temperature Zone</label>
                <div className="flex flex-wrap gap-2">
                  {(['frozen', 'refrigerated', 'ambient'] as TemperatureZone[]).map(zone => (
                    <button
                      key={zone}
                      onClick={() => toggleTempZone(zone)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                        selectedTempZones.includes(zone)
                          ? 'bg-[#65A30D]/20 border-[#65A30D]/50 text-[#A3E635]'
                          : 'bg-neutral-800 border-white/10 text-neutral-400 hover:text-white'
                      }`}
                    >
                      {zone.charAt(0).toUpperCase() + zone.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Certifications */}
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Certifications</label>
                <div className="flex flex-wrap gap-2">
                  {(['organic', 'kosher', 'halal'] as Certification[]).map(cert => (
                    <button
                      key={cert}
                      onClick={() => toggleCertification(cert)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                        selectedCertifications.includes(cert)
                          ? 'bg-[#65A30D]/20 border-[#65A30D]/50 text-[#A3E635]'
                          : 'bg-neutral-800 border-white/10 text-neutral-400 hover:text-white'
                      }`}
                    >
                      {cert.charAt(0).toUpperCase() + cert.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Allergen Filter */}
            <div className="mt-4 pt-4 border-t border-white/5">
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Exclude Allergens
              </label>
              <div className="flex flex-wrap gap-2">
                {(['peanuts', 'tree_nuts', 'milk', 'eggs', 'wheat', 'soy', 'fish', 'shellfish'] as Allergen[]).map(allergen => (
                  <button
                    key={allergen}
                    onClick={() => toggleAllergen(allergen)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                      selectedAllergens.includes(allergen)
                        ? 'bg-red-500/20 border-red-500/50 text-red-400'
                        : 'bg-neutral-800 border-white/10 text-neutral-400 hover:text-white'
                    }`}
                  >
                    {allergen.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>
          </Card>
        )}

        {/* Results Count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-neutral-400">
            Showing <span className="text-white font-medium">{filteredIngredients.length}</span> ingredients
          </p>
        </div>

        {/* Results Grid */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredIngredients.map(ingredient => (
              <IngredientCard 
                key={ingredient.id} 
                ingredient={ingredient}
                onAddToRFQ={(ing) => console.log('Add to RFQ:', ing.name)}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredIngredients.map(ingredient => (
              <IngredientCard 
                key={ingredient.id} 
                ingredient={ingredient}
                variant="compact"
                onAddToRFQ={(ing) => console.log('Add to RFQ:', ing.name)}
              />
            ))}
          </div>
        )}

        {filteredIngredients.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-neutral-800 flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-neutral-500" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">No ingredients found</h3>
            <p className="text-neutral-400">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  )
}
