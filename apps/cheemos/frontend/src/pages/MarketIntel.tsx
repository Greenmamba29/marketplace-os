import { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Search, 
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Globe,
  AlertTriangle,
  Zap,
  BarChart3,
  Clock
} from 'lucide-react';
import { useMarketOverview, useTopMovers, useLatestIntelligence } from '@/hooks';
import CASSearch from '@/components/CASSearch';
import PriceChart from '@/components/PriceChart';
import { useNavigate } from 'react-router-dom';

// Market sentiment indicator
function MarketSentiment({ sentiment }: { sentiment: 'bullish' | 'bearish' | 'neutral' }) {
  const configs = {
    bullish: { color: 'text-accent-success', bg: 'bg-accent-success/10', icon: TrendingUp, label: 'Bullish' },
    bearish: { color: 'text-accent-error', bg: 'bg-accent-error/10', icon: TrendingDown, label: 'Bearish' },
    neutral: { color: 'text-accent-info', bg: 'bg-accent-info/10', icon: Minus, label: 'Neutral' },
  };
  
  const config = configs[sentiment];
  const Icon = config.icon;
  
  return (
    <div className={`flex items-center gap-2 px-4 py-2 ${config.bg} rounded-lg`}>
      <Icon className={`w-5 h-5 ${config.color}`} />
      <span className={`font-medium ${config.color}`}>{config.label}</span>
    </div>
  );
}

