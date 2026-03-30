import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, Mail, Lock, ArrowRight, User } from 'lucide-react';
import { useAuth } from '@/hooks';
import { toast } from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ id: '1', email, name: 'Executive Chef', role: 'buyer', company: 'Hospitality Group X' });
    toast.success('Welcome back to FoodOps');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4 relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(22,163,74,0.05),transparent_50%)]" />
      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-16">
          <Link to="/" className="inline-flex items-center gap-4 mb-10">
            <div className="w-16 h-16 bg-primary rounded-[1.5rem] flex items-center justify-center shadow-[0_0_40px_rgba(22,163,74,0.3)]">
              <Leaf className="w-8 h-8 text-white" />
            </div>
            <span className="font-display font-black text-5xl text-white tracking-tighter uppercase">FoodOps</span>
          </Link>
          <h1 className="text-xl font-display font-bold text-white tracking-[0.3em] uppercase">Enterprise Portal</h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-surface-50 border border-surface-200 rounded-[3rem] p-12 space-y-10">
          <div className="space-y-4">
            <label className="block text-[10px] font-mono font-black text-primary uppercase tracking-[0.4em]">Corporate Identifier</label>
            <div className="relative">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
              <input type="email" required className="w-full bg-surface border border-surface-200 rounded-2xl pl-16 pr-5 py-6 text-white outline-none focus:border-primary transition-all text-lg font-mono" placeholder="chef@group.com" />
            </div>
          </div>
          <div className="space-y-4">
            <label className="block text-[10px] font-mono font-black text-primary uppercase tracking-[0.4em]">Access Token</label>
            <div className="relative">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
              <input type="password" required className="w-full bg-surface border border-surface-200 rounded-2xl pl-16 pr-5 py-6 text-white outline-none focus:border-primary transition-all text-lg font-mono" placeholder="••••••••" />
            </div>
          </div>
          <button className="w-full py-6 bg-primary text-white font-black rounded-2xl hover:shadow-[0_0_50px_rgba(22,163,74,0.4)] transition-all flex items-center justify-center gap-4 uppercase tracking-[0.2em]">
            Enter Operations <ArrowRight className="w-6 h-6" />
          </button>
          <div className="text-center pt-4">
            <Link to="/register" className="text-xs text-surface-400 hover:text-white transition-colors uppercase tracking-widest font-black">
              New to Network? <span className="text-primary">Apply for Access</span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
