import { useProducts } from '../hooks/useProducts';
import { Link } from 'react-router-dom';
import { Beaker, Search, SlidersHorizontal, ArrowRight, Shield } from 'lucide-react';

export default function ProductDirectory() {
  const { data: products, isLoading } = useProducts();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">Scientific Catalog</h1>
          <p className="text-surface-400">2.1M+ items from 380+ certified brands.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
            <input 
              type="text" 
              placeholder="Search by catalog #, CAS, or name..." 
              className="pl-10 pr-4 py-2 bg-surface-50 border border-surface-200 rounded-lg text-white w-full md:w-80"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-surface-50 border border-surface-200 rounded-lg text-surface-400 hover:text-white transition-colors">
            <SlidersHorizontal className="w-5 h-5" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoading ? (
          [1,2,3,4].map(i => <div key={i} className="h-96 bg-surface-50 animate-pulse rounded-xl" />)
        ) : (
          products?.map(product => (
            <Link key={product.id} to={`/products/${product.id}`} className="group bg-surface-50 border border-surface-200 rounded-xl overflow-hidden hover:border-primary/50 transition-all card-hover">
              <div className="aspect-square relative overflow-hidden bg-surface-100 p-8">
                <img src={product.imageUrl} alt={product.name} className="object-contain w-full h-full transition-transform duration-500 group-hover:scale-110" />
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-1">
                  <div className="text-xs text-primary font-medium uppercase tracking-wider">{product.category}</div>
                  <div className="text-[10px] text-surface-400 font-mono">#{product.catalogNumber}</div>
                </div>
                <h3 className="text-lg font-medium text-white mb-2 line-clamp-2 min-h-[3.5rem]">{product.name}</h3>
                <div className="text-sm text-surface-400 mb-4">{product.brand}</div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-accent-success flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    In Stock
                  </span>
                  <span className="text-primary group-hover:gap-2 transition-all flex items-center gap-1 text-sm">
                    View <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
