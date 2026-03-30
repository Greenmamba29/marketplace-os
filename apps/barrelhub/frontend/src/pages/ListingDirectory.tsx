import { useState } from 'react';
import { Search, Filter, ChevronRight, ShoppingBag, Wine } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const categories = [
  'Bourbon', 'Scotch Whisky', 'Irish Whiskey', 'Rum', 'Tequila', 'Brandy', 'Neutral Grain Spirit'
];

const mockListings = [
  { id: '1', name: '2018 Kentucky Straight Bourbon', category: 'Bourbon', price: 1250.00, image: 'https://images.unsplash.com/photo-1527281405159-35d5b9ade1bc?auto=format&fit=crop&w=300&q=80', barrels: 42, age: '6 Year' },
  { id: '2', name: 'Islay Single Malt (Peated)', category: 'Scotch Whisky', price: 4800.00, image: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=300&q=80', barrels: 12, age: '12 Year' },
  { id: '3', name: 'Añejo Tequila (Blue Weber)', category: 'Tequila', price: 2100.00, image: 'https://images.unsplash.com/photo-1516535794938-6063878fca60?auto=format&fit=crop&w=300&q=80', barrels: 25, age: '3 Year' },
  { id: '4', name: 'Caribbean Dark Rum (Pot Still)', category: 'Rum', price: 950.00, image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=300&q=80', barrels: 60, age: 'NAS' },
  { id: '5', name: 'Neutral Grain Spirit (95% ABV)', category: 'Neutral Grain Spirit', price: 3.50, image: 'https://images.unsplash.com/photo-1550985543-ef4800632a4e?auto=format&fit=crop&w=300&q=80', barrels: 500, age: 'New' },
];

export default function ListingDirectory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  return (
    <div className="min-h-screen bg-surface pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-white mb-2">Barrel Exchange</h1>
            <p className="text-surface-400">Institutional marketplace for bulk spirit acquisition.</p>
          </div>
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
            <input 
              type="text" 
              placeholder="Search by distillery, age, or mash bill..." 
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
                <Filter className="w-4 h-4 text-primary" /> Spirit Type
              </h3>
              <div className="space-y-2">
                <button 
                  onClick={() => setSelectedCategory('All')}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedCategory === 'All' ? 'bg-primary/10 text-primary border border-primary/20' : 'text-surface-400 hover:text-white hover:bg-surface-50'}`}
                >
                  All Spirits
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
              <h4 className="text-sm font-medium text-white mb-2">Portfolio Analytics</h4>
              <p className="text-xs text-surface-400 mb-3">Track your barrel valuation and market yield in real-time.</p>
              <Link to="/dashboard" className="text-xs text-primary font-medium flex items-center gap-1 hover:gap-2 transition-all">
                Go to Portfolio <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {mockListings.map((listing) => (
                <Link 
                  key={listing.id}
                  to={`/listings/${listing.id}`}
                  className="group bg-surface-50 border border-surface-200 rounded-xl overflow-hidden card-hover"
                >
                  <div className="aspect-video overflow-hidden bg-surface-100 relative">
                    <img src={listing.image} alt={listing.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-2 right-2 px-2 py-1 bg-primary/90 backdrop-blur rounded text-[10px] font-mono text-white">
                      {listing.age}
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="text-[10px] uppercase tracking-wider text-primary font-medium mb-1">{listing.category}</div>
                    <h3 className="text-white font-medium mb-2 group-hover:text-primary transition-colors">{listing.name}</h3>
                    <div className="flex justify-between items-center">
                      <div className="text-lg font-display font-bold text-white">${listing.price.toLocaleString()}<span className="text-xs text-surface-400 font-sans font-normal ml-1">/barrel</span></div>
                      <div className="flex items-center gap-1 text-[10px] text-surface-400 font-mono">
                        <Wine className="w-3 h-3" /> {listing.barrels} available
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
