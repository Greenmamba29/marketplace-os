import { Link, Outlet, useNavigate } from 'react-router-dom';
import { Hexagon, Menu, X, User, LayoutDashboard, Globe, Shield } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/hooks';

export default function Layout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <nav className="border-b border-surface-200 bg-surface/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Hexagon className="w-5 h-5 text-white" />
                </div>
                <span className="font-display font-bold text-xl text-white tracking-tight">LithiumBuy</span>
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/materials" className="text-surface-400 hover:text-white transition-colors text-sm font-medium">Compounds</Link>
              <Link to="/rfq" className="text-surface-400 hover:text-white transition-colors text-sm font-medium">Trade RFQ</Link>
              <Link to="/pricing" className="text-surface-400 hover:text-white transition-colors text-sm font-medium">Pricing</Link>
              {user ? (
                <Link to="/dashboard" className="w-8 h-8 bg-surface-100 border border-surface-200 rounded-full flex items-center justify-center text-primary">
                  <User className="w-4 h-4" />
                </Link>
              ) : (
                <Link to="/login" className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold">Join Market</Link>
              )}
            </div>
          </div>
        </div>
      </nav>
      <main className="flex-grow">
        <Outlet />
      </main>
      <footer className="bg-surface-50 border-t border-surface-200 py-10">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-surface-400 italic">Global Lithium Index: Live Data Enabled</p>
        </div>
      </footer>
    </div>
  );
}
