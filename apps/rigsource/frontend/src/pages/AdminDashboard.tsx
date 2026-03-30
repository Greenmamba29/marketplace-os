import React from 'react';
import { useEquipment } from '../hooks';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Plus, Users, LayoutDashboard, DollarSign, Package } from 'lucide-react';

const AdminDashboard = () => {
  const { data: equipment } = useEquipment();
  const chartData = [
    { name: 'Jan', rev: 4000 },
    { name: 'Feb', rev: 3000 },
    { name: 'Mar', rev: 2000 },
    { name: 'Apr', rev: 2780 },
    { name: 'May', rev: 1890 },
    { name: 'Jun', rev: 2390 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-12">
        <h1 className="text-4xl font-bold font-display">Admin Console</h1>
        <button className="btn btn-primary"><Plus className="w-5 h-5" /> Add Listing</button>
      </div>

      <div className="grid md:grid-cols-4 gap-6 mb-12">
        {[
          { label: 'Revenue', val: '$1.2M', icon: DollarSign },
          { label: 'Active Listings', val: '85', icon: Package },
          { label: 'Dealers', val: '14', icon: Users },
          { label: 'Total Sales', val: '23', icon: BarChart },
        ].map(s => (
          <div key={s.label} className="p-6 bg-surface-50 border border-surface-100 rounded-2xl">
            <div className="p-2 bg-surface-100 rounded-lg w-fit mb-4 text-primary"><s.icon className="w-4 h-4" /></div>
            <div className="text-sm text-surface-400 mb-1">{s.label}</div>
            <div className="text-2xl font-bold">{s.val}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mb-12">
        <div className="p-8 bg-surface-50 border border-surface-100 rounded-3xl">
          <h3 className="font-bold mb-8">Revenue Distribution (USD)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272A" />
                <XAxis dataKey="name" stroke="#52525B" />
                <YAxis stroke="#52525B" />
                <Tooltip 
                  contentStyle={{ background: '#18181B', border: '0.5px solid #3F3F46', borderRadius: '12px' }}
                />
                <Bar dataKey="rev" fill="#DC2626" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="p-8 bg-surface-50 border border-surface-100 rounded-3xl">
          <h3 className="font-bold mb-8">Recent Dealer Inquiries</h3>
          <div className="space-y-6">
            {[1,2,3].map(i => (
              <div key={i} className="flex items-center justify-between border-b border-surface-100/50 pb-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-surface-100 border border-surface-200"></div>
                  <div>
                    <div className="font-bold">Heavy Machinery Corp</div>
                    <div className="text-xs text-surface-400">Verifying documents • 2h ago</div>
                  </div>
                </div>
                <button className="text-xs font-bold text-primary">Approve</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
         <h3 className="font-bold mb-6">Manage Listings</h3>
         <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Category</th>
                <th>Price</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100/50">
              {equipment?.map(item => (
                <tr key={item.id}>
                  <td className="font-bold">{item.make} {item.model}</td>
                  <td className="text-surface-400 text-sm">{item.category}</td>
                  <td>${item.price.toLocaleString()}</td>
                  <td><span className="badge badge-success">Active</span></td>
                  <td className="flex gap-4">
                    <button className="text-xs font-bold hover:text-primary">Edit</button>
                    <button className="text-xs font-bold hover:text-accent-error">Remove</button>
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

export default AdminDashboard;
