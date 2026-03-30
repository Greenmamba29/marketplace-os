import { Search, Clock, CheckCircle2, AlertCircle, FileText } from 'lucide-react';

export default function BuyerDashboard() {
  const stats = [
    { label: 'Active RFQs', value: 15, icon: Search, color: 'text-primary' },
    { label: 'Pending Quotes', value: 8, icon: Clock, color: 'text-accent-warning' },
    { label: 'Orders in Transit', value: 3, icon: CheckCircle2, color: 'text-accent-success' },
    { label: 'Unread Reports', value: 12, icon: FileText, color: 'text-accent-info' },
  ];

  const rfqs = [
    { id: 'RFQ-LB-782', title: 'Q2 Reagents Restock', institution: 'MIT Biotech Lab', status: 'Quoted', date: '2026-03-22' },
    { id: 'RFQ-LB-783', title: 'High-Res Microscope', institution: 'Harvard Medical', status: 'Reviewing', date: '2026-03-24' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">Researcher Dashboard</h1>
          <p className="text-surface-400">Managing procurement for MIT Biotech Lab</p>
        </div>
        <button className="btn-primary">New RFQ</button>
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
          <h2 className="text-xl font-display font-bold text-white">Institutional Requests</h2>
          <button className="text-primary hover:underline text-sm font-medium">History</button>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>RFQ ID</th>
                <th>Request Title</th>
                <th>Institution</th>
                <th>Status</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {rfqs.map((rfq, i) => (
                <tr key={i}>
                  <td className="font-mono text-sm text-white">{rfq.id}</td>
                  <td className="text-white font-medium">{rfq.title}</td>
                  <td className="text-surface-400">{rfq.institution}</td>
                  <td>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      rfq.status === 'Quoted' ? 'bg-accent-success/10 text-accent-success' :
                      'bg-accent-warning/10 text-accent-warning'
                    }`}>
                      {rfq.status}
                    </span>
                  </td>
                  <td className="text-surface-400 text-sm">{rfq.date}</td>
                  <td>
                    <button className="text-primary hover:text-primary-400 text-sm font-medium">View Quotes</button>
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
