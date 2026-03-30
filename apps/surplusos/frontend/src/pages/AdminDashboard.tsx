import React from 'react';
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

const AdminDashboard = () => {
  const data = [{n:'Jan',v:400},{n:'Feb',v:700},{n:'Mar',v:1200},{n:'Apr',v:900}];
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
       <h1 className="text-4xl font-black font-display uppercase italic tracking-tighter mb-12">Liquidation Control</h1>
       <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2 bg-surface-50 p-8 rounded-3xl border border-surface-100">
            <h3 className="font-bold mb-8 uppercase italic tracking-widest text-xs">Volume per Month</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}><XAxis dataKey="n" stroke="#3F3F46" /><YAxis stroke="#3F3F46" /><Tooltip contentStyle={{background:'#18181B', border:'none'}} /><Bar dataKey="v" fill="#B45309" radius={4} /></BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="bg-surface-50 p-8 rounded-3xl border border-surface-100">
             <h3 className="font-bold mb-8 uppercase italic tracking-widest text-xs">Admin Actions</h3>
             <div className="space-y-4">
                <button className="w-full btn btn-primary py-4 italic uppercase">Review 14 New Listings</button>
                <button className="w-full btn btn-secondary py-4 italic uppercase">Manage Payouts</button>
             </div>
          </div>
       </div>
    </div>
  );
};
export default AdminDashboard;
