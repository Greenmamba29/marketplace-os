import { useState } from 'react';
import { Search, Filter, ChevronRight, ShoppingBag, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const categories = [
  'Flavors & Extracts', 'Preservatives', 'Sweeteners', 'Proteins', 'Starches & Hydrocolloids', 'Colors', 'Vitamins'
];

const mockProducts = [
  { id: '1', name: 'Premium Whey Protein Isolate', category: 'Proteins', price: 12.50, image: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?auto=format&fit=crop&w=300&q=80', unit: 'kg' },
  { id: '2', name: 'Natural Bourbon Vanilla Extract', category: 'Flavors & Extracts', price: 85.00, image: 'https://images.unsplash.com/photo-1506368249639-73a05d6f6488?auto=format&fit=crop&w=300&q=80', unit: 'L' },
  { id: '3', name: 'Modified Tapioca Starch', category: 'Starches & Hydrocolloids', price: 2.10, image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=300&q=80', unit: 'kg' },
  { id: '4', name: 'Stevia Leaf Extract (95% REB-A)', category: 'Sweeteners', price: 45.00, image: 'https://images.unsplash.com/photo-1534120247760-c44c3e4a62f1?auto=format&fit=crop&w=300&q=80', unit: 'kg' },
  { id: '5', name: 'Ascorbic Acid (Vitamin C)', category: 'Vitamins', price: 18.00, image: 'https://images.unsplash.com/photo-1616671285410-99f6b9415891?auto=format&fit=crop&w=300&q=80', unit: 'kg' },
];

export default function ProductDirectory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  return (
    <div className="min-h-screen bg-surface pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-white mb-2">Ingredient Directory</h1>
            <p className="text-surface-400">Search 65,000+ formula-ready food ingredients.</p>
          </div>
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
            <input 
              type="text" 
              placeholder="Search by INCI, CAS, or name..." 
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
                  All Ingredients
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
              <h4 className="text-sm font-medium text-white mb-2">Missing something?</h4>
              <p className="text-xs text-surface-400 mb-3">Our global network can source any specialty functional ingredient.</p>
              <Link to="/rfq" className="text-xs text-primary font-medium flex items-center gap-1 hover:gap-2 transition-all">
                Custom Sourcing <ChevronRight className="w-3 h-3" />
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
                  <div className="aspect-square overflow-hidden bg-surface-100 relative">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-2 right-2 flex gap-1">
                      <div className="px-2 py-1 bg-accent-success/80 backdrop-blur rounded text-[8px] font-bold text-white uppercase">Organic</div>
                      <div className="px-2 py-1 bg-accent-info/80 backdrop-blur rounded text-[8px] font-bold text-white uppercase">Non-GMO</div>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="text-[10px] uppercase tracking-wider text-primary font-medium mb-1">{product.category}</div>
                    <h3 className="text-white font-medium mb-2 group-hover:text-primary transition-colors">{product.name}</h3>
                    <div className="flex justify-between items-center">
                      <div className="text-lg font-display font-bold text-white">${product.price.toFixed(2)}<span className="text-xs text-surface-400 font-sans font-normal ml-1">/{product.unit}</span></div>
                      <div className="flex gap-2">
                        <button className="w-8 h-8 bg-surface-100 rounded-lg flex items-center justify-center text-surface-400 hover:text-primary transition-colors">
                          <FileText className="w-4 h-4" />
                        </button>
                        <div className="w-8 h-8 bg-surface-100 rounded-lg flex items-center justify-center text-surface-400 group-hover:bg-primary group-hover:text-white transition-colors">
                          <ShoppingBag className="w-4 h-4" />
                        </div>
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
