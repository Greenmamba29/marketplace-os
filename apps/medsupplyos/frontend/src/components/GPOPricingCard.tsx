import { TrendingDown, Check, Building2, FileText } from 'lucide-react'
import { GPOPricingTier, GPOPriceBenchmark } from '../types'

interface GPOPricingCardProps {
  pricing: GPOPricingTier
  isSelected?: boolean
  onSelect?: () => void
}

export function GPOPricingCard({ pricing, isSelected, onSelect }: GPOPricingCardProps) {
  const getTierClass = (tier: number) => {
    switch (tier) {
      case 1:
        return 'gpo-tier-1'
      case 2:
        return 'gpo-tier-2'
      case 3:
        return 'gpo-tier-3'
      default:
        return 'gpo-tier-1'
    }
  }

  return (
    <div
      onClick={onSelect}
      className={`clinical-card p-4 cursor-pointer transition-all ${
        isSelected
          ? 'ring-2 ring-clinical-500 border-clinical-500'
          : 'hover:border-clinical-300'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <span className={`gpo-tier-badge ${getTierClass(pricing.tier)}`}>
            Tier {pricing.tier}
          </span>
          <h4 className="font-semibold text-surface-900 mt-2">{pricing.gpoName}</h4>
        </div>
        {isSelected && (
          <div className="w-6 h-6 bg-clinical-500 rounded-full flex items-center justify-center">
            <Check className="w-4 h-4 text-white" />
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-clinical-600">
            ${pricing.contractPrice.toFixed(2)}
          </span>
          <span className="text-sm text-surface-500">/unit</span>
        </div>

        {pricing.minimumSpend > 0 && (
          <p className="text-sm text-surface-600">
            Min. spend: ${pricing.minimumSpend.toLocaleString()}
          </p>
        )}

        <div className="pt-2 border-t border-surface-200">
          <div className="flex items-center gap-2 text-sm text-surface-600">
            <FileText className="w-4 h-4" />
            <span className="font-mono text-xs">{pricing.contractNumber}</span>
          </div>
          <p className="text-xs text-surface-500 mt-1">
            Valid through {new Date(pricing.expirationDate).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  )
}

interface GPOBenchmarkCardProps {
  benchmark: GPOPriceBenchmark
}

export function GPOBenchmarkCard({ benchmark }: GPOBenchmarkCardProps) {
  const bestPrice = benchmark.gpoPrices.reduce((min, p) =>
    p.price < min.price ? p : min
  , benchmark.gpoPrices[0])

  return (
    <div className="clinical-card">
      <div className="p-4 border-b border-surface-200">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-surface-900">{benchmark.equipmentName}</h3>
            <p className="text-sm text-surface-500">{benchmark.manufacturer}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-surface-500">List Price</p>
            <p className="text-lg font-semibold text-surface-900">
              ${benchmark.listPrice.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center p-3 bg-surface-50 rounded-clinical">
            <p className="text-xs text-surface-500">Market Avg</p>
            <p className="font-semibold text-surface-900">
              ${benchmark.marketAverage.toFixed(2)}
            </p>
          </div>
          <div className="text-center p-3 bg-medical-green/10 rounded-clinical">
            <p className="text-xs text-medical-green">Best Price</p>
            <p className="font-semibold text-medical-green">
              ${benchmark.lowestPrice.toFixed(2)}
            </p>
          </div>
          <div className="text-center p-3 bg-clinical-50 rounded-clinical">
            <p className="text-xs text-clinical-600">Potential Savings</p>
            <p className="font-semibold text-clinical-600">
              ${benchmark.potentialSavings.toFixed(2)}
            </p>
          </div>
        </div>

        <h4 className="text-sm font-medium text-surface-700 mb-3 flex items-center gap-2">
          <Building2 className="w-4 h-4" />
          GPO Contract Pricing
        </h4>

        <div className="space-y-2">
          {benchmark.gpoPrices.map((gpoPrice, idx) => (
            <div
              key={idx}
              className={`flex items-center justify-between p-3 rounded-clinical ${
                gpoPrice.gpoId === bestPrice.gpoId
                  ? 'bg-medical-green/10 border border-medical-green/20'
                  : 'bg-surface-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`gpo-tier-badge ${
                  gpoPrice.tier === 3 ? 'gpo-tier-3' : gpoPrice.tier === 2 ? 'gpo-tier-2' : 'gpo-tier-1'
                }`}>
                  T{gpoPrice.tier}
                </span>
                <div>
                  <p className="text-sm font-medium text-surface-900">{gpoPrice.gpoName}</p>
                  <p className="text-xs text-surface-500 font-mono">{gpoPrice.contractNumber}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-surface-900">${gpoPrice.price.toFixed(2)}</p>
                <p className={`text-xs ${
                  gpoPrice.savingsPercent > 15 ? 'text-medical-green' : 'text-clinical-600'
                }`}>
                  <TrendingDown className="w-3 h-3 inline mr-1" />
                  {gpoPrice.savingsPercent.toFixed(1)}% off
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 py-3 bg-surface-50 border-t border-surface-200 rounded-b-clinical">
        <p className="text-xs text-surface-500">
          Last updated: {new Date(benchmark.lastUpdated).toLocaleString()}
        </p>
      </div>
    </div>
  )
}

interface GPOSavingsWidgetProps {
  totalSavings: number
  savingsPercent: number
  contractCount: number
  missedOpportunities: number
}

export function GPOSavingsWidget({
  totalSavings,
  savingsPercent,
  contractCount,
  missedOpportunities,
}: GPOSavingsWidgetProps) {
  return (
    <div className="clinical-card p-4">
      <h4 className="text-sm font-semibold text-surface-900 mb-4 flex items-center gap-2">
        <TrendingDown className="w-4 h-4 text-medical-green" />
        GPO Savings Summary
      </h4>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 bg-medical-green/10 rounded-clinical">
          <p className="text-xs text-medical-green mb-1">Total Savings</p>
          <p className="text-xl font-bold text-medical-green">
            ${totalSavings.toLocaleString()}
          </p>
        </div>

        <div className="p-3 bg-clinical-50 rounded-clinical">
          <p className="text-xs text-clinical-600 mb-1">Savings Rate</p>
          <p className="text-xl font-bold text-clinical-600">
            {savingsPercent.toFixed(1)}%
          </p>
        </div>

        <div className="p-3 bg-surface-50 rounded-clinical">
          <p className="text-xs text-surface-600 mb-1">Active Contracts</p>
          <p className="text-xl font-bold text-surface-900">
            {contractCount}
          </p>
        </div>

        <div className={`p-3 rounded-clinical ${missedOpportunities > 0 ? 'bg-medical-amber/10' : 'bg-surface-50'}`}>
          <p className={`text-xs mb-1 ${missedOpportunities > 0 ? 'text-medical-amber' : 'text-surface-600'}`}>
            Missed Opportunities
          </p>
          <p className={`text-xl font-bold ${missedOpportunities > 0 ? 'text-medical-amber' : 'text-surface-900'}`}>
            {missedOpportunities}
          </p>
        </div>
      </div>
    </div>
  )
}
