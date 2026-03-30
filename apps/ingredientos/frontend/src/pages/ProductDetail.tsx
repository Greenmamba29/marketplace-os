import { useParams, Link } from 'react-router-dom';
import { 
  ChevronLeft, 
  ShoppingCart, 
  FileText, 
  Truck, 
  Clock, 
  ShieldCheck, 
  CheckCircle2,
  ChevronRight,
  Info,
  Download,
  FlaskConical,
  Beaker,
  AlertTriangle
} from 'lucide-react';
import { motion } from 'framer-motion';

const mockProduct = {
  id: '1',
  name: 'Premium Whey Protein Isolate',
  category: 'Proteins',
  price: 12.50,
  image: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?auto=format&fit=crop&w=600&q=80',
  description: 'Ultra-filtered, low-lactose whey protein isolate with 90% protein content. Ideal for sport nutrition, weight management formulas, and medical nutrition applications.',
  inciName: 'Whey Protein Isolate',
  casNumber: '91082-88-1',
  moq: '500 kg',
  leadTime: '10 days',
  unit: 'kg',
  applications: ['Protein Shakes', 'Nutrition Bars', 'Meal Replacements', 'Infant Formula', 'Functional Beverages'],
  status: ['Organic Certified', 'Non-GMO', 'Kosher', 'Halal'],
  pricingTiers: [
    { range: '500-1999', price: 12.50 },
    { range: '2000-4999', price: 11.20 },
    { range: '5000+', price: 10.15 },
  ],
  specs: [
    { label: 'Protein Content', value: '≥ 90.0%' },
    { label: 'Fat Content', value: '≤ 1.0%' },
    { label: 'Lactose Content', value: '≤ 0.5%' },
    { label: 'Moisture', value: '≤ 5.0%' },
  ]
};

export default function ProductDetail() {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-surface pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/products" className="inline-flex items-center gap-2 text-surface-400 hover:text-white mb-8 transition-colors">
          <ChevronLeft className="w-4 h-4" /> Back to Ingredients
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-surface-50 border border-surface-200 rounded-2xl overflow-hidden relative">
              <img src={mockProduct.image} alt={mockProduct.name} className="w-full h-full object-cover" />
              <div className="absolute bottom-4 right-4 flex gap-2">
                <button className="p-3 bg-surface-900/80 backdrop-blur-md border border-surface-200 rounded-xl text-white hover:text-primary transition-colors shadow-xl">
                  <Download className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-8">
            <div>
              <div className="text-xs uppercase tracking-wider text-primary font-medium mb-2">{mockProduct.category}</div>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">{mockProduct.name}</h1>
              <div className="flex items-center gap-4 text-xs font-mono text-surface-400 mb-6">
                <span>INCI: {mockProduct.inciName}</span>
                <span>CAS: {mockProduct.casNumber}</span>
              </div>
              <p className="text-surface-400 leading-relaxed mb-6">{mockProduct.description}</p>
              
              <div className="flex flex-wrap gap-2">
                {mockProduct.status.map(s => (
                  <span key={s} className="px-3 py-1 bg-surface-100 border border-surface-200 rounded-lg text-[10px] text-white font-medium">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-6 bg-surface-50 border border-surface-200 rounded-2xl space-y-6">
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-sm text-surface-400 mb-1">Wholesale Price (from)</div>
                  <div className="text-3xl font-display font-bold text-white">${mockProduct.pricingTiers[mockProduct.pricingTiers.length-1].price.toFixed(2)}<span className="text-sm text-surface-400 font-sans font-normal ml-2">/{mockProduct.unit}</span></div>
                </div>
                <div className="text-xs text-surface-400">MOQ: {mockProduct.moq}</div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {mockProduct.pricingTiers.map(tier => (
                  <div key={tier.range} className="p-2 bg-surface-100 border border-surface-200 rounded-lg text-center">
                    <div className="text-[10px] text-surface-400 mb-1">{tier.range} {mockProduct.unit}</div>
                    <div className="text-sm font-bold text-white">${tier.price.toFixed(2)}</div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-3">
                <Link to="/rfq" className="btn btn-primary w-full">
                  <ShoppingCart className="w-5 h-5" /> Order Trial Batch
                </Link>
                <div className="grid grid-cols-2 gap-3">
                  <button className="btn btn-secondary text-sm">Download CoA</button>
                  <button className="btn btn-secondary text-sm">Allergen Sheet</button>
                </div>
              </div>
            </div>

            <div className="p-4 bg-accent-warning/5 border border-accent-warning/20 rounded-xl flex gap-3">
              <AlertTriangle className="w-5 h-5 text-accent-warning shrink-0" />
              <div className="text-xs text-surface-400">
                <span className="text-white font-medium block mb-1">Regulatory Note</span>
                Compliant with Prop 65. REACH registration active. Approved for use in European Union (EC No. 232-679-6).
              </div>
            </div>
          </div>
        </div>

        {/* Technical Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <h2 className="text-2xl font-display font-bold text-white">Technical Specifications</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {mockProduct.specs.map(spec => (
                <div key={spec.label} className="p-4 bg-surface-50 border border-surface-200 rounded-xl">
                  <div className="text-xs text-surface-400 mb-1">{spec.label}</div>
                  <div className="text-sm font-medium text-white">{spec.value}</div>
                </div>
              ))}
            </div>
            
            <div className="space-y-4">
              <h3 className="text-xl font-display font-bold text-white">Application Guide</h3>
              <div className="flex flex-wrap gap-2">
                {mockProduct.applications.map(app => (
                  <span key={app} className="px-4 py-2 bg-primary/5 text-primary border border-primary/20 rounded-xl text-xs font-medium">
                    {app}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <h2 className="text-2xl font-display font-bold text-white">Quality Documentation</h2>
            <div className="space-y-4">
              {[
                { label: 'CoA (Current Batch)', size: '2.4 MB', type: 'PDF' },
                { label: 'MSDS / SDS', size: '1.8 MB', type: 'PDF' },
                { label: 'Technical Data Sheet', size: '3.1 MB', type: 'PDF' },
                { label: 'Stability Study', size: '12 MB', type: 'PDF' }
              ].map(doc => (
                <div key={doc.label} className="flex items-center justify-between p-4 bg-surface-50 border border-surface-200 rounded-xl hover:border-primary/50 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-surface-400 group-hover:text-primary" />
                    <div>
                      <div className="text-sm font-medium text-white">{doc.label}</div>
                      <div className="text-[10px] text-surface-400">{doc.type} • {doc.size}</div>
                    </div>
                  </div>
                  <Download className="w-4 h-4 text-surface-400 group-hover:text-primary" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
