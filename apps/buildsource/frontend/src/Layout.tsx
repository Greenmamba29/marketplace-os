import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, LogOut, HardHat, Package, ClipboardList, Search, User, Menu, X, Building2 } from 'lucide-react';
import { useAuthStore } from './store/auth';

const Layout: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const navLinks = [
    { name: 'Materials', href: '/materials', icon: Package },
    { name: 'RFQ', href: '/rfq/new', icon: ClipboardList },
    { name: 'Pricing', href: '/pricing', icon: ShoppingCart },
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  ];

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <nav className="border-b border-surface-200 glass sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <HardHat className="text-white w-5 h-5" />
                </div>
                <span className="text-xl font-display font-bold text-white tracking-tight">BuildSource</span>
              </Link>
              <div className="hidden md:ml-10 md:flex md:space-x-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.href}
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-surface-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-surface-50 rounded-lg border border-surface-200">
                    <Building2 className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">{user.company}</span>
                  </div>
                  <button onClick={() => { logout(); navigate('/login'); }} className="p-2 text-surface-400 hover:text-white">
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <Link to="/login" className="btn btn-primary py-2 px-4 text-sm">Sign In</Link>
              )}
            </div>
          </div>
        </div>
      </nav>
      <main className="flex-grow">
        <Outlet />
      </main>
      <footer className="bg-surface-50 border-t border-surface-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-surface-400 text-sm">
          <div className="flex justify-center items-center gap-2 mb-4">
            <HardHat className="text-primary w-5 h-5" />
            <span className="text-white font-bold font-display">BuildSource</span>
          </div>
          <p>&copy; {new Date().getFullYear()} BuildSource Marketplace OS. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
