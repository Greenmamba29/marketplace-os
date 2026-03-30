import { Link } from 'react-router-dom';
import { Beaker, Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        {/* Logo */}
        <Link to="/" className="inline-flex items-center gap-2 mb-8">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Beaker className="w-6 h-6 text-white" />
          </div>
          <span className="font-display font-bold text-2xl text-white">ChemOS</span>
        </Link>
        
        {/* 404 */}
        <div className="mb-8">
          <h1 className="text-8xl font-display font-bold text-primary/20 mb-4">404</h1>
          <h2 className="text-2xl font-display font-bold text-white mb-2">
            Page not found
          </h2>
          <p className="text-surface-400">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        
        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/"
            className="w-full sm:w-auto px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-600 transition-colors flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            Go Home
          </Link>
          <Link
            to="/cas"
            className="w-full sm:w-auto px-6 py-3 bg-surface-100 text-white font-medium rounded-lg hover:bg-surface-200 border border-surface-200 transition-colors flex items-center justify-center gap-2"
          >
            <Search className="w-5 h-5" />
            Browse CAS Directory
          </Link>
        </div>
      </div>
    </div>
  );
}
