import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, 
  FileText, 
  TrendingUp, 
  Shield, 
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Beaker,
  Quote,
  Truck,
  Plus
} from 'lucide-react';
import { useRFQs, useAuth } from '@/hooks';
import { motion } from 'framer-motion';

// Stat card component
function StatCard({ title, value, change, changeType, icon: Icon }: { 
  title: string; 
  value: string | number; 
  change?: string; 
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: typeof Package;
}) {
  return (
    <div className="bg-surface-50 border border-surface-200 rounded-xl p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-surface-400 mb-1">{title}</p>
          <p className="text-2xl font-display font-bold text-white">{value}</p>
          {change && (
            <p className={`text-sm mt-1 ${
              changeType === 'positive' ? 'text-accent-success' :
              changeType === 'negative' ? 'text-accent-error' :
              'text-surface-400'
            }`}>
              {change}
            </p>
          )}
        </div>
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <Icon className="w-5 h-5 text-primary" />
        </div>
      </div>
    </div>
  );
}

// RFQ status badge
function RFQStatusBadge({ status }: { status: string }) {
  const configs: Record<string, { color: string; label: string }> = {
    draft: { color: 'bg-surface-300', label: 'Draft' },
    submitted: { color: 'bg-accent-info', label: 'Submitted' },
    in_review: { color: 'bg-accent-warning', label: 'In Review' },
    quoting: { color: 'bg-primary', label: 'Quoting' },
    closed: { color: 'bg-accent-success', label: 'Closed' },
    cancelled: { color: 'bg-accent-error', label: 'Cancelled' },
  };
  
  const config = configs[status] || configs.draft;
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${config.color}`}>
      {config.label}
    </span>
  );
}

// Activity item component
function ActivityItem({ type, title, time, status }: { type: string; title: string; time: string; status?: string }) {
  const icons: Record<string, typeof Package> = {
    rfq: FileText,
    quote: Quote,
    order: Package,
    compliance: Shield,
  };
  
  const Icon = icons[type] || Package;
  
  return (
    <div className="flex items-start gap-4 p-4 hover:bg-surface-50 rounded-lg transition-colors">
      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white font-medium truncate">{title}</p>
        <p className="text-sm text-surface-400">{time}</p>
      </div>
      {status && (
        <span className={`px-2 py-1 rounded-full text-xs ${
          status === 'completed' ? 'bg-accent-success/10 text-accent-success' :
          status === 'pending' ? 'bg-accent-warning/10 text-accent-warning' :
          'bg-surface-100 text-surface-400'
        }`}>
          {status}
        </span>
      )}
    </div>
  );
}

export default function BuyerDashboard() {
  const { user } = useAuth();
  const { data: rfqs, isLoading } = useRFQs(user?.id);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Mock stats - would come from API
  const stats = {
    totalRFQs: 24,
    activeRFQs: 5,
    quotesReceived: 18,
    ordersPlaced: 12,
    ordersInTransit: 3,
    totalSpend: '$145,000',
    pendingCompliance: 2,
  };
  
  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'rfqs', label: 'My RFQs', icon: FileText },
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'compliance', label: 'Compliance', icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <div className="bg-surface-50 border-b border-surface-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-display font-bold text-white">Dashboard</h1>
              <p className="text-surface-400 mt-1">
                Welcome back, {user?.first_name || 'User'}
              </p>
            </div>
            <Link
              to="/rfq"
              className="px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-600 transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              New RFQ
            </Link>
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
            {/* Stats grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard 
                title="Active RFQs" 
                value={stats.activeRFQs} 
                change="+2 this week"
                changeType="positive"
                icon={FileText}
              />
              <StatCard 
                title="Quotes Received" 
                value={stats.quotesReceived}
                change="8 pending review"
                changeType="neutral"
                icon={Quote}
              />
              <StatCard 
                title="Orders in Transit" 
                value={stats.ordersInTransit}
                change="3 deliveries expected"
                changeType="neutral"
                icon={Truck}
              />
              <StatCard 
                title="Total Spend (YTD)" 
                value={stats.totalSpend}
                change="+12% vs last year"
                changeType="positive"
                icon={TrendingUp}
              />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Recent RFQs */}
              <div className="lg:col-span-2">
                <div className="bg-surface-50 border border-surface-200 rounded-xl">
                  <div className="flex items-center justify-between p-6 border-b border-surface-200">
                    <h3 className="text-lg font-medium text-white">Recent RFQs</h3>
                    <Link to="/dashboard?tab=rfqs" className="text-sm text-primary hover:underline">
                      View all
                    </Link>
                  </div>
                  
                  {isLoading ? (
                    <div className="p-6 text-center">
                      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                    </div>
                  ) : rfqs && rfqs.length > 0 ? (
                    <div className="divide-y divide-surface-200">
                      {rfqs.slice(0, 5).map((rfq) => (
                        <div key={rfq.id} className="p-4 flex items-center justify-between hover:bg-surface/50 transition-colors">
                          <div>
                            <p className="text-white font-medium">{rfq.title}</p>
                            <p className="text-sm text-surface-400">
                              {rfq.items.length} item(s) · {rfq.delivery_country}
                            </p>
                          </div>
                          <div className="flex items-center gap-4">
                            <RFQStatusBadge status={rfq.status} />
                            <ChevronRight className="w-5 h-5 text-surface-400" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 text-center">
                      <FileText className="w-12 h-12 text-surface-300 mx-auto mb-4" />
                      <p className="text-surface-400">No RFQs yet</p>
                      <Link to="/rfq" className="text-primary hover:underline mt-2 inline-block">
                        Create your first RFQ
                      </Link>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Activity feed */}
              <div>
                <div className="bg-surface-50 border border-surface-200 rounded-xl">
                  <div className="p-6 border-b border-surface-200">
                    <h3 className="text-lg font-medium text-white">Recent Activity</h3>
                  </div>
                  <div className="p-2">
                    <ActivityItem 
                      type="quote"
                      title="New quote received for RFQ-2024-001"
                      time="2 hours ago"
                      status="pending"
                    />
                    <ActivityItem 
                      type="order"
                      title="Order #ORD-2024-015 shipped"
                      time="5 hours ago"
                      status="completed"
                    />
                    <ActivityItem 
                      type="compliance"
                      title="REACH registration updated for CAS 67-64-1"
                      time="1 day ago"
                    />
                    <ActivityItem 
                      type="rfq"
                      title="RFQ-2024-008 closed"
                      time="2 days ago"
                      status="completed"
                    />
                  </div>
                </div>
                
                {/* Compliance alerts */}
                {stats.pendingCompliance > 0 && (
                  <div className="mt-6 p-4 bg-accent-warning/10 border border-accent-warning/30 rounded-xl">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-accent-warning flex-shrink-0" />
                      <div>
                        <p className="text-white font-medium">Compliance Review Needed</p>
                        <p className="text-sm text-surface-400 mt-1">
                          {stats.pendingCompliance} chemical(s) require compliance review
                        </p>
                        <Link to="/compliance" className="text-sm text-accent-warning hover:underline mt-2 inline-block">
                          Review now →
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* RFQs Tab */}
        {activeTab === 'rfqs' && (
          <div className="bg-surface-50 border border-surface-200 rounded-xl">
            <div className="p-6 border-b border-surface-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-white">All RFQs</h3>
                <div className="flex items-center gap-2">
                  <select className="px-3 py-2 bg-surface border border-surface-200 rounded-lg text-sm text-white">
                    <option>All Status</option>
                    <option>Active</option>
                    <option>Closed</option>
                  </select>
                </div>
              </div>
            </div>
            
            {isLoading ? (
              <div className="p-6 text-center">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
              </div>
            ) : rfqs && rfqs.length > 0 ? (
              <div className="divide-y divide-surface-200">
                {rfqs.map((rfq) => (
                  <div key={rfq.id} className="p-6 hover:bg-surface/50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-white font-medium">{rfq.title}</h4>
                          <RFQStatusBadge status={rfq.status} />
                        </div>
                        <p className="text-sm text-surface-400">
                          {rfq.items.length} item(s) · Delivery to {rfq.delivery_city}, {rfq.delivery_country}
                        </p>
                        <p className="text-sm text-surface-400 mt-1">
                          Required by: {new Date(rfq.required_delivery_date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-surface-400">
                          {rfq.quotes_received} quote(s) received
                        </p>
                        <Link 
                          to={`/rfq/${rfq.id}`}
                          className="text-sm text-primary hover:underline mt-2 inline-block"
                        >
                          View details →
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center">
                <FileText className="w-16 h-16 text-surface-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-white mb-2">No RFQs yet</h3>
                <p className="text-surface-400 mb-6">Start sourcing by creating your first RFQ</p>
                <Link 
                  to="/rfq"
                  className="px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-600 transition-colors"
                >
                  Create RFQ
                </Link>
              </div>
            )}
          </div>
        )}
        
        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="bg-surface-50 border border-surface-200 rounded-xl">
            <div className="p-6 border-b border-surface-200">
              <h3 className="text-lg font-medium text-white">Orders</h3>
            </div>
            <div className="p-12 text-center">
              <Package className="w-16 h-16 text-surface-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-white mb-2">No orders yet</h3>
              <p className="text-surface-400 mb-6">Orders will appear here after you accept quotes</p>
              <Link 
                to="/dashboard?tab=rfqs"
                className="text-primary hover:underline"
              >
                View your RFQs →
              </Link>
            </div>
          </div>
        )}
        
        {/* Compliance Tab */}
        {activeTab === 'compliance' && (
          <div className="bg-surface-50 border border-surface-200 rounded-xl">
            <div className="p-6 border-b border-surface-200">
              <h3 className="text-lg font-medium text-white">Compliance Documents</h3>
            </div>
            <div className="p-12 text-center">
              <Shield className="w-16 h-16 text-surface-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-white mb-2">Compliance tracking</h3>
              <p className="text-surface-400 mb-6">Track compliance status for all your sourced chemicals</p>
              <Link 
                to="/compliance"
                className="px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-600 transition-colors"
              >
                View Compliance Center
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
