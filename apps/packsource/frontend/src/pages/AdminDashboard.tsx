import { Users, Globe, FileCheck, DollarSign, TrendingUp, Activity } from 'lucide-react';

export default function AdminDashboard() {
  const stats = [
    { label: 'Active Manufacturers', value: 650, icon: Globe, color: 'text-primary' },
    { label: 'Total Buyers', value: '4.2K', icon: Users, color: 'text-accent-info' },
    { label: 'Active RFQs', value: 840, icon: FileCheck, color: 'text-accent-warning' },
    { label: 'Monthly GMV', value: '$8.4M', icon: DollarSign, color: 'text-accent-success' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-3xl font-display font-bold text-white">Admin Console</h1>
        <div className="flex gap-4">
          <button className="btn-secondary">Export Data</button>
          <button className="btn-primary">Audit Log</button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, i) => (
          <div key={i} className="p-6 bg-surface-50 border border-surface-200 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 bg-surface-100 rounded-lg ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <span className="text-2xl font-bold text-white">{stat.value}</span>
            </div>
            <p className="text-sm text-surface-400 font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="p-6 bg-surface-50 border border-surface-200 rounded-xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-display font-bold text-white">System Health</h2>
            <Activity className="w-5 h-5 text-accent-success" />
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-surface-100 rounded-lg border border-surface-200">
              <span className="text-sm text-surface-400">API Gateway</span>
              <span className="text-xs font-bold text-accent-success uppercase tracking-wider">Operational</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-surface-100 rounded-lg border border-surface-200">
              <span className="text-sm text-surface-400">Search Engine</span>
              <span className="text-xs font-bold text-accent-success uppercase tracking-wider">Operational</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-surface-100 rounded-lg border border-surface-200">
              <span className="text-sm text-surface-400">Quote Engine</span>
              <span className="text-xs font-bold text-accent-warning uppercase tracking-wider">Slow Response</span>
            </div>
          </div>
        </div>

        <div className="p-6 bg-surface-50 border border-surface-200 rounded-xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-display font-bold text-white">Top Manufacturers</h2>
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          <div className="space-y-4">
            {['PackCo Industries', 'EcoPack Solutions', 'Global Glass Corp', 'LabelMaster'].map(m => (
              <div key={m} className="flex justify-between items-center">
                <span className="text-sm text-white font-medium">{m}</span>
                <span className="text-xs text-primary font-bold">Verified</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
