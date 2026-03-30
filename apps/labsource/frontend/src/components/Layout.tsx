import { Link, useLocation } from 'react-router-dom'
import { 
  FlaskConical, 
  Search, 
  Package, 
  Thermometer, 
  FileText, 
  LayoutDashboard, 
  Settings, 
  LogOut,
  Bell,
  User,
  Menu,
  X
} from 'lucide-react'
import { useState } from 'react'
import { useAuthStore } from '../hooks/useAuth'

interface LayoutProps {
  children: React.ReactNode
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Reagents', href: '/reagents', icon: Search },
  { name: 'Lot Tracker', href: '/lots', icon: Package },
  { name: 'Cold Chain', href: '/cold-chain', icon: Thermometer },
  { name: 'RFQ', href: '/rfq', icon: FileText },
]

const adminNavigation = [
  { name: 'Admin', href: '/admin', icon: Settings },
]

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const { user, logout } = useAuthStore()

  const isActive = (href: string) => location.pathname === href || location.pathname.startsWith(href + '/')

  const navItems = user?.role === 'admin' 
    ? [...navigation, ...adminNavigation] 
    : navigation

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/80 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 transform transition-transform duration-200 lg:hidden ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-800">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-science-600 rounded-lg flex items-center justify-center">
              <FlaskConical className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-semibold text-lg text-slate-100">LabSource</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="text-slate-400 hover:text-slate-200">
            <X className="w-6 h-6" />
          </button>
        </div>
        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive(item.href)
                  ? 'bg-science-950 text-science-400 border border-science-800'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:w-64 lg:bg-slate-900 lg:border-r lg:border-slate-800 lg:flex lg:flex-col">
        <div className="flex items-center h-16 px-6 border-b border-slate-800">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-science-600 rounded-lg flex items-center justify-center">
              <FlaskConical className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-semibold text-lg text-slate-100">LabSource</span>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive(item.href)
                  ? 'bg-science-950 text-science-400 border border-science-800'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-slate-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-200 truncate">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs text-slate-500 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-3 px-3 py-2 w-full text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors mt-2"
          >
            <LogOut className="w-5 h-5" />
            Sign out
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-slate-400 hover:text-slate-200"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-4">
              <button className="relative text-slate-400 hover:text-slate-200">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-science-600 rounded-full text-[10px] flex items-center justify-center text-white">
                  3
                </span>
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
