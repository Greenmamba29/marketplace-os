import React, { useState } from 'react';
import { useProducts } from '../hooks';
import { Search, Filter, Shield, Box, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProductDirectory = () => {
  const { data: products } = useProducts();
  const [filter, setFilter] = useState('All');
  const categories = ['All', 'Switches', 'Routers', 'Firewalls', 'Access Points', 'Servers', 'Cables'];
  const filtered = filter === 'All' ? products : products?.filter(p => p.category === filter);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-12">
        <div>
          <h1 className="text-4xl font-black font-display mb-2 uppercase italic tracking-tighter">Inventory</h1>
          <p className="text-surface-400">Search over 320,000 SKUs from global distribution centers.</p>
        </div>
        <div className="flex-grow max-w-md relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400 w-5 h-5" />
          <input className="w-full pl-10 bg-surface-50 border border-surface-200 rounded-lg p-3" placeholder="Search Part Number or SKU..." />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-12">
        {categories.map(cat => (
          <button key={cat} onClick={() => setFilter(cat)} className={`px-6 py-2 rounded-md text-xs font-black uppercase tracking-widest transition-all ${filter === cat ? 'bg-primary text-white' : 'bg-surface-50 text-surface-400 hover:bg-surface-100'}`}>{cat}</button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filtered?.map((item) => (
          <Link key={item.id} to={`/products/${item.id}`} className="group">
            <div className="bg-surface-50 border border-surface-100 rounded-2xl p-6 hover:border-primary/50 transition-all h-full flex flex-col">
              <div className="flex justify-between items-start mb-6">
                <span className="text-[10px] bg-surface-100 text-surface-400 px-2 py-1 rounded font-black tracking-widest uppercase">{item.brand}</span>
                {item.taaCompliant && <span className="badge-taa">TAA Compliant</span>}
              </div>
              <div className="font-mono text-primary text-xs font-bold mb-2 tracking-wider">{item.partNumber}</div>
              <h3 className="text-lg font-bold mb-4 line-clamp-2 h-14">{item.name}</h3>
              <div className="mt-auto pt-6 border-t border-surface-100/50 flex justify-between items-center">
                <div>
                  <div className="text-[10px] text-surface-400 uppercase font-black italic mb-1">Price From</div>
                  <div className="text-xl font-black font-display">${$item.price.toLocaleString()}</div>
                </div>
                <div className="text-right">
                   <div className="text-[10px] text-surface-400 uppercase font-black italic mb-1">Condition</div>
                   <div className="text-xs font-bold text-white uppercase">{item.condition}</div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
export default ProductDirectory;
