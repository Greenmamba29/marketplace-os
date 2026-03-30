import { useState } from 'react'
import { 
  ShieldCheck, 
  Beaker, 
  FileText, 
  AlertTriangle,
  CheckCircle2,
  Search,
  ExternalLink,
  Download,
  Info,
  Leaf,
  Scale,
  FlaskConical
} from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Badge } from '../components/ui/Badge'
import { Card, CardContent, CardHeader } from '../components/ui/Card'
import { ComplianceBadge } from '../components/ui/ComplianceBadge'

// GRAS Database Mock
const grasEntries = [
  {
    id: 'GRN-000253',
    substance: 'Rebaudioside A (Stevia)',
    notifier: 'Cargill, Inc.',
    notification_date: '2008-12-17',
    fda_response: 'No Questions',
    intended_use: 'General purpose sweetener',
    status: 'active',
  },
  {
    id: 'GRN-000772',
    substance: 'Hemp Seed-Derived Ingredients',
    notifier: 'Fresh Hemp Foods Ltd.',
    notification_date: '2018-12-20',
    fda_response: 'No Questions',
    intended_use: 'Food ingredient',
    status: 'active',
  },
  {
    id: 'GRN-000928',
    substance: 'CBD Isolate',
    notifier: 'Various',
    notification_date: '2020-01-15',
    fda_response: 'Pending',
    intended_use: 'Dietary supplement',
    status: 'under_review',
  },
]

// Certification Database
const certifications = [
  {
    id: 'USDA-ORG',
    name: 'USDA Organic',
    issuer: 'USDA National Organic Program',
    description: 'Products meeting USDA organic standards',
    requirements: ['95%+ organic ingredients', 'No synthetic additives', 'Annual inspection'],
    website: 'https://www.ams.usda.gov/organic',
  },
  {
    id: 'NGP',
    name: 'Non-GMO Project Verified',
    issuer: 'Non-GMO Project Inc.',
    description: 'Third-party verification for non-GMO products',
    requirements: ['Testing for GMO contamination', 'Supply chain traceability', 'Annual audits'],
    website: 'https://www.nongmoproject.org',
  },
  {
    id: 'OU-KOSHER',
    name: 'OU Kosher',
    issuer: 'Orthodox Union',
    description: 'The world\'s most widely recognized kosher certification',
    requirements: ['Ingredient verification', 'Production facility inspection', 'Rabbinic supervision'],
    website: 'https://oukosher.org',
  },
  {
    id: 'IFANCA',
    name: 'IFANCA Halal',
    issuer: 'Islamic Food and Nutrition Council of America',
    description: 'Halal certification for food products',
    requirements: ['Ingredient compliance', 'Facility inspection', 'Supply chain verification'],
    website: 'https://www.ifanca.org',
  },
]

// Allergen Information
const allergenInfo = [
  {
    allergen: 'Milk',
    fda_major: true,
    declaration_required: true,
    common_names: ['Butter', 'Casein', 'Whey', 'Lactose'],
    threshold_ppm: null,
  },
  {
    allergen: 'Eggs',
    fda_major: true,
    declaration_required: true,
    common_names: ['Albumin', 'Globulin', 'Lysozyme', 'Ovalbumin'],
    threshold_ppm: null,
  },
  {
    allergen: 'Fish',
    fda_major: true,
    declaration_required: true,
    common_names: ['Anchovy', 'Bass', 'Cod', 'Salmon'],
    threshold_ppm: null,
  },
  {
    allergen: 'Crustacean Shellfish',
    fda_major: true,
    declaration_required: true,
    common_names: ['Crab', 'Lobster', 'Shrimp', 'Prawns'],
    threshold_ppm: null,
  },
  {
    allergen: 'Tree Nuts',
    fda_major: true,
    declaration_required: true,
    common_names: ['Almond', 'Cashew', 'Walnut', 'Pecan', 'Pistachio'],
    threshold_ppm: null,
  },
  {
    allergen: 'Peanuts',
    fda_major: true,
    declaration_required: true,
    common_names: ['Groundnut', 'Goober', 'Monkey nut'],
    threshold_ppm: null,
  },
  {
    allergen: 'Wheat',
    fda_major: true,
    declaration_required: true,
    common_names: ['Flour', 'Semolina', 'Durum', 'Spelt'],
    threshold_ppm: null,
  },
  {
    allergen: 'Soybeans',
    fda_major: true,
    declaration_required: true,
    common_names: ['Soy protein', 'Tofu', 'Edamame', 'Miso'],
    threshold_ppm: null,
  },
  {
    allergen: 'Sesame',
    fda_major: true,
    declaration_required: true,
    common_names: ['Benne', 'Gingelly', 'Til'],
    threshold_ppm: null,
  },
]

