import { Link, Outlet, useNavigate } from 'react-router-dom';
import { Zap, Menu, X, User, LayoutDashboard, Search, FileText } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/hooks';

export default function Layout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <nav className="border-b border-surface-200 bg-surface/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-black" />
                </div>
                <span className="font-display font-bold text-xl text-white tracking-tight">VoltSource</span>
              </Link>
              <div className="hidden md:flex items-center ml-10 space-x-8">
                <Link to="/components" className="text-surface-400 hover:text-white transition-colors text-sm font-medium">Browse Components</Link>
                <Link to="/rfq" className="text-surface-400 hover:text-white transition-colors text-sm font-medium">Request Quote</Link>
                <Link to="/pricing" className="text-surface-400 hover:text-white transition-colors text-sm font-medium">Pricing</Link>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <div className="flex items-center gap-4">
                  <Link to="/dashboard" className="text-surface-400 hover:text-white transition-colors">
                    <LayoutDashboard className="w-5 h-5" />
                  </Link>
                  <button onClick={handleLogout} className="text-sm text-surface-400 hover:text-white">Sign Out</button>
                  <div className="w-8 h-8 bg-surface-100 border border-surface-200 rounded-full flex items-center justify-center text-primary">
                    <User className="w-4 h-4" />
                  </div>
                </div>
              ) : (
                <>
                  <Link to="/login" className="text-sm font-medium text-surface-400 hover:text-white">Sign In</Link>
                  <Link to="/register" className="px-4 py-2 bg-primary text-black rounded-lg text-sm font-bold hover:bg-primary-400 transition-colors">Join</Link>
                </>
              )}
            </div>
            
            <div className="md:hidden flex items-center">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-surface-400">
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow">
        <Outlet />
      </main>

      <footer className="bg-surface-50 border-t border-surface-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
              <Zap className="w-6 h-6 text-primary" />
              <span className="font-display font-bold text-lg text-white">VoltSource</span>
            </div>
            <p className="text-sm text-surface-400">© 2026 VoltSource. Powering the energy transition.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
