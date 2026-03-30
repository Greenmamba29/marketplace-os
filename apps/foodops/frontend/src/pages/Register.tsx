import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, Mail, Lock, ArrowRight, User, Building2, Globe, Truck } from 'lucide-react';
import { useAuth } from '@/hooks';
import { toast } from 'react-hot-toast';

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ id: '1', email: '', name: 'Operator', role: 'buyer' });
    toast.success('Registration Transmitted');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4 py-32 relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(22,163,74,0.05),transparent_50%)]" />
      <div className="max-w-lg w-full relative z-10">
        <div className="text-center mb-12">
          <Link to="/" className="inline-flex items-center gap-4 mb-8">
            <Leaf className="w-10 h-10 text-primary" />
            <span className="font-display font-black text-4xl text-white tracking-tighter uppercase">FoodOps</span>
          </Link>
          <h1 className="text-xl font-display font-bold text-white uppercase tracking-[0.4em]">Network Application</h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-surface-50 border border-surface-200 rounded-[3rem] p-12 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="block text-[10px] font-mono font-black text-primary uppercase tracking-widest">Operating Name</label>
              <div className="relative">
                <Building2 className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
                <input type="text" required className="w-full bg-surface border border-surface-200 rounded-2xl pl-14 pr-5 py-5 text-white outline-none focus:border-primary transition-all text-sm" placeholder="Global Dining Inc" />
              </div>
            </div>
            <div className="space-y-4">
              <label className="block text-[10px] font-mono font-black text-primary uppercase tracking-widest">Business License</label>
              <div className="relative">
                <Globe className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
                <input type="text" required className="w-full bg-surface border border-surface-200 rounded-2xl pl-14 pr-5 py-5 text-white outline-none focus:border-primary transition-all text-sm" placeholder="LIC-99210" />
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <label className="block text-[10px] font-mono font-black text-primary uppercase tracking-widest">Operational Email</label>
            <div className="relative">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
              <input type="email" required className="w-full bg-surface border border-surface-200 rounded-2xl pl-14 pr-5 py-5 text-white outline-none focus:border-primary transition-all text-sm" placeholder="ops@entity.com" />
            </div>
          </div>
          <div className="space-y-4">
            <label className="block text-[10px] font-mono font-black text-primary uppercase tracking-widest">Fleet Capability</label>
            <select className="w-full bg-surface border border-surface-200 rounded-2xl p-5 text-white outline-none focus:border-primary text-sm appearance-none font-bold">
              <option>Standard Distribution</option>
              <option>Cold Chain (IoT Enabled)</option>
              <option>Last Mile Specialty</option>
            </select>
          </div>
          <button className="w-full py-6 bg-primary text-white font-black rounded-2xl hover:shadow-[0_0_50px_rgba(22,163,74,0.5)] transition-all flex items-center justify-center gap-4 uppercase tracking-[0.2em] mt-4">
            Apply for Admission <ArrowRight className="w-6 h-6" />
          </button>
        </form>
      </div>
    </div>
  );
}
