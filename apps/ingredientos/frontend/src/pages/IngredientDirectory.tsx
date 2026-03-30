import { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  Search, 
  Filter, 
  ChevronDown, 
  CheckCircle2, 
  ShieldCheck,
  Leaf,
  Scale,
  Beaker,
  ArrowRight,
  X
} from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Badge } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'
import { ComplianceBadge } from '../components/ui/ComplianceBadge'
import type { Ingredient, IngredientCategory } from '../types'

// Mock data
const mockIngredients: Ingredient[] = [
  {
    id: '1',
    name: 'Organic Stevia Extract Reb-A 97%',
    description: 'High-purity stevia extract with 97% Rebaudioside A content. Zero-calorie natural sweetener.',
    category: 'sweeteners',
    supplier: {
      id: 's1',
      name: 'PureSweet Naturals',
      description: 'Leading supplier of natural sweeteners',
      country: 'United States',
      certifications: ['USDA Organic', 'Non-GMO Project', 'Kosher'],
      years_in_business: 15,
      verified: true,
      rating: 4.8,
      review_count: 127,
      contact_email: 'sales@puresweet.com',
      created_at: '2020-01-01',
    },
    supplier_id: 's1',
    price_per_kg: 85.50,
    moq_kg: 25,
    price_tier: 'premium',
    specifications: {
      shelf_life_months: 36,
      storage_conditions: 'Cool, dry place. Keep sealed.',
      moisture_percent: 5,
    },
    regulatory_status: {
      us_fda_status: 'approved',
      eu_efsa_status: 'approved',
      fda_regulation_number: '21 CFR 182.20',
    },
    certifications: [
      {
        id: 'c1',
        name: 'USDA Organic',
        type: 'organic',
        issuer: 'USDA',
        certificate_number: 'ORG-2024-001',
        issue_date: '2024-01-01',
        expiry_date: '2025-01-01',
        status: 'active',
        verified: true,
      },
      {
        id: 'c2',
        name: 'Non-GMO Project Verified',
        type: 'non_gmo',
        issuer: 'Non-GMO Project',
        certificate_number: 'NGP-2024-456',
        issue_date: '2024-01-01',
        expiry_date: '2025-01-01',
        status: 'active',
        verified: true,
      },
    ],
    allergen_profile: {
      id: 'a1',
      ingredient_id: '1',
      contains_major_allergens: false,
      major_allergens: [],
      may_contain: [],
      processed_on_shared_equipment: false,
      allergen_statement: 'This product does not contain any of the major food allergens.',
      fda_compliant: true,
    },
    functional_claims: [],
    gras_status: {
      id: 'g1',
      ingredient_id: '1',
      status: 'gras',
      fdn_number: 'GRN 000253',
      notification_date: '2008-12-17',
      fda_response: 'no_questions',
      self_affirmed: false,
    },
    country_of_origin: 'United States',
    lot_traceable: true,
    coa_available: true,
    status: 'active',
    featured: true,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },
  {
    id: '2',
    name: 'Pea Protein Isolate 80%',
    description: 'Plant-based protein isolate from yellow peas. Clean taste, excellent emulsification.',
    category: 'proteins',
    supplier: {
      id: 's2',
      name: 'PlantPro Ingredients',
      description: 'Specialist in plant-based proteins',
      country: 'Canada',
      certifications: ['Non-GMO Project', 'Kosher', 'Halal'],
      years_in_business: 8,
      verified: true,
      rating: 4.6,
      review_count: 89,
      contact_email: 'info@plantpro.com',
      created_at: '2020-01-01',
    },
    supplier_id: 's2',
    price_per_kg: 12.75,
    moq_kg: 500,
    price_tier: 'standard',
    specifications: {
      shelf_life_months: 24,
      storage_conditions: 'Cool, dry place',
      moisture_percent: 8,
      protein_content: 80,
    },
    regulatory_status: {
      us_fda_status: 'approved',
      eu_efsa_status: 'approved',
    },
    certifications: [
      {
        id: 'c3',
        name: 'Non-GMO Project Verified',
        type: 'non_gmo',
        issuer: 'Non-GMO Project',
        certificate_number: 'NGP-2024-789',
        issue_date: '2024-01-01',
        expiry_date: '2025-01-01',
        status: 'active',
        verified: true,
      },
    ],
    allergen_profile: {
      id: 'a2',
      ingredient_id: '2',
      contains_major_allergens: false,
      major_allergens: [],
      may_contain: ['soybeans'],
      processed_on_shared_equipment: true,
      allergen_statement: 'Produced in a facility that also processes soy.',
      fda_compliant: true,
    },
    functional_claims: [],
    gras_status: {
      id: 'g2',
      ingredient_id: '2',
      status: 'gras',
      self_affirmed: true,
    },
    country_of_origin: 'Canada',
    lot_traceable: true,
    coa_available: true,
    status: 'active',
    featured: false,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },
  {
    id: '3',
    name: 'Natural Vanilla Extract 2X',
    description: 'Pure vanilla extract from Madagascar vanilla beans. Double-fold strength.',
    category: 'flavors',
    supplier: {
      id: 's3',
      name: 'FlavorCraft International',
      description: 'Premium flavor extracts and essences',
      country: 'United States',
      certifications: ['Kosher', 'Organic'],
      years_in_business: 25,
      verified: true,
      rating: 4.9,
      review_count: 234,
      contact_email: 'orders@flavorcraft.com',
      created_at: '2020-01-01',
    },
    supplier_id: 's3',
    price_per_kg: 145.00,
    moq_kg: 10,
    price_tier: 'premium',
    specifications: {
      shelf_life_months: 48,
      storage_conditions: 'Cool, dark place',
      alcohol_content: 35,
    },
    regulatory_status: {
      us_fda_status: 'approved',
      eu_efsa_status: 'approved',
      fda_regulation_number: '21 CFR 169.175',
    },
    certifications: [
      {
        id: 'c4',
        name: 'Kosher Certified',
        type: 'kosher',
        issuer: 'OU',
        certificate_number: 'OU-K-12345',
        issue_date: '2024-01-01',
        expiry_date: '2025-01-01',
        status: 'active',
        verified: true,
      },
    ],
    allergen_profile: {
      id: 'a3',
      ingredient_id: '3',
      contains_major_allergens: false,
      major_allergens: [],
      may_contain: [],
      processed_on_shared_equipment: false,
      allergen_statement: 'Contains alcohol. No major allergens.',
      fda_compliant: true,
    },
    functional_claims: [],
    gras_status: {
      id: 'g3',
      ingredient_id: '3',
      status: 'gras',
      self_affirmed: false,
    },
    country_of_origin: 'Madagascar',
    lot_traceable: true,
    coa_available: true,
    status: 'active',
    featured: true,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },
]

