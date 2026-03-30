import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, Mail, Lock, ArrowRight, User } from 'lucide-react';
import { useAuth } from '@/hooks';
import { toast } from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login
    login({ id: '1', email, name: 'John Doe', role: 'buyer', company: 'Volt Energy Corp' });
    toast.success('Welcome to VoltSource');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(234,179,8,0.05),transparent_50%)]" />
      
      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-12">
          <Link to="/" className="inline-flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <Zap className="w-7 h-7 text-black fill-black" />
            </div>
            <span className="font-display font-black text-3xl text-white tracking-tighter">VoltSource</span>
          </Link>
          <h1 className="text-2xl font-display font-bold text-white">ENTERPRISE LOGIN</h1>
          <p className="text-surface-400 mt-2">Access the global energy supply chain</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-surface-50 border border-surface-200 rounded-2xl p-8 space-y-6">
          <div>
            <label className="block text-[10px] font-mono font-black text-primary uppercase tracking-widest mb-2">Corporate Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
              <input 
                type="email" 
                required
                className="w-full bg-surface border border-surface-200 rounded-xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-primary transition-all"
                placeholder="procurement@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-[10px] font-mono font-black text-primary uppercase tracking-widest mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
              <input 
                type="password" 
                required
                className="w-full bg-surface border border-surface-200 rounded-xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-primary transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button className="w-full py-4 bg-primary text-black font-black rounded-xl hover:bg-primary-400 transition-all flex items-center justify-center gap-2">
            SIGN IN <ArrowRight className="w-5 h-5" />
          </button>

          <div className="text-center pt-4">
            <Link to="/register" className="text-sm text-surface-400 hover:text-white transition-colors">
              New to VoltSource? <span className="text-primary font-bold">Apply for Account</span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
