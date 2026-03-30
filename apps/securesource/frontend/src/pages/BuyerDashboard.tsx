import React from 'react';
import { Shield, FileText, CheckCircle, Activity } from 'lucide-react';

const BuyerDashboard = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-5xl font-black font-display uppercase italic tracking-tighter mb-16">Buyer Console</h1>
      <div className="grid md:grid-cols-4 gap-8 mb-16">
        {[
          { label: 'Active Projects', val: '1', icon: Shield },
          { label: 'Pending Quotes', val: '4', icon: FileText },
          { label: 'Certified Docs', val: '12', icon: CheckCircle },
          { label: 'System Uptime', val: '99.9%', icon: Activity },
        ].map(s => (
          <div key={s.label} className="bg-surface-50 border border-surface-100 p-10 rounded-[2rem]">
            <s.icon className="w-8 h-8 text-primary mb-6" />
            <div className="text-[10px] text-surface-400 font-black uppercase tracking-[0.2em] mb-2">{s.label}</div>
            <div className="text-4xl font-black font-display italic">{s.val}</div>
          </div>
        ))}
      </div>

      <div className="space-y-12">
         <div className="flex gap-16 border-b border-surface-100">
           <button className="pb-6 border-b-2 border-primary font-black uppercase italic tracking-[0.2em] text-sm">Active Project RFQs</button>
           <button className="pb-6 text-surface-400 font-black uppercase italic tracking-[0.2em] text-sm">Hardware Orders</button>
           <button className="pb-6 text-surface-400 font-black uppercase italic tracking-[0.2em] text-sm">Integrator Bids</button>
         </div>
         <div className="bg-surface-50 p-24 rounded-[3rem] border border-surface-100 text-center">
           <Shield className="w-16 h-16 text-surface-200 mx-auto mb-8 opacity-20" />
           <p className="text-surface-400 font-black uppercase italic tracking-widest">Awaiting Integrator Response for Project #SS-9281</p>
         </div>
      </div>
    </div>
  );
};
export default BuyerDashboard;
