import { Beaker, Globe, FileCheck, DollarSign, TrendingUp, Activity, Users } from 'lucide-react';

export default function AdminDashboard() {
  const stats = [
    { label: 'Verified Brands', value: 380, icon: Globe, color: 'text-primary' },
    { label: 'Institutions', value: '1.2K', icon: Users, color: 'text-accent-info' },
    { label: 'Active RFQs', value: 840, icon: FileCheck, color: 'text-accent-warning' },
    { label: 'Market GMV', value: '$24.5M', icon: DollarSign, color: 'text-accent-success' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-3xl font-display font-bold text-white">LabSource Admin</h1>
        <div className="flex gap-4">
          <button className="btn-secondary">Compliance Audit</button>
          <button className="btn-primary">Platform Health</button>
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
            <h2 className="text-xl font-display font-bold text-white">Catalog Connectivity</h2>
            <Activity className="w-5 h-5 text-accent-success" />
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-surface-100 rounded-lg border border-surface-200">
              <span className="text-sm text-surface-400">Sigma-Aldrich API</span>
              <span className="text-xs font-bold text-accent-success uppercase tracking-wider">Operational</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-surface-100 rounded-lg border border-surface-200">
              <span className="text-sm text-surface-400">Thermo Fisher Feed</span>
              <span className="text-xs font-bold text-accent-success uppercase tracking-wider">Operational</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-surface-100 rounded-lg border border-surface-200">
              <span className="text-sm text-surface-400">Global Logistics Hub</span>
              <span className="text-xs font-bold text-accent-warning uppercase tracking-wider">Syncing...</span>
            </div>
          </div>
        </div>

        <div className="p-6 bg-surface-50 border border-surface-200 rounded-xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-display font-bold text-white">Top Brands</h2>
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          <div className="space-y-4">
            {['Sigma-Aldrich', 'Thermo Fisher Scientific', 'Agilent Technologies', 'VWR'].map(b => (
              <div key={b} className="flex justify-between items-center">
                <span className="text-sm text-white font-medium">{b}</span>
                <span className="text-xs text-primary font-bold">Premier Partner</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
