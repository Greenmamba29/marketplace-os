import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, ArrowLeft } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="text-center">
         <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-primary/20">
            <AlertCircle className="w-10 h-10 text-primary" />
         </div>
         <h1 className="text-6xl font-display font-extrabold text-white mb-4 italic">404</h1>
         <h2 className="text-2xl font-bold text-white mb-6">Resource Not Found</h2>
         <p className="text-surface-400 mb-10 max-w-md mx-auto">
           The page you are looking for has been moved or doesn't exist in the MRODirect system.
         </p>
         <Link to="/" className="btn btn-primary px-8 flex items-center gap-2 mx-auto inline-flex">
            <ArrowLeft className="w-4 h-4" /> Back to Terminal
         </Link>
      </div>
    </div>
  );
};

export default NotFound;
