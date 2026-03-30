import { Link, useNavigate } from 'react-router-dom';
import { Sprout, Mail, Lock, ArrowRight } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <Sprout className="w-6 h-6 text-white" />
            </div>
            <span className="font-display font-bold text-2xl text-white">AgroOps</span>
          </Link>
          <h1 className="text-3xl font-display font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-surface-400">Sign in to manage your agricultural sourcing.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-surface-400 ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
              <input type="email" required className="w-full pl-12 pr-4 py-3" placeholder="farmer@farm.com" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-surface-400 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
              <input type="password" required className="w-full pl-12 pr-4 py-3" placeholder="••••••••" />
            </div>
          </div>

          <button type="submit" className="btn-primary w-full py-4 text-lg">
            Sign In
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        <p className="mt-8 text-center text-surface-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary hover:text-primary-400 font-medium">Create one for free</Link>
        </p>
      </div>
    </div>
  );
}
