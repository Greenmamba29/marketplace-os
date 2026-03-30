import { useParams, Link } from 'react-router-dom';
import { 
  ChevronLeft, 
  ShoppingCart, 
  FileText, 
  Truck, 
  Clock, 
  Layers, 
  ShieldCheck, 
  CheckCircle2,
  ChevronRight,
  Info
} from 'lucide-react';
import { motion } from 'framer-motion';

const mockProduct = {
  id: '1',
  name: 'Elite Performance Scrub Top',
  category: 'Healthcare Scrubs',
  price: 24.99,
  image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80',
  description: 'Our top-tier performance scrub top, designed for maximum comfort and durability during long hospital shifts. Featuring moisture-wicking technology and reinforced stitching.',
  fabric: '72% Polyester, 21% Rayon, 7% Spandex',
  moq: 50,
  productionTime: '10-14 days',
  sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'],
  colors: ['Midnight Blue', 'Ceil Blue', 'Graphite', 'Surgical Green', 'White'],
  pricingTiers: [
    { range: '50-199', price: 24.99 },
    { range: '200-499', price: 22.50 },
    { range: '500-999', price: 19.99 },
    { range: '1000+', price: 17.50 },
  ],
  specs: [
    { label: 'Weight', value: '180 gsm' },
    { label: 'Stretch', value: '4-Way' },
    { label: 'Anti-Microbial', value: 'Yes (Silvadur™)' },
    { label: 'Pockets', value: '3 (including chest pocket)' },
  ]
};

export default function ProductDetail() {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-surface pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/products" className="inline-flex items-center gap-2 text-surface-400 hover:text-white mb-8 transition-colors">
          <ChevronLeft className="w-4 h-4" /> Back to Catalog
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-surface-50 border border-surface-200 rounded-2xl overflow-hidden">
              <img src={mockProduct.image} alt={mockProduct.name} className="w-full h-full object-cover" />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="aspect-square bg-surface-50 border border-surface-200 rounded-xl overflow-hidden cursor-pointer hover:border-primary transition-colors">
                  <img src={mockProduct.image} alt="" className="w-full h-full object-cover opacity-50 hover:opacity-100" />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-8">
            <div>
              <div className="text-xs uppercase tracking-wider text-primary font-medium mb-2">{mockProduct.category}</div>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">{mockProduct.name}</h1>
              <p className="text-surface-400 leading-relaxed mb-6">{mockProduct.description}</p>
              
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-surface-100 rounded-lg text-xs text-white">
                  <Layers className="w-4 h-4 text-primary" /> {mockProduct.fabric}
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-surface-100 rounded-lg text-xs text-white">
                  <Clock className="w-4 h-4 text-primary" /> {mockProduct.productionTime} Production
                </div>
              </div>
            </div>

            <div className="p-6 bg-surface-50 border border-surface-200 rounded-2xl space-y-6">
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-sm text-surface-400 mb-1">Bulk Pricing (from)</div>
                  <div className="text-3xl font-display font-bold text-white">${mockProduct.pricingTiers[mockProduct.pricingTiers.length-1].price.toFixed(2)}<span className="text-sm text-surface-400 font-sans font-normal ml-2">/unit</span></div>
                </div>
                <div className="text-xs text-surface-400">MOQ: {mockProduct.moq} units</div>
              </div>

              <div className="space-y-3">
                <div className="text-sm font-medium text-white mb-2">Pricing Tiers</div>
                <div className="grid grid-cols-4 gap-2">
                  {mockProduct.pricingTiers.map(tier => (
                    <div key={tier.range} className="p-2 bg-surface-100 border border-surface-200 rounded-lg text-center">
                      <div className="text-[10px] text-surface-400 mb-1">{tier.range}</div>
                      <div className="text-sm font-bold text-white">${tier.price.toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <Link to="/rfq" className="btn btn-primary w-full">
                  <ShoppingCart className="w-5 h-5" /> Start Bulk RFQ
                </Link>
                <Link to="/register" className="btn btn-secondary w-full">
                  <FileText className="w-5 h-5" /> Request Samples
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 border border-surface-200 rounded-xl">
                <div className="flex items-center gap-2 text-white font-medium mb-2">
                  <CheckCircle2 className="w-4 h-4 text-accent-success" /> Quality Assurance
                </div>
                <p className="text-xs text-surface-400">Triple-check inspection on every bulk production run.</p>
              </div>
              <div className="p-4 border border-surface-200 rounded-xl">
                <div className="flex items-center gap-2 text-white font-medium mb-2">
                  <Truck className="w-4 h-4 text-primary" /> Global Logistics
                </div>
                <p className="text-xs text-surface-400">DDP shipping available to 45+ countries worldwide.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <h2 className="text-2xl font-display font-bold text-white">Fabric & Technical Specs</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {mockProduct.specs.map(spec => (
                <div key={spec.label} className="p-4 bg-surface-50 border border-surface-200 rounded-xl">
                  <div className="text-xs text-surface-400 mb-1">{spec.label}</div>
                  <div className="text-sm font-medium text-white">{spec.value}</div>
                </div>
              ))}
            </div>
            
            <div className="prose prose-invert max-w-none text-surface-400">
              <p>The Elite Performance Scrub Top is engineered with our proprietary DuraStitch™ technology, ensuring it withstands the rigors of industrial laundering while maintaining its shape and vibrant color. The anti-microbial finish provides an extra layer of protection for frontline healthcare workers.</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <h2 className="text-2xl font-display font-bold text-white">Customization</h2>
            <div className="space-y-4">
              {[
                { label: 'Embroidery', desc: 'Direct-to-garment high-density stitching' },
                { label: 'Screen Print', desc: 'Durable, vibrant multi-color printing' },
                { label: 'Patches', desc: 'Woven or PVC patches with merrowed edges' }
              ].map(opt => (
                <div key={opt.label} className="flex items-start gap-3 p-4 bg-surface-50 border border-surface-200 rounded-xl">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-white">{opt.label}</div>
                    <div className="text-xs text-surface-400">{opt.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
