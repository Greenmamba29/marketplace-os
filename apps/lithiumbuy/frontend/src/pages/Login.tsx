import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Hexagon, Mail, Lock, ArrowRight, Activity } from 'lucide-react';
import { useAuth } from '@/hooks';
import { toast } from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ id: '1', email, name: 'Market Participant', role: 'buyer', company: 'Global Materials Group' });
    toast.success('Market Access Granted');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4 relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(124,58,237,0.08),transparent_50%)]" />
      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-12">
          <Link to="/" className="inline-flex items-center gap-3 mb-8">
            <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(124,58,237,0.4)]">
              <Hexagon className="w-8 h-8 text-white" />
            </div>
            <span className="font-display font-black text-4xl text-white tracking-tighter">LithiumBuy</span>
          </Link>
          <h1 className="text-2xl font-display font-bold text-white tracking-widest uppercase">Member Login</h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-surface-50 border border-surface-200 rounded-[2rem] p-10 space-y-8">
          <div className="space-y-4">
            <label className="block text-[10px] font-mono font-black text-primary uppercase tracking-[0.3em]">Corporate ID</label>
            <div className="relative">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
              <input 
                type="email" required
                className="w-full bg-surface border border-surface-200 rounded-2xl pl-14 pr-5 py-5 text-white focus:border-primary outline-none transition-all"
                placeholder="trade@corporation.com"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <label className="block text-[10px] font-mono font-black text-primary uppercase tracking-[0.3em]">Access Key</label>
            <div className="relative">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
              <input 
                type="password" required
                className="w-full bg-surface border border-surface-200 rounded-2xl pl-14 pr-5 py-5 text-white focus:border-primary outline-none transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button className="w-full py-5 bg-primary text-white font-black rounded-2xl hover:shadow-[0_0_40px_rgba(124,58,237,0.5)] transition-all flex items-center justify-center gap-3 uppercase tracking-widest">
            Grant Access <ArrowRight className="w-5 h-5" />
          </button>

          <div className="text-center pt-6">
            <Link to="/register" className="text-xs text-surface-400 hover:text-white transition-colors uppercase tracking-widest">
              New Participant? <span className="text-primary font-bold">Register for Hub</span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
