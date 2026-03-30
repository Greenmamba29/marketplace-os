import { ShieldCheck, Users, Package, FileText, Activity, Search, Filter, Truck, LayoutDashboard } from 'lucide-react';

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-surface pt-32 pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 mb-20">
          <div>
            <p className="text-xs font-mono font-black text-primary uppercase tracking-[0.5em] mb-4">System Console</p>
            <h1 className="text-6xl font-display font-black text-white uppercase tracking-tighter">DISTRO ADMIN</h1>
          </div>
          <button className="px-10 py-4 bg-primary text-white font-black rounded-xl text-xs uppercase tracking-widest hover:shadow-[0_0_30px_rgba(22,163,74,0.3)] transition-all">Network Status: Online</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-20">
          <div className="bg-surface-50 border border-surface-200 rounded-[2.5rem] p-10">
            <p className="text-[10px] font-mono uppercase text-surface-400 font-black mb-4 tracking-widest">Network Throughput</p>
            <p className="text-4xl font-mono font-black text-white">$142M</p>
          </div>
          <div className="bg-surface-50 border border-surface-200 rounded-[2.5rem] p-10">
            <p className="text-[10px] font-mono uppercase text-surface-400 font-black mb-4 tracking-widest">Active Fleet</p>
            <p className="text-4xl font-mono font-black text-white">4,280</p>
          </div>
          <div className="bg-surface-50 border border-surface-200 rounded-[2.5rem] p-10">
            <p className="text-[10px] font-mono uppercase text-surface-400 font-black mb-4 tracking-widest">Incident Alerts</p>
            <p className="text-4xl font-mono font-black text-red-500">2</p>
          </div>
          <div className="bg-surface-50 border border-surface-200 rounded-[2.5rem] p-10">
            <p className="text-[10px] font-mono uppercase text-surface-400 font-black mb-4 tracking-widest">Avg Fulfillment</p>
            <p className="text-4xl font-mono font-black text-green-500">99.8%</p>
          </div>
        </div>

        <div className="bg-surface-50 border border-surface-200 rounded-[3rem] overflow-hidden">
          <div className="p-10 border-b border-surface-200 flex justify-between items-center">
            <h3 className="text-2xl font-display font-bold text-white uppercase tracking-tight">LOGISTICS EVENT LOG</h3>
            <div className="flex gap-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                <input type="text" placeholder="Filter stream..." className="pl-10 pr-5 py-3 bg-surface border border-surface-200 rounded-xl text-xs outline-none focus:border-primary" />
              </div>
            </div>
          </div>
          <div className="divide-y divide-surface-200">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="p-8 flex items-center justify-between hover:bg-surface-100 transition-all group cursor-pointer">
                <div className="flex items-center gap-8">
                  <div className="w-12 h-12 bg-surface-200 rounded-2xl flex items-center justify-center text-surface-400 group-hover:text-primary transition-colors">
                    <Truck className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-white uppercase tracking-tight">Fleet Alert: Transit Delay (Route #{420+i})</p>
                    <p className="text-xs font-mono text-surface-400 uppercase tracking-widest mt-1">Chicago DC → Regional Hub-B • Cold Chain Intact</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-mono text-surface-400 font-black mb-1">PROCESSED AT 14:2{i} UTC</p>
                  <span className="text-[10px] font-mono font-black text-primary underline uppercase tracking-widest">Manage Routing</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
