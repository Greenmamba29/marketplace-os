import { useState } from 'react';
import { Search, Filter, ChevronRight, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const categories = [
  'Seating', 'Desking', 'Storage', 'Conference', 'Lounge', 'Acoustic', 'Outdoor'
];

const mockProducts = [
  { id: '1', name: 'ErgoDynamic Task Chair', category: 'Seating', price: 685.00, image: 'https://images.unsplash.com/photo-1581009146145-b5ef03a7403f?auto=format&fit=crop&w=300&q=80', leadTime: '2-3 weeks' },
  { id: '2', name: 'Infinite Series Height-Adjustable Desk', category: 'Desking', price: 1250.00, image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=300&q=80', leadTime: '3-4 weeks' },
  { id: '3', name: 'Modular Storage System v2', category: 'Storage', price: 450.00, image: 'https://images.unsplash.com/photo-1590402444811-bfee29d1df90?auto=format&fit=crop&w=300&q=80', leadTime: '1 week' },
  { id: '4', name: 'Executive Conference Table', category: 'Conference', price: 3800.00, image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=300&q=80', leadTime: '6 weeks' },
  { id: '5', name: 'QuietCloud Acoustic Panel', category: 'Acoustic', price: 120.00, image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=300&q=80', leadTime: '48 hours' },
];

export default function ProductDirectory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  return (
    <div className="min-h-screen bg-surface pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-white mb-2">Furniture Collection</h1>
            <p className="text-surface-400">Premium contract-grade office solutions.</p>
          </div>
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
            <input 
              type="text" 
              placeholder="Search by brand, SKU, or category..." 
              className="w-full pl-10 pr-4 py-2 bg-surface-50 border border-surface-200 rounded-lg text-white focus:border-primary outline-none transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="space-y-6">
            <div>
              <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                <Filter className="w-4 h-4 text-primary" /> Categories
              </h3>
              <div className="space-y-2">
                <button 
                  onClick={() => setSelectedCategory('All')}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedCategory === 'All' ? 'bg-primary/10 text-primary border border-primary/20' : 'text-surface-400 hover:text-white hover:bg-surface-50'}`}
                >
                  All Furniture
                </button>
                {categories.map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedCategory === cat ? 'bg-primary/10 text-primary border border-primary/20' : 'text-surface-400 hover:text-white hover:bg-surface-50'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="p-4 bg-primary/5 border border-primary/10 rounded-xl">
              <h4 className="text-sm font-medium text-white mb-2">Planning a new office?</h4>
              <p className="text-xs text-surface-400 mb-3">Get a custom quote for a full-floor renovation project.</p>
              <Link to="/rfq" className="text-xs text-primary font-medium flex items-center gap-1 hover:gap-2 transition-all">
                Project Wizard <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {mockProducts.map((product) => (
                <Link 
                  key={product.id}
                  to={`/products/${product.id}`}
                  className="group bg-surface-50 border border-surface-200 rounded-xl overflow-hidden card-hover"
                >
                  <div className="aspect-video overflow-hidden bg-surface-100 relative">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute bottom-2 left-2 px-2 py-1 bg-surface-900/80 backdrop-blur rounded text-[10px] font-mono text-white">
                      Lead: {product.leadTime}
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="text-[10px] uppercase tracking-wider text-primary font-medium mb-1">{product.category}</div>
                    <h3 className="text-white font-medium mb-2 group-hover:text-primary transition-colors">{product.name}</h3>
                    <div className="flex justify-between items-center">
                      <div className="text-lg font-display font-bold text-white">${product.price.toLocaleString()}</div>
                      <div className="w-8 h-8 bg-surface-100 rounded-lg flex items-center justify-center text-surface-400 group-hover:bg-primary group-hover:text-white transition-colors">
                        <ShoppingBag className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
