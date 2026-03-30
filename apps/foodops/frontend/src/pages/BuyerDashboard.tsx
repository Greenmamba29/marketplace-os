import { useAuth } from '@/hooks';
import { Truck, Package, Clock, ShieldCheck, Activity, BarChart3, TrendingUp, ChevronRight, Leaf, MapPin, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function BuyerDashboard() {
  const { user } = useAuth();

  const orders = [
    { id: 'ORD-7721', type: 'Produce / Proteins', status: 'IN TRANSIT', eta: '11:30 AM', temp: '3.4°C' },
    { id: 'ORD-6502', type: 'Beverages / Dry Goods', status: 'PROCESSING', eta: 'Tomorrow', temp: 'N/A' },
  ];

  return (
    <div className="min-h-screen bg-surface pt-32 pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-20">
          <div>
            <p className="text-xs font-mono font-black text-primary uppercase tracking-[0.5em] mb-4">Account Overview</p>
            <h1 className="text-6xl font-display font-black text-white uppercase tracking-tighter">OPERATIONS HUB</h1>
          </div>
          <div className="flex gap-4">
            <button className="w-14 h-14 bg-surface-50 border border-surface-200 rounded-2xl flex items-center justify-center text-surface-400 relative">
              <Bell className="w-6 h-6" />
              <div className="absolute top-4 right-4 w-2.5 h-2.5 bg-primary rounded-full border-2 border-surface-50" />
            </button>
          </div>
        </div>

        {/* Status Panels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="bg-surface-50 border border-surface-200 rounded-[2.5rem] p-10 flex flex-col justify-between h-64 hover:border-primary/50 transition-all group">
            <div className="flex justify-between items-start">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                <Truck className="w-8 h-8" />
              </div>
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-5xl font-mono font-black text-white">4</p>
              <p className="text-xs font-mono font-black text-surface-400 uppercase tracking-widest mt-2">Active Shipments</p>
            </div>
          </div>
          <div className="bg-surface-50 border border-surface-200 rounded-[2.5rem] p-10 flex flex-col justify-between h-64 hover:border-primary/50 transition-all group">
            <div className="flex justify-between items-start">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                <Package className="w-8 h-8" />
              </div>
              <Activity className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-5xl font-mono font-black text-white">12</p>
              <p className="text-xs font-mono font-black text-surface-400 uppercase tracking-widest mt-2">Weekly Orders</p>
            </div>
          </div>
          <div className="bg-surface-50 border border-surface-200 rounded-[2.5rem] p-10 flex flex-col justify-between h-64 hover:border-primary/50 transition-all group">
            <div className="flex justify-between items-start">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <Activity className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-5xl font-mono font-black text-white">99.2%</p>
              <p className="text-xs font-mono font-black text-surface-400 uppercase tracking-widest mt-2">Compliance Score</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-2xl font-display font-bold text-white uppercase tracking-tight">Active Deliveries</h3>
              <Link to="/products" className="text-xs font-black text-primary uppercase tracking-widest hover:underline">Full Catalog →</Link>
            </div>
            <div className="space-y-4">
              {orders.map((ord) => (
                <div key={ord.id} className="bg-surface-50 border border-surface-200 rounded-2xl p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 group hover:bg-surface-100 transition-all">
                  <div className="flex items-center gap-8">
                    <div className="w-16 h-16 bg-surface rounded-2xl flex items-center justify-center text-surface-400 group-hover:text-primary transition-colors border border-surface-200">
                      <MapPin className="w-8 h-8" />
                    </div>
                    <div>
                      <p className="text-xl font-bold text-white uppercase tracking-tight">{ord.type}</p>
                      <p className="text-xs font-mono text-surface-400 uppercase tracking-widest mt-1">{ord.id} • Cold Chain Active</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-12">
                    <div className="text-right">
                      <p className="text-[10px] font-mono font-black text-surface-400 uppercase mb-1">Status</p>
                      <span className={`text-[10px] font-mono font-black px-4 py-1 rounded-full border ${ord.status === 'IN TRANSIT' ? 'bg-primary/5 border-primary text-primary' : 'bg-surface border-surface-200 text-surface-400'}`}>
                        {ord.status}
                      </span>
                    </div>
                    <div className="text-right hidden md:block">
                      <p className="text-[10px] font-mono font-black text-surface-400 uppercase mb-1">Live Temp</p>
                      <p className="text-sm font-mono text-white font-bold">{ord.temp}</p>
                    </div>
                    <button className="w-10 h-10 bg-surface border border-surface-200 rounded-xl flex items-center justify-center hover:bg-primary hover:border-primary hover:text-white transition-all">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-surface-50 border border-surface-200 rounded-[2.5rem] p-10">
              <h3 className="text-lg font-display font-bold text-white mb-10 uppercase tracking-widest">Supplier Scorecard</h3>
              <div className="space-y-8">
                {[
                  { name: 'Valley Fresh Produce', score: 98 },
                  { name: 'Prime Protein Co', score: 94 },
                  { name: 'Dairy Logistics Ltd', score: 89 },
                ].map(s => (
                  <div key={s.name}>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs font-bold text-white uppercase tracking-tight">{s.name}</span>
                      <span className="text-xs font-mono font-black text-primary">{s.score}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-surface rounded-full overflow-hidden border border-surface-200">
                      <div className="h-full bg-primary" style={{ width: `${s.score}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-primary/5 border border-primary/20 rounded-[2.5rem] p-10">
              <div className="flex items-center gap-4 mb-6">
                <Leaf className="w-6 h-6 text-primary" />
                <h4 className="text-xs font-black text-primary uppercase tracking-widest">ESG Reporting</h4>
              </div>
              <p className="text-xs text-surface-300 leading-relaxed mb-8">
                Your sourcing this month has contributed to a <span className="text-white font-bold">14% reduction</span> in plastic waste through our Circular Packaging initiative.
              </p>
              <button className="w-full py-4 border border-primary/30 rounded-xl text-[10px] font-black text-primary uppercase tracking-widest hover:bg-primary/10 transition-all">
                Download ESG Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