const categories: { value: IngredientCategory; label: string }[] = [
  { value: 'sweeteners', label: 'Sweeteners' },
  { value: 'flavors', label: 'Flavors' },
  { value: 'colors', label: 'Colors' },
  { value: 'preservatives', label: 'Preservatives' },
  { value: 'emulsifiers', label: 'Emulsifiers' },
  { value: 'proteins', label: 'Proteins' },
  { value: 'probiotics', label: 'Probiotics' },
  { value: 'extracts', label: 'Extracts' },
]

const IngredientDirectory = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<IngredientCategory | ''>('')
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    organic: false,
    nonGmo: false,
    kosher: false,
    halal: false,
    gras: false,
  })

  const filteredIngredients = mockIngredients.filter(ingredient => {
    const matchesSearch = ingredient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ingredient.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = !selectedCategory || ingredient.category === selectedCategory
    const matchesOrganic = !filters.organic || ingredient.certifications.some(c => c.type === 'organic')
    const matchesNonGmo = !filters.nonGmo || ingredient.certifications.some(c => c.type === 'non_gmo')
    const matchesKosher = !filters.kosher || ingredient.certifications.some(c => c.type === 'kosher')
    const matchesHalal = !filters.halal || ingredient.certifications.some(c => c.type === 'halal')
    const matchesGras = !filters.gras || ingredient.gras_status.status === 'gras'
    
    return matchesSearch && matchesCategory && matchesOrganic && matchesNonGmo && 
           matchesKosher && matchesHalal && matchesGras
  })

  const activeFiltersCount = Object.values(filters).filter(Boolean).length + (selectedCategory ? 1 : 0)

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl font-bold text-slate-100">
                Ingredient Directory
              </h1>
              <p className="text-slate-400 mt-1">
                Browse {mockIngredients.length}+ verified ingredients with complete regulatory documentation
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="emerald">
                <CheckCircle2 className="w-3 h-3" />
                GRAS Verified
              </Badge>
              <Badge variant="saffron">
                <ShieldCheck className="w-3 h-3" />
                Certified
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="sticky top-16 z-40 bg-slate-950/95 backdrop-blur border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <Input
                placeholder="Search ingredients, suppliers, or CAS numbers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search className="w-5 h-5" />}
              />
            </div>

            {/* Category Select */}
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as IngredientCategory | '')}
                className="w-full md:w-48 px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-100 focus:outline-none focus:border-saffron-500/50 appearance-none cursor-pointer"
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            </div>

            {/* Filter Toggle */}
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              leftIcon={<Filter className="w-4 h-4" />}
            >
              Filters
              {activeFiltersCount > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-saffron-500 text-slate-950 text-xs rounded-full">
                  {activeFiltersCount}
                </span>
              )}
            </Button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mt-4 p-4 bg-slate-900 border border-slate-700/50 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-slate-100">Certification Filters</h3>
                <button
                  onClick={() => {
                    setFilters({ organic: false, nonGmo: false, kosher: false, halal: false, gras: false })
                    setSelectedCategory('')
                  }}
                  className="text-sm text-saffron-400 hover:text-saffron-300 flex items-center gap-1"
                >
                  <X className="w-4 h-4" />
                  Clear all
                </button>
              </div>
              <div className="flex flex-wrap gap-3">
                <label className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-lg cursor-pointer hover:bg-slate-800 transition-colors">
                  <input
                    type="checkbox"
                    checked={filters.organic}
                    onChange={(e) => setFilters(f => ({ ...f, organic: e.target.checked }))}
                    className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-saffron-500 focus:ring-saffron-500/30"
                  />
                  <Leaf className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm text-slate-300">USDA Organic</span>
                </label>
                <label className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-lg cursor-pointer hover:bg-slate-800 transition-colors">
                  <input
                    type="checkbox"
                    checked={filters.nonGmo}
                    onChange={(e) => setFilters(f => ({ ...f, nonGmo: e.target.checked }))}
                    className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-saffron-500 focus:ring-saffron-500/30"
                  />
                  <Scale className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-slate-300">Non-GMO</span>
                </label>
                <label className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-lg cursor-pointer hover:bg-slate-800 transition-colors">
                  <input
                    type="checkbox"
                    checked={filters.kosher}
                    onChange={(e) => setFilters(f => ({ ...f, kosher: e.target.checked }))}
                    className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-saffron-500 focus:ring-saffron-500/30"
                  />
                  <span className="text-sm text-slate-300">Kosher</span>
                </label>
                <label className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-lg cursor-pointer hover:bg-slate-800 transition-colors">
                  <input
                    type="checkbox"
                    checked={filters.halal}
                    onChange={(e) => setFilters(f => ({ ...f, halal: e.target.checked }))}
                    className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-saffron-500 focus:ring-saffron-500/30"
                  />
                  <span className="text-sm text-slate-300">Halal</span>
                </label>
                <label className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-lg cursor-pointer hover:bg-slate-800 transition-colors">
                  <input
                    type="checkbox"
                    checked={filters.gras}
                    onChange={(e) => setFilters(f => ({ ...f, gras: e.target.checked }))}
                    className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-saffron-500 focus:ring-saffron-500/30"
                  />
                  <Beaker className="w-4 h-4 text-saffron-400" />
                  <span className="text-sm text-slate-300">GRAS Verified</span>
                </label>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <p className="text-slate-400">
            Showing <span className="text-slate-100 font-medium">{filteredIngredients.length}</span> ingredients
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {filteredIngredients.map((ingredient) => (
            <Card key={ingredient.id} hover>
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="saffron">
                        {ingredient.category}
                      </Badge>
                      {ingredient.featured && (
                        <Badge variant="emerald">Featured</Badge>
                      )}
                    </div>
                    <h3 className="font-display font-semibold text-lg text-slate-100">
                      {ingredient.name}
                    </h3>
                  </div>
                  <div className="text-right">
                    <p className="font-display font-bold text-xl text-saffron-500">
                      ${ingredient.price_per_kg.toFixed(2)}
                    </p>
                    <p className="text-xs text-slate-500">per kg</p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                  {ingredient.description}
                </p>

                {/* Compliance Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <ComplianceBadge 
                    status={ingredient.gras_status.status === 'gras' ? 'verified' : 'pending'}
                    label={ingredient.gras_status.status === 'gras' ? 'GRAS' : 'GRAS Pending'}
                  />
                  {ingredient.certifications.map(cert => (
                    <ComplianceBadge 
                      key={cert.id}
                      status="verified"
                      label={cert.name}
                    />
                  ))}
                  {ingredient.allergen_profile.contains_major_allergens ? (
                    <ComplianceBadge status="missing" label="Contains Allergens" />
                  ) : (
                    <ComplianceBadge status="verified" label="Allergen-Free" />
                  )}
                </div>

                {/* Supplier Info */}
                <div className="flex items-center justify-between py-4 border-t border-slate-700/50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center">
                      <span className="text-xs font-medium text-slate-400">
                        {ingredient.supplier.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-300">{ingredient.supplier.name}</p>
                      <p className="text-xs text-slate-500">{ingredient.supplier.country}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-sm text-slate-400">Verified</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-4">
                  <Link to={`/ingredients/${ingredient.id}`} className="flex-1">
                    <Button variant="outline" className="w-full">
                      View Details
                    </Button>
                  </Link>
                  <Link to={`/rfq?ingredient=${ingredient.id}`}>
                    <Button rightIcon={<ArrowRight className="w-4 h-4" />}>
                      Request Quote
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredIngredients.length === 0 && (
          <div className="text-center py-16">
            <Beaker className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="font-display text-xl font-semibold text-slate-100 mb-2">
              No ingredients found
            </h3>
            <p className="text-slate-400 mb-6">
              Try adjusting your search or filters to find what you're looking for.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('')
                setFilters({ organic: false, nonGmo: false, kosher: false, halal: false, gras: false })
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default IngredientDirectory
