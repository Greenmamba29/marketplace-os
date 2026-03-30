import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { useAllPriceIndices } from '@/hooks/usePricing';
import type { PriceIndex } from '@/types';

const materialLabels: Record<string, string> = {
  carbonate: 'Li₂CO₃',
  hydroxide: 'LiOH',
  spodumene: 'Spodumene',
  metal: 'Li Metal',
  chloride: 'LiCl',
};

export default function PriceTicker() {
  const { data: indices, isLoading } = useAllPriceIndices();
  const [animatedIndices, setAnimatedIndices] = useState<PriceIndex[]>([]);

  useEffect(() => {
    if (indices) {
      setAnimatedIndices(indices as PriceIndex[]);
    }
  }, [indices]);

  if (isLoading) {
    return (
      <div className="bg-slate-900 border-b border-slate-800 py-2">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-center gap-2">
          <Activity className="w-4 h-4 text-blue-500 animate-pulse" />
          <span className="text-slate-400 text-sm">Loading market data...</span>
        </div>
      </div>
    );
  }

  if (!animatedIndices || animatedIndices.length === 0) {
    return null;
  }

  // Duplicate for infinite scroll effect
  const tickerItems = [...animatedIndices, ...animatedIndices];

  return (
    <div className="bg-slate-900 border-b border-slate-800 overflow-hidden">
      <div className="ticker-animation flex whitespace-nowrap">
        {tickerItems.map((index, i) => {
          const isPositive = index.change_24h >= 0;
          const TrendIcon = isPositive ? TrendingUp : TrendingDown;
          
          return (
            <div
              key={`${index.material_form}-${i}`}
              className="inline-flex items-center gap-3 px-6 py-2 border-r border-slate-800"
            >
              <span className="text-slate-400 text-sm font-medium">
                {materialLabels[index.material_form] || index.material_form}
              </span>
              <span className="text-white font-mono font-semibold">
                ${index.current_price.toLocaleString()}
              </span>
              <span
                className={`flex items-center gap-1 text-xs font-medium ${
                  isPositive ? 'text-emerald-400' : 'text-red-400'
                }`}
              >
                <TrendIcon className="w-3 h-3" />
                {isPositive ? '+' : ''}
                {index.change_24h_percent.toFixed(2)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
