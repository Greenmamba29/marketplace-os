import React from 'react';
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, AreaChart, Area } from 'recharts';

const AdminDashboard = () => {
  const data = [{n:'Jan',v:24000},{n:'Feb',v:45000},{n:'Mar',v:78000},{n:'Apr',v:62000}];
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
       <h1 className="text-5xl font-black font-display uppercase italic tracking-tighter mb-16">Security HQ Admin</h1>
       <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 bg-surface-50 p-12 rounded-[3rem] border border-surface-100">
             <h3 className="font-black text-xs uppercase tracking-[0.3em] text-surface-400 mb-12 italic">System GMV Velocity</h3>
             <div className="h-80">
               <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={data}><XAxis dataKey="n" stroke="#3F3F46" /><YAxis stroke="#3F3F46" /><Tooltip contentStyle={{background:'#18181B', border:'none'}} /><Area type="monotone" dataKey="v" stroke="#475569" fill="#475569" fillOpacity={0.2} /></AreaChart>
               </ResponsiveContainer>
             </div>
          </div>
          <div className="bg-surface-50 p-12 rounded-[3rem] border border-surface-100">
             <h3 className="font-black text-xs uppercase tracking-[0.3em] text-surface-400 mb-12 italic">Certification Alerts</h3>
             <div className="space-y-8">
                {[1,2,3,4].map(i => (
                  <div key={i} className="flex justify-between items-center text-sm font-black border-b border-surface-100/50 pb-6 italic">
                    <span>Avigilon Firmware 4.2</span>
                    <span className="text-primary uppercase text-[10px] tracking-widest">Pending</span>
                  </div>
                ))}
             </div>
          </div>
       </div>
    </div>
  );
};
export default AdminDashboard;
