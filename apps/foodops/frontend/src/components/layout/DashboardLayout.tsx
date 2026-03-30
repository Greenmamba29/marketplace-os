import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { 
  LayoutDashboard, 
  ShoppingCart, 
  ChefHat, 
  ClipboardList, 
  Thermometer, 
  FileCheck,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  User
} from 'lucide-react'
import { useAuthStore } from '../../store/authStore'

export const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { user, logout } = useAuthStore()
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const sidebarLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/dashboard/menu', label: 'Menu Engineering', icon: ChefHat },
    { to: '/dashboard/rfq', label: 'Request Quote', icon: ClipboardList },
    { to: '/dashboard/orders', label: 'Orders', icon: ShoppingCart },
    { to: '/dashboard/compliance', label: 'FSMA Compliance', icon: FileCheck },
    { to: '/dashboard/temperature', label: 'Temperature Logs', icon: Thermometer },
  ]

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard'
    }
    return location.pathname.startsWith(path)
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex">
      {/* Desktop Sidebar */}
      <aside 
        className={`hidden lg:flex flex-col fixed left-0 top-0 bottom-0 bg-[#141414] border-r border-white/5 transition-all duration-300 z-40 ${
          isSidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-4 border-b border-white/5">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#65A30D] flex items-center justify-center flex-shrink-0">
              <ChefHat className="w-5 h-5 text-white" />
            </div>
            {isSidebarOpen && (
              <span className="font-display font-bold text-lg text-white">
                Food<span className="text-[#65A30D]">Ops</span>
              </span>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {sidebarLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                isActive(link.to)
                  ? 'bg-[#65A30D]/10 text-[#65A30D]'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
              title={!isSidebarOpen ? link.label : undefined}
            >
              <link.icon className="w-5 h-5 flex-shrink-0" />
              {isSidebarOpen && <span className="text-sm font-medium">{link.label}</span>}
            </Link>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div className="p-3 border-t border-white/5 space-y-1">
          <button
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
            title={!isSidebarOpen ? 'Settings' : undefined}
          >
            <Settings className="w-5 h-5 flex-shrink-0" />
            {isSidebarOpen && <span className="text-sm font-medium">Settings</span>}
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-neutral-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
            title={!isSidebarOpen ? 'Logout' : undefined}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {isSidebarOpen && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-[#65A30D] text-white flex items-center justify-center shadow-lg hover:bg-[#84CC16] transition-colors"
        >
          {isSidebarOpen ? (
            <X className="w-3 h-3" />
          ) : (
            <Menu className="w-3 h-3" />
          )}
        </button>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside 
        className={`lg:hidden fixed left-0 top-0 bottom-0 w-64 bg-[#141414] border-r border-white/5 z-50 transition-transform duration-300 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-white/5">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#65A30D] flex items-center justify-center">
              <ChefHat className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-lg text-white">
              Food<span className="text-[#65A30D]">Ops</span>
            </span>
          </Link>
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-neutral-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="py-4 px-3 space-y-1">
          {sidebarLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                isActive(link.to)
                  ? 'bg-[#65A30D]/10 text-[#65A30D]'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <link.icon className="w-5 h-5" />
              <span className="text-sm font-medium">{link.label}</span>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-neutral-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${
        isSidebarOpen ? 'lg:ml-64' : 'lg:ml-20'
      }`}>
        {/* Header */}
        <header className="h-16 bg-[#0A0A0A]/90 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
          {/* Left */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden w-9 h-9 rounded-lg bg-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            {/* Search */}
            <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg bg-neutral-800/50 border border-white/5 w-64">
              <Search className="w-4 h-4 text-neutral-500" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent border-none outline-none text-sm text-white placeholder-neutral-500 w-full"
              />
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-3">
            {/* Notifications */}
            <button className="relative w-9 h-9 rounded-lg bg-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-700 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#65A30D]"></span>
            </button>

            {/* User */}
            <div className="flex items-center gap-3 pl-3 border-l border-white/5">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-white">{user?.name}</p>
                <p className="text-xs text-neutral-500">{user?.organizationName}</p>
              </div>
              <div className="w-9 h-9 rounded-lg bg-[#65A30D]/20 flex items-center justify-center">
                <User className="w-5 h-5 text-[#65A30D]" />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
