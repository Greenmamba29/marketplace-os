import { Outlet, Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { 
  ChefHat, 
  Search, 
  Menu, 
  X, 
  User, 
  LogIn,
  ShoppingCart,
  Thermometer,
  ClipboardCheck
} from 'lucide-react'
import { useAuthStore } from '../../store/authStore'

export const MainLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { isAuthenticated, user } = useAuthStore()
  const location = useLocation()

  const navLinks = [
    { to: '/ingredients', label: 'Ingredients', icon: Search },
    { to: '/dashboard/menu', label: 'Menu Engineering', icon: ChefHat },
    { to: '/dashboard/compliance', label: 'FSMA Compliance', icon: ClipboardCheck },
  ]

  const isActive = (path: string) => location.pathname.startsWith(path)

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A]/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#65A30D] flex items-center justify-center">
                <ChefHat className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-xl text-white">
                Food<span className="text-[#65A30D]">Ops</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive(link.to)
                      ? 'text-[#65A30D] bg-[#65A30D]/10'
                      : 'text-neutral-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-[#65A30D] text-white text-sm font-medium hover:bg-[#84CC16] transition-colors"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Dashboard
                  </Link>
                  <Link
                    to="/dashboard"
                    className="w-9 h-9 rounded-lg bg-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-700 transition-colors"
                  >
                    <User className="w-5 h-5" />
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg text-neutral-400 hover:text-white transition-colors"
                  >
                    <LogIn className="w-4 h-4" />
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 rounded-lg bg-[#65A30D] text-white text-sm font-medium hover:bg-[#84CC16] transition-colors"
                  >
                    Get Started
                  </Link>
                </>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden w-9 h-9 rounded-lg bg-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-white/5 bg-[#0A0A0A]">
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
                    isActive(link.to)
                      ? 'text-[#65A30D] bg-[#65A30D]/10'
                      : 'text-neutral-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <link.icon className="w-5 h-5" />
                  {link.label}
                </Link>
              ))}
              {!isAuthenticated && (
                <>
                  <div className="border-t border-white/5 pt-2 mt-2">
                    <Link
                      to="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5"
                    >
                      <LogIn className="w-5 h-5" />
                      Sign In
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="pt-16">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="md:col-span-1">
              <Link to="/" className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-[#65A30D] flex items-center justify-center">
                  <ChefHat className="w-5 h-5 text-white" />
                </div>
                <span className="font-display font-bold text-xl text-white">
                  Food<span className="text-[#65A30D]">Ops</span>
                </span>
              </Link>
              <p className="text-neutral-500 text-sm">
                Commercial food distribution platform with menu-based procurement, cold chain monitoring, and FSMA compliance.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-medium text-white mb-4">Platform</h4>
              <ul className="space-y-2">
                <li><Link to="/ingredients" className="text-neutral-500 hover:text-[#65A30D] text-sm transition-colors">Ingredients</Link></li>
                <li><Link to="/dashboard/menu" className="text-neutral-500 hover:text-[#65A30D] text-sm transition-colors">Menu Engineering</Link></li>
                <li><Link to="/dashboard/rfq" className="text-neutral-500 hover:text-[#65A30D] text-sm transition-colors">Request Quote</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-white mb-4">Compliance</h4>
              <ul className="space-y-2">
                <li><Link to="/dashboard/compliance" className="text-neutral-500 hover:text-[#65A30D] text-sm transition-colors">FSMA Dashboard</Link></li>
                <li><span className="text-neutral-500 text-sm">Lot Traceability</span></li>
                <li><span className="text-neutral-500 text-sm">Temperature Logs</span></li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-white mb-4">Support</h4>
              <ul className="space-y-2">
                <li><span className="text-neutral-500 text-sm">Documentation</span></li>
                <li><span className="text-neutral-500 text-sm">Contact Us</span></li>
                <li><span className="text-neutral-500 text-sm">Privacy Policy</span></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/5 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-neutral-600 text-sm">
              © 2024 FoodOps. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-neutral-600 text-sm">
              <Thermometer className="w-4 h-4" />
              <span>Cold Chain Verified</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
