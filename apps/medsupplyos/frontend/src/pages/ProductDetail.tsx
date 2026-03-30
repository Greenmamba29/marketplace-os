import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProduct } from '../hooks';
import { ShieldCheck, Activity, Award } from 'lucide-react';

const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const { data: p } = useProduct(id || '1');

  if (!p) return null;

  return (
    <div className="py-12 px-4 max-w-7xl mx-auto">
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="aspect-square bg-surface-50 border border-surface-200 rounded-[40px] flex items-center justify-center">
             <Activity className="w-24 h-24 text-primary opacity-20" />
          </div>
          <div className="space-y-8">
             <div>
                <div className="flex items-center gap-2 mb-4">
                   <span className="badge badge-success">FDA Cleared</span>
                   <span className="badge badge-info">{p.category}</span>
                </div>
                <h1 className="text-4xl font-display font-bold text-white">{p.name}</h1>
                <p className="text-lg text-primary font-bold mt-2">{p.manufacturer}</p>
             </div>

             <div className="p-6 bg-surface-50 rounded-2xl border border-surface-200">
                <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-widest">Clinical Specifications</h3>
                <div className="grid grid-cols-2 gap-4">
                   {Object.entries(p.specs).map(([k, v]) => (
                     <div key={k}><div className="text-[10px] text-surface-400 uppercase">{k}</div><div className="text-sm text-white font-medium">{v}</div></div>
                   ))}
                </div>
             </div>

             {p.sterilization && (
               <div className="flex items-center gap-3 p-4 bg-primary/5 border border-primary/20 rounded-xl">
                  <Award className="text-primary w-5 h-5" />
                  <span className="text-sm text-white">Sterilization: <strong>{p.sterilization}</strong></span>
               </div>
             )}

             <div className="flex gap-4 pt-8">
                <Link to={`/rfq/new?productId=${p.id}`} className="btn btn-primary px-10">Request Institutional Quote</Link>
                <button className="btn btn-secondary">Download MDS2</button>
             </div>
          </div>
       </div>
    </div>
  );
};

export default ProductDetail;
