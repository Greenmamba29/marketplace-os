import { useParams, Link } from 'react-router-dom';
import { useProducts } from '@/hooks';
import { Leaf, ShieldCheck, Truck, Package, Activity, Clock, ArrowLeft, Download, ShoppingBag, ListChecks } from 'lucide-react';

export default function ProductDetail() {
  const { id } = useParams();
  const { data: products } = useProducts();
  const product = products?.find(p => p.id === id);

  if (!product) return <div className="pt-32 text-center text-surface-400">Loading catalog item...</div>;

  return (
    <div className="min-h-screen bg-surface pt-32 pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/products" className="inline-flex items-center gap-3 text-surface-400 hover:text-white transition-colors mb-16 text-xs font-black uppercase tracking-[0.2em]">
          <ArrowLeft className="w-4 h-4" /> Back to Catalog
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Gallery & Nutrition */}
          <div>
            <div className="aspect-square bg-surface-50 border border-surface-200 rounded-[2rem] overflow-hidden mb-12 relative group">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover opacity-90" />
            </div>
            
            <div className="bg-surface-50 border border-surface-200 rounded-[2rem] p-10">
              <h3 className="text-lg font-display font-bold text-white mb-8 flex items-center gap-3 uppercase tracking-widest">
                <ListChecks className="w-6 h-6 text-primary" /> Nutritional Overview
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {Object.entries(product.nutrition).map(([k, v]) => (
                  <div key={k} className="p-6 bg-surface border border-surface-200/50 rounded-2xl text-center">
                    <p className="text-[10px] text-surface-400 font-black uppercase mb-2 tracking-widest">{k}</p>
                    <p className="text-xl font-mono text-white font-black">{v}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Details & Commerce */}
          <div>
            <div className="mb-12">
              <p className="text-xs font-mono font-black text-primary uppercase tracking-[0.3em] mb-4">{product.distributor}</p>
              <h1 className="text-5xl md:text-7xl font-display font-black text-white mb-8 tracking-tighter leading-none">{product.name}</h1>
              <p className="text-surface-400 text-xl leading-relaxed font-light">{product.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-12">
              <div className="p-8 bg-surface-50 border border-surface-200 rounded-2xl flex flex-col justify-center">
                <p className="text-[10px] text-surface-400 font-black uppercase mb-3 tracking-widest">Unit Pricing</p>
                <p className="text-4xl font-mono text-white font-black">${product.pricing.price}<span className="text-sm font-normal text-surface-400 font-sans ml-2">/ {product.pricing.unit}</span></p>
              </div>
              <div className="p-8 bg-surface-50 border border-surface-200 rounded-2xl flex flex-col justify-center border-l-4 border-l-primary">
                <p className="text-[10px] text-primary font-black uppercase mb-3 tracking-widest">Bulk Rate (10+)</p>
                <p className="text-4xl font-mono text-primary font-black">${product.pricing.bulkPrice}<span className="text-sm font-normal text-surface-400 font-sans ml-2">/ {product.pricing.unit}</span></p>
              </div>
            </div>

            <div className="bg-surface-50 border border-surface-200 rounded-[2rem] p-10 mb-12">
              <h3 className="text-lg font-display font-bold text-white mb-8 uppercase tracking-widest">Safety & Certs</h3>
              <div className="flex flex-wrap gap-4">
                {product.certifications.map(cert => (
                  <span key={cert} className="px-6 py-3 bg-surface border border-surface-200 rounded-xl text-xs font-black text-white flex items-center gap-3 uppercase tracking-widest">
                    <ShieldCheck className="w-4 h-4 text-primary" /> {cert}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6">
              <Link 
                to={`/rfq?p=${product.id}`} 
                className="flex-grow py-6 bg-primary text-white font-black rounded-2xl flex items-center justify-center gap-4 hover:shadow-[0_0_30px_rgba(22,163,74,0.4)] transition-all uppercase tracking-widest"
              >
                <ShoppingBag className="w-6 h-6" /> Start Bulk RFQ
              </Link>
              <button className="px-12 py-6 bg-surface-100 text-white font-bold rounded-2xl border border-surface-200 flex items-center justify-center gap-4 hover:bg-surface-200 transition-all uppercase tracking-widest">
                <Download className="w-6 h-6" /> Spec Sheet
              </button>
            </div>
            
            <div className="mt-12 flex items-center gap-6 p-6 bg-primary/5 border border-primary/20 rounded-2xl">
              <Truck className="w-10 h-10 text-primary" />
              <div>
                <p className="text-sm font-bold text-white uppercase tracking-tight">Cold Chain Guaranteed</p>
                <p className="text-xs text-surface-400">IoT monitoring active. Product maintained at 2-4°C during transit.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
