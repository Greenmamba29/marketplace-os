import React from 'react';
import { Package, Truck, ClipboardList, TrendingUp } from 'lucide-react';
import { useOrders } from '../hooks';

const BuyerDashboard: React.FC = () => {
  const { data: orders } = useOrders();

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-display font-bold text-white mb-8 italic">Project Manager Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
         {[
           { label: 'Active Projects', value: '4', icon: Building2 },
           { label: 'Material Orders', value: '18', icon: Package },
           { label: 'Pending Quotes', value: '24', icon: ClipboardList },
           { label: 'Project Spend', value: '$1.2M', icon: TrendingUp }
         ].map((s, i) => (
           <div key={i} className="glass border border-surface-200 p-6 rounded-2xl bg-surface-50">
              <div className="text-surface-400 text-xs font-bold uppercase mb-2">{s.label}</div>
              <div className="text-2xl font-bold text-white">{s.value}</div>
           </div>
         ))}
      </div>

      <div className="glass border border-surface-200 rounded-3xl overflow-hidden">
         <div className="p-6 border-b border-surface-200 bg-surface-50 font-bold text-white">Active Material Shipments</div>
         <div className="table-container border-0 rounded-none">
            <table>
               <thead>
                  <tr><th>Project</th><th>Status</th><th>Total</th><th>Date</th></tr>
               </thead>
               <tbody>
                  {orders?.map(o => (
                    <tr key={o.id}>
                       <td className="font-bold text-white">{o.projectId}</td>
                       <td><span className="badge badge-info">{o.status}</span></td>
                       <td className="font-bold text-white">${o.totalPrice.toLocaleString()}</td>
                       <td className="text-surface-400">{o.createdAt}</td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
};

import { Building2 } from 'lucide-react';
export default BuyerDashboard;
