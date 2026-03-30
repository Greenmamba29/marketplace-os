import { Outlet, Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { 
  Heart, Users, Calendar, ClipboardList, UserCircle, 
  Menu, X, ChevronDown, Bell, LogOut, Shield 
} from 'lucide-react'
import { useAuthStore } from '../hooks/useAuth'

export function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { isAuthenticated, user, logout } = useAuthStore()
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  const navLinks = [
    { name: 'Find Caregivers', href: '/caregivers', icon: Users },
    ...(isAuthenticated && user?.role === 'family' ? [
      { name: 'Care Plans', href: '/portal', icon: ClipboardList },
      { name: 'Schedule', href: '/scheduling', icon: Calendar },
    ] : []),
    ...(isAuthenticated && user?.role === 'caregiver' ? [
      { name: 'My Schedule', href: '/scheduling', icon: Calendar },
      { name: 'My Profile', href: '/caregiver/dashboard', icon: UserCircle },
    ] : []),
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
        <div className="container-custom">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">CareOps</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(link.href)
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Right side actions */}
            <div className="flex items-center gap-2">
              {isAuthenticated ? (
                <>
                  {/* Notifications */}
                  <button className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
                  </button>

                  {/* User menu */}
                  <div className="relative">
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-primary-700">
                          {user?.firstName?.[0]}{user?.lastName?.[0]}
                        </span>
                      </div>
                      <ChevronDown className="w-4 h-4 text-slate-500" />
                    </button>

                    {userMenuOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-2 animate-fade-in">
                        <div className="px-4 py-3 border-b border-slate-100">
                          <p className="text-sm font-medium text-slate-900">
                            {user?.firstName} {user?.lastName}
                          </p>
                          <p className="text-xs text-slate-500">{user?.email}</p>
                        </div>
                        
                        {user?.role === 'admin' && (
                          <Link
                            to="/admin"
                            className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <Shield className="w-4 h-4" />
                            Admin Dashboard
                          </Link>
                        )}
                        
                        <Link
                          to="/portal"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <UserCircle className="w-4 h-4" />
                          My Account
                        </Link>
                        
                        <button
                          onClick={() => {
                            logout()
                            setUserMenuOpen(false)
                          }}
                          className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="hidden md:flex items-center gap-2">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 bg-primary-500 text-white text-sm font-medium rounded-lg hover:bg-primary-600 transition-colors"
                  >
                    Get Started
                  </Link>
                </div>
              )}

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white animate-slide-up">
            <nav className="container-custom py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive(link.href)
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <link.icon className="w-5 h-5" />
                  {link.name}
                </Link>
              ))}
              
              {!isAuthenticated && (
                <div className="pt-4 border-t border-slate-200 space-y-2">
                  <Link
                    to="/login"
                    className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white bg-primary-500 rounded-lg hover:bg-primary-600"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="min-h-[calc(100vh-64px-300px)]">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-slate-50 border-t border-slate-200">
        <div className="container-custom py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="md:col-span-1">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                  <Heart className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-bold text-slate-900">CareOps</span>
              </Link>
              <p className="mt-4 text-sm text-slate-600">
                Connecting families with compassionate, qualified caregivers for professional home care.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-semibold text-slate-900 mb-4">For Families</h4>
              <ul className="space-y-2">
                <li><Link to="/caregivers" className="text-sm text-slate-600 hover:text-primary-600">Find Caregivers</Link></li>
                <li><Link to="/care-plans/new" className="text-sm text-slate-600 hover:text-primary-600">Create Care Plan</Link></li>
                <li><Link to="/portal" className="text-sm text-slate-600 hover:text-primary-600">Family Portal</Link></li>
                <li><Link to="/pricing" className="text-sm text-slate-600 hover:text-primary-600">Pricing</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 mb-4">For Caregivers</h4>
              <ul className="space-y-2">
                <li><Link to="/caregiver/apply" className="text-sm text-slate-600 hover:text-primary-600">Apply to Join</Link></li>
                <li><Link to="/caregiver/resources" className="text-sm text-slate-600 hover:text-primary-600">Resources</Link></li>
                <li><Link to="/caregiver/training" className="text-sm text-slate-600 hover:text-primary-600">Training</Link></li>
                <li><Link to="/caregiver/faq" className="text-sm text-slate-600 hover:text-primary-600">FAQ</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 mb-4">Support</h4>
              <ul className="space-y-2">
                <li><Link to="/help" className="text-sm text-slate-600 hover:text-primary-600">Help Center</Link></li>
                <li><Link to="/contact" className="text-sm text-slate-600 hover:text-primary-600">Contact Us</Link></li>
                <li><Link to="/safety" className="text-sm text-slate-600 hover:text-primary-600">Safety</Link></li>
                <li><Link to="/privacy" className="text-sm text-slate-600 hover:text-primary-600">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} CareOps. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1 text-sm text-slate-500">
                <Shield className="w-4 h-4 text-green-500" />
                Background Checked Caregivers
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
