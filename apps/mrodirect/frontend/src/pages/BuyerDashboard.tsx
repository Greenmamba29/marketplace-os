import React from 'react';
import { motion } from 'framer-motion';
import { Package, Truck, ClipboardList, TrendingUp, Search, Bell, Filter, ChevronRight, LayoutDashboard, User, Settings, ShieldCheck } from 'lucide-react';
import { useOrders } from '../hooks';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const MOCK_SPEND_DATA = [
  { month: 'Jan', spend: 45000 },
  { month: 'Feb', spend: 52000 },
  { month: 'Mar', spend: 48000 },
  { month: 'Apr', spend: 61000 },
  { month: 'May', spend: 55000 },
  { month: 'Jun', spend: 67000 }
];

const BuyerDashboard: React.FC = () => {
  const { data: orders, isLoading } = useOrders();

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-display font-bold text-white mb-2 italic">Buyer Dashboard</h1>
          <p className="text-surface-400">Welcome back, Industrial Buyer. You have 3 active shipments.</p>
        </div>
        <div className="flex items-center gap-4">
           <button className="p-2.5 bg-surface-50 border border-surface-200 rounded-xl relative group transition-all hover:border-primary/50">
              <Bell className="w-5 h-5 text-surface-400 group-hover:text-primary" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full ring-2 ring-surface" />
           </button>
           <div className="flex items-center gap-2 px-4 py-2 bg-surface-50 rounded-xl border border-surface-200">
              <User className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-white">BuildTech Industries</span>
           </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {[
          { icon: Package, title: 'Active Orders', value: '12', trend: '+2', color: 'primary' },
          { icon: ClipboardList, title: 'Open RFQs', value: '5', trend: '0', color: 'info' },
          { icon: Truck, title: 'In Transit', value: '3', trend: '-1', color: 'warning' },
          { icon: TrendingUp, title: 'Total Spend', value: '$245K', trend: '+12%', color: 'success' }
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass border border-surface-200 rounded-2xl p-6"
          >
            <div className="flex justify-between items-start mb-4">
               <div className={`w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center`}>
                  <stat.icon className={`text-primary w-6 h-6`} />
               </div>
               <span className={`text-xs font-bold ${stat.trend.startsWith('+') ? 'text-accent-success' : 'text-surface-400'}`}>
                 {stat.trend}
               </span>
            </div>
            <div className="text-sm text-surface-400 font-medium mb-1">{stat.title}</div>
            <div className="text-2xl font-bold text-white">{stat.value}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-8 space-y-8">
           {/* Spend Chart */}
           <div className="glass border border-surface-200 rounded-3xl p-8 bg-surface-50">
              <div className="flex justify-between items-center mb-8">
                 <h3 className="text-xl font-display font-bold text-white">Spend Analytics</h3>
                 <div className="flex gap-2">
                    <span className="text-xs text-surface-400 px-3 py-1 bg-surface-100 border border-surface-200 rounded-full">6 Months</span>
                 </div>
              </div>
              <div className="h-64">
                 <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={MOCK_SPEND_DATA}>
                       <CartesianGrid strokeDasharray="3 3" stroke="#18181B" vertical={false} />
                       <XAxis dataKey="month" stroke="#71717A" fontSize={12} axisLine={false} tickLine={false} />
                       <YAxis stroke="#71717A" fontSize={12} axisLine={false} tickLine={false} tickFormatter={(val) => `$${val/1000}k`} />
                       <Tooltip 
                         contentStyle={{ background: '#18181B', border: '1px solid #3F3F46', borderRadius: '12px' }}
                         itemStyle={{ color: '#F97316' }}
                       />
                       <Line type="monotone" dataKey="spend" stroke="#F97316" strokeWidth={3} dot={{ fill: '#F97316', r: 4 }} activeDot={{ r: 6 }} />
                    </LineChart>
                 </ResponsiveContainer>
              </div>
           </div>

           {/* Orders Table */}
           <div className="glass border border-surface-200 rounded-3xl overflow-hidden">
              <div className="p-6 border-b border-surface-200 flex justify-between items-center bg-surface-50">
                 <h3 className="text-lg font-display font-bold text-white">Recent Orders</h3>
                 <button className="text-primary text-sm font-bold hover:underline">View All</button>
              </div>
              <div className="table-container border-0 rounded-none bg-transparent">
                 <table>
                    <thead>
                       <tr>
                          <th>Order ID</th>
                          <th>Part SKU</th>
                          <th>Total Price</th>
                          <th>Status</th>
                          <th>Order Date</th>
                       </tr>
                    </thead>
                    <tbody>
                       {isLoading ? (
                         <tr><td colSpan={5} className="text-center py-10">Loading...</td></tr>
                       ) : orders?.map((order) => (
                         <tr key={order.id}>
                            <td className="font-mono text-xs font-bold text-white uppercase">{order.id}</td>
                            <td className="text-sm text-surface-400">SK-7890-X</td>
                            <td className="font-bold text-white">${order.totalPrice.toLocaleString()}</td>
                            <td>
                               <span className={`badge ${order.status === 'Delivered' ? 'badge-success' : 'badge-warning'}`}>
                                 {order.status}
                               </span>
                            </td>
                            <td className="text-xs text-surface-400">{order.createdAt}</td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-4 space-y-8">
           {/* Open RFQs List */}
           <div className="glass border border-surface-200 rounded-3xl p-6 bg-surface-50">
              <h3 className="text-lg font-display font-bold text-white mb-6">Open RFQs</h3>
              <div className="space-y-4">
                 {[
                   { id: 'RFQ-00124', part: 'Heavy Duty Bearings', quotes: 8, status: 'Active' },
                   { id: 'RFQ-00125', part: 'Industrial Servo 2.0', quotes: 3, status: 'Expiring' },
                   { id: 'RFQ-00128', part: 'Hydraulic Piston Set', quotes: 0, status: 'New' }
                 ].map((rfq, idx) => (
                   <div key={idx} className="p-4 rounded-xl border border-surface-200 hover:border-primary/30 transition-all cursor-pointer group">
                      <div className="flex justify-between items-start mb-2">
                         <div className="text-xs font-mono text-primary uppercase font-bold">{rfq.id}</div>
                         <div className={`text-[10px] uppercase font-bold tracking-widest ${rfq.status === 'Expiring' ? 'text-accent-warning' : 'text-accent-info'}`}>
                           {rfq.status}
                         </div>
                      </div>
                      <div className="text-sm font-bold text-white mb-3">{rfq.part}</div>
                      <div className="flex justify-between items-center">
                         <div className="text-xs text-surface-400">{rfq.quotes} Quotes Received</div>
                         <ChevronRight className="w-4 h-4 text-surface-400 group-hover:text-white transition-all group-hover:translate-x-1" />
                      </div>
                   </div>
                 ))}
              </div>
              <button className="btn btn-secondary w-full mt-6 py-2.5 text-xs font-bold">Manage All RFQs</button>
           </div>

           {/* Supplier Stats */}
           <div className="glass border border-surface-200 rounded-3xl p-6">
              <h3 className="text-lg font-display font-bold text-white mb-6">Preferred Suppliers</h3>
              <div className="space-y-4">
                 {[
                   { name: 'Global Industrial Co.', spend: '$124,500', rating: 4.8 },
                   { name: 'Siemens Direct MRO', spend: '$82,200', rating: 4.9 },
                   { name: 'Atlas Copco Parts', spend: '$38,400', rating: 4.5 }
                 ].map((sup, idx) => (
                   <div key={idx} className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-surface-50 rounded-lg flex items-center justify-center shrink-0 border border-surface-100">
                         <ShieldCheck className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                         <div className="text-sm font-bold text-white">{sup.name}</div>
                         <div className="text-xs text-surface-400">Total Spend: {sup.spend}</div>
                      </div>
                      <div className="text-xs font-bold text-accent-success">{sup.rating}</div>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerDashboard;
