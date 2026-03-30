import React from 'react';
import { Link } from 'react-router-dom';
import { Wrench, Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-surface text-center">
      <Wrench className="w-24 h-24 text-primary/20 mb-8" />
      <h1 className="text-9xl font-black font-display text-primary">404</h1>
      <p className="text-2xl font-bold font-display mt-4 mb-12">EQUIPMENT NOT FOUND</p>
      <Link to="/" className="btn btn-primary px-8">
        <Home className="w-5 h-5" /> Back to Base
      </Link>
    </div>
  );
};

export default NotFound;
