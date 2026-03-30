import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
const NotFound = () => (
  <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
    <ShieldAlert className="w-24 h-24 text-primary/20 mb-12" />
    <h1 className="text-9xl font-black font-display italic text-primary leading-none">404</h1>
    <p className="text-2xl font-black uppercase italic tracking-[0.4em] mb-12">Breach in URL Path</p>
    <Link to="/" className="btn btn-primary px-12 py-5 uppercase italic font-black text-lg">Return to Perimeter</Link>
  </div>
);
export default NotFound;
