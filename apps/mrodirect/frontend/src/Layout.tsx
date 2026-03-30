import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, LogOut, Package, ShoppingCart, User, ClipboardList, Menu, X, Search } from 'lucide-react';
import { useAuthStore } from './store/auth';

const Layout: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { name: 'Parts', href: '/parts', icon: Package },
    { name: 'RFQ', href: '/rfq/new', icon: ClipboardList },
    { name: 'Pricing', href: '/pricing', icon: ShoppingCart },
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  ];

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* Navigation */}
      <nav className="border-b border-surface-200 glass sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Package className="text-white w-5 h-5" />
                </div>
                <span className="text-xl font-display font-bold text-white tracking-tight">MRODirect</span>
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
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search parts..."
                  className="bg-surface-50 border-surface-200 rounded-full pl-10 pr-4 py-1.5 text-sm w-64 focus:w-80 transition-all"
                />
              </div>

              {user ? (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-surface-50 rounded-lg border border-surface-200">
                    <User className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">{user.name}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-surface-400 hover:text-white hover:bg-surface-50 rounded-lg transition-all"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <Link to="/login" className="btn btn-primary py-2 px-4 text-sm">
                  Sign In
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md text-surface-400 hover:text-white hover:bg-surface-100"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden glass border-b border-surface-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="block px-3 py-2 rounded-md text-base font-medium text-surface-400 hover:text-white hover:bg-surface-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-surface-50 border-t border-surface-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-1">
               <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <Package className="text-white w-5 h-5" />
                  </div>
                  <span className="text-xl font-display font-bold text-white tracking-tight">MRODirect</span>
                </div>
                <p className="text-sm text-surface-400">
                  The ultimate marketplace for industrial MRO parts and equipment. Source at scale with precision.
                </p>
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Marketplace</h3>
              <ul className="space-y-2 text-sm text-surface-400">
                <li><Link to="/parts" className="hover:text-primary transition-colors">Browse Parts</Link></li>
                <li><Link to="/rfq/new" className="hover:text-primary transition-colors">Request Quote</Link></li>
                <li><Link to="/suppliers" className="hover:text-primary transition-colors">Suppliers</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-surface-400">
                <li><a href="#" className="hover:text-primary transition-colors">About</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-surface-400">
                <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">API Docs</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact Support</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-surface-200 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-surface-400">
              &copy; {new Date().getFullYear()} MRODirect. All rights reserved.
            </p>
            <div className="flex gap-6">
              <span className="text-xs text-surface-400">Powered by MarketplaceOS</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
