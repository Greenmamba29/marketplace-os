import { useAuth } from '@/hooks';
import { LayoutDashboard, Package, Clock, ShieldCheck, Activity, BarChart3, TrendingUp, ChevronRight, Hexagon, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function BuyerDashboard() {
  const { user } = useAuth();

  const activePositions = [
    { id: 'TRD-9921', name: 'Lithium Carbonate', qty: '120 MT', status: 'QUOTING', date: 'Mar 24' },
    { id: 'TRD-8402', name: 'Spodumene SC6', qty: '500 MT', status: 'CONTRACT', date: 'Mar 18' },
  ];

  return (
    <div className="min-h-screen bg-surface pt-24 pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-16">
          <div>
            <h1 className="text-5xl font-display font-black text-white mb-2 uppercase tracking-tighter">TRADING HUB</h1>
            <p className="text-surface-400">Trading as: <span className="text-white font-bold">{user?.company || 'Global Battery Group'}</span></p>
          </div>
          <button className="p-4 bg-surface-50 border border-surface-200 rounded-2xl text-primary relative">
            <Bell className="w-6 h-6" />
            <span className="absolute top-3 right-3 w-3 h-3 bg-red-500 rounded-full border-2 border-surface-50" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
          <div className="bg-surface-50 border border-surface-200 rounded-3xl p-8 border-l-4 border-l-primary">
            <p className="text-[10px] font-mono uppercase text-surface-400 font-black mb-4 tracking-widest">Active Positions</p>
            <p className="text-4xl font-mono font-black text-white">4</p>
          </div>
          <div className="bg-surface-50 border border-surface-200 rounded-3xl p-8 border-l-4 border-l-green-500">
            <p className="text-[10px] font-mono uppercase text-surface-400 font-black mb-4 tracking-widest">Market Exposure</p>
            <p className="text-4xl font-mono font-black text-white">$2.4M</p>
          </div>
          <div className="bg-surface-50 border border-surface-200 rounded-3xl p-8 border-l-4 border-l-blue-500">
            <p className="text-[10px] font-mono uppercase text-surface-400 font-black mb-4 tracking-widest">Price Alerts</p>
            <p className="text-4xl font-mono font-black text-white">12</p>
          </div>
          <div className="bg-surface-50 border border-surface-200 rounded-3xl p-8 border-l-4 border-l-yellow-500">
            <p className="text-[10px] font-mono uppercase text-surface-400 font-black mb-4 tracking-widest">Trade History</p>
            <p className="text-4xl font-mono font-black text-white">45</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <h3 className="text-2xl font-display font-bold text-white flex items-center gap-3">
              <Activity className="w-6 h-6 text-primary" /> LIVE POSITIONS
            </h3>
            <div className="space-y-4">
              {activePositions.map((pos) => (
                <div key={pos.id} className="bg-surface-50 border border-surface-200 rounded-2xl p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 hover:border-primary/50 transition-all">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-surface-100 rounded-2xl flex items-center justify-center text-primary shadow-inner">
                      <Hexagon className="w-8 h-8" />
                    </div>
                    <div>
                      <p className="text-xl font-bold text-white">{pos.name}</p>
                      <p className="text-xs font-mono text-surface-400 uppercase tracking-widest mt-1">{pos.id} • {pos.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-12">
                    <div className="text-right">
                      <p className="text-[10px] font-mono uppercase text-surface-400 font-black mb-1">Volume</p>
                      <p className="text-lg font-mono text-white font-bold">{pos.qty}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-mono uppercase text-surface-400 font-black mb-1">Status</p>
                      <span className={`text-[10px] font-mono font-black px-3 py-1 rounded-full border ${pos.status === 'QUOTING' ? 'text-primary border-primary bg-primary/5' : 'text-green-500 border-green-500 bg-green-500/5'}`}>
                        {pos.status}
                      </span>
                    </div>
                    <button className="p-3 bg-surface-100 border border-surface-200 rounded-xl hover:text-primary">
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface-50 border border-surface-200 rounded-[2rem] p-8">
            <h3 className="text-xl font-display font-bold text-white mb-8">MARKET WATCH</h3>
            <div className="space-y-8">
              {[
                { label: 'Battery Grade Index', val: '+2.1%', up: true },
                { label: 'Global Inventory', val: '-0.8%', up: false },
                { label: 'Mining Output', val: '+4.5%', up: true }
              ].map((watch, i) => (
                <div key={i} className="flex justify-between items-center">
                  <span className="text-xs font-bold text-surface-400 uppercase tracking-widest">{watch.label}</span>
                  <span className={`text-sm font-mono font-black ${watch.up ? 'text-green-500' : 'text-red-500'}`}>{watch.val}</span>
                </div>
              ))}
              <div className="pt-8 border-t border-surface-200">
                <button className="w-full py-4 bg-surface-100 border border-surface-200 rounded-2xl text-xs font-black uppercase tracking-[0.2em] text-white hover:bg-surface-200 transition-all">
                  VIEW FULL ANALYTICS
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
