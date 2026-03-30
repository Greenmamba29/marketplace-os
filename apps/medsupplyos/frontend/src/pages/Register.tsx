import React from 'react';
import { Link } from 'react-router-dom';

const Register: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-surface">
     <div className="glass border border-surface-200 p-10 rounded-[40px] w-full max-w-md">
        <h1 className="text-2xl font-display font-bold text-white mb-8 text-center">Institutional Registration</h1>
        <div className="space-y-4">
           <input type="text" placeholder="Full Name" className="w-full" />
           <input type="text" placeholder="Healthcare Facility" className="w-full" />
           <input type="email" placeholder="Work Email" className="w-full" />
           <Link to="/dashboard" className="btn btn-primary w-full py-4">Register Facility</Link>
        </div>
     </div>
  </div>
);

export default Register;
