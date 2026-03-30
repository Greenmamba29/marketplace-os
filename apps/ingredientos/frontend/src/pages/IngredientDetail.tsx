import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { 
  ArrowLeft, 
  CheckCircle2, 
  ShieldCheck, 
  FileText,
  Download,
  Beaker,
  Leaf,
  Scale,
  ExternalLink,
  Building2,
  Star,
  MapPin,
  Calendar,
  ArrowRight
} from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Card, CardContent, CardHeader } from '../components/ui/Card'
import { ComplianceBadge } from '../components/ui/ComplianceBadge'

// Mock ingredient data (same as in IngredientDirectory)
const mockIngredient = {
  id: '1',
  name: 'Organic Stevia Extract Reb-A 97%',
  description: 'High-purity stevia extract with 97% Rebaudioside A content. This premium natural sweetener provides intense sweetness without calories, making it ideal for beverages, baked goods, and dietary supplements. Our extraction process ensures minimal aftertaste and maximum stability.',
  category: 'sweeteners',
  supplier: {
    id: 's1',
    name: 'PureSweet Naturals',
    description: 'Leading supplier of natural sweeteners with over 15 years of experience in the food ingredient industry.',
    website: 'https://puresweet.com',
    country: 'United States',
    certifications: ['USDA Organic', 'Non-GMO Project', 'Kosher', 'ISO 22000'],
    years_in_business: 15,
    verified: true,
    rating: 4.8,
    review_count: 127,
    contact_email: 'sales@puresweet.com',
    contact_phone: '+1-555-0123',
  },
  price_per_kg: 85.50,
  moq_kg: 25,
  price_tier: 'premium',
  specifications: {
    brix: 0,
    moisture_percent: 5,
    ph: 6.5,
    shelf_life_months: 36,
    storage_conditions: 'Store in a cool, dry place away from direct sunlight. Keep container tightly sealed.',
    solubility: 'Highly soluble in water',
    particle_size_mesh: 80,
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
    {
      id: 'c3',
      name: 'Kosher Certified',
      type: 'kosher',
      issuer: 'Orthodox Union',
      certificate_number: 'OU-K-7890',
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
    allergen_statement: 'This product does not contain any of the major food allergens as defined by FALCPA. It is produced in a dedicated allergen-free facility.',
    fda_compliant: true,
  },
  functional_claims: [
    {
      id: 'fc1',
      ingredient_id: '1',
      claim: 'Zero calorie sweetener',
      claim_type: 'nutrient_content',
      regulatory_status: 'approved',
      substantiation_documents: ['Nutritional Analysis Report'],
    },
    {
      id: 'fc2',
      ingredient_id: '1',
      claim: 'Natural origin',
      claim_type: 'structure_function',
      regulatory_status: 'approved',
      substantiation_documents: ['Source Verification Certificate'],
    },
  ],
  gras_status: {
    id: 'g1',
    ingredient_id: '1',
    status: 'gras',
    fdn_number: 'GRN 000253',
    notification_date: '2008-12-17',
    fda_response: 'no_questions',
    self_affirmed: false,
    safety_studies_url: 'https://www.fda.gov/food/gras-notice-inventory',
  },
  country_of_origin: 'United States',
  lot_traceable: true,
  coa_available: true,
  sds_url: '/documents/sds-stevia.pdf',
  coa_template_url: '/documents/coa-template-stevia.pdf',
  product_data_sheet_url: '/documents/pds-stevia.pdf',
  status: 'active',
  featured: true,
  created_at: '2024-01-01',
  updated_at: '2024-01-01',
}

const IngredientDetail = () => {
  const { id } = useParams<{ id: string }>
  const ingredient = mockIngredient

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link 
            to="/ingredients" 
            className="inline-flex items-center gap-2 text-slate-400 hover:text-saffron-400 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Directory
          </Link>
          
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <Badge variant="saffron">{ingredient.category}</Badge>
                {ingredient.featured && <Badge variant="emerald">Featured</Badge>}
                <ComplianceBadge 
                  status={ingredient.gras_status.status === 'gras' ? 'verified' : 'pending'}
                  label="GRAS Verified"
                />
              </div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-slate-100 mb-2">
                {ingredient.name}
              </h1>
              <p className="text-slate-400 max-w-2xl">{ingredient.description}</p>
            </div>
            
            <div className="flex flex-col items-start lg:items-end gap-4">
              <div className="text-left lg:text-right">
                <p className="font-display text-4xl font-bold text-saffron-500">
                  ${ingredient.price_per_kg.toFixed(2)}
                </p>
                <p className="text-sm text-slate-500">per kg • MOQ: {ingredient.moq_kg} kg</p>
              </div>
              <div className="flex items-center gap-3">
                <Link to={`/rfq?ingredient=${ingredient.id}`}>
                  <Button rightIcon={<ArrowRight className="w-4 h-4" />}>
                    Request Quote
                  </Button>
                </Link>
                <Button variant="outline" leftIcon={<Download className="w-4 h-4" />}>
                  Download Specs
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Specifications */}
            <Card>
              <CardHeader className="p-6 border-b border-slate-700/50">
                <div className="flex items-center gap-2">
                  <Beaker className="w-5 h-5 text-saffron-500" />
                  <h2 className="font-display font-semibold text-lg text-slate-100">Specifications</h2>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <dt className="text-xs text-slate-500 uppercase mb-1">Moisture Content</dt>
                    <dd className="text-sm text-slate-100">{ingredient.specifications.moisture_percent}% max</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-slate-500 uppercase mb-1">pH</dt>
                    <dd className="text-sm text-slate-100">{ingredient.specifications.ph}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-slate-500 uppercase mb-1">Particle Size</dt>
                    <dd className="text-sm text-slate-100">{ingredient.specifications.particle_size_mesh} mesh</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-slate-500 uppercase mb-1">Solubility</dt>
                    <dd className="text-sm text-slate-100">{ingredient.specifications.solubility}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-slate-500 uppercase mb-1">Shelf Life</dt>
                    <dd className="text-sm text-slate-100">{ingredient.specifications.shelf_life_months} months</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-slate-500 uppercase mb-1">Country of Origin</dt>
                    <dd className="text-sm text-slate-100">{ingredient.country_of_origin}</dd>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-slate-700/50">
                  <dt className="text-xs text-slate-500 uppercase mb-1">Storage Conditions</dt>
                  <dd className="text-sm text-slate-100">{ingredient.specifications.storage_conditions}</dd>
                </div>
              </CardContent>
            </Card>

            {/* Certifications */}
            <Card>
              <CardHeader className="p-6 border-b border-slate-700/50">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-saffron-500" />
                  <h2 className="font-display font-semibold text-lg text-slate-100">Certifications</h2>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {ingredient.certifications.map((cert) => (
                    <div key={cert.id} className="flex items-start justify-between p-4 bg-slate-800/50 rounded-lg">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-100">{cert.name}</p>
                          <p className="text-sm text-slate-500">{cert.issuer}</p>
                          <p className="text-xs text-slate-500 mt-1">Cert #: {cert.certificate_number}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <ComplianceBadge status="verified" label="Active" />
                        <p className="text-xs text-slate-500 mt-1">Expires: {cert.expiry_date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* GRAS Status */}
            <Card>
              <CardHeader className="p-6 border-b border-slate-700/50">
                <div className="flex items-center gap-2">
                  <Beaker className="w-5 h-5 text-saffron-500" />
                  <h2 className="font-display font-semibold text-lg text-slate-100">GRAS Status</h2>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex items-start gap-4 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                  <div className="w-12 h-12 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-medium text-emerald-400">FDA GRAS Approved</h3>
                      <ComplianceBadge status="verified" label="No Questions" />
                    </div>
                    <p className="text-sm text-slate-400 mb-3">
                      This ingredient has been notified to the FDA as Generally Recognized As Safe (GRAS) 
                      and the agency has raised no questions regarding the notification.
                    </p>
                    <div className="grid sm:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-slate-500">GRN Number:</span>
                        <span className="text-slate-100 ml-2">{ingredient.gras_status.fdn_number}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Notification Date:</span>
                        <span className="text-slate-100 ml-2">{ingredient.gras_status.notification_date}</span>
                      </div>
                    </div>
                    <a
                      href={ingredient.gras_status.safety_studies_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-saffron-400 hover:text-saffron-300 mt-3"
                    >
                      View FDA GRAS Notice
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Allergen Profile */}
            <Card>
              <CardHeader className="p-6 border-b border-slate-700/50">
                <div className="flex items-center gap-2">
                  <Leaf className="w-5 h-5 text-saffron-500" />
                  <h2 className="font-display font-semibold text-lg text-slate-100">Allergen Information</h2>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex items-start gap-4 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                  <div className="w-12 h-12 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-emerald-400 mb-2">Allergen-Free</h3>
                    <p className="text-sm text-slate-400">{ingredient.allergen_profile.allergen_statement}</p>
                    <ComplianceBadge status="verified" label="FALCPA Compliant" className="mt-3" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Documentation */}
            <Card>
              <CardHeader className="p-6 border-b border-slate-700/50">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-saffron-500" />
                  <h2 className="font-display font-semibold text-lg text-slate-100">Documentation</h2>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <a
                    href={ingredient.sds_url}
                    className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-rose-500/10 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-rose-400" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-slate-100">Safety Data Sheet (SDS)</p>
                      <p className="text-xs text-slate-500">PDF • 245 KB</p>
                    </div>
                    <Download className="w-4 h-4 text-slate-500" />
                  </a>
                  <a
                    href={ingredient.coa_template_url}
                    className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <Scale className="w-5 h-5 text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-slate-100">Certificate of Analysis</p>
                      <p className="text-xs text-slate-500">Template • PDF</p>
                    </div>
                    <Download className="w-4 h-4 text-slate-500" />
                  </a>
                  <a
                    href={ingredient.product_data_sheet_url}
                    className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-saffron-500/10 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-saffron-400" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-slate-100">Product Data Sheet</p>
                      <p className="text-xs text-slate-500">PDF • 1.2 MB</p>
                    </div>
                    <Download className="w-4 h-4 text-slate-500" />
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Supplier Card */}
            <Card>
              <CardHeader className="p-6 border-b border-slate-700/50">
                <h2 className="font-display font-semibold text-lg text-slate-100">Supplier</h2>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-xl bg-saffron-500/10 flex items-center justify-center">
                    <Building2 className="w-7 h-7 text-saffron-500" />
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-100">{ingredient.supplier.name}</h3>
                    <div className="flex items-center gap-1 text-sm text-slate-500">
                      <MapPin className="w-3.5 h-3.5" />
                      {ingredient.supplier.country}
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-slate-400 mb-4">{ingredient.supplier.description}</p>
                
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-saffron-400 fill-saffron-400" />
                    <span className="text-sm font-medium text-slate-100">{ingredient.supplier.rating}</span>
                  </div>
                  <span className="text-sm text-slate-500">({ingredient.supplier.review_count} reviews)</span>
                  <ComplianceBadge status="verified" label="Verified" />
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-slate-500" />
                    <span className="text-slate-400">{ingredient.supplier.years_in_business} years in business</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {ingredient.supplier.certifications.map((cert) => (
                    <Badge key={cert} variant="slate" size="sm">{cert}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader className="p-6 border-b border-slate-700/50">
                <h2 className="font-display font-semibold text-lg text-slate-100">Quick Actions</h2>
              </CardHeader>
              <CardContent className="p-6 space-y-3">
                <Link to={`/rfq?ingredient=${ingredient.id}`}>
                  <Button className="w-full" rightIcon={<ArrowRight className="w-4 h-4" />}>
                    Request Quote
                  </Button>
                </Link>
                <Button variant="outline" className="w-full" leftIcon={<Download className="w-4 h-4" />}>
                  Download All Documents
                </Button>
                <Button variant="ghost" className="w-full">
                  Contact Supplier
                </Button>
              </CardContent>
            </Card>

            {/* Regulatory Summary */}
            <Card>
              <CardHeader className="p-6 border-b border-slate-700/50">
                <h2 className="font-display font-semibold text-lg text-slate-100">Regulatory Summary</h2>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">FDA Status</span>
                    <ComplianceBadge status="verified" label="Approved" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">EFSA Status</span>
                    <ComplianceBadge status="verified" label="Approved" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">GRAS Status</span>
                    <ComplianceBadge status="verified" label="Verified" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">Lot Traceable</span>
                    <ComplianceBadge status="verified" label="Yes" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">COA Available</span>
                    <ComplianceBadge status="verified" label="Yes" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default IngredientDetail
