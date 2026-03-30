import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  MapPin, 
  Shield, 
  Beaker, 
  Droplets, 
  Circle,
  ChevronRight,
  CheckCircle,
  X,
  Package
} from 'lucide-react';
import Card, { CardContent, CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { useMaterials, useMines } from '@/hooks/useMaterials';
import { formatCurrency } from '@/lib/utils';
import type { MaterialForm, PurityGrade, DeliveryTerm } from '@/types';

const materialForms: { value: MaterialForm | ''; label: string }[] = [
  { value: '', label: 'All Forms' },
  { value: 'carbonate', label: 'Lithium Carbonate' },
  { value: 'hydroxide', label: 'Lithium Hydroxide' },
  { value: 'spodumene', label: 'Spodumene' },
  { value: 'metal', label: 'Lithium Metal' },
  { value: 'chloride', label: 'Lithium Chloride' },
];

const purityGrades: { value: PurityGrade | ''; label: string }[] = [
  { value: '', label: 'All Grades' },
  { value: 'battery', label: 'Battery Grade' },
  { value: 'technical', label: 'Technical Grade' },
  { value: 'industrial', label: 'Industrial Grade' },
];

const deliveryTerms: { value: DeliveryTerm | ''; label: string }[] = [
  { value: '', label: 'All Terms' },
  { value: 'CIF', label: 'CIF' },
  { value: 'FOB', label: 'FOB' },
  { value: 'DDP', label: 'DDP' },
  { value: 'EXW', label: 'EXW' },
];

export default function MaterialDirectory() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [filters, setFilters] = useState({
    form: (searchParams.get('form') as MaterialForm) || '',
    grade: (searchParams.get('grade') as PurityGrade) || '',
    ira_compliant: searchParams.get('ira') === 'true' || false,
    delivery_term: (searchParams.get('term') as DeliveryTerm) || '',
  });

  const { data: materials, isLoading } = useMaterials(
    {
      form: filters.form || undefined,
      grade: filters.grade || undefined,
      ira_compliant: filters.ira_compliant || undefined,
      delivery_term: filters.delivery_term || undefined,
    },
    1,
    20
  );

  const { data: mines } = useMines({ ira_eligible: true }, 1, 10);

  const updateFilter = (key: string, value: string | boolean) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    const params = new URLSearchParams();
    if (newFilters.form) params.set('form', newFilters.form);
    if (newFilters.grade) params.set('grade', newFilters.grade);
    if (newFilters.ira_compliant) params.set('ira', 'true');
    if (newFilters.delivery_term) params.set('term', newFilters.delivery_term);
    setSearchParams(params);
  };

  const clearFilters = () => {
    setFilters({
      form: '',
      grade: '',
      ira_compliant: false,
      delivery_term: '',
    });
    setSearchParams(new URLSearchParams());
  };

  const hasActiveFilters = filters.form || filters.grade || filters.ira_compliant || filters.delivery_term;

  return (
    <div className="min-h-screen bg-slate-950 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Material Directory</h1>
            <p className="text-slate-400">
              Browse verified lithium materials from global suppliers
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" leftIcon={<Package className="w-4 h-4" />}>
              View Mines
            </Button>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search materials, suppliers, or specifications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3"
              />
            </div>
            <Button
              variant={showFilters ? 'primary' : 'outline'}
              leftIcon={<Filter className="w-4 h-4" />}
              onClick={() => setShowFilters(!showFilters)}
            >
              Filters
              {hasActiveFilters && (
                <span className="ml-2 w-5 h-5 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center">
                  {[filters.form, filters.grade, filters.delivery_term].filter(Boolean).length + 
                   (filters.ira_compliant ? 1 : 0)}
                </span>
              )}
            </Button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <Card className="mb-4">
              <CardContent className="p-4">
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Material Form
                    </label>
                    <select
                      value={filters.form}
                      onChange={(e) => updateFilter('form', e.target.value)}
                    >
                      {materialForms.map((form) => (
                        <option key={form.value} value={form.value}>
                          {form.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Purity Grade
                    </label>
                    <select
                      value={filters.grade}
                      onChange={(e) => updateFilter('grade', e.target.value)}
                    >
                      {purityGrades.map((grade) => (
                        <option key={grade.value} value={grade.value}>
                          {grade.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Delivery Terms
                    </label>
                    <select
                      value={filters.delivery_term}
                      onChange={(e) => updateFilter('delivery_term', e.target.value)}
                    >
                      {deliveryTerms.map((term) => (
                        <option key={term.value} value={term.value}>
                          {term.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Compliance
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.ira_compliant}
                        onChange={(e) => updateFilter('ira_compliant', e.target.checked)}
                        className="w-4 h-4 rounded border-slate-600"
                      />
                      <span className="text-slate-300 text-sm">IRA Compliant Only</span>
                    </label>
                  </div>
                </div>

                {hasActiveFilters && (
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-700">
                    <div className="flex flex-wrap gap-2">
                      {filters.form && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-500/10 text-blue-400 text-xs rounded-full">
                          {materialForms.find(f => f.value === filters.form)?.label}
                          <button onClick={() => updateFilter('form', '')}>
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      )}
                      {filters.grade && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-500/10 text-blue-400 text-xs rounded-full">
                          {purityGrades.find(g => g.value === filters.grade)?.label}
                          <button onClick={() => updateFilter('grade', '')}>
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      )}
                      {filters.ira_compliant && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-500/10 text-emerald-400 text-xs rounded-full">
                          IRA Compliant
                          <button onClick={() => updateFilter('ira_compliant', false)}>
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      )}
                    </div>
                    <button
                      onClick={clearFilters}
                      className="text-slate-400 hover:text-white text-sm"
                    >
                      Clear all
                    </button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Results */}
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Materials Grid */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array(6).fill(0).map((_, i) => (
                  <Card key={i} className="h-64 animate-pulse bg-slate-800" />
                ))}
              </div>
            ) : materials?.items && materials.items.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {(materials.items as any[]).map((material: any) => (
                  <Card key={material.id} hover className="group">
                    <CardContent className="p-5">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                            {material.name}
                          </h3>
                          <p className="text-slate-400 text-sm">
                            {material.supplier?.company_name}
                          </p>
                        </div>
                        {material.ira_compliant && (
                          <Shield className="w-5 h-5 text-emerald-400" />
                        )}
                      </div>

                      {/* Specs */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Beaker className="w-4 h-4 text-slate-500" />
                          <span className="text-slate-400">Grade:</span>
                          <span className="text-slate-200 capitalize">{material.grade}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Droplets className="w-4 h-4 text-slate-500" />
                          <span className="text-slate-400">Li₂CO₃ Eq:</span>
                          <span className="text-slate-200">{material.li2co3_equivalent}%</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Circle className="w-4 h-4 text-slate-500" />
                          <span className="text-slate-400">D50:</span>
                          <span className="text-slate-200">{material.particle_size_d50}μm</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-slate-500" />
                          <span className="text-slate-400">Origin:</span>
                          <span className="text-slate-200">{material.mine?.country}</span>
                        </div>
                      </div>

                      {/* Price & Availability */}
                      <div className="flex items-end justify-between pt-4 border-t border-slate-700">
                        <div>
                          <p className="text-slate-400 text-sm">Price</p>
                          <p className="text-xl font-bold text-white font-mono">
                            {formatCurrency(material.price_per_unit, material.currency, { maximumFractionDigits: 0 })}
                          </p>
                          <p className="text-slate-500 text-xs">/ {material.unit}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-slate-400 text-sm">Available</p>
                          <p className="text-slate-200 font-medium">
                            {material.available_quantity.toLocaleString()} {material.unit}
                          </p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 mt-4">
                        <Button size="sm" className="flex-1">
                          Request Quote
                        </Button>
                        <Button variant="outline" size="sm">
                          Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="text-center py-16">
                <Package className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  No materials found
                </h3>
                <p className="text-slate-400 mb-4">
                  Try adjusting your filters or search query
                </p>
                {hasActiveFilters && (
                  <Button variant="outline" onClick={clearFilters}>
                    Clear Filters
                  </Button>
                )}
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* IRA Compliant Mines */}
            <Card>
              <CardHeader className="pb-3">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  IRA Compliant Mines
                </h3>
              </CardHeader>
              <CardContent>
                {mines?.items && (mines.items as any[]).length > 0 ? (
                  <div className="space-y-3">
                    {(mines.items as any[]).slice(0, 5).map((mine: any) => (
                      <div
                        key={mine.id}
                        className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg"
                      >
                        <div>
                          <p className="text-white text-sm font-medium">{mine.name}</p>
                          <p className="text-slate-400 text-xs">{mine.country}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-500" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 text-sm text-center py-4">
                    No mines available
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader className="pb-3">
                <h3 className="font-semibold text-white">Market Overview</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-slate-400 text-sm">Total Listings</p>
                  <p className="text-2xl font-bold text-white">
                    {materials?.total?.toLocaleString() || '0'}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">IRA Compliant</p>
                  <p className="text-2xl font-bold text-emerald-400">
                    {materials?.items?.filter((m: any) => m.ira_compliant).length || 0}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Verified Suppliers</p>
                  <p className="text-2xl font-bold text-white">150+</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
