import { Link } from 'react-router-dom';
import { Leaf, Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center px-4">
      <div className="w-24 h-24 bg-primary/10 rounded-[2.5rem] flex items-center justify-center mb-12 animate-bounce">
        <Leaf className="w-12 h-12 text-primary" />
      </div>
      <h1 className="text-[12rem] font-display font-black text-white mb-4 tracking-tighter leading-none">404</h1>
      <p className="text-xl font-mono text-surface-400 mb-16 uppercase tracking-[0.8em]">SKU Out of Stock</p>
      
      <div className="flex flex-col sm:flex-row gap-8">
        <Link to="/" className="px-16 py-5 bg-primary text-white font-black rounded-2xl flex items-center justify-center gap-4 uppercase tracking-widest text-xs">
          <Home className="w-6 h-6" /> Back to Base
        </Link>
        <Link to="/products" className="px-16 py-5 bg-surface-50 text-white font-bold rounded-2xl border border-surface-200 flex items-center justify-center gap-4 uppercase tracking-widest text-xs">
          <Search className="w-6 h-6" /> Re-scan Catalog
        </Link>
      </div>
    </div>
  );
}
