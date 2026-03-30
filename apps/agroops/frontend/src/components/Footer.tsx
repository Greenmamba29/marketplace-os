import { Link } from 'react-router-dom'
import { Sprout, Mail, Phone, MapPin, Linkedin, Twitter } from 'lucide-react'

const footerLinks = {
  Products: [
    { name: 'Seeds', href: '/directory?category=seed' },
    { name: 'Fertilizers', href: '/directory?category=fertilizer' },
    { name: 'Crop Protection', href: '/directory?category=crop_protection' },
    { name: 'Equipment', href: '/directory?category=equipment' },
  ],
  Services: [
    { name: 'Agronomic Engine', href: '/agronomy' },
    { name: 'RFQ Platform', href: '/rfq-wizard' },
    { name: 'Market Intelligence', href: '/market-intel' },
    { name: 'Credit Terms', href: '/credit' },
  ],
  Company: [
    { name: 'About Us', href: '/about' },
    { name: 'Careers', href: '/careers' },
    { name: 'Press', href: '/press' },
    { name: 'Contact', href: '/contact' },
  ],
  Resources: [
    { name: 'Help Center', href: '/help' },
    { name: 'EPA Database', href: '/epa' },
    { name: 'Weather Data', href: '/weather' },
    { name: 'API Docs', href: '/api-docs' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-dark-800 border-t border-0.5 border-dark-600/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-field-gold rounded-lg flex items-center justify-center">
                <Sprout className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-display font-bold text-white">
                Agro<span className="text-field-gold">Ops</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm mb-6 max-w-xs">
              The agricultural inputs marketplace connecting farmers with trusted suppliers. 
              Seeds, fertilizers, crop protection, and agronomic intelligence.
            </p>
            <div className="space-y-2">
              <a href="mailto:info@agroops.io" className="flex items-center gap-2 text-sm text-gray-400 hover:text-field-gold transition-colors">
                <Mail className="w-4 h-4" />
                info@agroops.io
              </a>
              <a href="tel:+1-800-AGROOPS" className="flex items-center gap-2 text-sm text-gray-400 hover:text-field-gold transition-colors">
                <Phone className="w-4 h-4" />
                1-800-AGROOPS
              </a>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <MapPin className="w-4 h-4" />
                Des Moines, IA
              </div>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                {category}
              </h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-sm text-gray-400 hover:text-field-gold transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="border-t border-0.5 border-dark-600/30 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} AgroOps, Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="text-sm text-gray-500 hover:text-gray-400">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-sm text-gray-500 hover:text-gray-400">
              Terms of Service
            </Link>
            <div className="flex items-center gap-3 ml-4">
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-field-gold transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-field-gold transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
