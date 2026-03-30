import { useState } from 'react';
import { useProducts } from '@/hooks';
import { Link } from 'react-router-dom';
import { Search, Filter, ShoppingBag, Truck, ShieldCheck, ChevronRight, LayoutGrid, List } from 'lucide-react';

export default function ProductDirectory() {
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState<string>('');
  const { data: products, isLoading } = useProducts(cat);

  const categories = ['Produce', 'Proteins', 'Dairy', 'Dry Goods', 'Beverages', 'Specialty'];

  return (
    <div className="min-h-screen bg-surface pt-32 pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16">
          <div>
            <p className="text-xs font-mono font-black text-primary uppercase tracking-[0.4em] mb-4">Master Catalog</p>
            <h1 className="text-6xl font-display font-black text-white uppercase tracking-tighter">Food & Beverage</h1>
          </div>
          <div className="flex w-full md:w-auto gap-4">
            <div className="relative flex-grow md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
              <input 
                type="text" 
                placeholder="Search SKUs, Brands, Origins..." 
                className="w-full pl-12 pr-5 py-5 bg-surface-50 border border-surface-200 rounded-2xl text-sm focus:border-primary transition-all text-white outline-none"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button className="p-5 bg-surface-50 border border-surface-200 rounded-2xl text-surface-400 hover:text-white transition-colors">
              <Filter className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex flex-wrap gap-4 mb-16">
          <button 
            onClick={() => setCat('')}
            className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest border transition-all ${!cat ? 'bg-primary border-primary text-white shadow-[0_0_20px_rgba(22,163,74,0.3)]' : 'bg-surface-50 border-surface-200 text-surface-400'}`}
          >
            All Items
          </button>
          {categories.map(c => (
            <button 
              key={c}
              onClick={() => setCat(c)}
              className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest border transition-all ${cat === c ? 'bg-primary border-primary text-white shadow-[0_0_20px_rgba(22,163,74,0.3)]' : 'bg-surface-50 border-surface-200 text-surface-400 hover:border-surface-300'}`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {isLoading ? (
            Array(8).fill(0).map((_, i) => (
              <div key={i} className="h-[500px] bg-surface-50 border border-surface-200 rounded-2xl animate-pulse" />
            ))
          ) : (
            products?.filter(p => p.name.toLowerCase().includes(search.toLowerCase())).map((product) => (
              <Link 
                key={product.id} 
                to={`/products/${product.id}`}
                className="group bg-surface-50 border border-surface-200 rounded-2xl overflow-hidden hover:border-primary/50 transition-all card-hover"
              >
                <div className="h-64 overflow-hidden relative">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80" />
                  <div className="absolute top-4 left-4 px-3 py-1 bg-surface/80 backdrop-blur-md rounded-lg border border-surface-200">
                    <span className="text-[10px] font-mono font-black text-white uppercase">{product.category}</span>
                  </div>
                </div>
                <div className="p-8">
                  <p className="text-[10px] font-mono font-black text-primary uppercase tracking-widest mb-2">{product.distributor}</p>
                  <h3 className="text-xl font-display font-bold text-white mb-6 line-clamp-2 h-14">{product.name}</h3>
                  
                  <div className="space-y-3 mb-8">
                    {product.certifications.slice(0, 2).map(cert => (
                      <div key={cert} className="flex items-center gap-2 text-[10px] text-surface-400 font-bold uppercase">
                        <ShieldCheck className="w-3 h-3 text-primary" /> {cert}
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-surface-200">
                    <div>
                      <p className="text-[10px] text-surface-400 font-black uppercase mb-1">Per {product.pricing.unit}</p>
                      <p className="text-2xl font-mono text-white font-black">${product.pricing.price}</p>
                    </div>
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                      <ChevronRight className="w-6 h-6" />
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
