import { Link } from 'react-router-dom';
import { Hexagon, Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center px-4">
      <div className="w-24 h-24 bg-primary/10 rounded-[2rem] flex items-center justify-center mb-8 rotate-12">
        <Hexagon className="w-12 h-12 text-primary" />
      </div>
      <h1 className="text-9xl font-display font-black text-white mb-4">404</h1>
      <p className="text-xl font-mono text-surface-400 mb-12 uppercase tracking-[0.5em]">Material Out of Reach</p>
      
      <div className="flex flex-col sm:flex-row gap-6">
        <Link to="/" className="px-12 py-5 bg-primary text-white font-black rounded-2xl flex items-center justify-center gap-2 uppercase tracking-widest text-xs">
          <Home className="w-5 h-5" /> RETURN HOME
        </Link>
        <Link to="/materials" className="px-12 py-5 bg-surface-50 text-white font-bold rounded-2xl border border-surface-200 flex items-center justify-center gap-2 uppercase tracking-widest text-xs">
          <Search className="w-5 h-5" /> RE-ENTER HUB
        </Link>
      </div>
    </div>
  );
}
