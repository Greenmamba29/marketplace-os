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
  Wine,
  TrendingUp,
  Landmark,
  Beer
} from 'lucide-react';
import { motion } from 'framer-motion';

const mockListing = {
  id: '1',
  name: '2018 Kentucky Straight Bourbon',
  category: 'Bourbon',
  price: 1250.00,
  image: 'https://images.unsplash.com/photo-1527281405159-35d5b9ade1bc?auto=format&fit=crop&w=600&q=80',
  description: 'High-rye bourbon mash bill with 6 years of aging in Char #4 American White Oak. Distilled in Bardstown, Kentucky. Currently stored in a temperature-controlled Rickhouse.',
  distillery: 'Bardstown Reserve Distillery',
  mashBill: '75% Corn, 21% Rye, 4% Malted Barley',
  abv: '62.5% (Entry Proof)',
  age: '6 Years',
  barrelType: 'American White Oak',
  charLevel: '#4 Heavy Char',
  fillDate: 'June 2018',
  totalBarrels: 42,
  minAcquisition: 5,
  tastingNotes: 'Vanilla bean, toasted oak, spicy rye finish, dark chocolate undertones.',
  pricingTiers: [
    { range: '5-9 barrels', price: 1250.00 },
    { range: '10-24 barrels', price: 1180.00 },
    { range: '25+ barrels', price: 1120.00 },
  ],
  specs: [
    { label: 'Warehouse', value: 'Rickhouse B, Floor 4' },
    { label: 'Evaporation Rate', value: '3.2% Annually' },
    { label: 'Storage Fee', value: '$3.50/mo/barrel' },
    { label: 'Insurance', value: 'Included (Lloyds)' },
  ]
};

export default function BarrelDetail() {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-surface pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/listings" className="inline-flex items-center gap-2 text-surface-400 hover:text-white mb-8 transition-colors">
          <ChevronLeft className="w-4 h-4" /> Back to Exchange
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Barrel Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-surface-50 border border-surface-200 rounded-2xl overflow-hidden shadow-2xl">
              <img src={mockListing.image} alt={mockListing.name} className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Listing Info */}
          <div className="space-y-8">
            <div>
              <div className="text-xs uppercase tracking-wider text-primary font-bold mb-2 flex items-center gap-2">
                <Landmark className="w-4 h-4" /> {mockListing.distillery}
              </div>
              <h1 className="text-3xl md:text-5xl font-display font-bold text-white mb-4">{mockListing.name}</h1>
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="px-3 py-1 bg-surface-100 border border-surface-200 rounded-lg text-xs font-mono text-white">
                  AGE: {mockListing.age}
                </div>
                <div className="px-3 py-1 bg-surface-100 border border-surface-200 rounded-lg text-xs font-mono text-white">
                  ABV: {mockListing.abv}
                </div>
              </div>
              <p className="text-surface-400 leading-relaxed mb-8">{mockListing.description}</p>
              
              <div className="p-5 bg-surface-50 border border-surface-200 rounded-2xl border-l-4 border-l-primary italic text-surface-400 text-sm">
                " {mockListing.tastingNotes} "
              </div>
            </div>

            <div className="p-8 bg-surface-50 border border-surface-200 rounded-3xl space-y-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Wine className="w-32 h-32" />
              </div>
              <div className="flex justify-between items-end relative">
                <div>
                  <div className="text-sm text-surface-400 mb-1">Acquisition Price (from)</div>
                  <div className="text-4xl font-display font-bold text-white">${mockListing.pricingTiers[mockListing.pricingTiers.length-1].price.toLocaleString()}<span className="text-sm text-surface-400 font-sans font-normal ml-2">/barrel</span></div>
                </div>
                <div className="text-xs text-surface-400 text-right">
                  <div className="font-bold text-white mb-1">{mockListing.totalBarrels} Barrels available</div>
                  <div>Min. Order: {mockListing.minAcquisition} units</div>
                </div>
              </div>

              <div className="space-y-3 relative">
                <div className="text-xs font-bold text-white uppercase tracking-widest">Pricing Tiers</div>
                <div className="grid grid-cols-3 gap-2">
                  {mockListing.pricingTiers.map(tier => (
                    <div key={tier.range} className="p-3 bg-surface-100 border border-surface-200 rounded-xl text-center">
                      <div className="text-[10px] text-surface-400 mb-1">{tier.range}</div>
                      <div className="text-sm font-bold text-white">${tier.price.toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3 relative">
                <Link to="/acquire" className="btn btn-primary w-full py-4 text-lg">
                  <TrendingUp className="w-5 h-5" /> Start Acquisition
                </Link>
                <div className="grid grid-cols-2 gap-3">
                  <button className="btn btn-secondary text-sm">Request Sample (50ml)</button>
                  <button className="btn btn-secondary text-sm">Review Lab Analysis</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-10">
            <div>
              <h2 className="text-2xl font-display font-bold text-white mb-6">Technical Profile</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {mockListing.specs.map(spec => (
                  <div key={spec.label} className="p-5 bg-surface-50 border border-surface-200 rounded-2xl">
                    <div className="text-xs text-surface-400 mb-2">{spec.label}</div>
                    <div className="text-sm font-bold text-white">{spec.value}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-6 bg-surface-50 border border-surface-200 rounded-2xl">
                <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                  <Beer className="w-4 h-4 text-primary" /> Mash Bill
                </h3>
                <p className="text-sm text-surface-400 leading-loose">{mockListing.mashBill}</p>
              </div>
              <div className="p-6 bg-surface-50 border border-surface-200 rounded-2xl">
                <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" /> Barrel Specs
                </h3>
                <ul className="text-sm text-surface-400 space-y-2">
                  <li>Type: {mockListing.barrelType}</li>
                  <li>Char: {mockListing.charLevel}</li>
                  <li>Filled: {mockListing.fillDate}</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <h2 className="text-2xl font-display font-bold text-white">Compliance & Transfer</h2>
            <div className="space-y-4">
              {[
                { label: 'TTB Transfer-in-Bond', desc: 'Secure transfer between DSP licenses' },
                { label: 'Barrel Condition Audit', desc: 'Pre-shipment integrity and fill level check' },
                { label: 'Insurance Policy', desc: 'Full-value coverage during Rickhouse storage' }
              ].map(opt => (
                <div key={opt.label} className="flex items-start gap-4 p-5 bg-surface-50 border border-surface-200 rounded-2xl">
                  <ShieldCheck className="w-6 h-6 text-primary mt-1" />
                  <div>
                    <div className="text-sm font-bold text-white mb-1">{opt.label}</div>
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
