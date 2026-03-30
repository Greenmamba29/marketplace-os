import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center text-center">
       <div>
          <h1 className="text-9xl font-display font-bold text-primary opacity-20">404</h1>
          <h2 className="text-2xl font-bold text-white mb-8">Site Unavailable</h2>
          <Link to="/" className="btn btn-primary">Return Home</Link>
       </div>
    </div>
  );
};

export default NotFound;
