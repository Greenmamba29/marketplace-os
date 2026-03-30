import React from 'react';
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

const AdminDashboard = () => {
  const data = [{n:'Jan',v:4000},{n:'Feb',v:7000},{n:'Mar',v:12000},{n:'Apr',v:9000}];
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
       <h1 className="text-4xl font-black font-display uppercase italic tracking-tighter mb-12">B2B Core Control</h1>
       <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-surface-50 p-8 rounded-3xl border border-surface-100">
             <h3 className="font-bold mb-8 uppercase italic tracking-widest text-xs">SKU Velocity</h3>
             <div className="h-64">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={data}><XAxis dataKey="n" stroke="#3F3F46" /><YAxis stroke="#3F3F46" /><Tooltip contentStyle={{background:'#18181B', border:'none'}} /><Bar dataKey="v" fill="#0284C7" radius={4} /></BarChart>
               </ResponsiveContainer>
             </div>
          </div>
          <div className="bg-surface-50 p-8 rounded-3xl border border-surface-100">
             <h3 className="font-bold mb-8 uppercase italic tracking-widest text-xs">Supplier Status</h3>
             <div className="space-y-6">
                {[1,2,3].map(i => (
                  <div key={i} className="flex justify-between items-center text-sm font-bold border-b border-surface-100 pb-4">
                    <span>GlobalNet Distri</span>
                    <span className="text-primary uppercase text-xs italic">Verified</span>
                  </div>
                ))}
             </div>
          </div>
       </div>
    </div>
  );
};
export default AdminDashboard;
