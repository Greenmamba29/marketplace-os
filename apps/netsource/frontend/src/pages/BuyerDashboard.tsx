import React from 'react';
import { FileText, Truck, Zap, Activity } from 'lucide-react';

const BuyerDashboard = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-black font-display uppercase italic tracking-tighter mb-12">Buyer Dashboard</h1>
      <div className="grid md:grid-cols-4 gap-6 mb-12">
        {[
          { label: 'Active RFQs', val: '2', icon: FileText },
          { label: 'Tracking', val: '3', icon: Truck },
          { label: 'FastQuotes', val: '8', icon: Zap },
          { label: 'Activity', val: '98%', icon: Activity },
        ].map(s => (
          <div key={s.label} className="bg-surface-50 border border-surface-100 p-8 rounded-3xl">
            <s.icon className="w-5 h-5 text-primary mb-4" />
            <div className="text-xs text-surface-400 font-bold uppercase italic tracking-widest mb-1">{s.label}</div>
            <div className="text-3xl font-black font-display">{s.val}</div>
          </div>
        ))}
      </div>

      <div className="space-y-8">
         <div className="flex gap-12 border-b border-surface-100">
           <button className="pb-4 border-b-2 border-primary font-black uppercase italic tracking-widest">RFQs & Quotes</button>
           <button className="pb-4 text-surface-400 font-black uppercase italic tracking-widest">Purchase History</button>
         </div>
         <div className="bg-surface-50 p-12 rounded-3xl border border-surface-100 text-center">
           <FileText className="w-12 h-12 text-surface-200 mx-auto mb-4" />
           <p className="text-surface-400 font-bold">No active RFQs. Build your BOM in the RFQ wizard.</p>
         </div>
      </div>
    </div>
  );
};
export default BuyerDashboard;
