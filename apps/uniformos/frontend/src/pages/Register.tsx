import { Link } from 'react-router-dom';
import { Layers, CheckCircle2 } from 'lucide-react';

export default function Register() {
  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-4">
      <Link to="/" className="flex items-center gap-2 mb-8">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
          <Layers className="w-6 h-6 text-white" />
        </div>
        <span className="font-display font-bold text-2xl text-white">UniformOS</span>
      </Link>
      
      <div className="w-full max-w-xl p-8 bg-surface-50 border border-surface-200 rounded-2xl shadow-2xl">
        <div className="text-center mb-10">
          <h1 className="text-2xl font-display font-bold text-white mb-2">Request Buyer Access</h1>
          <p className="text-sm text-surface-400">Join the world's most efficient uniform sourcing marketplace.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="space-y-4">
            <h3 className="text-white font-medium mb-2">Company Information</h3>
            <div className="space-y-2">
              <label className="text-xs font-medium text-surface-400 ml-1">Company Name</label>
              <input type="text" placeholder="Acme Corp" className="w-full px-3 py-2 text-sm" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-surface-400 ml-1">Industry</label>
              <select className="w-full px-3 py-2 text-sm">
                <option>Healthcare</option>
                <option>Hospitality</option>
                <option>Public Safety</option>
                <option>Manufacturing</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-surface-400 ml-1">Estimated Annual Spend</label>
              <input type="text" placeholder="$50,000+" className="w-full px-3 py-2 text-sm" />
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-white font-medium mb-2">Contact Person</h3>
            <div className="space-y-2">
              <label className="text-xs font-medium text-surface-400 ml-1">Full Name</label>
              <input type="text" placeholder="John Doe" className="w-full px-3 py-2 text-sm" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-surface-400 ml-1">Work Email</label>
              <input type="email" placeholder="john@acme.com" className="w-full px-3 py-2 text-sm" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-surface-400 ml-1">Job Title</label>
              <input type="text" placeholder="Procurement Manager" className="w-full px-3 py-2 text-sm" />
            </div>
          </div>
        </div>
        
        <button className="btn btn-primary w-full py-4 mt-2 shadow-lg shadow-primary/20">Apply for Account</button>
        
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-surface-200 pt-8">
          {[
            'Verified Suppliers',
            'Wholesale Pricing',
            'RFQ Management'
          ].map(feature => (
            <div key={feature} className="flex items-center gap-2 text-[10px] text-surface-400 uppercase tracking-widest font-bold">
              <CheckCircle2 className="w-4 h-4 text-primary" /> {feature}
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-8 text-sm text-surface-400 text-center">
        Already have an account? <Link to="/login" className="text-primary font-medium hover:underline transition-colors">Sign In</Link>
      </div>
    </div>
  );
}
