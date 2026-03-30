import React from 'react';
import { Link } from 'react-router-dom';
const NotFound = () => (
  <div className="min-h-screen flex flex-col items-center justify-center text-center">
    <h1 className="text-9xl font-black font-display italic text-primary">404</h1>
    <p className="text-xl font-bold uppercase italic tracking-widest mb-12">Asset Not Found</p>
    <Link to="/" className="btn btn-primary">Return Home</Link>
  </div>
);
export default NotFound;
