import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  ReferenceLine,
} from 'recharts';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface PriceData {
  date: string;
  price: number;
  volume?: number;
}

interface PriceChartProps {
  data: PriceData[];
  title?: string;
  showVolume?: boolean;
  height?: number;
  currency?: string;
}

export default function PriceChart({ 
  data, 
  title, 
  showVolume = false, 
  height = 300,
  currency = 'USD'
}: PriceChartProps) {
  const stats = useMemo(() => {
    if (data.length === 0) return null;
    
    const prices = data.map(d => d.price);
    const current = prices[prices.length - 1];
    const previous = prices[prices.length - 2] || current;
    const start = prices[0];
    
    const change24h = ((current - previous) / previous) * 100;
    const changeTotal = ((current - start) / start) * 100;
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const avg = prices.reduce((a, b) => a + b, 0) / prices.length;
    
    return { current, change24h, changeTotal, min, max, avg };
  }, [data]);

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (data.length === 0) {
    return (
      <div className="bg-surface-50 border border-surface-200 rounded-xl p-6">
        <p className="text-surface-400 text-center">No price data available</p>
      </div>
    );
  }

  return (
    <div className="bg-surface-50 border border-surface-200 rounded-xl p-6">
      {title && <h3 className="text-lg font-medium text-white mb-4">{title}</h3>}
      
      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div>
            <p className="text-xs text-surface-400 uppercase tracking-wider">Current</p>
            <p className="text-xl font-mono font-medium text-white">{formatPrice(stats.current)}</p>
          </div>
          <div>
            <p className="text-xs text-surface-400 uppercase tracking-wider">24h Change</p>
            <div className={`flex items-center gap-1 ${stats.change24h >= 0 ? 'text-accent-success' : 'text-accent-error'}`}>
              {stats.change24h >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              <span className="text-xl font-mono font-medium">{Math.abs(stats.change24h).toFixed(2)}%</span>
            </div>
          </div>
          <div>
            <p className="text-xs text-surface-400 uppercase tracking-wider">Period Range</p>
            <p className="text-sm font-mono text-white">
              {formatPrice(stats.min)} - {formatPrice(stats.max)}
            </p>
          </div>
          <div>
            <p className="text-xs text-surface-400 uppercase tracking-wider">Average</p>
            <p className="text-xl font-mono font-medium text-white">{formatPrice(stats.avg)}</p>
          </div>
        </div>
      )}
      
      {/* Chart */}
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0ABFBC" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#0ABFBC" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272A" vertical={false} />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatDate}
              stroke="#71717A"
              tick={{ fill: '#71717A', fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              tickFormatter={(value) => `$${value}`}
              stroke="#71717A"
              tick={{ fill: '#71717A', fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              domain={['auto', 'auto']}
            />
            <Tooltip 
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-surface border border-surface-200 rounded-lg p-3 shadow-xl">
                      <p className="text-xs text-surface-400 mb-1">{formatDate(label)}</p>
                      <p className="text-lg font-mono font-medium text-white">
                        {formatPrice(payload[0].value as number)}
                      </p>
                      {payload[0].payload.volume && (
                        <p className="text-xs text-surface-400 mt-1">
                          Volume: {payload[0].payload.volume.toLocaleString()} kg
                        </p>
                      )}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area 
              type="monotone" 
              dataKey="price" 
              stroke="#0ABFBC" 
              strokeWidth={2}
              fill="url(#priceGradient)"
            />
            {stats && (
              <ReferenceLine 
                y={stats.avg} 
                stroke="#71717A" 
                strokeDasharray="5 5" 
                label={{ value: 'Avg', fill: '#71717A', fontSize: 12, position: 'right' }}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// Mini chart for lists
interface MiniPriceChartProps {
  data: PriceData[];
  width?: number;
  height?: number;
}

export function MiniPriceChart({ data, width = 120, height = 40 }: MiniPriceChartProps) {
  if (data.length === 0) return null;
  
  const startPrice = data[0].price;
  const endPrice = data[data.length - 1].price;
  const isPositive = endPrice >= startPrice;
  
  return (
    <div className="flex items-center gap-2">
      <LineChart width={width} height={height} data={data}>
        <Line 
          type="monotone" 
          dataKey="price" 
          stroke={isPositive ? '#22C55E' : '#EF4444'} 
          strokeWidth={1.5}
          dot={false}
        />
      </LineChart>
      <span className={`text-xs font-mono ${isPositive ? 'text-accent-success' : 'text-accent-error'}`}>
        {isPositive ? '+' : ''}{((endPrice - startPrice) / startPrice * 100).toFixed(1)}%
      </span>
    </div>
  );
}
