import React from 'react';
import { Activity, ClipboardList, Package, TrendingUp } from 'lucide-react';

const BuyerDashboard: React.FC = () => (
  <div className="py-12 px-4 max-w-7xl mx-auto">
     <h1 className="text-3xl font-display font-bold text-white mb-8">Procurement Dashboard</h1>
     <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        {[
          { label: 'Pending RFQs', value: '8', icon: ClipboardList },
          { label: 'Active Orders', value: '14', icon: Package },
          { label: 'Compliance Docs', value: '156', icon: Activity },
          { label: 'Annual Spend', value: '$840K', icon: TrendingUp }
        ].map((s, i) => (
          <div key={i} className="glass border border-surface-200 p-6 rounded-2xl bg-surface-50">
             <div className="text-xs text-surface-400 font-bold uppercase mb-2">{s.label}</div>
             <div className="text-2xl font-bold text-white">{s.value}</div>
          </div>
        ))}
     </div>
     <div className="glass border border-surface-200 rounded-2xl bg-surface-50 p-8 h-64 flex items-center justify-center text-surface-400 border-dashed">
        Shipment Tracking & Compliance Audit Log Placeholder
     </div>
  </div>
);

export default BuyerDashboard;
