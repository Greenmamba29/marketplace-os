import { Outlet, Link, useLocation } from 'react-router-dom'
import { useAuthStore } from '../hooks/useAuth'
import {
  LayoutDashboard,
  Package,
  ScanLine,
  FileText,
  TrendingDown,
  Users,
  Settings,
  LogOut,
  Bell,
  Search,
  Menu,
  X,
  Stethoscope,
  Activity,
  AlertTriangle,
} from 'lucide-react'
import { useState } from 'react'

export function Layout() {
  const { user, logout, hasPermission } = useAuthStore()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Equipment Directory', href: '/equipment', icon: Package },
    { name: 'UDI Tracker', href: '/udi-tracker', icon: ScanLine, permission: 'access_udi_tracker' },
    { name: 'RFQ Wizard', href: '/rfq', icon: FileText, permission: 'create_rfq' },
    { name: 'GPO Benchmark', href: '/gpo-benchmark', icon: TrendingDown, permission: 'view_gpo_pricing' },
    { name: 'Biomedical Assets', href: '/biomedical-assets', icon: Activity, permission: 'manage_inventory' },
    { name: 'Emergency Sourcing', href: '/emergency-sourcing', icon: AlertTriangle, permission: 'admin_access' },
    { name: 'Admin', href: '/admin', icon: Users, permission: 'admin_access' },
  ]

  const filteredNavigation = navigation.filter(
    item => !item.permission || hasPermission(item.permission)
  )

  const isActive = (href: string) => {
    if (href === '/dashboard') return location.pathname === '/dashboard'
    return location.pathname.startsWith(href)
  }

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-surface-200 transform transition-transform duration-200 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-surface-200">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-clinical-500 rounded-clinical flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-surface-900">MedSupplyOS</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-surface-500 hover:text-surface-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {filteredNavigation.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-clinical text-sm font-medium transition-colors ${
                  active
                    ? 'bg-clinical-50 text-clinical-700'
                    : 'text-surface-600 hover:bg-surface-100 hover:text-surface-900'
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? 'text-clinical-600' : 'text-surface-400'}`} />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-surface-200">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-clinical-100 flex items-center justify-center">
              <span className="text-sm font-medium text-clinical-700">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-surface-900 truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-surface-500 truncate">{user?.email}</p>
            </div>
            <button
              onClick={logout}
              className="text-surface-400 hover:text-surface-600 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Header */}
        <header className="sticky top-0 z-30 h-16 bg-white border-b border-surface-200 px-4 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-surface-500 hover:text-surface-700"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
              <input
                type="text"
                placeholder="Search equipment, orders, UDIs..."
                className="w-64 pl-9 pr-4 py-2 text-sm rounded-clinical border border-surface-200 focus:outline-none focus:ring-2 focus:ring-clinical-500 focus:border-clinical-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 text-surface-500 hover:text-surface-700 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-medical-red rounded-full" />
            </button>
            <Link
              to="/settings"
              className="p-2 text-surface-500 hover:text-surface-700 transition-colors"
            >
              <Settings className="w-5 h-5" />
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
