import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package, Truck, ClipboardList, TrendingUp, Bell, User,
  ShieldCheck, RotateCcw, Bookmark, Activity, ChevronRight,
  ExternalLink, Star, CheckCircle, Clock, Plus, ArrowRight
} from 'lucide-react';
import { useOrders } from '../hooks';
import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const MALL_URL = 'https://marketplace-os-hub.netlify.app';
const ACCENT = '#F97316';

const MOCK_SPEND = [
  { month: 'Jan', spend: 45000 },
  { month: 'Feb', spend: 52000 },
  { month: 'Mar', spend: 48000 },
  { month: 'Apr', spend: 61000 },
  { month: 'May', spend: 55000 },
  { month: 'Jun', spend: 67000 },
];

const SAVED_SUPPLIERS = [
  { name: 'Global Industrial Co.', spend: '$124,500', rating: 4.8, verified: true, vertical: 'MRO' },
  { name: 'Siemens Direct MRO',    spend: '$82,200',  rating: 4.9, verified: true, vertical: 'MRO' },
  { name: 'Atlas Copco Parts',     spend: '$38,400',  rating: 4.5, verified: true, vertical: 'MRO' },
];

const REPEAT_LISTS = [
  { name: 'Monthly Bearing Reorder', items: 12, lastOrdered: '15 Mar 2026', total: '$4,240' },
  { name: 'Q2 Hydraulics Pack',      items: 7,  lastOrdered: '01 Mar 2026', total: '$8,190' },
  { name: 'Emergency Fasteners Kit', items: 5,  lastOrdered: '22 Feb 2026', total: '$1,050' },
];

const TABS = [
  { id: 'orders',    label: 'Orders',          icon: Package },
  { id: 'rfqs',      label: 'Open RFQs',       icon: ClipboardList },
  { id: 'saved',     label: 'Saved Suppliers',  icon: Bookmark },
  { id: 'repeat',    label: 'Repeat Lists',     icon: RotateCcw },
  { id: 'activity',  label: 'Activity',         icon: Activity },
];

const BuyerDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const { data: orders, isLoading } = useOrders();

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">

      {/* ── HEADER ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <p className="text-[10px] text-surface-400 uppercase tracking-widest font-bold mb-1">Account Portfolio</p>
          <h1 className="text-4xl font-display font-black text-white uppercase tracking-tighter">Buyer Dashboard</h1>
          <p className="text-surface-400 mt-1 text-sm">3 active shipments · 5 open RFQs awaiting quotes</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2.5 bg-surface-50 border border-surface-200 rounded-xl relative hover:border-primary/50 transition-colors">
            <Bell className="w-5 h-5 text-surface-400" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full" />
          </button>
          <div className="flex items-center gap-2 px-4 py-2.5 bg-surface-50 border border-surface-200 rounded-xl">
            <User className="w-4 h-4 text-primary" />
            <span className="text-sm font-bold text-white">BuildTech Industries</span>
          </div>
          <a
            href={MALL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 border border-surface-200 hover:border-primary rounded-xl text-xs font-bold text-surface-400 hover:text-primary transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Mall
          </a>
        </div>
      </div>

      {/* ── STATS CARDS ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { icon: Package,     label: 'Active Orders',  value: '12',   trend: '+2',   color: ACCENT },
          { icon: ClipboardList, label: 'Open RFQs',   value: '5',    trend: '0',    color: '#2563EB' },
          { icon: Truck,       label: 'In Transit',    value: '3',    trend: '-1',   color: '#EAB308' },
          { icon: TrendingUp,  label: 'Total Spend',   value: '$245K', trend: '+12%', color: '#16A34A' },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-surface-50 border border-surface-200 rounded-2xl p-6 hover:border-primary/30 transition-colors"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: s.color + '18' }}>
                  <Icon className="w-5 h-5" style={{ color: s.color }} />
                </div>
                <span className={`text-xs font-bold ${s.trend.startsWith('+') ? 'text-green-400' : 'text-surface-400'}`}>
                  {s.trend}
                </span>
              </div>
              <p className="text-xs text-surface-400 font-bold uppercase tracking-widest mb-1">{s.label}</p>
              <p className="text-2xl font-display font-black text-white">{s.value}</p>
            </motion.div>
          );
        })}
      </div>

      {/* ── SPEND CHART ── */}
      <div className="bg-surface-50 border border-surface-200 rounded-3xl p-7 mb-10">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-base font-display font-black text-white uppercase tracking-tighter">Spend Analytics</h3>
            <p className="text-xs text-surface-400 mt-1">6-month sourcing volume</p>
          </div>
          <span className="text-[10px] font-black text-surface-400 px-3 py-1 bg-surface-100 border border-surface-200 rounded-full">6 Months</span>
        </div>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={MOCK_SPEND}>
              <CartesianGrid strokeDasharray="3 3" stroke="#18181B" vertical={false} />
              <XAxis dataKey="month" stroke="#71717A" fontSize={11} axisLine={false} tickLine={false} />
              <YAxis stroke="#71717A" fontSize={11} axisLine={false} tickLine={false} tickFormatter={v => `$${v / 1000}k`} />
              <Tooltip contentStyle={{ background: '#18181B', border: '1px solid #3F3F46', borderRadius: '12px' }} itemStyle={{ color: ACCENT }} />
              <Line type="monotone" dataKey="spend" stroke={ACCENT} strokeWidth={3} dot={{ fill: ACCENT, r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── PORTFOLIO TABS (OpenSea: Collected / Created / Favorited / Activity) ── */}
      <div className="bg-surface-50 border border-surface-200 rounded-3xl overflow-hidden">
        {/* Tab bar */}
        <div className="flex border-b border-surface-200 overflow-x-auto">
          {TABS.map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 text-xs font-black uppercase tracking-widest whitespace-nowrap border-b-2 transition-all ${
                  active
                    ? 'border-primary text-white bg-primary/5'
                    : 'border-transparent text-surface-400 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="p-7"
          >
            {/* ORDERS */}
            {activeTab === 'orders' && (
              <div>
                <div className="flex justify-between items-center mb-5">
                  <p className="text-xs text-surface-400">{orders?.length ?? 0} orders total</p>
                  <Link to="/rfq/new" className="flex items-center gap-1.5 text-xs font-black text-primary hover:underline uppercase tracking-widest">
                    <Plus className="w-3 h-3" />New RFQ
                  </Link>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-[10px] text-surface-400 uppercase tracking-widest font-black border-b border-surface-200">
                        <th className="pb-3 pr-4">Order ID</th>
                        <th className="pb-3 pr-4">Part SKU</th>
                        <th className="pb-3 pr-4">Total</th>
                        <th className="pb-3 pr-4">Status</th>
                        <th className="pb-3">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {isLoading ? (
                        <tr><td colSpan={5} className="text-center py-10 text-surface-400 text-sm">Loading...</td></tr>
                      ) : orders?.map(order => (
                        <tr key={order.id} className="border-b border-surface-200/50 hover:bg-surface-100/30 transition-colors">
                          <td className="py-4 pr-4 font-mono text-xs font-bold text-white uppercase">{order.id}</td>
                          <td className="py-4 pr-4 text-xs text-surface-400">SK-7890-X</td>
                          <td className="py-4 pr-4 font-bold text-white text-sm">${order.totalPrice.toLocaleString()}</td>
                          <td className="py-4 pr-4">
                            <span className={`inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-1 rounded-full ${
                              order.status === 'Delivered'
                                ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                                : 'bg-yellow-500/10 border border-yellow-500/20 text-yellow-400'
                            }`}>
                              <CheckCircle className="w-3 h-3" />{order.status}
                            </span>
                          </td>
                          <td className="py-4 text-xs text-surface-400">{order.createdAt}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* RFQs */}
            {activeTab === 'rfqs' && (
              <div className="space-y-4">
                {[
                  { id: 'RFQ-00124', part: 'Heavy Duty Bearings SKF-6308-2RS', quotes: 8,  status: 'Active',   expires: '2 days' },
                  { id: 'RFQ-00125', part: 'Industrial Servo Motor 2.0kW',      quotes: 3,  status: 'Expiring', expires: '6 hrs' },
                  { id: 'RFQ-00128', part: 'Hydraulic Piston Set HP-900',        quotes: 0,  status: 'New',      expires: '5 days' },
                ].map((rfq, i) => (
                  <div key={i} className="flex items-center justify-between p-5 bg-[#080C14] border border-surface-200 hover:border-primary/40 rounded-2xl group transition-colors cursor-pointer">
                    <div>
                      <p className="text-[10px] font-mono font-bold text-primary uppercase mb-1">{rfq.id}</p>
                      <p className="text-sm font-bold text-white mb-1">{rfq.part}</p>
                      <div className="flex items-center gap-3 text-[10px] text-surface-400">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />Expires in {rfq.expires}</span>
                        <span>{rfq.quotes} quotes received</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${
                        rfq.status === 'Expiring' ? 'bg-yellow-500/10 border border-yellow-500/20 text-yellow-400'
                        : rfq.status === 'Active' ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                        : 'bg-blue-500/10 border border-blue-500/20 text-blue-400'
                      }`}>{rfq.status}</span>
                      <ChevronRight className="w-4 h-4 text-surface-400 group-hover:text-white transition-all group-hover:translate-x-1" />
                    </div>
                  </div>
                ))}
                <Link to="/rfq/new" className="flex items-center justify-center gap-2 w-full py-4 border border-dashed border-surface-200 hover:border-primary rounded-2xl text-xs font-bold text-surface-400 hover:text-primary transition-colors mt-2">
                  <Plus className="w-4 h-4" />Submit New RFQ
                </Link>
              </div>
            )}

            {/* SAVED SUPPLIERS */}
            {activeTab === 'saved' && (
              <div className="space-y-4">
                {SAVED_SUPPLIERS.map((sup, i) => (
                  <div key={i} className="flex items-center gap-4 p-5 bg-[#080C14] border border-surface-200 rounded-2xl hover:border-primary/40 transition-colors">
                    <div className="w-12 h-12 bg-surface-50 rounded-xl flex items-center justify-center shrink-0 border border-surface-200">
                      <ShieldCheck className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-bold text-white">{sup.name}</p>
                        {sup.verified && <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary">VERIFIED</span>}
                      </div>
                      <div className="flex items-center gap-4 text-[10px] text-surface-400">
                        <span className="flex items-center gap-1"><Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />{sup.rating}</span>
                        <span>Total spend: {sup.spend}</span>
                        <span>{sup.vertical}</span>
                      </div>
                    </div>
                    <button className="text-[10px] font-black text-primary hover:underline uppercase tracking-widest whitespace-nowrap flex items-center gap-1">
                      RFQ <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* REPEAT LISTS */}
            {activeTab === 'repeat' && (
              <div className="space-y-4">
                {REPEAT_LISTS.map((list, i) => (
                  <div key={i} className="flex items-center justify-between p-5 bg-[#080C14] border border-surface-200 rounded-2xl hover:border-primary/40 transition-colors group cursor-pointer">
                    <div>
                      <p className="text-sm font-bold text-white mb-1">{list.name}</p>
                      <div className="flex items-center gap-4 text-[10px] text-surface-400">
                        <span>{list.items} items</span>
                        <span>Last ordered: {list.lastOrdered}</span>
                        <span className="font-bold text-white">{list.total}</span>
                      </div>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all text-black" style={{ backgroundColor: ACCENT }}>
                      <RotateCcw className="w-3.5 h-3.5" />Reorder
                    </button>
                  </div>
                ))}
                <button className="flex items-center justify-center gap-2 w-full py-4 border border-dashed border-surface-200 hover:border-primary rounded-2xl text-xs font-bold text-surface-400 hover:text-primary transition-colors">
                  <Plus className="w-4 h-4" />Create New Repeat List
                </button>
              </div>
            )}

            {/* ACTIVITY */}
            {activeTab === 'activity' && (
              <div className="space-y-3">
                {[
                  { event: 'RFQ submitted',       detail: 'Heavy Duty Bearings × 500 units',  time: '2 hrs ago',  icon: ClipboardList, color: '#2563EB' },
                  { event: 'Quote received',       detail: 'Global Industrial Co. — $45.50/u', time: '4 hrs ago',  icon: CheckCircle,   color: '#16A34A' },
                  { event: 'Order confirmed',      detail: 'ORD-A4F2B1 · $22,750',             time: '1 day ago',  icon: Package,       color: ACCENT },
                  { event: 'Shipment dispatched',  detail: 'ORD-A3C901 · ETA 2 Apr',           time: '2 days ago', icon: Truck,         color: '#EAB308' },
                  { event: 'Supplier saved',       detail: 'Siemens Direct MRO',               time: '3 days ago', icon: Bookmark,      color: '#7C3AED' },
                ].map((a, i) => {
                  const Icon = a.icon;
                  return (
                    <div key={i} className="flex items-start gap-4 p-4 rounded-xl hover:bg-surface-100/30 transition-colors">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: a.color + '18' }}>
                        <Icon className="w-4 h-4" style={{ color: a.color }} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-white">{a.event}</p>
                        <p className="text-xs text-surface-400">{a.detail}</p>
                      </div>
                      <p className="text-[10px] text-surface-500 shrink-0">{a.time}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Continue Shopping */}
      <div className="mt-8 text-center">
        <a
          href={MALL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-xs text-surface-400 hover:text-primary transition-colors font-bold uppercase tracking-widest"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Continue Shopping at GrahmOS Mall
        </a>
      </div>
    </div>
  );
};

export default BuyerDashboard;
