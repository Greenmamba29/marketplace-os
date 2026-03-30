import { 
  BarChart3, 
  Package, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  TrendingUp,
  FileText,
  Search
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function BuyerDashboard() {
  const stats = [
    { label: 'Project Status', value: '4 active', icon: Package, color: 'text-primary' },
    { label: 'Quotes Received', value: '$840k total', icon: BarChart3, color: 'text-accent-info' },
    { label: 'Design Milestones', value: '95%', icon: CheckCircle2, color: 'text-accent-success' },
    { label: 'Spend Variance', value: '-2.4%', icon: TrendingUp, color: 'text-white' },
  ];

  const activeRfqs = [
    { id: 'PRJ-2401', subject: 'Headquarters Renovation - Phase 1', status: 'Quoting', date: '2024-03-24', quotes: 8 },
    { id: 'PRJ-2405', subject: 'Hybrid Work Kit Rollout (Global)', status: 'Reviewing', date: '2024-03-22', quotes: 12 },
    { id: 'PRJ-2409', subject: 'Executive Boardroom Update', status: 'Draft', date: '2024-03-20', quotes: 0 },
  ];

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-display font-bold text-white mb-2">Buyer Dashboard</h1>
            <p className="text-surface-400">Welcome back, Uniform Manager.</p>
          </div>
          <div className="flex gap-3">
            <button className="btn btn-secondary py-2 px-4 text-sm">Download Reports</button>
            <button className="btn btn-primary py-2 px-4 text-sm">New RFQ</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-6 bg-surface-50 border border-surface-200 rounded-2xl"
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`p-2 bg-surface-100 rounded-lg ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
              </div>
              <div className="text-2xl font-display font-bold text-white">{stat.value}</div>
              <div className="text-sm text-surface-400">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-display font-bold text-white">Active RFQs</h2>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>RFQ ID</th>
                    <th>Subject</th>
                    <th>Status</th>
                    <th>Quotes</th>
                    <th>Date</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {activeRfqs.map(rfq => (
                    <tr key={rfq.id}>
                      <td className="font-mono text-xs text-primary">{rfq.id}</td>
                      <td className="text-white font-medium">{rfq.subject}</td>
                      <td>
                        <span className={`badge ${rfq.status === 'Quoting' ? 'badge-info' : rfq.status === 'Reviewing' ? 'badge-warning' : 'badge-ghost'}`}>
                          {rfq.status}
                        </span>
                      </td>
                      <td className="text-surface-400">{rfq.quotes}</td>
                      <td className="text-surface-400">{rfq.date}</td>
                      <td className="text-right">
                        <button className="text-primary hover:text-primary-600 font-medium text-sm transition-colors">View Details</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-display font-bold text-white">Recent Activity</h2>
            <div className="p-6 bg-surface-50 border border-surface-200 rounded-2xl space-y-4">
              {[
                { time: '2h ago', user: 'Admin', act: 'New quote received', ref: 'RFQ-001', icon: FileText, color: 'text-primary' },
                { time: '5h ago', user: 'Logistics', act: 'Sample shipped', ref: 'RFQ-002', icon: Truck, color: 'text-accent-info' },
                { time: '1d ago', user: 'Finance', act: 'Invoice paid', ref: 'Order #4592', icon: CheckCircle2, color: 'text-accent-success' }
              ].map((activity, i) => (
                <div key={i} className="flex gap-3">
                  <div className={`mt-1 p-1.5 rounded bg-surface-100 ${activity.color}`}>
                    <activity.icon className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-sm text-white font-medium">{activity.act}</div>
                    <div className="text-xs text-surface-400">{activity.ref} • {activity.time}</div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-6 bg-primary/5 border border-primary/20 rounded-2xl">
              <h3 className="text-white font-medium mb-2">Order Management</h3>
              <p className="text-xs text-surface-400 mb-4 leading-relaxed">Automate your recurring uniform orders with our smart restocking engine.</p>
              <button className="btn btn-primary w-full py-2 text-sm">Configure Automation</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Truck(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
      <path d="M15 18H9" />
      <path d="M19 18h2a1 1 0 0 0 1-1v-5h-7v6h2" />
      <path d="M13 9h4" />
      <path d="M13 12h9" />
      <circle cx="7" cy="18" r="2" />
      <circle cx="17" cy="18" r="2" />
    </svg>
  );
}
