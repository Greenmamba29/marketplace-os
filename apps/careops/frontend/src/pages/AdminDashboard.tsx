import { Heart, Globe, FileCheck, DollarSign, TrendingUp, Activity, Users } from 'lucide-react';

export default function AdminDashboard() {
  const stats = [
    { label: 'Total Caregivers', value: '24K', icon: Heart, color: 'text-primary' },
    { label: 'Registered Agencies', value: '1.4K', icon: Users, color: 'text-accent-info' },
    { label: 'Active Placements', value: '4.8K', icon: FileCheck, color: 'text-accent-warning' },
    { label: 'Platform GMV', value: '$38.2M', icon: DollarSign, color: 'text-accent-success' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-3xl font-display font-bold text-white">CareOps Admin</h1>
        <div className="flex gap-4">
          <button className="btn-secondary">Compliance Review</button>
          <button className="btn-primary">Payout Management</button>
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
            <h2 className="text-xl font-display font-bold text-white">Registry Health</h2>
            <Activity className="w-5 h-5 text-accent-success" />
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-surface-100 rounded-lg border border-surface-200">
              <span className="text-sm text-surface-400">CNA Registry Sync</span>
              <span className="text-xs font-bold text-accent-success uppercase tracking-wider">Operational</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-surface-100 rounded-lg border border-surface-200">
              <span className="text-sm text-surface-400">RN License Feed</span>
              <span className="text-xs font-bold text-accent-success uppercase tracking-wider">Operational</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-surface-100 rounded-lg border border-surface-200">
              <span className="text-sm text-surface-400">Checkr API (Background)</span>
              <span className="text-xs font-bold text-accent-success uppercase tracking-wider">Operational</span>
            </div>
          </div>
        </div>

        <div className="p-6 bg-surface-50 border border-surface-200 rounded-xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-display font-bold text-white">Staffing Trends</h2>
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          <div className="space-y-4">
            {['Miami, FL', 'New York, NY', 'Austin, TX', 'Los Angeles, CA'].map(c => (
              <div key={c} className="flex justify-between items-center">
                <span className="text-sm text-white font-medium">{c}</span>
                <span className="text-xs text-primary font-bold">High Demand</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
