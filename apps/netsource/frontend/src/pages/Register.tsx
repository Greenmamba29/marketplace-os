import React from 'react';
import { Link } from 'react-router-dom';
import { Network } from 'lucide-react';
const Register = () => (
  <div className="min-h-screen flex items-center justify-center p-4">
    <div className="w-full max-w-sm text-center">
      <Network className="w-16 h-16 text-primary mx-auto mb-8" />
      <h1 className="text-3xl font-black font-display uppercase italic tracking-tighter mb-8 text-white">Join NetSource</h1>
      <div className="bg-surface-50 p-10 rounded-[2.5rem] border border-surface-100 space-y-4">
        <input className="w-full bg-surface-100 p-4 rounded-xl border border-surface-200" placeholder="Full Name" />
        <input className="w-full bg-surface-100 p-4 rounded-xl border border-surface-200" placeholder="Company" />
        <input className="w-full bg-surface-100 p-4 rounded-xl border border-surface-200" placeholder="Email" />
        <input className="w-full bg-surface-100 p-4 rounded-xl border border-surface-200" placeholder="Password" type="password" />
        <Link to="/login" className="btn btn-primary w-full py-4 uppercase italic font-black text-lg">Create Account</Link>
      </div>
    </div>
  </div>
);
export default Register;
