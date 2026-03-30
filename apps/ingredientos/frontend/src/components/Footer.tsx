import { Link } from 'react-router-dom'
import { FlaskConical, Mail, Phone, MapPin, Linkedin, Twitter } from 'lucide-react'

const Footer = () => {
  const footerLinks = {
    Platform: [
      { name: 'Ingredient Directory', href: '/ingredients' },
      { name: 'Regulatory Center', href: '/regulatory' },
      { name: 'Submit RFQ', href: '/rfq' },
      { name: 'For Suppliers', href: '/suppliers' },
    ],
    Resources: [
      { name: 'GRAS Database', href: '/regulatory#gras' },
      { name: 'Certification Guide', href: '/regulatory#certifications' },
      { name: 'Allergen Database', href: '/regulatory#allergens' },
      { name: 'Compliance Blog', href: '/blog' },
    ],
    Company: [
      { name: 'About Us', href: '/about' },
      { name: 'Careers', href: '/careers' },
      { name: 'Press', href: '/press' },
      { name: 'Contact', href: '/contact' },
    ],
    Legal: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Cookie Policy', href: '/cookies' },
    ],
  }

  return (
    <footer className="bg-slate-900 border-t border-slate-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg bg-saffron-500 flex items-center justify-center">
                <FlaskConical className="w-5 h-5 text-slate-950" />
              </div>
              <span className="font-display font-bold text-xl text-slate-100">
                Ingredient<span className="text-saffron-500">OS</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm mb-6 max-w-xs">
              The premier B2B marketplace for specialty food and beverage ingredients with comprehensive regulatory compliance.
            </p>
            <div className="space-y-3">
              <a href="mailto:hello@ingredientos.io" className="flex items-center gap-2 text-sm text-slate-400 hover:text-saffron-400 transition-colors">
                <Mail className="w-4 h-4" />
                hello@ingredientos.io
              </a>
              <a href="tel:+1-800-555-0199" className="flex items-center gap-2 text-sm text-slate-400 hover:text-saffron-400 transition-colors">
                <Phone className="w-4 h-4" />
                +1 (800) 555-0199
              </a>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <MapPin className="w-4 h-4" />
                San Francisco, CA
              </div>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-display font-semibold text-slate-100 mb-4">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-sm text-slate-400 hover:text-saffron-400 transition-colors"
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
        <div className="mt-12 pt-8 border-t border-slate-700/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} IngredientOS. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-saffron-400 transition-colors">
              <Linkedin className="w-5 h-5" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-saffron-400 transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
