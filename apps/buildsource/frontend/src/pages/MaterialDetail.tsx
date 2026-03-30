import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Package, ShieldCheck, Truck, ShoppingCart, Download, Star } from 'lucide-react';
import { useMaterial } from '../hooks';

const MaterialDetail: React.FC = () => {
  const { id } = useParams();
  const { data: m, isLoading } = useMaterial(id || '1');

  if (isLoading || !m) return null;

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="aspect-square bg-surface-50 border border-surface-200 rounded-[40px] flex items-center justify-center">
           <Package className="w-32 h-32 text-surface-200" />
        </div>
        <div className="space-y-8">
           <div>
              <span className="text-primary font-bold uppercase tracking-widest text-xs">{m.category}</span>
              <h1 className="text-4xl font-display font-bold text-white mt-2">{m.name}</h1>
              <p className="text-surface-400 mt-4 leading-relaxed">{m.description}</p>
           </div>
           
           <div className="flex gap-4">
              <div className="p-4 bg-surface-50 rounded-2xl border border-surface-200 flex-1">
                 <div className="text-xs text-surface-400 mb-1">Unit Price</div>
                 <div className="text-2xl font-bold text-white">${m.price.toFixed(2)}</div>
              </div>
              <div className="p-4 bg-surface-50 rounded-2xl border border-surface-200 flex-1">
                 <div className="text-xs text-surface-400 mb-1">Availability</div>
                 <div className="text-2xl font-bold text-white">{m.availability}</div>
              </div>
           </div>

           <div className="space-y-4">
              <h3 className="font-bold text-white flex items-center gap-2 uppercase text-xs tracking-wider">Certifications</h3>
              <div className="flex gap-2">
                 {m.certifications.map(c => <span key={c} className="badge badge-info">{c}</span>)}
              </div>
           </div>

           <div className="flex gap-4 pt-8">
              <Link to={`/rfq/new?materialId=${m.id}`} className="btn btn-primary px-10 py-4">Request Project Quote</Link>
              <button className="btn btn-secondary px-6"><ShoppingCart className="w-5 h-5" /></button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default MaterialDetail;
