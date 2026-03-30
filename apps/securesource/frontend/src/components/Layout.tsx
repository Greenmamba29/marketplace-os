import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Shield, Search, HardDrive, FileText, LayoutDashboard, LogOut, Lock } from 'lucide-react';
import { useAuth } from '../hooks';

const Layout = () => {
  const { user, logout } = useAuth();
  return (
    <div className="min-h-screen bg-surface">
      <nav className="border-b border-surface-100 bg-surface-50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-8 h-8 text-primary" />
            <Link to="/" className="text-xl font-black font-display tracking-tight text-white uppercase italic">SecureSource</Link>
          </div>
          <div className="hidden md:flex gap-8 items-center">
            <Link to="/products" className="text-surface-400 hover:text-white text-xs font-black uppercase tracking-widest">Products</Link>
            <Link to="/integrators" className="text-surface-400 hover:text-white text-xs font-black uppercase tracking-widest">Integrators</Link>
            <Link to="/rfq" className="text-surface-400 hover:text-white text-xs font-black uppercase tracking-widest">RFQ</Link>
            <Link to="/pricing" className="text-surface-400 hover:text-white text-xs font-black uppercase tracking-widest">Pricing</Link>
            <Link to="/dashboard" className="text-surface-400 hover:text-white text-xs font-black uppercase tracking-widest">Dashboard</Link>
            {user ? <button onClick={logout} className="text-surface-400 hover:text-white"><LogOut className="w-5 h-5"/></button> : <Link to="/login" className="btn btn-primary py-2 px-6 text-xs uppercase italic">Secure Login</Link>}
          </div>
        </div>
      </nav>
      <main><Outlet /></main>
    </div>
  );
};
export default Layout;
