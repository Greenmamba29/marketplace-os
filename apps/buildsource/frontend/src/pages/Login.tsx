import React from 'react';
import { Link } from 'react-router-dom';
import { HardHat } from 'lucide-react';

const Login: React.FC = () => {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center">
       <div className="w-full max-w-md p-8 glass border border-surface-200 rounded-[32px]">
          <div className="text-center mb-8">
             <HardHat className="w-12 h-12 text-primary mx-auto mb-4" />
             <h1 className="text-2xl font-display font-bold text-white">BuildSource Sign In</h1>
          </div>
          <div className="space-y-6">
             <input type="email" placeholder="Work Email" className="w-full" />
             <input type="password" placeholder="Password" className="w-full" />
             <Link to="/dashboard" className="btn btn-primary w-full py-4 font-bold">Access Marketplace</Link>
          </div>
          <p className="text-center text-sm text-surface-400 mt-8">Don't have an account? <Link to="/register" className="text-primary font-bold">Register</Link></p>
       </div>
    </div>
  );
};

export default Login;
