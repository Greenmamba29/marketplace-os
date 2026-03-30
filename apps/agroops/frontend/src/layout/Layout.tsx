import { Link, Outlet, useNavigate } from 'react-router-dom';
import { Sprout, User, LogOut, Menu, X, Search, Bell } from 'lucide-react';
import { useState } from 'react';

export default function Layout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <nav className="border-b border-surface-200 bg-surface/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Sprout className="w-5 h-5 text-white" />
                </div>
                <span className="font-display font-bold text-xl text-white">AgroOps</span>
              </Link>
              <div className="hidden md:ml-8 md:flex md:space-x-6">
                <Link to="/products" className="text-surface-400 hover:text-white px-3 py-2 text-sm font-medium transition-colors">Products</Link>
                <Link to="/rfq" className="text-surface-400 hover:text-white px-3 py-2 text-sm font-medium transition-colors">Request Quote</Link>
                <Link to="/pricing" className="text-surface-400 hover:text-white px-3 py-2 text-sm font-medium transition-colors">Pricing</Link>
                <Link to="/dashboard" className="text-surface-400 hover:text-white px-3 py-2 text-sm font-medium transition-colors">Dashboard</Link>
              </div>
            </div>
            
            <div className="hidden md:flex items-center gap-4">
              <button className="text-surface-400 hover:text-white p-2">
                <Search className="w-5 h-5" />
              </button>
              <button className="text-surface-400 hover:text-white p-2">
                <Bell className="w-5 h-5" />
              </button>
              <div className="h-6 w-px bg-surface-200" />
              <button onClick={() => navigate('/login')} className="flex items-center gap-2 text-surface-400 hover:text-white p-2">
                <User className="w-5 h-5" />
                <span className="text-sm font-medium">Account</span>
              </button>
            </div>

            <div className="md:hidden flex items-center">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-surface-400 p-2">
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Sprout className="w-5 h-5 text-white" />
                </div>
                <span className="font-display font-bold text-xl text-white">AgroOps</span>
              </div>
              <p className="text-surface-400 text-sm max-w-sm">
                The leading B2B marketplace for agricultural inputs. Connect directly with 420+ global suppliers for seeds, fertilizers, and more.
              </p>
            </div>
            <div>
              <h4 className="text-white font-medium mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-surface-400">
                <li><Link to="/products" className="hover:text-primary transition-colors">Input Catalog</Link></li>
                <li><Link to="/rfq" className="hover:text-primary transition-colors">Request Quote</Link></li>
                <li><Link to="/dashboard" className="hover:text-primary transition-colors">Buyer Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-medium mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-surface-400">
                <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">EPA Guidelines</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-surface-200 text-center text-sm text-surface-400">
            © {new Date().getFullYear()} AgroOps. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
