import { Link, useNavigate } from 'react-router-dom';
import { Heart, Mail, Lock, Building2, ArrowRight } from 'lucide-react';

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
              <Heart className="w-6 h-6 text-white" />
            </div>
            <span className="font-display font-bold text-2xl text-white">CareOps</span>
          </Link>
          <h1 className="text-3xl font-display font-bold text-white mb-2">Agency Registration</h1>
          <p className="text-surface-400">Join the world's largest home care staffing network.</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-surface-400 ml-1">Admin First Name</label>
              <input type="text" required className="w-full" placeholder="Robert" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-surface-400 ml-1">Admin Last Name</label>
              <input type="text" required className="w-full" placeholder="Wilson" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-surface-400 ml-1">Home Care Agency Name</label>
            <div className="relative">
              <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
              <input type="text" required className="w-full pl-12" placeholder="Florida Home Care" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-surface-400 ml-1">Agency Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
              <input type="email" required className="w-full pl-12 pr-4" placeholder="admin@floridacare.com" />
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
            Create Agency Account
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        <p className="mt-8 text-center text-surface-400">
          Already an agency partner?{' '}
          <Link to="/login" className="text-primary hover:text-primary-400 font-medium">Log In</Link>
        </p>
      </div>
    </div>
  );
}
