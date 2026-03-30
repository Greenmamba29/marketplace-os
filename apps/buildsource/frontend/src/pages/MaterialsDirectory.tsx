import React, { useState } from 'react';
import { Search, Filter, Grid, Package, ChevronRight } from 'lucide-react';
import { useMaterials } from '../hooks';
import { Link } from 'react-router-dom';

const MaterialsDirectory: React.FC = () => {
  const { data: materials, isLoading } = useMaterials();

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-12">
        <h1 className="text-4xl font-display font-bold text-white mb-4">Materials Catalog</h1>
        <div className="flex gap-4">
           {['Concrete', 'Steel', 'Lumber', 'Electrical', 'Plumbing', 'HVAC'].map(c => (
             <button key={c} className="px-4 py-2 rounded-full border border-surface-200 text-sm hover:border-primary hover:text-primary transition-all">{c}</button>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {isLoading ? [1,2,3,4].map(i => <div key={i} className="h-64 skeleton" />) : 
          materials?.map(m => (
            <div key={m.id} className="glass border border-surface-200 rounded-2xl p-6 card-hover">
               <div className="aspect-video bg-surface-50 rounded-xl mb-4 flex items-center justify-center">
                  <Package className="w-10 h-10 text-surface-200" />
               </div>
               <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{m.category}</span>
               <h3 className="text-lg font-bold text-white mb-4 mt-1">{m.name}</h3>
               <div className="flex justify-between items-center pt-4 border-t border-surface-200">
                  <span className="text-xl font-bold">${m.price.toFixed(2)} <span className="text-xs text-surface-400">/{m.unit}</span></span>
                  <Link to={`/materials/${m.id}`} className="btn btn-secondary p-2"><ChevronRight className="w-5 h-5" /></Link>
               </div>
            </div>
          ))
        }
      </div>
    </div>
  );
};

export default MaterialsDirectory;
