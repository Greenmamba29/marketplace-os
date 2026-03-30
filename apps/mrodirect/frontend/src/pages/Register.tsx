import React from 'react';
import { Link } from 'react-router-dom';
import { Package, ArrowRight, Building2, User, Mail, Lock } from 'lucide-react';

const Register: React.FC = () => {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-surface to-surface z-0" />
      
      <div className="w-full max-w-2xl relative z-10">
        <div className="text-center mb-8">
           <Link to="/" className="inline-flex items-center gap-2 mb-8">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                 <Package className="text-white w-6 h-6" />
              </div>
              <span className="text-2xl font-display font-bold text-white tracking-tight italic">MRODirect</span>
           </Link>
           <h1 className="text-3xl font-display font-bold text-white mb-2 italic">Join the Marketplace</h1>
           <p className="text-surface-400">Digitize your industrial procurement workflow today.</p>
        </div>

        <div className="glass border border-surface-200 rounded-3xl p-8 md:p-12">
           <form className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <label className="text-sm font-medium text-surface-400">Full Name</label>
                    <div className="relative">
                       <User className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 w-5 h-5" />
                       <input type="text" className="w-full pl-12" placeholder="John Doe" />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-sm font-medium text-surface-400">Company Name</label>
                    <div className="relative">
                       <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 w-5 h-5" />
                       <input type="text" className="w-full pl-12" placeholder="BuildTech Industries" />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-sm font-medium text-surface-400">Work Email</label>
                    <div className="relative">
                       <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 w-5 h-5" />
                       <input type="email" className="w-full pl-12" placeholder="john@buildtech.com" />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-sm font-medium text-surface-400">Account Type</label>
                    <select className="w-full">
                       <option>Buyer (Procurement)</option>
                       <option>Supplier (Manufacturer)</option>
                       <option>Logistics Partner</option>
                    </select>
                 </div>
              </div>

              <div className="space-y-2">
                 <label className="text-sm font-medium text-surface-400">Password</label>
                 <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 w-5 h-5" />
                    <input type="password" className="w-full pl-12" placeholder="Create a secure password" />
                 </div>
              </div>

              <div className="p-4 bg-surface-50 border border-surface-200 rounded-xl">
                 <div className="flex items-center gap-2 mb-2">
                    <input type="checkbox" className="w-4 h-4 rounded bg-surface-100 border-surface-200 text-primary" />
                    <span className="text-xs text-white font-medium">I agree to the MRODirect Master Service Agreement</span>
                 </div>
                 <p className="text-[10px] text-surface-400 ml-6">
                   Your data will be processed according to our Privacy Policy. Enterprise accounts are subject to verification.
                 </p>
              </div>

              <Link to="/dashboard" className="btn btn-primary w-full flex items-center justify-center gap-2 group py-4 text-lg">
                 Create Your Platform Account <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
           </form>

           <div className="mt-8 pt-8 border-t border-surface-200">
              <p className="text-sm text-surface-400 text-center">
                 Already have an account? <Link to="/login" className="text-primary font-bold hover:underline">Sign in here</Link>
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
