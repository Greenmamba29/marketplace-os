import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { 
  Sprout, 
  Search, 
  Menu, 
  X, 
  User, 
  LogOut, 
  ShoppingCart,
  ClipboardList,
  BarChart3,
  ChevronDown
} from 'lucide-react'
import { useAuthStore } from '@/store'
import { useLogout } from '@/hooks'

const navLinks = [
  { name: 'Directory', href: '/directory', icon: Search },
  { name: 'Agronomy', href: '/agronomy', icon: Sprout },
  { name: 'RFQ', href: '/rfq-wizard', icon: ClipboardList },
]

const authLinks = [
  { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
]

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuthStore()
  const logout = useLogout()

  const isActive = (path: string) => location.pathname === path

  return (
    <nav className="sticky top-0 z-50 bg-dark-900/95 backdrop-blur-xl border-b border-0.5 border-dark-600/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-field-gold rounded-lg flex items-center justify-center">
              <Sprout className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-display font-bold text-white">
              Agro<span className="text-field-gold">Ops</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(link.href)
                    ? 'text-field-gold bg-field-gold/10'
                    : 'text-gray-400 hover:text-white hover:bg-dark-700'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <BarChart3 className="w-5 h-5" />
                </Link>
                
                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-dark-700 transition-colors"
                  >
                    <div className="w-8 h-8 bg-field-gold/20 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-field-gold" />
                    </div>
                    <span className="text-sm text-gray-300">{user?.first_name}</span>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </button>
                  
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-dark-800 rounded-xl border border-0.5 border-dark-600/50 shadow-xl py-1">
                      <div className="px-4 py-2 border-b border-dark-600/30">
                        <p className="text-sm font-medium text-white">{user?.first_name} {user?.last_name}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>
                      <Link
                        to="/dashboard"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-dark-700"
                      >
                        <BarChart3 className="w-4 h-4" />
                        Dashboard
                      </Link>
                      <Link
                        to="/profile"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-dark-700"
                      >
                        <User className="w-4 h-4" />
                        Profile
                      </Link>
                      {user?.role === 'admin' && (
                        <Link
                          to="/admin"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-dark-700"
                        >
                          <BarChart3 className="w-4 h-4" />
                          Admin
                        </Link>
                      )}
                      <button
                        onClick={() => logout.mutate()}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-dark-700"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-field-gold hover:bg-field-gold-light text-white text-sm font-medium rounded-lg transition-colors"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-400 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-dark-800 border-t border-0.5 border-dark-600/30">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium ${
                  isActive(link.href)
                    ? 'text-field-gold bg-field-gold/10'
                    : 'text-gray-400 hover:text-white hover:bg-dark-700'
                }`}
              >
                <link.icon className="w-5 h-5" />
                {link.name}
              </Link>
            ))}
            
            {isAuthenticated ? (
              <>
                <div className="border-t border-dark-600/30 pt-3 mt-3">
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-dark-700"
                  >
                    <BarChart3 className="w-5 h-5" />
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      logout.mutate()
                      setMobileMenuOpen(false)
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-400 hover:bg-dark-700"
                  >
                    <LogOut className="w-5 h-5" />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="border-t border-dark-600/30 pt-3 mt-3 space-y-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-sm font-medium text-gray-300 hover:text-white"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 bg-field-gold text-white text-sm font-medium rounded-lg text-center"
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
