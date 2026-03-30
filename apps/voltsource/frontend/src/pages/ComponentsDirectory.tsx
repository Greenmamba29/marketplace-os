import { useState } from 'react';
import { useComponents } from '@/hooks';
import { Link } from 'react-router-dom';
import { Search, Filter, Battery, Cpu, Sun, Zap, Grid, Box, ChevronRight } from 'lucide-react';

export default function ComponentsDirectory() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('');
  const { data: components, isLoading } = useComponents(category);

  const categories = [
    { name: 'EV Motors', icon: Cpu },
    { name: 'Battery Cells', icon: Battery },
    { name: 'Charging Systems', icon: Zap },
    { name: 'Inverters', icon: Cpu },
    { name: 'Solar Panels', icon: Sun },
    { name: 'Grid Hardware', icon: Grid }
  ];

  return (
    <div className="min-h-screen bg-surface pt-24 pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-display font-black text-white mb-2 tracking-tighter">COMPONENT DIRECTORY</h1>
            <p className="text-surface-400">Browse verified EV & clean energy hardware</p>
          </div>
          <div className="flex w-full md:w-auto gap-4">
            <div className="relative flex-grow md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
              <input 
                type="text" 
                placeholder="Search specs, part numbers..." 
                className="w-full pl-10 pr-4 py-3 bg-surface-50 border border-surface-200 rounded-lg text-sm focus:outline-none focus:border-primary transition-colors text-white"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button className="p-3 bg-surface-50 border border-surface-200 rounded-lg text-surface-400 hover:text-white transition-colors">
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-16">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = category === cat.name;
            return (
              <button 
                key={cat.name}
                onClick={() => setCategory(isActive ? '' : cat.name)}
                className={`flex flex-col items-center gap-3 p-6 rounded-xl border transition-all duration-300 ${
                  isActive ? 'bg-primary/10 border-primary text-primary shadow-[0_0_20px_rgba(234,179,8,0.1)]' : 'bg-surface-50 border-surface-200 text-surface-400 hover:border-surface-300'
                }`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-[10px] font-mono uppercase tracking-widest font-bold">{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            Array(6).fill(0).map((_, i) => (
              <div key={i} className="h-[400px] bg-surface-50 border border-surface-200 rounded-xl animate-pulse" />
            ))
          ) : (
            components?.filter(c => c.name.toLowerCase().includes(search.toLowerCase())).map((component) => (
              <Link 
                key={component.id} 
                to={`/components/${component.id}`}
                className="group bg-surface-50 border border-surface-200 rounded-xl overflow-hidden hover:border-primary/50 transition-all card-hover"
              >
                <div className="h-48 overflow-hidden relative">
                  <img src={component.image} alt={component.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-80" />
                  <div className="absolute top-4 left-4 px-3 py-1 bg-surface/80 backdrop-blur-md rounded-full border border-surface-200">
                    <span className="text-[10px] font-mono font-bold text-white uppercase">{component.category}</span>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-[10px] font-mono uppercase tracking-widest text-primary font-bold mb-2">{component.manufacturer}</p>
                  <h3 className="text-xl font-display font-bold text-white mb-4 line-clamp-1">{component.name}</h3>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {Object.entries(component.specs).map(([k, v]) => (
                      <div key={k} className="bg-surface-100 p-2 rounded-lg border border-surface-200/50">
                        <p className="text-[8px] uppercase tracking-tighter text-surface-400 font-bold">{k}</p>
                        <p className="text-xs text-white font-mono">{v}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-6 border-t border-surface-200">
                    <div>
                      <p className="text-[10px] text-surface-400 font-bold uppercase tracking-widest mb-1">Starting From</p>
                      <p className="text-lg font-mono text-white font-bold">${component.priceTiers[0].price.toLocaleString()}</p>
                    </div>
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-all">
                      <ChevronRight className="w-5 h-5" />
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
