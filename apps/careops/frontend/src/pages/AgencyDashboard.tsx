import { Search, Clock, CheckCircle2, ShieldCheck, Users, DollarSign } from 'lucide-react';

export default function AgencyDashboard() {
  const stats = [
    { label: 'Active Placements', value: 24, icon: Users, color: 'text-primary' },
    { label: 'Staff in Roster', value: 185, icon: CheckCircle2, color: 'text-accent-success' },
    { label: 'Pending Requests', value: 6, icon: Clock, color: 'text-accent-warning' },
    { label: 'Monthly Billing', value: '$112K', icon: DollarSign, color: 'text-accent-info' },
  ];

  const placements = [
    { id: 'PL-CA-001', staff: 'Sarah Johnson', patient: 'Home Care (Elderly)', status: 'Active', renewal: '2026-06-15' },
    { id: 'PL-CA-002', staff: 'Michael Chen', patient: 'Post-Op Recovery', status: 'Active', renewal: '2026-04-10' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">Agency Dashboard</h1>
          <p className="text-surface-400">Manage your staff roster and active placements.</p>
        </div>
        <button className="btn-primary">New Placement Search</button>
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

      <div className="bg-surface-50 border border-surface-200 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-surface-200 flex justify-between items-center">
          <h2 className="text-xl font-display font-bold text-white">Active Placements</h2>
          <button className="text-primary hover:underline text-sm font-medium">Manage Roster</button>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Caregiver</th>
                <th>Patient Case</th>
                <th>Status</th>
                <th>Renewal Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {placements.map((pl, i) => (
                <tr key={i}>
                  <td className="font-mono text-sm text-white">{pl.id}</td>
                  <td className="text-white font-medium">{pl.staff}</td>
                  <td className="text-surface-400">{pl.patient}</td>
                  <td>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-accent-success/10 text-accent-success">
                      {pl.status}
                    </span>
                  </td>
                  <td className="text-surface-400 text-sm">{pl.renewal}</td>
                  <td>
                    <button className="text-primary hover:text-primary-400 text-sm font-medium">Timesheets</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
