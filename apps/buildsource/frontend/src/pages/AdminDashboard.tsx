import React from 'react';
import { LayoutDashboard, Users, Factory, TrendingUp } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-display font-bold text-white mb-8 italic">Platform OS</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <div className="glass border border-surface-200 p-8 rounded-[32px] bg-surface-50 col-span-2">
            <h3 className="text-xl font-bold text-white mb-6">Marketplace Volume</h3>
            <div className="h-64 bg-surface-100 rounded-2xl flex items-center justify-center text-surface-400">GMV Analytics Chart Placeholder</div>
         </div>
         <div className="glass border border-surface-200 p-8 rounded-[32px] bg-primary/5">
            <h3 className="text-xl font-bold text-white mb-6">System Health</h3>
            <div className="space-y-4">
               <div className="flex justify-between text-sm"><span className="text-surface-400">API Latency</span><span className="text-accent-success font-bold">12ms</span></div>
               <div className="flex justify-between text-sm"><span className="text-surface-400">DB Connections</span><span className="text-accent-success font-bold">Active</span></div>
               <div className="flex justify-between text-sm"><span className="text-surface-400">SSL Certificate</span><span className="text-accent-success font-bold">Valid</span></div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
