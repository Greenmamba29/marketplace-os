import { Link } from 'react-router-dom';
import { Layers, Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-4">
      <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mb-8">
        <Layers className="w-10 h-10 text-primary" />
      </div>
      <h1 className="text-8xl font-display font-bold text-white mb-4">404</h1>
      <h2 className="text-2xl font-display font-bold text-white mb-6">Page Not Found</h2>
      <p className="text-surface-400 text-center max-w-md mb-10 leading-relaxed">
        The page you are looking for might have been moved, renamed, or is temporarily unavailable.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link to="/" className="btn btn-primary px-8 flex items-center gap-2">
          <Home className="w-5 h-5" /> Go Home
        </Link>
        <Link to="/products" className="btn btn-secondary px-8 flex items-center gap-2">
          <Search className="w-5 h-5" /> Search Catalog
        </Link>
      </div>
    </div>
  );
}
