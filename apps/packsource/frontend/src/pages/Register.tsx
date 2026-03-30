import { Link, useNavigate } from 'react-router-dom';
import { Package, Mail, Lock, User, Building2, ArrowRight } from 'lucide-react';

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
              <Package className="w-6 h-6 text-white" />
            </div>
            <span className="font-display font-bold text-2xl text-white">PackSource</span>
          </Link>
          <h1 className="text-3xl font-display font-bold text-white mb-2">Create Account</h1>
          <p className="text-surface-400">Start sourcing packaging at scale today.</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-surface-400 ml-1">First Name</label>
              <input type="text" required className="w-full" placeholder="John" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-surface-400 ml-1">Last Name</label>
              <input type="text" required className="w-full" placeholder="Doe" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-surface-400 ml-1">Company Name</label>
            <div className="relative">
              <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
              <input type="text" required className="w-full pl-12" placeholder="Acme Corp" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-surface-400 ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
              <input type="email" required className="w-full pl-12 pr-4" placeholder="name@company.com" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-surface-400 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
              <input type="password" required className="w-full pl-12" placeholder="••••••••" />
            </div>
          </div>

          <div className="text-xs text-surface-400 px-1">
            By creating an account, you agree to our{' '}
            <a href="#" className="text-primary hover:underline">Terms of Service</a> and{' '}
            <a href="#" className="text-primary hover:underline">Privacy Policy</a>.
          </div>

          <button type="submit" className="btn-primary w-full py-4 text-lg">
            Create Account
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        <p className="mt-8 text-center text-surface-400">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:text-primary-400 font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
