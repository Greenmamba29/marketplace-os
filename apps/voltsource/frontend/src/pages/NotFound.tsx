import { Link } from 'react-router-dom';
import { Zap, Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center px-4">
      <div className="w-24 h-24 bg-primary/10 rounded-3xl flex items-center justify-center mb-8 animate-pulse">
        <Zap className="w-12 h-12 text-primary" />
      </div>
      <h1 className="text-8xl font-display font-black text-white mb-4">404</h1>
      <p className="text-2xl font-bold text-surface-400 mb-12 uppercase tracking-widest font-mono">Component Not Found</p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Link to="/" className="px-8 py-4 bg-primary text-black font-bold rounded-xl flex items-center justify-center gap-2">
          <Home className="w-5 h-5" /> BACK HOME
        </Link>
        <Link to="/components" className="px-8 py-4 bg-surface-100 text-white font-bold rounded-xl border border-surface-200 flex items-center justify-center gap-2">
          <Search className="w-5 h-5" /> SEARCH CATALOG
        </Link>
      </div>
    </div>
  );
}
