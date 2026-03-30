import { ShieldCheck, Users, Package, FileText, Activity, Search, Filter } from 'lucide-react';

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-surface pt-24 pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-4xl font-display font-black text-white mb-2 uppercase tracking-tighter">NETWORK ADMIN</h1>
            <p className="text-surface-400">Managing 280+ verified manufacturers and enterprise buyers</p>
          </div>
          <div className="flex gap-4">
            <button className="px-6 py-2 bg-primary text-black font-bold rounded-lg text-sm">ADD SUPPLIER +</button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-surface-50 border border-surface-200 rounded-2xl p-6">
            <p className="text-[10px] font-mono uppercase text-surface-400 font-bold mb-4">Total Volume (GMV)</p>
            <p className="text-3xl font-mono font-black text-white">$42.8M</p>
          </div>
          <div className="bg-surface-50 border border-surface-200 rounded-2xl p-6">
            <p className="text-[10px] font-mono uppercase text-surface-400 font-bold mb-4">Active RFQs</p>
            <p className="text-3xl font-mono font-black text-white">1,240</p>
          </div>
          <div className="bg-surface-50 border border-surface-200 rounded-2xl p-6">
            <p className="text-[10px] font-mono uppercase text-surface-400 font-bold mb-4">Pending Verifications</p>
            <p className="text-3xl font-mono font-black text-primary">14</p>
          </div>
          <div className="bg-surface-50 border border-surface-200 rounded-2xl p-6">
            <p className="text-[10px] font-mono uppercase text-surface-400 font-bold mb-4">System Uptime</p>
            <p className="text-3xl font-mono font-black text-green-500">99.98%</p>
          </div>
        </div>

        <div className="bg-surface-50 border border-surface-200 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-surface-200 flex flex-col md:flex-row justify-between items-center gap-4">
            <h3 className="font-display font-bold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" /> SYSTEM ACTIVITY LOG
            </h3>
            <div className="flex w-full md:w-auto gap-2">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                <input type="text" placeholder="Filter logs..." className="w-full pl-9 pr-4 py-2 bg-surface border border-surface-200 rounded-lg text-xs" />
              </div>
              <button className="p-2 border border-surface-200 rounded-lg"><Filter className="w-4 h-4 text-surface-400" /></button>
            </div>
          </div>
          <div className="divide-y divide-surface-200">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="p-4 flex items-center justify-between hover:bg-surface-100 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-surface-200 rounded-lg flex items-center justify-center text-primary">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white uppercase">New RFQ Issued: RFQ-492{i}</p>
                    <p className="text-[10px] font-mono text-surface-400">Enterprise Buyer 'Global Energy Group' submitted Grid Storage request</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-mono text-surface-400">2 MINUTES AGO</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
