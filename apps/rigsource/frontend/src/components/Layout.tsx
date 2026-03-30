import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Wrench, Package, Users, FileText, LayoutDashboard, Menu, X, LogOut } from 'lucide-react';
import { useAuth } from '../hooks';

const Layout = () => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Equipment', icon: Package, path: '/equipment' },
    { name: 'Dealers', icon: Users, path: '/dealers' },
    { name: 'RFQ', icon: FileText, path: '/rfq' },
    { name: 'Pricing', icon: FileText, path: '/pricing' },
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  ];

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <nav className="glass border-b border-surface-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <Wrench className="w-8 h-8 text-primary" />
              <span className="text-xl font-bold font-display tracking-tight">RigSource</span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                    location.pathname === item.path ? 'text-primary' : 'text-surface-400 hover:text-white'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </Link>
              ))}
              {user ? (
                <button onClick={logout} className="text-surface-400 hover:text-white">
                  <LogOut className="w-5 h-5" />
                </button>
              ) : (
                <Link to="/login" className="btn btn-primary py-2 px-4 text-sm">Login</Link>
              )}
            </div>

            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white">
                {isMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow">
        <Outlet />
      </main>

      <footer className="border-t border-surface-100 py-12 bg-surface-50">
        <div className="max-w-7xl mx-auto px-4 text-center text-surface-400 text-sm">
          <p>© 2026 RigSource Inc. Heavy Equipment, Anywhere in the World.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
