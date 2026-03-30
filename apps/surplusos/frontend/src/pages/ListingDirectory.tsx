import React, { useState } from 'react';
import { useListings } from '../hooks';
import { Search, MapPin, Clock, Gavel, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';

const ListingDirectory = () => {
  const { data: listings } = useListings();
  const [filter, setFilter] = useState('All');
  const categories = ['All', 'Industrial', 'IT Assets', 'Lab', 'Vehicles', 'Real Estate', 'Inventory'];
  const filtered = filter === 'All' ? listings : listings?.filter(l => l.category === filter);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-12">
        <div>
          <h1 className="text-4xl font-bold font-display italic uppercase mb-4 tracking-tight">Marketplace</h1>
          <p className="text-surface-400 font-medium">Browse active auctions and fixed-price surplus assets.</p>
        </div>
        <div className="flex-grow max-w-md relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400 w-5 h-5" />
          <input className="w-full pl-10 bg-surface-50 border border-surface-200 rounded-lg p-3" placeholder="Search assets..." />
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-12">
        {categories.map(cat => (
          <button key={cat} onClick={() => setFilter(cat)} className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${filter === cat ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-surface-50 text-surface-400 hover:bg-surface-100'}`}>{cat}</button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filtered?.map((item) => (
          <Link key={item.id} to={`/listings/${item.id}`} className="group">
            <div className="bg-surface-50 border border-surface-100 rounded-2xl overflow-hidden hover:border-primary/50 transition-all">
              <div className="aspect-square bg-surface-100 flex items-center justify-center text-[10px] text-surface-300 font-black uppercase tracking-widest italic relative">
                [Asset Image Placeholder]
                <div className="absolute top-2 left-2">
                   <span className={`text-[10px] px-2 py-1 rounded font-black uppercase tracking-tighter italic ${item.saleType === 'Auction' ? 'bg-primary text-white' : 'bg-blue-600 text-white'}`}>
                    {item.saleType}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="text-[10px] text-primary font-black uppercase tracking-widest mb-2 italic">{item.category}</div>
                <h3 className="text-lg font-bold mb-4 h-14 line-clamp-2">{item.title}</h3>
                <div className="flex items-center gap-2 text-surface-400 text-sm mb-4">
                  <MapPin className="w-4 h-4" /> {item.location}
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-surface-100/50">
                  <div>
                    <div className="text-[10px] text-surface-400 uppercase font-black italic">Current Bid</div>
                    <div className="text-xl font-black font-display text-white">${$item.currentBid || item.askingPrice}</div>
                  </div>
                  {item.saleType === 'Auction' && (
                    <div className="text-right">
                      <div className="text-[10px] text-surface-400 uppercase font-black italic">Ends In</div>
                      <div className="text-sm font-bold text-primary">2d 04h</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
export default ListingDirectory;
