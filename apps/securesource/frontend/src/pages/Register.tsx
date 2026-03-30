import React from 'react';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';
const Register = () => (
  <div className="min-h-screen flex items-center justify-center p-4">
    <div className="w-full max-w-sm text-center">
      <Shield className="w-16 h-16 text-primary mx-auto mb-10" />
      <h1 className="text-4xl font-black font-display uppercase italic tracking-tighter mb-10 text-white">Join SecureSource</h1>
      <div className="bg-surface-50 p-12 rounded-[3rem] border border-surface-100 space-y-4">
        <input className="w-full bg-surface-100 p-5 rounded-2xl border border-surface-200 font-bold" placeholder="Full Name" />
        <input className="w-full bg-surface-100 p-5 rounded-2xl border border-surface-200 font-bold" placeholder="Company" />
        <input className="w-full bg-surface-100 p-5 rounded-2xl border border-surface-200 font-bold" placeholder="Work Email" />
        <input className="w-full bg-surface-100 p-5 rounded-2xl border border-surface-200 font-bold" placeholder="Password" type="password" />
        <Link to="/login" className="btn btn-primary w-full py-5 uppercase italic font-black text-xl">Create Identity</Link>
      </div>
    </div>
  </div>
);
export default Register;
