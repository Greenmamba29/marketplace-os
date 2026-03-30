import { 
  Users, 
  BarChart3, 
  ShoppingBag, 
  Settings,
  Shield,
  TrendingUp,
  Globe,
  Plus
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminDashboard() {
  const stats = [
    { label: 'Platform GMV', value: '$8.2M', icon: TrendingUp, color: 'text-accent-success' },
    { label: 'Food Technologists', value: '45', icon: Users, color: 'text-primary' },
    { label: 'Active Ingredients', value: '65k+', icon: Globe, color: 'text-accent-info' },
    { label: 'Lab Requests', value: '28', icon: ShoppingBag, color: 'text-accent-warning' },
  ];

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-display font-bold text-white mb-2">Admin Dashboard</h1>
            <p className="text-surface-400">Manage UniformOS marketplace operations.</p>
          </div>
          <div className="flex gap-3">
            <button className="btn btn-secondary py-2 px-4 text-sm">System Status</button>
            <button className="btn btn-primary py-2 px-4 text-sm flex items-center gap-2"><Plus className="w-4 h-4" /> Add Supplier</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div key={i} className="p-6 bg-surface-50 border border-surface-200 rounded-2xl">
              <div className={`p-2 w-10 h-10 bg-surface-100 rounded-lg ${stat.color} mb-4 flex items-center justify-center`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div className="text-2xl font-display font-bold text-white">{stat.value}</div>
              <div className="text-sm text-surface-400">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="p-8 bg-surface-50 border border-surface-200 rounded-2xl">
            <h2 className="text-xl font-display font-bold text-white mb-6">Sourcing Performance</h2>
            <div className="h-64 flex items-center justify-center text-surface-400 border border-surface-200 border-dashed rounded-xl">
              Growth Chart (Recharts)
            </div>
          </div>
          
          <div className="p-8 bg-surface-50 border border-surface-200 rounded-2xl">
            <h2 className="text-xl font-display font-bold text-white mb-6">Recent RFQs</h2>
            <div className="space-y-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="flex items-center justify-between p-4 bg-surface-100 border border-surface-200 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-surface-200 rounded-lg flex items-center justify-center text-surface-400 font-bold">
                      {i}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">Uniform RFQ #{1000 + i}</div>
                      <div className="text-xs text-surface-400">Submitted by Medical Global Corp</div>
                    </div>
                  </div>
                  <button className="text-primary hover:text-primary-600 font-medium text-sm">Process</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

  );
}
