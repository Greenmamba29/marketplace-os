import React from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Users, ShoppingCart, TrendingUp, BarChart3, Factory, ShieldCheck, Search, Bell, AlertCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const MOCK_REVENUE_DATA = [
  { month: 'Oct', revenue: 1200000 },
  { month: 'Nov', revenue: 1450000 },
  { month: 'Dec', revenue: 1380000 },
  { month: 'Jan', revenue: 1850000 },
  { month: 'Feb', revenue: 2100000 },
  { month: 'Mar', revenue: 2450000 }
];

const AdminDashboard: React.FC = () => {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-display font-bold text-white mb-2 italic underline decoration-primary/50">Admin OS</h1>
          <p className="text-surface-400">Platform Control Center • System status: <span className="text-accent-success font-bold">Operational</span></p>
        </div>
        <div className="flex gap-4">
           <button className="btn btn-secondary py-2 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-accent-warning" /> System Alerts
           </button>
           <button className="btn btn-primary py-2">Export Data</button>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {[
          { icon: TrendingUp, title: 'Total Revenue (GMV)', value: '$12.4M', trend: '+15.2%', color: 'success' },
          { icon: Users, title: 'Total Buyers', value: '4,124', trend: '+124', color: 'info' },
          { icon: Factory, title: 'Active Suppliers', value: '842', trend: '+12', color: 'warning' },
          { icon: ShoppingCart, title: 'Orders Pipeline', value: '154', trend: 'Active', color: 'primary' }
        ].map((stat, idx) => (
          <div key={idx} className="glass border border-surface-200 rounded-2xl p-6 bg-surface-50">
             <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-surface-100 rounded-xl">
                   <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="text-sm font-medium text-surface-400 uppercase tracking-widest text-[10px]">{stat.title}</div>
             </div>
             <div className="flex items-baseline gap-4">
                <div className="text-3xl font-bold text-white">{stat.value}</div>
                <div className="text-xs font-bold text-accent-success">{stat.trend}</div>
             </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         <div className="lg:col-span-8 space-y-8">
            <div className="glass border border-surface-200 rounded-3xl p-8 bg-surface-50">
               <h3 className="text-xl font-display font-bold text-white mb-8 italic">Gross Marketplace Volume (GMV)</h3>
               <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                     <AreaChart data={MOCK_REVENUE_DATA}>
                        <defs>
                           <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#F97316" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#F97316" stopOpacity={0}/>
                           </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#18181B" vertical={false} />
                        <XAxis dataKey="month" stroke="#71717A" fontSize={12} axisLine={false} tickLine={false} />
                        <YAxis stroke="#71717A" fontSize={12} axisLine={false} tickLine={false} tickFormatter={(val) => `$${val/1000000}M`} />
                        <Tooltip 
                          contentStyle={{ background: '#18181B', border: '1px solid #3F3F46', borderRadius: '12px' }}
                        />
                        <Area type="monotone" dataKey="revenue" stroke="#F97316" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={3} />
                     </AreaChart>
                  </ResponsiveContainer>
               </div>
            </div>

            <div className="glass border border-surface-200 rounded-3xl overflow-hidden">
               <div className="p-6 border-b border-surface-200 bg-surface-50 flex justify-between items-center">
                  <h3 className="text-lg font-display font-bold text-white">Pending Supplier Verifications</h3>
                  <span className="badge badge-warning">8 Pending</span>
               </div>
               <div className="table-container border-0 rounded-none bg-transparent">
                  <table>
                     <thead>
                        <tr>
                           <th>Company</th>
                           <th>Country</th>
                           <th>Category</th>
                           <th>Certificates</th>
                           <th>Action</th>
                        </tr>
                     </thead>
                     <tbody>
                        {[
                           { name: 'Precision Machining GMBH', country: 'Germany', category: 'Precision Parts', certs: ['ISO-9001', 'ISO-14001'] },
                           { name: 'Tungsten Industrial Corp', country: 'USA', category: 'Metal Fab', certs: ['AS9100'] },
                           { name: 'Shanghai Motor Group', country: 'China', category: 'Electric Motors', certs: ['CE', 'UL'] }
                        ].map((sup, idx) => (
                           <tr key={idx}>
                              <td className="font-bold text-white">{sup.name}</td>
                              <td className="text-sm text-surface-400">{sup.country}</td>
                              <td className="text-sm text-surface-400">{sup.category}</td>
                              <td>
                                 <div className="flex gap-1">
                                    {sup.certs.map(c => <span key={c} className="text-[10px] font-mono px-1.5 py-0.5 bg-surface-100 rounded border border-surface-200 uppercase">{c}</span>)}
                                 </div>
                              </td>
                              <td>
                                 <button className="text-primary font-bold text-xs hover:underline">Review Application</button>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
         </div>

         <div className="lg:col-span-4 space-y-8">
            <div className="glass border border-surface-200 rounded-3xl p-6 bg-surface-50">
               <h3 className="text-lg font-display font-bold text-white mb-6 underline decoration-primary/30">Top Performing Categories</h3>
               <div className="space-y-6">
                  {[
                     { name: 'Industrial Motors', share: 32, revenue: '$3.9M', growth: '+24%' },
                     { name: 'Hydraulic Systems', share: 24, revenue: '$2.9M', growth: '+18%' },
                     { name: 'Precision Bearings', share: 18, revenue: '$2.2M', growth: '+12%' },
                     { name: 'HVAC Equipment', share: 15, revenue: '$1.8M', growth: '+42%' }
                  ].map((cat, idx) => (
                     <div key={idx} className="space-y-2">
                        <div className="flex justify-between text-sm">
                           <span className="font-medium text-white">{cat.name}</span>
                           <span className="text-accent-success font-bold">{cat.growth}</span>
                        </div>
                        <div className="h-2 bg-surface-100 rounded-full overflow-hidden">
                           <div className="h-full bg-primary" style={{ width: `${cat.share}%` }} />
                        </div>
                        <div className="flex justify-between text-[10px] text-surface-400 uppercase font-bold tracking-widest">
                           <span>{cat.revenue} Rev</span>
                           <span>{cat.share}% Share</span>
                        </div>
                     </div>
                  ))}
               </div>
            </div>

            <div className="glass border border-surface-200 rounded-3xl p-6 bg-primary/5">
               <div className="flex items-center gap-3 mb-4">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                  <h4 className="font-bold text-white">Platform Security</h4>
               </div>
               <p className="text-xs text-surface-400 leading-relaxed mb-6">
                  AI-driven fraud detection is currently monitoring <span className="text-white font-bold">142</span> concurrent transactions. 
                  No anomalies detected in the last 24 hours.
               </p>
               <div className="p-4 bg-surface-50 border border-surface-200 rounded-xl">
                  <div className="text-[10px] uppercase font-bold text-surface-400 mb-2">Recent Audit Log</div>
                  <div className="space-y-2">
                     <div className="text-[10px] text-surface-400 italic">2m ago: Admin sys_root approved 4 bulk orders</div>
                     <div className="text-[10px] text-surface-400 italic">15m ago: Supplier "ABB Direct" updated 240 SKUs</div>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
