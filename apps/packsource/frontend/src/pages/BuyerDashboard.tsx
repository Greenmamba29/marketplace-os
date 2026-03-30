import { Package, Clock, CheckCircle2, AlertCircle, Search, SlidersHorizontal } from 'lucide-react';

export default function BuyerDashboard() {
  const stats = [
    { label: 'Total RFQs', value: 12, icon: Search, color: 'text-primary' },
    { label: 'Active Quotes', value: 5, icon: Clock, color: 'text-accent-warning' },
    { label: 'Confirmed Orders', value: 8, icon: CheckCircle2, color: 'text-accent-success' },
    { label: 'Pending Payment', value: 2, icon: AlertCircle, color: 'text-accent-error' },
  ];

  const rfqs = [
    { id: 'RFQ-2026-001', product: 'Standard Corrugated Box', quantity: 1000, status: 'Quoted', date: '2026-03-20' },
    { id: 'RFQ-2026-002', product: 'Kraft Paper Pouch', quantity: 5000, status: 'Pending', date: '2026-03-25' },
    { id: 'RFQ-2026-003', product: 'Glass Bottle (500ml)', quantity: 2000, status: 'Confirmed', date: '2026-03-18' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-3xl font-display font-bold text-white">Buyer Dashboard</h1>
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
          <h2 className="text-xl font-display font-bold text-white">Recent RFQs</h2>
          <button className="text-primary hover:underline text-sm font-medium">View All</button>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>RFQ ID</th>
                <th>Product</th>
                <th>Quantity</th>
                <th>Status</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {rfqs.map((rfq, i) => (
                <tr key={i}>
                  <td className="font-mono text-sm text-white">{rfq.id}</td>
                  <td className="text-white">{rfq.product}</td>
                  <td className="text-surface-400">{rfq.quantity.toLocaleString()} units</td>
                  <td>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      rfq.status === 'Quoted' ? 'bg-accent-warning/10 text-accent-warning' :
                      rfq.status === 'Confirmed' ? 'bg-accent-success/10 text-accent-success' :
                      'bg-accent-info/10 text-accent-info'
                    }`}>
                      {rfq.status}
                    </span>
                  </td>
                  <td className="text-surface-400 text-sm">{rfq.date}</td>
                  <td>
                    <button className="text-primary hover:text-primary-400 text-sm font-medium">Details</button>
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
