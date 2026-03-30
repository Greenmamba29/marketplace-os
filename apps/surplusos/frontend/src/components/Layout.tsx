import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Tag, Search, PlusCircle, LayoutDashboard, LogOut, Gavel } from 'lucide-react';
import { useAuth } from '../hooks';

const Layout = () => {
  const { user, logout } = useAuth();
  return (
    <div className="min-h-screen bg-surface">
      <nav className="border-b border-surface-100 bg-surface-50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Tag className="w-8 h-8 text-primary" />
            <span className="text-xl font-black font-display tracking-tight italic">SURPLUSOS</span>
          </Link>
          <div className="hidden md:flex gap-8 items-center">
            <Link to="/listings" className="text-surface-400 hover:text-white flex items-center gap-2"><Search className="w-4 h-4"/> Listings</Link>
            <Link to="/sell" className="text-surface-400 hover:text-white flex items-center gap-2"><PlusCircle className="w-4 h-4"/> Sell</Link>
            <Link to="/auctions" className="text-surface-400 hover:text-white flex items-center gap-2"><Gavel className="w-4 h-4"/> Auctions</Link>
            <Link to="/pricing" className="text-surface-400 hover:text-white flex items-center gap-2"><PlusCircle className="w-4 h-4"/> Pricing</Link>
            <Link to="/dashboard" className="text-surface-400 hover:text-white flex items-center gap-2"><LayoutDashboard className="w-4 h-4"/> Dashboard</Link>
            {user ? <button onClick={logout}><LogOut /></button> : <Link to="/login" className="btn btn-primary py-2 text-sm">Login</Link>}
          </div>
        </div>
      </nav>
      <main><Outlet /></main>
    </div>
  );
};
export default Layout;
