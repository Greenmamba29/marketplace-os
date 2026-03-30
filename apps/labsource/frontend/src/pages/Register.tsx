import { Link, useNavigate } from 'react-router-dom';
import { Beaker, Mail, Lock, Building2, ArrowRight } from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4 py-20">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <Beaker className="w-6 h-6 text-white" />
            </div>
            <span className="font-display font-bold text-2xl text-white">LabSource</span>
          </Link>
          <h1 className="text-3xl font-display font-bold text-white mb-2">Register Institution</h1>
          <p className="text-surface-400">Join 1.2K+ research institutions sourcing smarter.</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-surface-400 ml-1">First Name</label>
              <input type="text" required className="w-full" placeholder="Alice" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-surface-400 ml-1">Last Name</label>
              <input type="text" required className="w-full" placeholder="Smith" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-surface-400 ml-1">Institution Name</label>
            <div className="relative">
              <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
              <input type="text" required className="w-full pl-12" placeholder="University of Science" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-surface-400 ml-1">Work Email (.edu / .org)</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
              <input type="email" required className="w-full pl-12 pr-4" placeholder="alice@university.edu" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-surface-400 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
              <input type="password" required className="w-full pl-12" placeholder="••••••••" />
            </div>
          </div>

          <button type="submit" className="btn-primary w-full py-4 text-lg">
            Create Institution Account
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        <p className="mt-8 text-center text-surface-400">
          Already registered?{' '}
          <Link to="/login" className="text-primary hover:text-primary-400 font-medium">Log In</Link>
        </p>
      </div>
    </div>
  );
}
