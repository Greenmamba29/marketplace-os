import React from 'react';
import { useProducts } from '../hooks';
import { Link } from 'react-router-dom';
import { ShieldCheck, ChevronRight } from 'lucide-react';

const ProductDirectory: React.FC = () => {
  const { data: products } = useProducts();

  return (
    <div className="py-12 px-4 max-w-7xl mx-auto">
      <div className="mb-12 flex justify-between items-end">
         <div>
            <h1 className="text-4xl font-display font-bold text-white">Medical Catalog</h1>
            <p className="text-surface-400">Filtering: FDA Cleared • Class II & III</p>
         </div>
         <div className="flex gap-2">
            <button className="badge badge-info">FDA 510(k)</button>
            <button className="badge badge-secondary">Class III</button>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         {products?.map(p => (
           <div key={p.id} className="glass border border-surface-200 p-6 rounded-2xl bg-surface-50 card-hover">
              <div className="flex justify-between items-start mb-4">
                 <span className="text-[10px] font-bold text-primary border border-primary/30 px-2 py-0.5 rounded uppercase">{p.fdaStatus}</span>
                 <ShieldCheck className="w-4 h-4 text-accent-success" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">{p.name}</h3>
              <p className="text-xs text-surface-400 mb-6">{p.manufacturer}</p>
              <div className="flex justify-between items-center pt-4 border-t border-surface-200">
                 <span className="text-xl font-bold text-white">${p.price.toLocaleString()}</span>
                 <Link to={`/products/${p.id}`} className="btn btn-secondary p-2"><ChevronRight className="w-4 h-4" /></Link>
              </div>
           </div>
         ))}
      </div>
    </div>
  );
};

export default ProductDirectory;
