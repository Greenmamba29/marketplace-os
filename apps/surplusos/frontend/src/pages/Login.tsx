import React from 'react';
import { Link } from 'react-router-dom';
import { Tag } from 'lucide-react';
const Login = () => (
  <div className="min-h-screen flex items-center justify-center p-4">
    <div className="w-full max-w-sm">
      <div className="text-center mb-12">
        <Tag className="w-12 h-12 text-primary mx-auto mb-4" />
        <h1 className="text-3xl font-black font-display uppercase italic tracking-tighter">Login to SurplusOS</h1>
      </div>
      <div className="bg-surface-50 p-8 rounded-[2rem] border border-surface-100 space-y-4">
        <input className="w-full bg-surface-100 p-4 rounded-xl" placeholder="Email" />
        <input className="w-full bg-surface-100 p-4 rounded-xl" placeholder="Password" type="password" />
        <Link to="/dashboard" className="btn btn-primary w-full py-4 uppercase italic font-black">Sign In</Link>
      </div>
    </div>
  </div>
);
export default Login;
