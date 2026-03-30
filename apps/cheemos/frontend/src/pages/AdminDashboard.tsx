import { useState } from 'react';
import { 
  Users, 
  Beaker, 
  FileText, 
  TrendingUp, 
  Shield, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  MoreVertical,
  Download,
  RefreshCw
} from 'lucide-react';
import { motion } from 'framer-motion';

// Stat card component
function StatCard({ title, value, change, icon: Icon }: { 
  title: string; 
  value: string | number; 
  change: string;
  icon: typeof Users;
}) {
  return (
    <div className="bg-surface-50 border border-surface-200 rounded-xl p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-surface-400 mb-1">{title}</p>
          <p className="text-2xl font-display font-bold text-white">{value}</p>
          <p className="text-sm text-accent-success mt-1">{change}</p>
        </div>
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <Icon className="w-5 h-5 text-primary" />
        </div>
      </div>
    </div>
  );
}

// Data table component
function DataTable({ 
  columns, 
  data, 
  onRowClick 
}: { 
  columns: { key: string; label: string }[];
  data: any[];
  onRowClick?: (row: any) => void;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-surface-200">
            {columns.map((col) => (
              <th key={col.key} className="text-left px-4 py-3 text-xs font-medium text-surface-400 uppercase tracking-wider">
                {col.label}
              </th>
            ))}
            <th className="w-10"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-200">
          {data.map((row, i) => (
            <tr 
              key={i} 
              onClick={() => onRowClick?.(row)}
              className={onRowClick ? 'cursor-pointer hover:bg-surface/50' : ''}
            >
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3">
                  {row[col.key]}
                </td>
              ))}
              <td>
                <button className="p-2 hover:bg-surface-100 rounded-lg">
                  <MoreVertical className="w-4 h-4 text-surface-400" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Status badge
function StatusBadge({ status }: { status: string }) {
  const configs: Record<string, { color: string; icon: typeof CheckCircle }> = {
    active: { color: 'bg-accent-success/10 text-accent-success', icon: CheckCircle },
    pending: { color: 'bg-accent-warning/10 text-accent-warning', icon: AlertTriangle },
    inactive: { color: 'bg-surface-200 text-surface-400', icon: XCircle },
    verified: { color: 'bg-accent-success/10 text-accent-success', icon: CheckCircle },
    flagged: { color: 'bg-accent-error/10 text-accent-error', icon: AlertTriangle },
  };
  
  const config = configs[status] || configs.inactive;
  const Icon = config.icon;
  
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
      <Icon className="w-3 h-3" />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Mock data
  const stats = {
    totalUsers: 1247,
    totalChemicals: 12400,
    totalRFQs: 4567,
    pendingVerifications: 23,
  };
  
  const users = [
    { id: 1, name: 'Acme Chemicals Ltd', email: 'procurement@acme.com', role: 'Buyer', status: 'active', joined: '2024-01-15' },
    { id: 2, name: 'SigmaChem GmbH', email: 'sales@sigmachem.de', role: 'Supplier', status: 'verified', joined: '2024-01-14' },
    { id: 3, name: 'Global Solvents Inc', email: 'info@globalsolvents.com', role: 'Supplier', status: 'pending', joined: '2024-01-13' },
    { id: 4, name: 'PharmaTech Solutions', email: 'buying@pharmatech.com', role: 'Buyer', status: 'active', joined: '2024-01-12' },
  ];
  
  const rfqs = [
    { id: 'RFQ-2024-001', title: 'Acetone HPLC Grade', buyer: 'Acme Chemicals', items: 1, quotes: 5, status: 'active' },
    { id: 'RFQ-2024-002', title: 'Methanol Technical', buyer: 'PharmaTech', items: 2, quotes: 3, status: 'active' },
    { id: 'RFQ-2024-003', title: 'Toluene ACS Grade', buyer: 'Lab Supplies Co', items: 1, quotes: 0, status: 'pending' },
  ];
  
  const alerts = [
    { id: 1, type: 'compliance', message: 'REACH registration expiring for 3 chemicals', severity: 'high', date: '2024-01-15' },
    { id: 2, type: 'verification', message: '23 suppliers pending verification', severity: 'medium', date: '2024-01-14' },
    { id: 3, type: 'system', message: 'Price index update completed', severity: 'low', date: '2024-01-13' },
  ];
  
  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'chemicals', label: 'Chemicals', icon: Beaker },
    { id: 'rfqs', label: 'RFQs', icon: FileText },
    { id: 'alerts', label: 'Alerts', icon: AlertTriangle },
  ];

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <div className="bg-surface-50 border-b border-surface-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-display font-bold text-white">Admin Dashboard</h1>
              <p className="text-surface-400 mt-1">Platform management and monitoring</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 bg-surface-100 border border-surface-200 rounded-lg text-white hover:bg-surface-200 transition-colors">
                <RefreshCw className="w-5 h-5" />
              </button>
              <button className="px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary-600 transition-colors flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export Report
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="border-b border-surface-200 mb-8">
          <div className="flex gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-surface-400 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
        
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard 
                title="Total Users" 
                value={stats.totalUsers.toLocaleString()}
                change="+12 this week"
                icon={Users}
              />
              <StatCard 
                title="Chemicals in DB" 
                value={stats.totalChemicals.toLocaleString()}
                change="+45 this week"
                icon={Beaker}
              />
              <StatCard 
                title="Total RFQs" 
                value={stats.totalRFQs.toLocaleString()}
                change="+89 this week"
                icon={FileText}
              />
              <StatCard 
                title="Pending Verifications" 
                value={stats.pendingVerifications}
                change="Action needed"
                icon={Shield}
              />
            </div>
            
            {/* Recent activity & alerts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-surface-50 border border-surface-200 rounded-xl">
                <div className="p-6 border-b border-surface-200">
                  <h3 className="text-lg font-medium text-white">Recent RFQs</h3>
                </div>
                <DataTable 
                  columns={[
                    { key: 'id', label: 'ID' },
                    { key: 'title', label: 'Title' },
                    { key: 'buyer', label: 'Buyer' },
                    { key: 'quotes', label: 'Quotes' },
                  ]}
                  data={rfqs.map(r => ({ ...r, quotes: `${r.quotes} received` }))}
                />
              </div>
              
              <div className="bg-surface-50 border border-surface-200 rounded-xl">
                <div className="p-6 border-b border-surface-200">
                  <h3 className="text-lg font-medium text-white">System Alerts</h3>
                </div>
                <div className="divide-y divide-surface-200">
                  {alerts.map((alert) => (
                    <div key={alert.id} className="p-4 flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        alert.severity === 'high' ? 'bg-accent-error' :
                        alert.severity === 'medium' ? 'bg-accent-warning' :
                        'bg-accent-info'
                      }`} />
                      <div className="flex-1">
                        <p className="text-white">{alert.message}</p>
                        <p className="text-sm text-surface-400">{alert.date}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        alert.severity === 'high' ? 'bg-accent-error/10 text-accent-error' :
                        alert.severity === 'medium' ? 'bg-accent-warning/10 text-accent-warning' :
                        'bg-accent-info/10 text-accent-info'
                      }`}>
                        {alert.severity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-surface-50 border border-surface-200 rounded-xl">
            <div className="p-6 border-b border-surface-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-white">All Users</h3>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                    <input 
                      type="text" 
                      placeholder="Search users..."
                      className="pl-10 pr-4 py-2 bg-surface border border-surface-200 rounded-lg text-sm text-white placeholder-surface-400"
                    />
                  </div>
                  <button className="p-2 bg-surface border border-surface-200 rounded-lg text-white">
                    <Filter className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
            <DataTable 
              columns={[
                { key: 'name', label: 'Name' },
                { key: 'email', label: 'Email' },
                { key: 'role', label: 'Role' },
                { key: 'status', label: 'Status' },
                { key: 'joined', label: 'Joined' },
              ]}
              data={users.map(u => ({
                ...u,
                status: <StatusBadge status={u.status} />,
              }))}
            />
          </div>
        )}
        
        {/* Chemicals Tab */}
        {activeTab === 'chemicals' && (
          <div className="bg-surface-50 border border-surface-200 rounded-xl p-12 text-center">
            <Beaker className="w-16 h-16 text-surface-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-white mb-2">Chemical Management</h3>
            <p className="text-surface-400 mb-6">Manage the chemical database and CAS registry</p>
            <button className="px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-600 transition-colors">
              Import Chemicals
            </button>
          </div>
        )}
        
        {/* RFQs Tab */}
        {activeTab === 'rfqs' && (
          <div className="bg-surface-50 border border-surface-200 rounded-xl">
            <div className="p-6 border-b border-surface-200">
              <h3 className="text-lg font-medium text-white">All RFQs</h3>
            </div>
            <DataTable 
              columns={[
                { key: 'id', label: 'ID' },
                { key: 'title', label: 'Title' },
                { key: 'buyer', label: 'Buyer' },
                { key: 'items', label: 'Items' },
                { key: 'status', label: 'Status' },
              ]}
              data={rfqs.map(r => ({
                ...r,
                status: <StatusBadge status={r.status} />,
              }))}
            />
          </div>
        )}
        
        {/* Alerts Tab */}
        {activeTab === 'alerts' && (
          <div className="bg-surface-50 border border-surface-200 rounded-xl">
            <div className="p-6 border-b border-surface-200">
              <h3 className="text-lg font-medium text-white">System Alerts</h3>
            </div>
            <div className="divide-y divide-surface-200">
              {alerts.map((alert) => (
                <div key={alert.id} className="p-6 flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      alert.severity === 'high' ? 'bg-accent-error/10' :
                      alert.severity === 'medium' ? 'bg-accent-warning/10' :
                      'bg-accent-info/10'
                    }`}>
                      <AlertTriangle className={`w-5 h-5 ${
                        alert.severity === 'high' ? 'text-accent-error' :
                        alert.severity === 'medium' ? 'text-accent-warning' :
                        'text-accent-info'
                      }`} />
                    </div>
                    <div>
                      <p className="text-white font-medium">{alert.message}</p>
                      <p className="text-sm text-surface-400 mt-1">{alert.date}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    alert.severity === 'high' ? 'bg-accent-error/10 text-accent-error' :
                    alert.severity === 'medium' ? 'bg-accent-warning/10 text-accent-warning' :
                    'bg-accent-info/10 text-accent-info'
                  }`}>
                    {alert.severity}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
