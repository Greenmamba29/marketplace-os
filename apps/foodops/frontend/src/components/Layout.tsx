import { Link, Outlet, useNavigate } from 'react-router-dom';
import { Leaf, Menu, X, User, ShoppingCart, Truck, Search } from 'lucide-react';
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
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                  <Leaf className="w-6 h-6 text-white" />
                </div>
                <span className="font-display font-bold text-2xl text-white tracking-tight">FoodOps</span>
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-10">
              <Link to="/products" className="text-surface-400 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest">Catalog</Link>
              <Link to="/rfq" className="text-surface-400 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest">Bulk RFQ</Link>
              <Link to="/pricing" className="text-surface-400 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest">Pricing</Link>
              {user ? (
                <div className="flex items-center gap-6">
                  <Link to="/dashboard" className="text-surface-400 hover:text-white">
                    <Truck className="w-6 h-6" />
                  </Link>
                  <div className="w-10 h-10 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center text-primary font-bold">
                    {user.name[0]}
                  </div>
                </div>
              ) : (
                <Link to="/login" className="px-6 py-3 bg-primary text-white rounded-xl text-sm font-black uppercase tracking-widest hover:bg-primary-600 transition-all">Sign In</Link>
              )}
            </div>
          </div>
        </div>
      </nav>
      <main className="flex-grow">
        <Outlet />
      </main>
      <footer className="bg-surface-50 border-t border-surface-200 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex justify-center gap-8 mb-8">
            <span className="text-xs font-mono uppercase text-surface-400">Cold Chain Verified</span>
            <span className="text-xs font-mono uppercase text-surface-400">99.2% Accuracy</span>
            <span className="text-xs font-mono uppercase text-surface-400">FSMA Compliant</span>
          </div>
          <p className="text-xs text-surface-400 uppercase tracking-widest">© 2026 FoodOps Distribution Systems</p>
        </div>
      </footer>
    </div>
  );
}
