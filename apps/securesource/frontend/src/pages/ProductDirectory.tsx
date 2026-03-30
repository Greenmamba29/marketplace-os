import React, { useState } from 'react';
import { useProducts } from '../hooks';
import { Search, Shield, Cpu, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProductDirectory = () => {
  const { data: products } = useProducts();
  const [filter, setFilter] = useState('All');
  const categories = ['All', 'Access Control', 'CCTV/Surveillance', 'Intrusion Detection', 'Biometrics', 'Intercom', 'Perimeter'];
  const filtered = filter === 'All' ? products : products?.filter(p => p.category === filter);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
        <div>
          <h1 className="text-5xl font-black font-display italic uppercase mb-2 tracking-tight">Systems</h1>
          <p className="text-surface-400 font-bold uppercase text-xs tracking-widest">The official B2B catalog for enterprise security hardware.</p>
        </div>
        <div className="flex-grow max-w-md relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 w-5 h-5" />
          <input className="w-full pl-12 bg-surface-50 border border-surface-200 rounded-2xl p-4 font-bold" placeholder="Search products, brands, compliance..." />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-16">
        {categories.map(cat => (
          <button key={cat} onClick={() => setFilter(cat)} className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all ${filter === cat ? 'bg-primary text-white' : 'bg-surface-50 text-surface-400 hover:bg-surface-100'}`}>{cat}</button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {filtered?.map((item) => (
          <Link key={item.id} to={`/products/${item.id}`} className="group">
            <div className="bg-surface-50 border border-surface-100 rounded-[2rem] p-8 hover:border-primary/50 transition-all flex flex-col h-full">
              <div className="flex flex-wrap gap-2 mb-6">
                {item.compliance.map(c => <span key={c} className="badge-compliance">{c}</span>)}
              </div>
              <div className="text-[10px] text-primary font-black uppercase tracking-widest mb-2 italic">{item.brand}</div>
              <h3 className="text-xl font-bold mb-6 italic leading-tight">{item.name}</h3>
              <div className="mt-auto pt-6 border-t border-surface-100/50 flex justify-between items-center">
                 <div>
                    <div className="text-[10px] text-surface-400 uppercase font-black italic mb-1">MSRP From</div>
                    <div className="text-2xl font-black font-display italic text-white">${$item.price.toLocaleString()}</div>
                 </div>
                 <Shield className="w-6 h-6 text-surface-200" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
export default ProductDirectory;
