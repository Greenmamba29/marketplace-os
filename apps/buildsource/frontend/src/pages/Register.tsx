import React from 'react';
import { Link } from 'react-router-dom';
import { HardHat } from 'lucide-react';

const Register: React.FC = () => {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center">
       <div className="w-full max-w-md p-8 glass border border-surface-200 rounded-[32px]">
          <div className="text-center mb-8">
             <HardHat className="w-12 h-12 text-primary mx-auto mb-4" />
             <h1 className="text-2xl font-display font-bold text-white">Join BuildSource</h1>
          </div>
          <div className="space-y-6">
             <input type="text" placeholder="Full Name" className="w-full" />
             <input type="text" placeholder="Company Name" className="w-full" />
             <input type="email" placeholder="Work Email" className="w-full" />
             <input type="password" placeholder="Password" className="w-full" />
             <Link to="/dashboard" className="btn btn-primary w-full py-4 font-bold">Create Account</Link>
          </div>
       </div>
    </div>
  );
};

export default Register;
