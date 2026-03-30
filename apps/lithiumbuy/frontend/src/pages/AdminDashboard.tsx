import { ShieldCheck, Users, Package, FileText, Activity, Search, BarChart3, Globe } from 'lucide-react';

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-surface pt-24 pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-16">
          <div>
            <h1 className="text-5xl font-display font-black text-white mb-2 uppercase tracking-tighter">MARKET ADMIN</h1>
            <p className="text-surface-400">Overseeing global lithium materials trade flows</p>
          </div>
          <button className="px-8 py-3 bg-primary text-white font-black rounded-xl text-xs uppercase tracking-widest">Network Config</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-16">
          <div className="bg-surface-50 border border-surface-200 rounded-3xl p-8">
            <p className="text-[10px] font-mono uppercase text-surface-400 font-black mb-4 tracking-widest">Trade Velocity</p>
            <p className="text-4xl font-mono font-black text-white">84/day</p>
          </div>
          <div className="bg-surface-50 border border-surface-200 rounded-3xl p-8">
            <p className="text-[10px] font-mono uppercase text-surface-400 font-black mb-4 tracking-widest">Escrow Volume</p>
            <p className="text-4xl font-mono font-black text-white">$12.4M</p>
          </div>
          <div className="bg-surface-50 border border-surface-200 rounded-3xl p-8">
            <p className="text-[10px] font-mono uppercase text-surface-400 font-black mb-4 tracking-widest">Mine Audits</p>
            <p className="text-4xl font-mono font-black text-primary">12 Active</p>
          </div>
          <div className="bg-surface-50 border border-surface-200 rounded-3xl p-8">
            <p className="text-[10px] font-mono uppercase text-surface-400 font-black mb-4 tracking-widest">System Health</p>
            <p className="text-4xl font-mono font-black text-green-500">NOMINAL</p>
          </div>
        </div>

        <div className="bg-surface-50 border border-surface-200 rounded-[2.5rem] overflow-hidden">
          <div className="p-8 border-b border-surface-200 flex justify-between items-center">
            <h3 className="text-xl font-display font-bold text-white uppercase tracking-tight">GLOBAL TRADE STREAM</h3>
            <Activity className="w-6 h-6 text-primary animate-pulse" />
          </div>
          <div className="divide-y divide-surface-200">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="p-6 flex items-center justify-between hover:bg-surface-100 transition-all cursor-pointer group">
                <div className="flex items-center gap-6">
                  <div className="w-10 h-10 bg-surface-200 rounded-xl flex items-center justify-center text-surface-400 group-hover:text-primary">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white uppercase">New Position Opened: MT-{800+i}</p>
                    <p className="text-[10px] font-mono text-surface-400 uppercase tracking-widest">Li Carbonate • Chile Source • 250 MT Target</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-mono text-surface-400 font-black mb-1">LATENCY: 14ms</p>
                  <span className="text-[10px] font-mono font-black text-primary underline">VIEW DETAILS</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
