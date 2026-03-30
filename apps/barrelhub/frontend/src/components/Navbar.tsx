import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, FlaskConical, BarChart3, ClipboardList, Wine, Search, Shield } from 'lucide-react'

const navItems = [
  { path: '/barrels', label: 'Barrel Directory', icon: Search },
  { path: '/registry', label: 'Registry', icon: ClipboardList },
  { path: '/sensory', label: 'Sensory', icon: Wine },
  { path: '/market-comps', label: 'Market Comps', icon: BarChart3 },
  { path: '/rfq', label: 'Submit RFQ', icon: FlaskConical },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  return (
    <nav className="sticky top-0 z-50 glass border-b border-0.5 border-charcoal-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-700 to-amber-900 rounded-lg flex items-center justify-center">
              <Wine className="w-5 h-5 text-amber-100" />
            </div>
            <span className="font-display text-xl font-bold text-gray-100">
              Barrel<span className="text-amber-600">Hub</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    isActive(item.path)
                      ? 'text-amber-500 bg-amber-900/20'
                      : 'text-gray-400 hover:text-amber-400 hover:bg-amber-900/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>

          {/* Right side actions */}
          <div className="hidden md:flex items-center space-x-3">
            <Link
              to="/admin"
              className="flex items-center space-x-2 px-4 py-2 text-gray-400 hover:text-amber-400 transition-colors duration-200"
            >
              <Shield className="w-4 h-4" />
              <span className="text-sm font-medium">Admin</span>
            </Link>
            <button className="btn-primary text-sm">
              Sign In
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-gray-400 hover:text-gray-200 hover:bg-charcoal-800 transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden border-t border-0.5 border-charcoal-800">
          <div className="px-4 py-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    isActive(item.path)
                      ? 'text-amber-500 bg-amber-900/20'
                      : 'text-gray-400 hover:text-amber-400 hover:bg-charcoal-800'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
            <div className="pt-3 border-t border-0.5 border-charcoal-800 mt-3">
              <Link
                to="/admin"
                onClick={() => setIsOpen(false)}
                className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-400 hover:text-amber-400 hover:bg-charcoal-800"
              >
                <Shield className="w-5 h-5" />
                <span>Admin</span>
              </Link>
              <button className="w-full mt-2 btn-primary text-sm">
                Sign In
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
