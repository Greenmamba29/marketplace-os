import { Outlet, Link, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/hooks/useAuth'
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  ShieldCheck, 
  ClipboardList,
  Settings,
  LogOut,
  Menu,
  X,
  Building2,
  Search
} from 'lucide-react'
import { useState } from 'react'

export function Layout() {
  const { user, logout } = useAuthStore()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navigation = [
    ...(user?.role === 'BUYER' || user?.role === 'CONTRACTING_OFFICER' 
      ? [{ name: 'Buyer Dashboard', href: '/buyer-dashboard', icon: LayoutDashboard }] 
      : []),
    ...(user?.role === 'VENDOR' 
      ? [{ name: 'Vendor Dashboard', href: '/vendor-dashboard', icon: LayoutDashboard }] 
      : []),
    { name: 'Vendor Directory', href: '/vendors', icon: Users },
    { name: 'RFP Matcher', href: '/rfps', icon: Search },
    { name: 'Compliance Center', href: '/compliance', icon: ShieldCheck },
    { name: 'RFQ Wizard', href: '/rfq-wizard', icon: ClipboardList },
    { name: 'Pricing', href: '/pricing', icon: ClipboardList },
    ...(user?.role === 'ADMIN' 
      ? [{ name: 'Admin', href: '/admin', icon: Settings }] 
      : []),
  ]

  const isActive = (href: string) => location.pathname === href || location.pathname.startsWith(`${href}/`)

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-semibold text-white">GovSource</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? 'bg-blue-600/10 text-blue-400'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* User Menu */}
            <div className="flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-3">
                  <span className="hidden sm:block text-sm text-slate-400">
                    {user.firstName} {user.lastName}
                  </span>
                  <button
                    onClick={logout}
                    className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="btn btn-primary text-sm"
                >
                  Sign In
                </Link>
              )}

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden border-t border-slate-800 bg-slate-900">
            <div className="px-4 py-3 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? 'bg-blue-600/10 text-blue-400'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}
