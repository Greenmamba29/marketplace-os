import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, Mail, Lock, ArrowRight, User, Building2 } from 'lucide-react';
import { useAuth } from '@/hooks';
import { toast } from 'react-hot-toast';

export default function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', company: '', password: '' });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ id: '1', ...formData, role: 'buyer' });
    toast.success('Account Created! Welcome to the network.');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4 relative overflow-hidden py-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(234,179,8,0.05),transparent_50%)]" />
      
      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-black fill-black" />
            </div>
            <span className="font-display font-black text-2xl text-white tracking-tighter">VoltSource</span>
          </Link>
          <h1 className="text-2xl font-display font-bold text-white">NETWORK APPLICATION</h1>
          <p className="text-surface-400 mt-2 text-sm px-6">Join 45k+ professionals sourcing EV components globally.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-surface-50 border border-surface-200 rounded-2xl p-8 space-y-5">
          <div>
            <label className="block text-[10px] font-mono font-black text-primary uppercase tracking-widest mb-2">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
              <input 
                type="text" required
                className="w-full bg-surface border border-surface-200 rounded-xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-primary text-sm"
                placeholder="Alex Carter"
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono font-black text-primary uppercase tracking-widest mb-2">Company Name</label>
            <div className="relative">
              <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
              <input 
                type="text" required
                className="w-full bg-surface border border-surface-200 rounded-xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-primary text-sm"
                placeholder="Volt Energy Solutions"
                onChange={e => setFormData({...formData, company: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono font-black text-primary uppercase tracking-widest mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
              <input 
                type="email" required
                className="w-full bg-surface border border-surface-200 rounded-xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-primary text-sm"
                placeholder="alex@company.com"
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-[10px] font-mono font-black text-primary uppercase tracking-widest mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
              <input 
                type="password" required
                className="w-full bg-surface border border-surface-200 rounded-xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-primary text-sm"
                placeholder="••••••••"
                onChange={e => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>

          <button className="w-full py-4 bg-primary text-black font-black rounded-xl hover:bg-primary-400 transition-all flex items-center justify-center gap-2 mt-4">
            CREATE ACCOUNT <ArrowRight className="w-5 h-5" />
          </button>

          <div className="text-center pt-4">
            <Link to="/login" className="text-xs text-surface-400 hover:text-white">
              Already have an account? <span className="text-primary font-bold">Sign In</span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