const RegulatoryCenter = () => {
  const [activeTab, setActiveTab] = useState<'gras' | 'certifications' | 'allergens'>('gras')
  const [searchQuery, setSearchQuery] = useState('')

  const tabs = [
    { id: 'gras', label: 'GRAS Database', icon: Beaker },
    { id: 'certifications', label: 'Certifications', icon: ShieldCheck },
    { id: 'allergens', label: 'Allergen Database', icon: AlertTriangle },
  ]

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-saffron-500/10 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-saffron-500" />
            </div>
            <div>
              <h1 className="font-display text-3xl font-bold text-slate-100">
                Regulatory Center
              </h1>
              <p className="text-slate-400">
                Comprehensive compliance documentation and regulatory resources
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-saffron-500 text-saffron-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <div className="mb-8">
          <Input
            placeholder={`Search ${activeTab}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-5 h-5" />}
            className="max-w-md"
          />
        </div>

        {/* GRAS Database */}
        {activeTab === 'gras' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold text-slate-100">
                FDA GRAS Notifications
              </h2>
              <a
                href="https://www.cfsanappsexternal.fda.gov/scripts/fdcc/?set=GRASNotices"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="sm" rightIcon={<ExternalLink className="w-4 h-4" />}>
                  View FDA Database
                </Button>
              </a>
            </div>

            <div className="grid gap-4">
              {grasEntries.map((entry) => (
                <Card key={entry.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge variant="saffron">{entry.id}</Badge>
                          <ComplianceBadge
                            status={entry.fda_response === 'No Questions' ? 'verified' : 'pending'}
                            label={entry.fda_response}
                          />
                        </div>
                        <h3 className="font-display font-semibold text-lg text-slate-100 mb-1">
                          {entry.substance}
                        </h3>
                        <p className="text-sm text-slate-400 mb-3">
                          <span className="text-slate-500">Notifier:</span> {entry.notifier}
                        </p>
                        <div className="flex flex-wrap gap-4 text-sm">
                          <span className="text-slate-400">
                            <span className="text-slate-500">Notification Date:</span>{' '}
                            {entry.notification_date}
                          </span>
                          <span className="text-slate-400">
                            <span className="text-slate-500">Intended Use:</span>{' '}
                            {entry.intended_use}
                          </span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" leftIcon={<Download className="w-4 h-4" />}>
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Info Box */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-400 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-400 mb-1">About GRAS</h4>
                  <p className="text-sm text-slate-400">
                    Generally Recognized As Safe (GRAS) is a FDA designation that a chemical or substance 
                    added to food is considered safe by experts. GRAS status can be self-affirmed by the 
                    manufacturer or confirmed through FDA notification.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Certifications */}
        {activeTab === 'certifications' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold text-slate-100">
                Certification Programs
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {certifications.map((cert) => (
                <Card key={cert.id} hover>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-saffron-500/10 flex items-center justify-center flex-shrink-0">
                        {cert.id === 'USDA-ORG' && <Leaf className="w-6 h-6 text-emerald-400" />}
                        {cert.id === 'NGP' && <Scale className="w-6 h-6 text-blue-400" />}
                        {cert.id === 'OU-KOSHER' && <ShieldCheck className="w-6 h-6 text-saffron-400" />}
                        {cert.id === 'IFANCA' && <CheckCircle2 className="w-6 h-6 text-emerald-400" />}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-display font-semibold text-lg text-slate-100 mb-1">
                          {cert.name}
                        </h3>
                        <p className="text-sm text-slate-500 mb-2">{cert.issuer}</p>
                        <p className="text-sm text-slate-400 mb-4">{cert.description}</p>
                        
                        <div className="mb-4">
                          <p className="text-xs font-medium text-slate-500 mb-2">Requirements:</p>
                          <ul className="space-y-1">
                            {cert.requirements.map((req, idx) => (
                              <li key={idx} className="flex items-center gap-2 text-sm text-slate-400">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                {req}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <a
                          href={cert.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm text-saffron-400 hover:text-saffron-300"
                        >
                          Learn more
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Allergens */}
        {activeTab === 'allergens' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold text-slate-100">
                Major Food Allergens (FALCPA)
              </h2>
              <a
                href="https://www.fda.gov/food/food-labeling-nutrition/food-allergies"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="sm" rightIcon={<ExternalLink className="w-4 h-4" />}>
                  FDA Guidelines
                </Button>
              </a>
            </div>

            {/* Info Alert */}
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5" />
                <div>
                  <h4 className="font-medium text-amber-400 mb-1">FALCPA Requirements</h4>
                  <p className="text-sm text-slate-400">
                    The Food Allergen Labeling and Consumer Protection Act (FALCPA) requires that 
                    food labels clearly identify the food source names of all major food allergens 
                    used to make the food.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {allergenInfo.map((allergen) => (
                <Card key={allergen.allergen}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-slate-100">{allergen.allergen}</h3>
                      {allergen.fda_major && (
                        <Badge variant="rose" size="sm">Major</Badge>
                      )}
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs text-slate-500">Common names/sources:</p>
                      <div className="flex flex-wrap gap-1">
                        {allergen.common_names.map((name) => (
                          <span
                            key={name}
                            className="px-2 py-0.5 bg-slate-800 text-slate-400 text-xs rounded"
                          >
                            {name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Documentation */}
            <Card>
              <CardHeader className="p-6 border-b border-slate-700/50">
                <h3 className="font-display font-semibold text-lg text-slate-100">
                  Allergen Documentation Requirements
                </h3>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-slate-100 mb-3">Required Documentation</h4>
                    <ul className="space-y-2">
                      {[
                        'Allergen statement for each ingredient',
                        'Facility allergen control program',
                        'Cleaning and sanitation protocols',
                        'Supplier allergen declarations',
                        'Risk assessment documentation',
                      ].map((item) => (
                        <li key={item} className="flex items-center gap-2 text-sm text-slate-400">
                          <FileText className="w-4 h-4 text-saffron-400" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-100 mb-3">Labeling Requirements</h4>
                    <ul className="space-y-2">
                      {[
                        'Contains statement (e.g., "Contains: Milk, Wheat")',
                        'Ingredient list with allergen source names',
                        'May contain advisory statements when applicable',
                        'Clear and conspicuous placement',
                      ].map((item) => (
                        <li key={item} className="flex items-center gap-2 text-sm text-slate-400">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

export default RegulatoryCenter
