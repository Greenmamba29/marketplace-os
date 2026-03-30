import { useState } from 'react';
import { useMaterials } from '@/hooks';
import { Link } from 'react-router-dom';
import { Search, Filter, Layers, Globe, Shield, ChevronRight, BarChart2 } from 'lucide-react';

export default function MaterialsDirectory() {
  const [search, setSearch] = useState('');
  const { data: materials, isLoading } = useMaterials();

  return (
    <div className="min-h-screen bg-surface pt-24 pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-16">
          <div>
            <h1 className="text-5xl font-display font-black text-white mb-2 uppercase tracking-tighter">Lithium Materials</h1>
            <p className="text-surface-400">Global compounds catalog with real-time pricing indicators</p>
          </div>
          <div className="flex w-full md:w-auto gap-4">
            <div className="relative flex-grow md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
              <input 
                type="text" 
                placeholder="Search compounds (e.g. Li2CO3)..." 
                className="w-full pl-12 pr-4 py-4 bg-surface-50 border border-surface-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors text-white"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button className="p-4 bg-surface-50 border border-surface-200 rounded-xl text-surface-400 hover:text-white transition-colors">
              <Filter className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {isLoading ? (
            Array(6).fill(0).map((_, i) => (
              <div key={i} className="h-[450px] bg-surface-50 border border-surface-200 rounded-2xl animate-pulse" />
            ))
          ) : (
            materials?.filter(m => m.name.toLowerCase().includes(search.toLowerCase())).map((material) => (
              <Link 
                key={material.id} 
                to={`/materials/${material.id}`}
                className="group bg-surface-50 border border-surface-200 rounded-2xl overflow-hidden hover:border-primary/50 transition-all card-hover"
              >
                <div className="h-56 overflow-hidden relative">
                  <img src={material.image} alt={material.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-60" />
                  <div className="absolute top-4 right-4 px-3 py-1 bg-primary/20 backdrop-blur-md rounded-lg border border-primary/30">
                    <span className="text-[10px] font-mono font-black text-primary uppercase">COA VERIFIED</span>
                  </div>
                </div>
                <div className="p-8">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {material.compounds.map(c => (
                      <span key={c} className="text-[10px] font-mono font-black text-surface-400 uppercase tracking-widest">{c}</span>
                    ))}
                  </div>
                  <h3 className="text-2xl font-display font-bold text-white mb-6 group-hover:text-primary transition-colors">{material.name}</h3>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between items-center py-2 border-b border-surface-200/50">
                      <span className="text-xs text-surface-400">Purity</span>
                      <span className="text-xs font-mono text-white font-bold">{material.purity}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-surface-200/50">
                      <span className="text-xs text-surface-400">Origin</span>
                      <span className="text-xs font-mono text-white font-bold">{material.origin}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-xs text-surface-400">Min Order</span>
                      <span className="text-xs font-mono text-white font-bold">{material.minOrder}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-surface-200">
                    <div className="flex items-center gap-2 text-green-500">
                      <BarChart2 className="w-4 h-4" />
                      <span className="text-xs font-mono font-bold">Trending Up</span>
                    </div>
                    <div className="flex items-center gap-1 text-primary text-sm font-black uppercase tracking-widest group-hover:gap-2 transition-all">
                      Details <ChevronRight className="w-4 h-4" />
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
