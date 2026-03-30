import { Link } from 'react-router-dom';
import { Heart, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center px-4">
      <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mb-8">
        <Heart className="w-10 h-10 text-primary" />
      </div>
      <h1 className="text-5xl font-display font-bold text-white mb-4">404</h1>
      <p className="text-xl text-surface-400 mb-10 text-center max-w-md">
        Heart not found. The page you're looking for doesn't exist.
      </p>
      <Link to="/" className="btn-primary">
        <ArrowLeft className="w-5 h-5" />
        Back to Home
      </Link>
    </div>
  );
}
