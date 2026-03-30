import { useParams, Link } from 'react-router-dom';
import { 
  ChevronLeft, 
  ShoppingCart, 
  FileText, 
  Truck, 
  Clock, 
  Layout, 
  ShieldCheck, 
  CheckCircle2,
  ChevronRight,
  Info,
  Maximize2
} from 'lucide-react';
import { motion } from 'framer-motion';

const mockProduct = {
  id: '1',
  name: 'ErgoDynamic Task Chair',
  category: 'Seating',
  price: 685.00,
  image: 'https://images.unsplash.com/photo-1581009146145-b5ef03a7403f?auto=format&fit=crop&w=600&q=80',
  description: 'The ErgoDynamic Task Chair is the pinnacle of office comfort. Engineered with responsive lumbar support and a breathable mesh back, it adapts to your body movement throughout the day.',
  materials: 'Recycled Aluminum, High-Density Mesh, 100% Recyclable Polymer',
  moq: 10,
  leadTime: '2-3 weeks',
  dimensions: '26.5"W x 26.5"D x 38.5-43.5"H',
  weightCapacity: '350 lbs',
  certifications: ['BIFMA Compliant', 'Greenguard Gold', 'Cradle to Cradle'],
  pricingTiers: [
    { range: '10-49', price: 685.00 },
    { range: '50-199', price: 615.00 },
    { range: '200+', price: 550.00 },
  ],
  specs: [
    { label: 'Seat Depth', value: '16.5" - 18.5"' },
    { label: 'Arm Height', value: '7.5" - 11.5"' },
    { label: 'Back Tilt', value: '23 degrees' },
    { label: 'Warranty', value: '12 Year Limited' },
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
                  <Maximize2 className="w-4 h-4 text-primary" /> {mockProduct.dimensions}
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-surface-100 rounded-lg text-xs text-white">
                  <Clock className="w-4 h-4 text-primary" /> {mockProduct.leadTime} Lead Time
                </div>
              </div>
            </div>

            <div className="p-6 bg-surface-50 border border-surface-200 rounded-2xl space-y-6">
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-sm text-surface-400 mb-1">Project Pricing (from)</div>
                  <div className="text-3xl font-display font-bold text-white">${mockProduct.pricingTiers[mockProduct.pricingTiers.length-1].price.toLocaleString()}<span className="text-sm text-surface-400 font-sans font-normal ml-2">/unit</span></div>
                </div>
                <div className="text-xs text-surface-400">MOQ: {mockProduct.moq} units</div>
              </div>

              <div className="space-y-3">
                <div className="text-sm font-medium text-white mb-2">Quantity Tiers</div>
                <div className="grid grid-cols-3 gap-2">
                  {mockProduct.pricingTiers.map(tier => (
                    <div key={tier.range} className="p-2 bg-surface-100 border border-surface-200 rounded-lg text-center">
                      <div className="text-[10px] text-surface-400 mb-1">{tier.range} units</div>
                      <div className="text-sm font-bold text-white">${tier.price.toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <Link to="/rfq" className="btn btn-primary w-full">
                  <FileText className="w-5 h-5" /> Request Project Quote
                </Link>
                <Link to="/register" className="btn btn-secondary w-full">
                  <Layout className="w-5 h-5" /> Customize Finishes
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium text-white">Sustainability & Certifications</h3>
              <div className="flex flex-wrap gap-2">
                {mockProduct.certifications.map(cert => (
                  <span key={cert} className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    {cert}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Technical Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <h2 className="text-2xl font-display font-bold text-white">Engineering & Materials</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {mockProduct.specs.map(spec => (
                <div key={spec.label} className="p-4 bg-surface-50 border border-surface-200 rounded-xl">
                  <div className="text-xs text-surface-400 mb-1">{spec.label}</div>
                  <div className="text-sm font-medium text-white">{spec.value}</div>
                </div>
              ))}
            </div>
            
            <div className="prose prose-invert max-w-none text-surface-400">
              <p>Built to exceed BIFMA standards, the ErgoDynamic series uses a synchronized tilt mechanism that mimics the natural pivot points of the human body. The carbon-neutral production process ensures your sustainability goals are met without compromising on performance.</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <h2 className="text-2xl font-display font-bold text-white">Workplace Services</h2>
            <div className="space-y-4">
              {[
                { label: 'White Glove Delivery', desc: 'Professional assembly and packaging removal' },
                { label: 'Ergonomic Training', desc: 'On-site tutorials for your staff on chair adjustment' },
                { label: 'Asset Tagging', desc: 'Inventory tracking numbers pre-applied to all units' }
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
