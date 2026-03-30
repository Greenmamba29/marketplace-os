import React from 'react';
import { Link } from 'react-router-dom';
import { Activity } from 'lucide-react';

const Login: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-surface">
     <div className="glass border border-surface-200 p-10 rounded-[40px] w-full max-w-md text-center">
        <Activity className="w-12 h-12 text-primary mx-auto mb-6" />
        <h1 className="text-2xl font-display font-bold text-white mb-8">MedSupplyOS Portal</h1>
        <div className="space-y-4">
           <input type="email" placeholder="Institutional Email" className="w-full" />
           <input type="password" placeholder="Password" className="w-full" />
           <Link to="/dashboard" className="btn btn-primary w-full py-4">Sign In</Link>
        </div>
     </div>
  </div>
);

export default Login;
