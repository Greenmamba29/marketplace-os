import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Grid, List, ChevronLeft, ChevronRight, Package, ShoppingCart } from 'lucide-react';
import { useParts } from '../hooks';
import { Link } from 'react-router-dom';

const PartsDirectory: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [search, setSearch] = useState('');
  const { data: parts, isLoading } = useParts();

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-display font-bold text-white mb-2">Parts Directory</h1>
          <p className="text-surface-400">Browse and source from over 2.4 million industrial SKUs.</p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-grow md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by SKU or name..."
              className="w-full bg-surface-50 border-surface-200 rounded-lg pl-10 py-2.5"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center border border-surface-200 rounded-lg p-1 bg-surface-50">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-primary text-white' : 'text-surface-400'}`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-primary text-white' : 'text-surface-400'}`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1 space-y-8">
          <div className="glass border border-surface-200 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-6 text-white font-bold uppercase tracking-wider text-xs">
              <Filter className="w-4 h-4 text-primary" />
              Filters
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium text-surface-400 mb-3 block">Category</label>
                <div className="space-y-2">
                  {['Bearings', 'Motors', 'Hydraulics', 'Pneumatics', 'Fasteners'].map((cat) => (
                    <label key={cat} className="flex items-center gap-2 cursor-pointer group">
                      <input type="checkbox" className="w-4 h-4 rounded bg-surface-100 border-surface-200 text-primary focus:ring-primary/20" />
                      <span className="text-sm text-surface-400 group-hover:text-white transition-colors">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-surface-400 mb-3 block">Brand</label>
                <div className="space-y-2">
                  {['SKF', 'Siemens', 'Bosch Rexroth', 'ABB', 'Timken'].map((brand) => (
                    <label key={brand} className="flex items-center gap-2 cursor-pointer group">
                      <input type="checkbox" className="w-4 h-4 rounded bg-surface-100 border-surface-200 text-primary focus:ring-primary/20" />
                      <span className="text-sm text-surface-400 group-hover:text-white transition-colors">{brand}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-surface-400 mb-3 block">Price Range ($)</label>
                <div className="flex gap-2">
                  <input type="text" placeholder="Min" className="w-full text-xs" />
                  <input type="text" placeholder="Max" className="w-full text-xs" />
                </div>
              </div>

              <button className="btn btn-primary w-full py-2.5 text-sm">Apply Filters</button>
            </div>
          </div>
        </div>

        {/* Parts Grid/List */}
        <div className="lg:col-span-3">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-64 skeleton"></div>
              ))}
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {parts?.map((part) => (
                <motion.div
                  key={part.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="glass border border-surface-200 rounded-2xl overflow-hidden card-hover group"
                >
                  <div className="h-40 bg-surface-50 flex items-center justify-center p-8 border-b border-surface-200 group-hover:bg-primary/5 transition-colors">
                    <Package className="w-12 h-12 text-surface-200 group-hover:text-primary/50 transition-colors" />
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-mono text-primary">{part.sku}</span>
                      <span className={`badge ${part.availability === 'In Stock' ? 'badge-success' : 'badge-warning'}`}>
                        {part.availability}
                      </span>
                    </div>
                    <Link to={`/parts/${part.id}`} className="text-lg font-bold text-white mb-2 block hover:text-primary transition-colors line-clamp-1">
                      {part.name}
                    </Link>
                    <div className="text-sm text-surface-400 mb-4">{part.brand} • {part.category}</div>
                    <div className="flex justify-between items-center pt-4 border-t border-surface-200">
                      <div className="text-xl font-bold text-white">${part.price.toLocaleString()}</div>
                      <Link to={`/parts/${part.id}`} className="btn btn-secondary p-2 rounded-lg">
                        <ChevronRight className="w-5 h-5" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="table-container bg-surface-50 border border-surface-200">
              <table>
                <thead>
                  <tr>
                    <th>Part & SKU</th>
                    <th>Category</th>
                    <th>Brand</th>
                    <th>Availability</th>
                    <th>Price</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {parts?.map((part) => (
                    <tr key={part.id}>
                      <td>
                        <div>
                          <Link to={`/parts/${part.id}`} className="font-bold text-white hover:text-primary">{part.name}</Link>
                          <div className="text-xs font-mono text-surface-400 uppercase">{part.sku}</div>
                        </div>
                      </td>
                      <td className="text-sm text-surface-400">{part.category}</td>
                      <td className="text-sm text-surface-400">{part.brand}</td>
                      <td>
                        <span className={`badge ${part.availability === 'In Stock' ? 'badge-success' : 'badge-warning'}`}>
                          {part.availability}
                        </span>
                      </td>
                      <td className="font-bold text-white">${part.price.toLocaleString()}</td>
                      <td>
                        <Link to={`/parts/${part.id}`} className="btn btn-secondary py-1.5 px-3 text-xs">View</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          <div className="mt-12 flex justify-between items-center text-sm text-surface-400">
            <div>Showing 1 - {parts?.length} of 2,410,234 parts</div>
            <div className="flex items-center gap-2">
              <button className="p-2 bg-surface-50 border border-surface-200 rounded hover:text-white disabled:opacity-50" disabled>
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="flex gap-1">
                {[1, 2, 3, '...', 120512].map((p, i) => (
                  <button key={i} className={`px-3 py-1.5 rounded ${p === 1 ? 'bg-primary text-white' : 'hover:bg-surface-50'}`}>
                    {p}
                  </button>
                ))}
              </div>
              <button className="p-2 bg-surface-50 border border-surface-200 rounded hover:text-white">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartsDirectory;
