import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center text-center">
     <div>
        <h1 className="text-6xl font-display font-bold text-white mb-4">404</h1>
        <p className="text-surface-400 mb-8">The medical record you requested was not found.</p>
        <Link to="/" className="btn btn-primary">Return Home</Link>
     </div>
  </div>
);

export default NotFound;
