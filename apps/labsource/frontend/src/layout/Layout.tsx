import { Link, Outlet, useNavigate } from 'react-router-dom';
import { Beaker, User, LogOut, Menu, X, Search, Bell, ShieldCheck } from 'lucide-react';
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
                  <Beaker className="w-5 h-5 text-white" />
                </div>
                <span className="font-display font-bold text-xl text-white">LabSource</span>
              </Link>
              <div className="hidden md:ml-8 md:flex md:space-x-6">
                <Link to="/products" className="text-surface-400 hover:text-white px-3 py-2 text-sm font-medium transition-colors">Catalog</Link>
                <Link to="/rfq" className="text-surface-400 hover:text-white px-3 py-2 text-sm font-medium transition-colors">RFQ</Link>
                <Link to="/pricing" className="text-surface-400 hover:text-white px-3 py-2 text-sm font-medium transition-colors">Pricing</Link>
                <Link to="/dashboard" className="text-surface-400 hover:text-white px-3 py-2 text-sm font-medium transition-colors">Dashboard</Link>
              </div>
            </div>
            
            <div className="hidden md:flex items-center gap-4">
              <div className="flex items-center gap-1 text-accent-success text-xs font-bold uppercase mr-4">
                <ShieldCheck className="w-4 h-4" />
                ISO 9001 Certified
              </div>
              <button className="text-surface-400 hover:text-white p-2">
                <Search className="w-5 h-5" />
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
                  <Beaker className="w-5 h-5 text-white" />
                </div>
                <span className="font-display font-bold text-xl text-white">LabSource</span>
              </div>
              <p className="text-surface-400 text-sm max-w-sm">
                Precision sourced laboratory supplies and equipment. Connecting research institutions with 380+ certified brands.
              </p>
            </div>
            <div>
              <h4 className="text-white font-medium mb-4">Catalog</h4>
              <ul className="space-y-2 text-sm text-surface-400">
                <li><Link to="/products?cat=glassware" className="hover:text-primary transition-colors">Glassware</Link></li>
                <li><Link to="/products?cat=reagents" className="hover:text-primary transition-colors">Reagents</Link></li>
                <li><Link to="/products?cat=instruments" className="hover:text-primary transition-colors">Instruments</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-medium mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-surface-400">
                <li><a href="#" className="hover:text-primary transition-colors">Safety Data Sheets</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Certificates of Analysis</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Supply Chain Status</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-surface-200 text-center text-sm text-surface-400">
            © {new Date().getFullYear()} LabSource. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
