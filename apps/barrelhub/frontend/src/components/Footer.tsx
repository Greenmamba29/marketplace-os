import { Link } from 'react-router-dom'
import { Wine, Mail, Phone, MapPin, Linkedin, Twitter } from 'lucide-react'

const footerLinks = {
  marketplace: [
    { label: 'Barrel Directory', href: '/barrels' },
    { label: 'Barrel Registry', href: '/registry' },
    { label: 'Sensory Profiles', href: '/sensory' },
    { label: 'Market Comps', href: '/market-comps' },
  ],
  company: [
    { label: 'About Us', href: '#' },
    { label: 'Careers', href: '#' },
    { label: 'Press', href: '#' },
    { label: 'Contact', href: '#' },
  ],
  resources: [
    { label: 'TTB Guidelines', href: '#' },
    { label: 'Compliance', href: '#' },
    { label: 'API Documentation', href: '#' },
    { label: 'Support', href: '#' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'Cookie Policy', href: '#' },
  ],
}

export function Footer() {
  return (
    <footer className="bg-charcoal-900 border-t border-0.5 border-charcoal-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-700 to-amber-900 rounded-lg flex items-center justify-center">
                <Wine className="w-5 h-5 text-amber-100" />
              </div>
              <span className="font-display text-xl font-bold text-gray-100">
                Barrel<span className="text-amber-600">Hub</span>
              </span>
            </Link>
            <p className="text-gray-500 text-sm mb-6 max-w-xs">
              The premier B2B marketplace for bulk whiskey and spirits. 
              Source aged barrels, verify TTB compliance, and access market intelligence.
            </p>
            <div className="space-y-3">
              <a href="mailto:hello@barrelhub.io" className="flex items-center space-x-2 text-gray-400 hover:text-amber-400 text-sm transition-colors">
                <Mail className="w-4 h-4" />
                <span>hello@barrelhub.io</span>
              </a>
              <a href="tel:+1-800-BARRELS" className="flex items-center space-x-2 text-gray-400 hover:text-amber-400 text-sm transition-colors">
                <Phone className="w-4 h-4" />
                <span>1-800-BARRELS</span>
              </a>
              <div className="flex items-center space-x-2 text-gray-500 text-sm">
                <MapPin className="w-4 h-4" />
                <span>Louisville, KY</span>
              </div>
            </div>
          </div>

          {/* Marketplace */}
          <div>
            <h3 className="font-display font-semibold text-gray-200 mb-4">Marketplace</h3>
            <ul className="space-y-2">
              {footerLinks.marketplace.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-gray-500 hover:text-amber-400 text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-display font-semibold text-gray-200 mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-gray-500 hover:text-amber-400 text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-display font-semibold text-gray-200 mb-4">Resources</h3>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-gray-500 hover:text-amber-400 text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-display font-semibold text-gray-200 mb-4">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-gray-500 hover:text-amber-400 text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-0.5 border-charcoal-800 flex flex-col md:flex-row items-center justify-between">
          <p className="text-gray-600 text-sm">
            © {new Date().getFullYear()} BarrelHub. All rights reserved.
          </p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <a href="#" className="text-gray-500 hover:text-amber-400 transition-colors">
              <Linkedin className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-500 hover:text-amber-400 transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
