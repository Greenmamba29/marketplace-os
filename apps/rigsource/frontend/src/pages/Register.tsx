import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Wrench, ArrowRight } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-surface">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <Link to="/" className="inline-flex items-center gap-2 mb-8">
            <Wrench className="w-10 h-10 text-primary" />
            <span className="text-2xl font-black font-display tracking-tight">RigSource</span>
          </Link>
          <h1 className="text-3xl font-bold font-display">Join RigSource</h1>
          <p className="text-surface-400 mt-2">Access global inventory and certified dealers.</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4 bg-surface-50 p-8 rounded-3xl border border-surface-100">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-surface-400 mb-2">First Name</label>
              <input placeholder="John" className="w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-400 mb-2">Last Name</label>
              <input placeholder="Doe" className="w-full" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-400 mb-2">Company Name</label>
            <input placeholder="Global Mining Co." className="w-full" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-400 mb-2">Email</label>
            <input type="email" placeholder="you@company.com" className="w-full" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-400 mb-2">Password</label>
            <input type="password" placeholder="••••••••" className="w-full" required />
          </div>
          <button type="submit" className="btn btn-primary w-full py-4 text-lg mt-4">
            Create Account <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        <p className="text-center mt-8 text-surface-400">
          Already have an account? <Link to="/login" className="text-primary font-bold">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
