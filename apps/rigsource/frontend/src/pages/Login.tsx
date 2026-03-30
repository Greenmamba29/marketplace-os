import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Wrench, ArrowRight } from 'lucide-react';
import { useAuth } from '../hooks';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login({ id: '1', name: 'Demo User', email: 'demo@rigsource.com', role: 'buyer' }, 'fake-token');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-surface">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <Link to="/" className="inline-flex items-center gap-2 mb-8">
            <Wrench className="w-10 h-10 text-primary" />
            <span className="text-2xl font-black font-display tracking-tight">RigSource</span>
          </Link>
          <h1 className="text-3xl font-bold font-display">Welcome Back</h1>
          <p className="text-surface-400 mt-2">Login to manage your equipment sourcing.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6 bg-surface-50 p-8 rounded-3xl border border-surface-100">
          <div>
            <label className="block text-sm font-medium text-surface-400 mb-2">Work Email</label>
            <input type="email" placeholder="you@company.com" className="w-full" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-400 mb-2">Password</label>
            <input type="password" placeholder="••••••••" className="w-full" required />
          </div>
          <button type="submit" className="btn btn-primary w-full py-4 text-lg">
            Sign In <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        <p className="text-center mt-8 text-surface-400">
          New to RigSource? <Link to="/register" className="text-primary font-bold">Create an account</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
