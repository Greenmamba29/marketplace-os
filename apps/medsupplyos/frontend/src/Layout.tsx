import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Activity, LayoutDashboard, Package, ClipboardList, User } from 'lucide-react';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <nav className="border-b border-surface-200 glass sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <Activity className="text-primary w-6 h-6" />
            <span className="text-xl font-display font-bold text-white">MedSupplyOS</span>
          </Link>
          <div className="flex gap-6 items-center">
            <Link to="/products" className="text-sm text-surface-400 hover:text-white">Products</Link>
            <Link to="/rfq/new" className="text-sm text-surface-400 hover:text-white">RFQ</Link>
            <Link to="/pricing" className="text-sm text-surface-400 hover:text-white">Pricing</Link>
            <Link to="/dashboard" className="text-sm text-surface-400 hover:text-white">Dashboard</Link>
            <div className="w-8 h-8 bg-surface-50 rounded-full border border-surface-200 flex items-center justify-center">
               <User className="w-4 h-4 text-primary" />
            </div>
          </div>
        </div>
      </nav>
      <main className="flex-grow"><Outlet /></main>
      <footer className="py-8 text-center text-xs text-surface-400 border-t border-surface-200">
         &copy; {new Date().getFullYear()} MedSupplyOS Healthcare Marketplace
      </footer>
    </div>
  );
};

export default Layout;