// Top mover card
function MoverCard({ 
  cas_number, 
  name, 
  price_change_percent, 
  current_price,
  direction 
}: { 
  cas_number: string; 
  name: string; 
  price_change_percent: number; 
  current_price: number;
  direction: 'gainer' | 'loser';
}) {
  const navigate = useNavigate();
  const isPositive = direction === 'gainer';
  
  return (
    <div 
      onClick={() => navigate(`/cas/${cas_number}`)}
      className="p-4 bg-surface-50 border border-surface-200 rounded-lg hover:border-primary/50 cursor-pointer transition-all card-hover"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="cas-number text-sm text-primary">{cas_number}</p>
          <p className="text-white font-medium mt-1">{name}</p>
        </div>
        <div className={`flex items-center gap-1 ${isPositive ? 'text-accent-success' : 'text-accent-error'}`}>
          {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
          <span className="font-mono font-medium">{Math.abs(price_change_percent).toFixed(2)}%</span>
        </div>
      </div>
      <p className="text-lg font-mono text-white mt-3">${current_price.toFixed(2)}/kg</p>
    </div>
  );
}

// Intelligence report card
function IntelligenceCard({ report }: { report: any }) {
  const navigate = useNavigate();
  
  return (
    <div 
      onClick={() => navigate(`/cas/${report.cas_number}`)}
      className="p-6 bg-surface-50 border border-surface-200 rounded-xl hover:border-primary/50 cursor-pointer transition-all card-hover"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <span className="cas-number text-sm text-primary">{report.cas_number}</span>
          <h3 className="text-white font-medium mt-1">{report.chemical_name}</h3>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          report.price_trend === 'up' ? 'bg-accent-success/10 text-accent-success' :
          report.price_trend === 'down' ? 'bg-accent-error/10 text-accent-error' :
          'bg-accent-info/10 text-accent-info'
        }`}>
          {report.price_trend === 'up' ? 'Rising' : report.price_trend === 'down' ? 'Falling' : 'Stable'}
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-surface-400">Avg Price</p>
          <p className="text-lg font-mono text-white">${report.avg_price_usd_kg.toFixed(2)}/kg</p>
        </div>
        <div>
          <p className="text-xs text-surface-400">Change</p>
          <p className={`text-lg font-mono ${report.price_change_percent >= 0 ? 'text-accent-success' : 'text-accent-error'}`}>
            {report.price_change_percent >= 0 ? '+' : ''}{report.price_change_percent.toFixed(2)}%
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <span className={`px-2 py-1 rounded text-xs ${
          report.supply_status === 'abundant' ? 'bg-accent-success/10 text-accent-success' :
          report.supply_status === 'normal' ? 'bg-accent-info/10 text-accent-info' :
          report.supply_status === 'tight' ? 'bg-accent-warning/10 text-accent-warning' :
          'bg-accent-error/10 text-accent-error'
        }`}>
          Supply: {report.supply_status}
        </span>
        {report.generated_by === 'ai' && (
          <span className="flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded text-xs">
            <Zap className="w-3 h-3" /> AI Generated
          </span>
        )}
      </div>
      
      {report.key_insights?.length > 0 && (
        <div className="mt-4 pt-4 border-t border-surface-200">
          <p className="text-xs text-surface-400 mb-2">Key Insights</p>
          <ul className="space-y-1">
            {report.key_insights.slice(0, 2).map((insight: string, i: number) => (
              <li key={i} className="text-sm text-surface-400 flex items-start gap-2">
                <span className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0" />
                {insight}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// Regional availability indicator
function RegionalAvailability({ regions }: { regions: any[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {regions?.map((region, i) => (
        <div key={i} className="p-4 bg-surface-50 border border-surface-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Globe className="w-4 h-4 text-surface-400" />
            <span className="text-sm text-white">{region.region}</span>
          </div>
          <div className={`w-full h-2 rounded-full mb-2 ${
            region.availability === 'high' ? 'bg-accent-success' :
            region.availability === 'medium' ? 'bg-accent-warning' :
            'bg-accent-error'
          }`} />
          <p className="text-xs text-surface-400">
            Lead time: {region.avg_lead_time_days} days
          </p>
        </div>
      ))}
    </div>
  );
}

export default function MarketIntel() {
  const [activeTab, setActiveTab] = useState('overview');
  const { data: overview } = useMarketOverview();
  const { data: gainers } = useTopMovers('gainers', 5);
  const { data: losers } = useTopMovers('losers', 5);
  const { data: latestIntel } = useLatestIntelligence(6);
  
  const tabs = [
    { id: 'overview', label: 'Market Overview', icon: BarChart3 },
    { id: 'movers', label: 'Top Movers', icon: Activity },
    { id: 'reports', label: 'AI Reports', icon: Zap },
  ];

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <div className="bg-surface-50 border-b border-surface-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-display font-bold text-white">Market Intelligence</h1>
              <p className="text-surface-400 mt-1">Live price indices and market analysis</p>
            </div>
            {overview && (
              <MarketSentiment sentiment={overview.market_sentiment} />
            )}
          </div>
          
          {/* Search */}
          <div className="mt-6 max-w-xl">
            <CASSearch placeholder="Search chemical for detailed analysis..." />
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
            {/* Market stats */}
            {overview && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="bg-surface-50 border border-surface-200 rounded-xl p-6">
                  <p className="text-sm text-surface-400 mb-1">Chemicals Tracked</p>
                  <p className="text-2xl font-display font-bold text-white">{overview.total_chemicals_tracked.toLocaleString()}</p>
                </div>
                <div className="bg-surface-50 border border-surface-200 rounded-xl p-6">
                  <p className="text-sm text-surface-400 mb-1">24h Avg Change</p>
                  <p className={`text-2xl font-display font-bold ${overview.avg_price_change_24h >= 0 ? 'text-accent-success' : 'text-accent-error'}`}>
                    {overview.avg_price_change_24h >= 0 ? '+' : ''}{overview.avg_price_change_24h.toFixed(2)}%
                  </p>
                </div>
                <div className="bg-surface-50 border border-surface-200 rounded-xl p-6">
                  <p className="text-sm text-surface-400 mb-1">24h Volume</p>
                  <p className="text-2xl font-display font-bold text-white">{overview.total_volume_24h.toLocaleString()} kg</p>
                </div>
                <div className="bg-surface-50 border border-surface-200 rounded-xl p-6">
                  <p className="text-sm text-surface-400 mb-1">Active RFQs</p>
                  <p className="text-2xl font-display font-bold text-white">{overview.active_rfqs.toLocaleString()}</p>
                </div>
              </div>
            )}
            
            {/* Top gainers & losers */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-accent-success" />
                  Top Gainers (24h)
                </h3>
                <div className="space-y-3">
                  {gainers?.chemicals.map((chemical) => (
                    <MoverCard 
                      key={chemical.cas_number}
                      {...chemical}
                      direction="gainer"
                    />
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                  <TrendingDown className="w-5 h-5 text-accent-error" />
                  Top Losers (24h)
                </h3>
                <div className="space-y-3">
                  {losers?.chemicals.map((chemical) => (
                    <MoverCard 
                      key={chemical.cas_number}
                      {...chemical}
                      direction="loser"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Movers Tab */}
        {activeTab === 'movers' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-surface-50 border border-surface-200 rounded-xl p-6">
                <h3 className="text-lg font-medium text-white mb-4">Biggest Gainers</h3>
                <div className="space-y-3">
                  {gainers?.chemicals.map((chemical, i) => (
                    <div key={chemical.cas_number} className="flex items-center justify-between p-3 bg-surface rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-xs text-primary font-medium">
                          {i + 1}
                        </span>
                        <div>
                          <p className="text-white font-medium">{chemical.name}</p>
                          <p className="cas-number text-sm text-surface-400">{chemical.cas_number}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-accent-success font-mono font-medium">+{chemical.price_change_percent.toFixed(2)}%</p>
                        <p className="text-sm text-surface-400">${chemical.current_price.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-surface-50 border border-surface-200 rounded-xl p-6">
                <h3 className="text-lg font-medium text-white mb-4">Biggest Losers</h3>
                <div className="space-y-3">
                  {losers?.chemicals.map((chemical, i) => (
                    <div key={chemical.cas_number} className="flex items-center justify-between p-3 bg-surface rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 bg-accent-error/10 rounded-full flex items-center justify-center text-xs text-accent-error font-medium">
                          {i + 1}
                        </span>
                        <div>
                          <p className="text-white font-medium">{chemical.name}</p>
                          <p className="cas-number text-sm text-surface-400">{chemical.cas_number}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-accent-error font-mono font-medium">{chemical.price_change_percent.toFixed(2)}%</p>
                        <p className="text-sm text-surface-400">${chemical.current_price.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-primary/10 to-transparent border border-primary/30 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Zap className="w-6 h-6 text-primary" />
                <h3 className="text-lg font-medium text-white">AI-Powered Market Analysis</h3>
              </div>
              <p className="text-surface-400 mb-4">
                Our AI analyzes market data, regulatory changes, and supply chain indicators to provide actionable intelligence.
              </p>
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-2 text-surface-400">
                  <Clock className="w-4 h-4" />
                  Updated hourly
                </span>
                <span className="flex items-center gap-2 text-surface-400">
                  <BarChart3 className="w-4 h-4" />
                  {overview?.total_chemicals_tracked.toLocaleString()} chemicals tracked
                </span>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-white mb-4">Latest Intelligence Reports</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {latestIntel?.map((report) => (
                  <IntelligenceCard key={report.id} report={report} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
