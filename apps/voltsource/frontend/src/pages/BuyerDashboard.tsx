import { useAuth, useRFQs } from '@/hooks';
import { LayoutDashboard, Package, Clock, ShieldCheck, Activity, BarChart3, TrendingUp, ChevronRight, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function BuyerDashboard() {
  const { user } = useAuth();
  const { data: rfqs } = useRFQs(user?.id || '1');

  const stats = [
    { label: 'Active Quotes', value: '12', icon: Activity, color: 'text-primary' },
    { label: 'Energy Projects', value: '4', icon: Zap, color: 'text-yellow-500' },
    { label: 'Verified Suppliers', value: '28', icon: ShieldCheck, color: 'text-green-500' },
    { label: 'Total Sourced', value: '$840k', icon: BarChart3, color: 'text-blue-500' },
  ];

  return (
    <div className="min-h-screen bg-surface pt-24 pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-4xl font-display font-black text-white mb-2 uppercase tracking-tighter">BUYER DASHBOARD</h1>
          <p className="text-surface-400">Welcome back, {user?.name || 'Energy Procurement Manager'}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="bg-surface-50 border border-surface-200 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2 bg-surface-100 rounded-lg ${stat.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <TrendingUp className="w-4 h-4 text-green-500" />
                </div>
                <p className="text-2xl font-mono font-black text-white">{stat.value}</p>
                <p className="text-[10px] font-mono uppercase tracking-widest text-surface-400 font-bold">{stat.label}</p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Active RFQs */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-display font-bold text-white flex items-center gap-2">
                <Package className="w-5 h-5 text-primary" /> RECENT RFQs
              </h3>
              <Link to="/rfq" className="text-xs text-primary font-bold hover:underline">NEW REQUEST +</Link>
            </div>
            
            <div className="space-y-4">
              {rfqs?.map((rfq) => (
                <div key={rfq.id} className="bg-surface-50 border border-surface-200 rounded-xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:border-primary/30 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-surface-100 rounded-xl flex items-center justify-center text-primary">
                      <Zap className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white uppercase">{rfq.projectType} Infrastructure</p>
                      <p className="text-[10px] font-mono text-surface-400">{rfq.id} • {new Date(rfq.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="text-right hidden md:block">
                      <p className="text-[10px] font-mono uppercase text-surface-400 font-bold">Status</p>
                      <span className="inline-flex items-center gap-1 text-xs text-yellow-500 font-bold px-2 py-0.5 bg-yellow-500/10 rounded-full border border-yellow-500/20">
                        <Clock className="w-3 h-3" /> PENDING
                      </span>
                    </div>
                    <button className="p-2 bg-surface-100 border border-surface-200 rounded-lg hover:text-primary transition-colors">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Supplier Alerts / Sidebar */}
          <div className="space-y-8">
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-8">
              <h4 className="text-sm font-display font-bold text-white mb-4">SUPPLIER NETWORK</h4>
              <p className="text-xs text-surface-400 mb-6 leading-relaxed">
                You are currently connected to 28 verified manufacturers in the VoltSource ecosystem.
              </p>
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-surface-200 rounded-full border border-surface-300" />
                    <div className="flex-grow">
                      <div className="h-2 w-24 bg-surface-200 rounded mb-1" />
                      <div className="h-1.5 w-16 bg-surface-300 rounded" />
                    </div>
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-surface-50 border border-surface-200 rounded-2xl p-8">
              <h4 className="text-sm font-display font-bold text-white mb-4">MARKET INTELLIGENCE</h4>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-[10px] text-surface-400 font-bold uppercase">Lithium Price Index</span>
                    <span className="text-[10px] text-red-500 font-bold">+2.4%</span>
                  </div>
                  <div className="h-1 bg-surface-200 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500 w-3/4" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-[10px] text-surface-400 font-bold uppercase">EV Motor Demand</span>
                    <span className="text-[10px] text-green-500 font-bold">+12.8%</span>
                  </div>
                  <div className="h-1 bg-surface-200 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 w-1/2" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
