import { Link, Outlet } from 'react-router-dom';
import { 
  ShoppingBag, 
  LayoutDashboard, 
  Settings, 
  LogOut, 
  User, 
  Bell,
  Layers,
  Search
} from 'lucide-react';
import { useAuth } from '@/hooks';

export default function Layout() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <header className="fixed top-0 left-0 right-0 z-50 bg-surface/80 backdrop-blur-md border-b border-surface-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl text-white">UniformOS</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link to="/products" className="text-sm font-medium text-surface-400 hover:text-white flex items-center gap-2">
              <Search className="w-4 h-4" /> Catalog
            </Link>
            <Link to="/pricing" className="text-sm font-medium text-surface-400 hover:text-white flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" /> Pricing
            </Link>
            <Link to="/rfq" className="text-sm font-medium text-surface-400 hover:text-white flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" /> Start RFQ
            </Link>
            <Link to="/dashboard" className="text-sm font-medium text-surface-400 hover:text-white flex items-center gap-2">
              <LayoutDashboard className="w-4 h-4" /> Dashboard
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <button className="relative p-2 text-surface-400 hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full border border-surface" />
            </button>
            <div className="h-8 w-[1px] bg-surface-200 mx-1" />
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-medium text-white">{user?.name}</div>
                <div className="text-[10px] text-surface-400">{user?.company}</div>
              </div>
              <div className="w-8 h-8 rounded-full bg-surface-100 border border-surface-200 flex items-center justify-center">
                <User className="w-4 h-4 text-surface-400" />
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-grow pt-16">
        <Outlet />
      </main>
      
      <footer className="bg-surface-50 border-t border-surface-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-surface-400">
          © {new Date().getFullYear()} UniformOS. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
