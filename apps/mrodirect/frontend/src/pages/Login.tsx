import React from 'react';
import { Link } from 'react-router-dom';
import { Package, ArrowRight, ShieldCheck, Mail, Lock } from 'lucide-react';

const Login: React.FC = () => {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-surface to-surface z-0" />
      
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
           <Link to="/" className="inline-flex items-center gap-2 mb-8">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                 <Package className="text-white w-6 h-6" />
              </div>
              <span className="text-2xl font-display font-bold text-white tracking-tight italic">MRODirect</span>
           </Link>
           <h1 className="text-3xl font-display font-bold text-white mb-2">Welcome Back</h1>
           <p className="text-surface-400">Access the industrial marketplace OS</p>
        </div>

        <div className="glass border border-surface-200 rounded-3xl p-8">
           <form className="space-y-6">
              <div className="space-y-2">
                 <label className="text-sm font-medium text-surface-400">Work Email</label>
                 <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 w-5 h-5" />
                    <input 
                      type="email" 
                      className="w-full pl-12" 
                      placeholder="name@company.com" 
                    />
                 </div>
              </div>

              <div className="space-y-2">
                 <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-surface-400">Password</label>
                    <a href="#" className="text-xs text-primary hover:underline">Forgot password?</a>
                 </div>
                 <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 w-5 h-5" />
                    <input 
                      type="password" 
                      className="w-full pl-12" 
                      placeholder="••••••••" 
                    />
                 </div>
              </div>

              <div className="flex items-center gap-2">
                 <input type="checkbox" className="w-4 h-4 rounded bg-surface-100 border-surface-200 text-primary" />
                 <span className="text-xs text-surface-400">Remember this device for 30 days</span>
              </div>

              <Link to="/dashboard" className="btn btn-primary w-full flex items-center justify-center gap-2 group">
                 Sign In to Platform <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
           </form>

           <div className="mt-8 pt-8 border-t border-surface-200">
              <p className="text-sm text-surface-400 text-center">
                 New to MRODirect? <Link to="/register" className="text-primary font-bold hover:underline">Create an account</Link>
              </p>
           </div>
        </div>

        <div className="mt-8 flex items-center justify-center gap-6 grayscale opacity-50">
           <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-white" />
              <span className="text-[10px] font-bold text-white uppercase tracking-widest">Enterprise Secure</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
