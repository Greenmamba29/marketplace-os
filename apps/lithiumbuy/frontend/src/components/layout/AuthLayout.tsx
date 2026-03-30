import { Outlet } from 'react-router-dom';
import { Atom } from 'lucide-react';

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
            <Atom className="w-7 h-7 text-white" />
          </div>
          <span className="text-2xl font-bold text-white">LithiumBuy</span>
        </div>
        
        {/* Auth Content */}
        <div className="card p-8">
          <Outlet />
        </div>
        
        {/* Footer */}
        <p className="text-center text-slate-500 text-sm mt-6">
          © 2024 LithiumBuy. All rights reserved.
        </p>
      </div>
    </div>
  );
}
