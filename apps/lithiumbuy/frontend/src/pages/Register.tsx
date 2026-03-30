import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Hexagon, Mail, Lock, ArrowRight, User, Building2, Globe } from 'lucide-react';
import { useAuth } from '@/hooks';
import { toast } from 'react-hot-toast';

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ id: '1', email: '', name: 'Participant', role: 'buyer' });
    toast.success('Registration Complete');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4 py-20 relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(124,58,237,0.08),transparent_50%)]" />
      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-3 mb-6">
            <Hexagon className="w-10 h-10 text-primary" />
            <span className="font-display font-black text-3xl text-white tracking-tighter">LithiumBuy</span>
          </Link>
          <h1 className="text-2xl font-display font-bold text-white uppercase tracking-widest">HUB REGISTRATION</h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-surface-50 border border-surface-200 rounded-[2.5rem] p-10 space-y-6">
          <div className="space-y-4">
            <label className="block text-[10px] font-mono font-black text-primary uppercase tracking-widest">Legal Entity Name</label>
            <div className="relative">
              <Building2 className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
              <input type="text" required className="w-full bg-surface border border-surface-200 rounded-2xl pl-14 pr-5 py-5 text-white outline-none focus:border-primary transition-all text-sm" placeholder="Lithium Processing Ltd" />
            </div>
          </div>
          <div className="space-y-4">
            <label className="block text-[10px] font-mono font-black text-primary uppercase tracking-widest">Company Jurisdiction</label>
            <div className="relative">
              <Globe className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
              <input type="text" required className="w-full bg-surface border border-surface-200 rounded-2xl pl-14 pr-5 py-5 text-white outline-none focus:border-primary transition-all text-sm" placeholder="Singapore" />
            </div>
          </div>
          <div className="space-y-4">
            <label className="block text-[10px] font-mono font-black text-primary uppercase tracking-widest">Email Contact</label>
            <div className="relative">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
              <input type="email" required className="w-full bg-surface border border-surface-200 rounded-2xl pl-14 pr-5 py-5 text-white outline-none focus:border-primary transition-all text-sm" placeholder="admin@entity.com" />
            </div>
          </div>
          <div className="space-y-4">
            <label className="block text-[10px] font-mono font-black text-primary uppercase tracking-widest">Security Pin</label>
            <div className="relative">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
              <input type="password" required className="w-full bg-surface border border-surface-200 rounded-2xl pl-14 pr-5 py-5 text-white outline-none focus:border-primary transition-all text-sm" placeholder="••••••••" />
            </div>
          </div>
          <button className="w-full py-5 bg-primary text-white font-black rounded-2xl hover:shadow-[0_0_40px_rgba(124,58,237,0.5)] transition-all flex items-center justify-center gap-3 uppercase tracking-widest mt-4">
            Request Admission <ArrowRight className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
