import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { 
  Beaker, 
  Search, 
  FileText, 
  BarChart3, 
  User, 
  LogOut, 
  Menu, 
  X,
  Bell,
  ShoppingCart,
  Shield
} from 'lucide-react';
import { useAuth } from '@/hooks';

export default function Layout() {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/cas', label: 'CAS Directory', icon: Search },
    { path: '/market-intel', label: 'Market Intel', icon: BarChart3 },
    { path: '/pricing', label: 'Pricing', icon: ShoppingCart },
    ...(isAuthenticated ? [
      { path: '/dashboard', label: 'Dashboard', icon: User },
      { path: '/compliance', label: 'Compliance', icon: Shield },
    ] : []),
    ...(user?.role === 'admin' ? [
      { path: '/admin', label: 'Admin', icon: FileText },
    ] : []),
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-surface-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Beaker className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-xl text-white">ChemOS</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname.startsWith(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-surface-400 hover:text-white hover:bg-surface-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right side actions */}
            <div className="flex items-center gap-2">
              {isAuthenticated ? (
                <>
                  <button className="p-2 text-surface-400 hover:text-white rounded-lg hover:bg-surface-50">
                    <Bell className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-surface-400 hover:text-white rounded-lg hover:bg-surface-50">
                    <ShoppingCart className="w-5 h-5" />
                  </button>
                  <div className="hidden md:flex items-center gap-3 ml-4 pl-4 border-l border-surface-200">
                    <div className="text-right">
                      <p className="text-sm font-medium text-white">{user?.first_name} {user?.last_name}</p>
                      <p className="text-xs text-surface-400">{user?.company_name}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="p-2 text-surface-400 hover:text-accent-error rounded-lg hover:bg-surface-50"
                    >
                      <LogOut className="w-5 h-5" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="hidden md:flex items-center gap-2">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm font-medium text-surface-400 hover:text-white"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:bg-primary-600"
                  >
                    Get Started
                  </Link>
                </div>
              )}

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-surface-400 hover:text-white rounded-lg hover:bg-surface-50"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-surface-200 bg-surface">
            <nav className="px-4 py-3 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname.startsWith(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium ${
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-surface-400 hover:text-white hover:bg-surface-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                );
              })}
              {isAuthenticated && (
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-accent-error hover:bg-surface-50"
                >
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </button>
              )}
            </nav>
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-surface-200 bg-surface-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Beaker className="w-5 h-5 text-white" />
                </div>
                <span className="font-display font-bold text-xl text-white">ChemOS</span>
              </div>
              <p className="text-sm text-surface-400">
                Global specialty chemicals marketplace with AI-powered compliance and market intelligence.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-white mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-surface-400">
                <li><Link to="/cas" className="hover:text-primary">CAS Directory</Link></li>
                <li><Link to="/market-intel" className="hover:text-primary">Market Intelligence</Link></li>
                <li><Link to="/rfq" className="hover:text-primary">Submit RFQ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-white mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-surface-400">
                <li><Link to="/compliance" className="hover:text-primary">Compliance Reports</Link></li>
                <li><a href="#" className="hover:text-primary">API Documentation</a></li>
                <li><a href="#" className="hover:text-primary">Help Center</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-surface-400">
                <li><a href="#" className="hover:text-primary">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary">Terms of Service</a></li>
                <li><a href="#" className="hover:text-primary">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-surface-200 text-center text-sm text-surface-400">
            © {new Date().getFullYear()} ChemOS. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
