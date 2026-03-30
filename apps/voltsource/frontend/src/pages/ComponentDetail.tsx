import { useParams, Link } from 'react-router-dom';
import { useComponents } from '@/hooks';
import { Zap, Shield, FileText, Package, Clock, Globe, ArrowLeft, ChevronRight, Activity, Download } from 'lucide-react';

export default function ComponentDetail() {
  const { id } = useParams();
  const { data: components } = useComponents();
  const component = components?.find(c => c.id === id);

  if (!component) return <div className="pt-32 text-center text-surface-400">Loading component...</div>;

  return (
    <div className="min-h-screen bg-surface pt-24 pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/components" className="inline-flex items-center gap-2 text-surface-400 hover:text-white transition-colors mb-12 text-sm">
          <ArrowLeft className="w-4 h-4" /> BACK TO DIRECTORY
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Image & Main Info */}
          <div>
            <div className="aspect-square bg-surface-50 border border-surface-200 rounded-2xl overflow-hidden mb-8 group relative">
              <img src={component.image} alt={component.name} className="w-full h-full object-cover opacity-80" />
              <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent opacity-40" />
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="p-6 bg-surface-50 border border-surface-200 rounded-xl">
                <Clock className="w-5 h-5 text-primary mb-3" />
                <p className="text-[10px] text-surface-400 font-bold uppercase mb-1">Lead Time</p>
                <p className="text-sm font-mono text-white">{component.leadTime}</p>
              </div>
              <div className="p-6 bg-surface-50 border border-surface-200 rounded-xl">
                <Package className="w-5 h-5 text-primary mb-3" />
                <p className="text-[10px] text-surface-400 font-bold uppercase mb-1">In Stock</p>
                <p className="text-sm font-mono text-white">{component.stock} Units</p>
              </div>
              <div className="p-6 bg-surface-50 border border-surface-200 rounded-xl">
                <Shield className="w-5 h-5 text-primary mb-3" />
                <p className="text-[10px] text-surface-400 font-bold uppercase mb-1">Verified</p>
                <p className="text-sm font-mono text-white">100% Audit</p>
              </div>
            </div>
          </div>

          {/* Details & Pricing */}
          <div>
            <div className="mb-10">
              <p className="text-sm font-mono text-primary font-bold uppercase tracking-widest mb-3">{component.manufacturer}</p>
              <h1 className="text-4xl md:text-5xl font-display font-black text-white mb-6 leading-none">{component.name}</h1>
              <p className="text-surface-400 text-lg leading-relaxed">{component.description}</p>
            </div>

            <div className="bg-surface-50 border border-surface-200 rounded-2xl p-8 mb-10">
              <h3 className="text-lg font-display font-bold text-white mb-6 flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" /> TECHNICAL SPECIFICATIONS
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(component.specs).map(([k, v]) => (
                  <div key={k} className="flex justify-between items-center py-3 border-b border-surface-200/50">
                    <span className="text-sm text-surface-400 capitalize">{k}</span>
                    <span className="text-sm font-mono text-white font-bold">{v}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-surface-50 border border-surface-200 rounded-2xl p-8 mb-10">
              <h3 className="text-lg font-display font-bold text-white mb-6">CERTIFICATIONS</h3>
              <div className="flex flex-wrap gap-3">
                {component.certifications.map(cert => (
                  <span key={cert} className="px-4 py-2 bg-surface-100 border border-surface-200 rounded-lg text-xs font-mono text-white">
                    {cert}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-surface-50 border border-surface-200 rounded-2xl p-8 mb-12">
              <h3 className="text-lg font-display font-bold text-white mb-6">BULK PRICING TIERS</h3>
              <div className="space-y-4">
                {component.priceTiers.map((tier, i) => (
                  <div key={i} className="flex justify-between items-center p-4 bg-surface/50 border border-surface-200/50 rounded-xl hover:border-primary/30 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-surface-100 rounded-lg flex items-center justify-center text-surface-400 font-mono text-xs">#{i+1}</div>
                      <span className="text-sm text-white font-medium">Min Order: {tier.minQuantity} Units</span>
                    </div>
                    <span className="text-lg font-mono text-primary font-bold">${tier.price.toLocaleString()} / Unit</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to={`/rfq?comp=${component.id}`} 
                className="flex-grow py-5 bg-primary text-black font-bold rounded-xl flex items-center justify-center gap-3 hover:bg-primary-400 transition-all"
              >
                <FileText className="w-5 h-5" /> REQUEST RFQ
              </Link>
              <button className="px-8 py-5 bg-surface-100 text-white font-bold rounded-xl border border-surface-200 flex items-center justify-center gap-3 hover:bg-surface-200 transition-all">
                <Download className="w-5 h-5" /> DATASHEET
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
