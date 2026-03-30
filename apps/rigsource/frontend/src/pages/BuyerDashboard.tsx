import React from 'react';
import { Package, FileText, ClipboardList, TrendingUp } from 'lucide-react';
import { useRFQ } from '../hooks';

const BuyerDashboard = () => {
  const { data: rfqs } = useRFQ();

  const stats = [
    { label: 'Active RFQs', value: '3', icon: FileText, color: 'text-blue-500' },
    { label: 'Quotes Received', value: '12', icon: TrendingUp, color: 'text-green-500' },
    { label: 'Total Orders', value: '2', icon: Package, color: 'text-primary' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold font-display mb-12">Buyer Dashboard</h1>

      <div className="grid md:grid-cols-3 gap-8 mb-12">
        {stats.map(s => (
          <div key={s.label} className="bg-surface-50 p-8 rounded-3xl border border-surface-100">
            <div className={`p-3 ${s.color} bg-surface-100 rounded-xl w-fit mb-6`}>
              <s.icon className="w-6 h-6" />
            </div>
            <div className="text-3xl font-bold mb-1">{s.value}</div>
            <div className="text-surface-400 text-sm">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="space-y-8">
        <div className="flex gap-4 border-b border-surface-100">
          <button className="px-4 py-4 border-b-2 border-primary font-bold">My RFQs</button>
          <button className="px-4 py-4 text-surface-400">Quotes</button>
          <button className="px-4 py-4 text-surface-400">Orders</button>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>RFQ ID</th>
                <th>Equipment</th>
                <th>Country</th>
                <th>Status</th>
                <th>Created</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100/50">
              {rfqs?.map(rfq => (
                <tr key={rfq.id}>
                  <td className="font-mono text-primary">{rfq.id}</td>
                  <td>{rfq.equipmentType}</td>
                  <td>{rfq.country}</td>
                  <td>
                    <span className={`badge ${rfq.status === 'quoted' ? 'badge-success' : 'badge-warning'}`}>
                      {rfq.status}
                    </span>
                  </td>
                  <td className="text-surface-400">{rfq.createdAt}</td>
                  <td>
                    <button className="text-sm font-bold hover:text-primary">View Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BuyerDashboard;
