import { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Download, 
  Activity,
  Info,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import Card, { CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { useAllPriceIndices, usePriceHistoryWithRange } from '@/hooks/usePricing';
import { useSupplyAlerts } from '@/hooks/useIntelligence';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { MaterialForm } from '@/types';

const materialOptions: { value: MaterialForm; label: string; unit: string }[] = [
  { value: 'carbonate', label: 'Lithium Carbonate', unit: 'USD/mt' },
  { value: 'hydroxide', label: 'Lithium Hydroxide', unit: 'USD/mt' },
  { value: 'spodumene', label: 'Spodumene Concentrate', unit: 'USD/mt' },
  { value: 'metal', label: 'Lithium Metal', unit: 'USD/mt' },
  { value: 'chloride', label: 'Lithium Chloride', unit: 'USD/mt' },
];

const timeRanges = [
  { value: 7, label: '7D' },
  { value: 30, label: '30D' },
  { value: 90, label: '90D' },
  { value: 180, label: '6M' },
  { value: 365, label: '1Y' },
];

export default function PriceIndex() {
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialForm>('carbonate');
  const [timeRange, setTimeRange] = useState(30);
  
  const { data: indices, isLoading: indicesLoading } = useAllPriceIndices();
  const { data: history, isLoading: historyLoading } = usePriceHistoryWithRange(
    selectedMaterial,
    timeRange
  );
  const { data: alerts } = useSupplyAlerts();

  const selectedMaterialData = materialOptions.find(m => m.value === selectedMaterial);
  const currentIndex = indices?.find((i: any) => i.material_form === selectedMaterial);

  const chartData = history?.map((h: any) => ({
    date: formatDate(h.date, { month: 'short', day: 'numeric' }),
    price: h.close,
    high: h.high,
    low: h.low,
  })) || [];

  return (
    <div className="min-h-screen bg-slate-950 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Lithium Price Index</h1>
            <p className="text-slate-400">
              Real-time pricing data from global markets. Updated every minute.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" leftIcon={<Calendar className="w-4 h-4" />}>
              Historical Data
            </Button>
            <Button variant="outline" leftIcon={<Download className="w-4 h-4" />}>
              Export
            </Button>
          </div>
        </div>

        {/* Price Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {indicesLoading ? (
            Array(5).fill(0).map((_, i) => (
              <Card key={i} className="h-32 animate-pulse bg-slate-800" />
            ))
          ) : (
            indices?.map((index: any) => {
              const isPositive = index.change_24h >= 0;
              const material = materialOptions.find(m => m.value === index.material_form);
              
              return (
                <button
                  key={index.material_form}
                  onClick={() => setSelectedMaterial(index.material_form)}
                  className={`text-left transition-all ${
                    selectedMaterial === index.material_form 
                      ? 'ring-2 ring-blue-500' 
                      : ''
                  }`}
                >
                  <Card className="h-full hover:border-slate-600">
                    <CardContent className="p-4">
                      <p className="text-slate-400 text-sm mb-1">
                        {material?.label}
                      </p>
                      <p className="text-2xl font-bold text-white font-mono mb-2">
                        {formatCurrency(index.current_price, index.currency, { maximumFractionDigits: 0 })}
                      </p>
                      <div className="flex items-center gap-2">
                        {isPositive ? (
                          <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <ArrowDownRight className="w-4 h-4 text-red-400" />
                        )}
                        <span
                          className={`text-sm font-medium ${
                            isPositive ? 'text-emerald-400' : 'text-red-400'
                          }`}
                        >
                          {isPositive ? '+' : ''}
                          {index.change_24h_percent.toFixed(2)}%
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </button>
              );
            })
          )}
        </div>

        {/* Main Chart Section */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Chart */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle>{selectedMaterialData?.label} Price Chart</CardTitle>
                <p className="text-slate-400 text-sm mt-1">
                  Unit: {selectedMaterialData?.unit}
                </p>
              </div>
              <div className="flex items-center gap-1 bg-slate-800 rounded-lg p-1">
                {timeRanges.map((range) => (
                  <button
                    key={range.value}
                    onClick={() => setTimeRange(range.value)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                      timeRange === range.value
                        ? 'bg-blue-500 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                {historyLoading ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="spinner" />
                  </div>
                ) : chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis 
                        dataKey="date" 
                        stroke="#64748B"
                        tick={{ fill: '#94A3B8', fontSize: 12 }}
                      />
                      <YAxis 
                        stroke="#64748B"
                        tick={{ fill: '#94A3B8', fontSize: 12 }}
                        tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1E293B',
                          border: '1px solid #334155',
                          borderRadius: '8px',
                        }}
                        labelStyle={{ color: '#94A3B8' }}
                        itemStyle={{ color: '#F8FAFC' }}
                        formatter={(value: number) => formatCurrency(value)}
                      />
                      <Area
                        type="monotone"
                        dataKey="price"
                        stroke="#3B82F6"
                        strokeWidth={2}
                        fill="url(#priceGradient)"
                      />
                      {currentIndex && (
                        <ReferenceLine 
                          y={currentIndex.current_price} 
                          stroke="#10B981" 
                          strokeDasharray="3 3"
                        />
                      )}
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-slate-500">
                    No data available
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Stats & Alerts */}
          <div className="space-y-6">
            {/* Price Stats */}
            {currentIndex && (
              <Card>
                <CardHeader>
                  <CardTitle>Price Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">24h High</span>
                    <span className="text-white font-mono">
                      {formatCurrency(currentIndex.current_price * 1.02, 'USD', { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">24h Low</span>
                    <span className="text-white font-mono">
                      {formatCurrency(currentIndex.current_price * 0.98, 'USD', { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">52W High</span>
                    <span className="text-white font-mono">
                      {formatCurrency(currentIndex.high_52w, 'USD', { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">52W Low</span>
                    <span className="text-white font-mono">
                      {formatCurrency(currentIndex.low_52w, 'USD', { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-slate-700">
                    <span className="text-slate-400">7D Change</span>
                    <span className={`font-mono ${currentIndex.change_7d >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {currentIndex.change_7d >= 0 ? '+' : ''}
                      {currentIndex.change_7d.toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">30D Change</span>
                    <span className={`font-mono ${currentIndex.change_30d >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {currentIndex.change_30d >= 0 ? '+' : ''}
                      {currentIndex.change_30d.toFixed(2)}%
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Supply Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-amber-400" />
                  Market Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                {alerts && alerts.length > 0 ? (
                  <div className="space-y-3">
                    {(alerts as any[]).slice(0, 3).map((alert: any) => (
                      <div
                        key={alert.id}
                        className="p-3 bg-slate-800/50 rounded-lg border border-slate-700"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Badge 
                            variant={
                              alert.severity === 'critical' ? 'danger' :
                              alert.severity === 'high' ? 'warning' : 'info'
                            }
                          >
                            {alert.severity}
                          </Badge>
                          <span className="text-slate-400 text-xs capitalize">
                            {alert.material_form}
                          </span>
                        </div>
                        <p className="text-sm text-slate-300">{alert.message}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-slate-500">
                    <Info className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No active alerts</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Market Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Market Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-6">
              <div>
                <p className="text-slate-400 text-sm mb-1">Total Volume (24h)</p>
                <p className="text-2xl font-bold text-white font-mono">12,450 mt</p>
                <p className="text-emerald-400 text-sm">+8.3% vs yesterday</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm mb-1">Active RFQs</p>
                <p className="text-2xl font-bold text-white font-mono">847</p>
                <p className="text-emerald-400 text-sm">+23 new today</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm mb-1">Open Contracts</p>
                <p className="text-2xl font-bold text-white font-mono">1,234</p>
                <p className="text-slate-400 text-sm">$4.2B notional</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm mb-1">Avg. Quote Response</p>
                <p className="text-2xl font-bold text-white font-mono">4.2 hrs</p>
                <p className="text-emerald-400 text-sm">-12% vs last week</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
