import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Building2,
  Package,
  ClipboardList,
  ShoppingCart,
  Leaf,
  Zap,
  User,
  LogOut,
  Menu,
  X,
  ChevronDown,
} from 'lucide-react';
import { Button } from './ui/Button';
import { useAuth } from '@hooks/useAuth';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  children?: { label: string; href: string }[];
}

const buyerNavItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: Building2 },
  { label: 'Projects', href: '/projects', icon: Package },
  { label: 'Materials', href: '/materials', icon: ClipboardList },
  { label: 'RFQs', href: '/rfqs', icon: ShoppingCart },
  { label: 'LEED Tracker', href: '/leed', icon: Leaf },
];

const supplierNavItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: Building2 },
  { label: 'Materials', href: '/materials', icon: Package },
  { label: 'Quotes', href: '/quotes', icon: ClipboardList },
  { label: 'Orders', href: '/orders', icon: ShoppingCart },
];

const adminNavItems: NavItem[] = [
  { label: 'Dashboard', href: '/admin', icon: Building2 },
  { label: 'Users', href: '/admin/users', icon: User },
  { label: 'Materials', href: '/admin/materials', icon: Package },
  { label: 'ACCIO', href: '/admin/accio', icon: Zap },
];

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);

  const navItems =
    user?.role === 'admin'
      ? adminNavItems
      : user?.role === 'supplier'
      ? supplierNavItems
      : buyerNavItems;

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-concrete-950">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 bg-concrete-900 border-b border-concrete-800">
        <div className="flex items-center justify-between h-16 px-4 lg:px-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-concrete-100">BuildSource</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? 'bg-orange-500/10 text-orange-500'
                    : 'text-concrete-400 hover:text-concrete-200 hover:bg-concrete-800'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Emergency Button */}
            {user?.role === 'buyer' && (
              <Button
                variant="danger"
                size="sm"
                leftIcon={<Zap className="w-4 h-4" />}
                onClick={() => navigate('/accio')}
                className="hidden sm:flex"
              >
                ACCIO
              </Button>
            )}

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 text-concrete-300 hover:text-concrete-100 transition-colors"
              >
                <div className="w-8 h-8 bg-concrete-700 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <span className="hidden sm:block text-sm font-medium">{user?.name}</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-concrete-900 border border-concrete-800 rounded-lg shadow-lg py-1">
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-concrete-300 hover:bg-concrete-800"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <User className="w-4 h-4" />
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-concrete-800"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-concrete-400 hover:text-concrete-100"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="lg:hidden border-t border-concrete-800 px-4 py-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium ${
                  isActive(item.href)
                    ? 'bg-orange-500/10 text-orange-500'
                    : 'text-concrete-400'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            ))}
            {user?.role === 'buyer' && (
              <Link
                to="/accio"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-400"
              >
                <Zap className="w-5 h-5" />
                ACCIO Emergency
              </Link>
            )}
          </nav>
        )}
      </header>

      {/* Main Content */}
      <main className="p-4 lg:p-8">{children}</main>
    </div>
  );
};
