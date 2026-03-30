import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  Menu, 
  X, 
  Search, 
  FlaskConical, 
  ShieldCheck, 
  FileText, 
  LayoutDashboard,
  User,
  LogOut,
  ChevronDown
} from 'lucide-react'
import { useAuthStore } from '../store/authStore'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { isAuthenticated, user, logout } = useAuthStore()
  const location = useLocation()

  const navLinks = [
    { name: 'Ingredients', href: '/ingredients', icon: FlaskConical },
    { name: 'Regulatory', href: '/regulatory', icon: ShieldCheck },
    ...(isAuthenticated && user?.role === 'buyer' 
      ? [{ name: 'RFQ', href: '/rfq', icon: FileText }] 
      : []),
  ]

  const isActive = (path: string) => location.pathname === path

  return (
    <nav className="sticky top-0 z-50 glass border-b border-slate-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-lg bg-saffron-500 flex items-center justify-center group-hover:shadow-glow-saffron transition-shadow">
              <FlaskConical className="w-5 h-5 text-slate-950" />
            </div>
            <span className="font-display font-bold text-xl text-slate-100">
              Ingredient<span className="text-saffron-500">OS</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive(link.href)
                    ? 'bg-saffron-500/10 text-saffron-400'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
                }`}
              >
                <link.icon className="w-4 h-4" />
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="hidden md:flex items-center gap-3">
            <button className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800/50 rounded-lg transition-all">
              <Search className="w-5 h-5" />
            </button>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-slate-100 hover:bg-slate-800/50 transition-all"
                >
                  <div className="w-8 h-8 rounded-full bg-saffron-500/20 flex items-center justify-center">
                    <User className="w-4 h-4 text-saffron-400" />
                  </div>
                  <span className="max-w-[120px] truncate">{user?.name}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-700/50 rounded-xl shadow-xl py-2 animate-in">
                    <div className="px-4 py-2 border-b border-slate-700/50">
                      <p className="text-sm font-medium text-slate-100">{user?.name}</p>
                      <p className="text-xs text-slate-500">{user?.email}</p>
                    </div>
                    {user?.role === 'buyer' && (
                      <Link
                        to="/dashboard"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:text-saffron-400 hover:bg-slate-800/50"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Dashboard
                      </Link>
                    )}
                    {user?.role === 'admin' && (
                      <Link
                        to="/admin"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:text-saffron-400 hover:bg-slate-800/50"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <ShieldCheck className="w-4 h-4" />
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        logout()
                        setUserMenuOpen(false)
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-rose-400 hover:bg-rose-500/10"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-slate-100 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-saffron-500 text-slate-950 text-sm font-semibold rounded-lg hover:bg-saffron-400 transition-colors"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-slate-400 hover:text-slate-100"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-slate-900 border-t border-slate-700/50">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium ${
                  isActive(link.href)
                    ? 'bg-saffron-500/10 text-saffron-400'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
                }`}
                onClick={() => setIsOpen(false)}
              >
                <link.icon className="w-5 h-5" />
                {link.name}
              </Link>
            ))}
            
            {isAuthenticated ? (
              <>
                <div className="border-t border-slate-700/50 my-2 pt-2">
                  <p className="px-4 py-2 text-sm font-medium text-slate-100">{user?.name}</p>
                  <p className="px-4 text-xs text-slate-500">{user?.email}</p>
                </div>
                {user?.role === 'buyer' && (
                  <Link
                    to="/dashboard"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-slate-400 hover:text-slate-100 hover:bg-slate-800/50"
                    onClick={() => setIsOpen(false)}
                  >
                    <LayoutDashboard className="w-5 h-5" />
                    Dashboard
                  </Link>
                )}
                <button
                  onClick={() => {
                    logout()
                    setIsOpen(false)
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-rose-400 hover:bg-rose-500/10"
                >
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </button>
              </>
            ) : (
              <div className="border-t border-slate-700/50 pt-3 space-y-2">
                <Link
                  to="/login"
                  className="block px-4 py-3 text-center text-sm font-medium text-slate-300 hover:text-slate-100 border border-slate-700/50 rounded-lg"
                  onClick={() => setIsOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="block px-4 py-3 text-center text-sm font-semibold text-slate-950 bg-saffron-500 rounded-lg hover:bg-saffron-400"
                  onClick={() => setIsOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
