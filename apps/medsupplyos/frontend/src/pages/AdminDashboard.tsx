import React from 'react';

const AdminDashboard: React.FC = () => (
  <div className="py-12 px-4 max-w-7xl mx-auto">
     <h1 className="text-3xl font-display font-bold text-white mb-8 italic">Admin Control Panel</h1>
     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass border border-surface-200 p-8 rounded-3xl bg-surface-50">
           <h3 className="font-bold text-white mb-4">Manufacturer Verification Queue</h3>
           <div className="text-sm text-surface-400">3 Manufacturers awaiting credential review</div>
        </div>
        <div className="glass border border-surface-200 p-8 rounded-3xl bg-primary/5">
           <h3 className="font-bold text-white mb-4">Marketplace Health</h3>
           <div className="text-sm text-surface-400">System performing within 99.9% clinical SLA</div>
        </div>
     </div>
  </div>
);

export default AdminDashboard;
