import { useState } from 'react'
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Calendar, 
  Filter,
  ArrowUpRight,
  Building2,
  Package,
  Wine
} from 'lucide-react'
import { useMarketComps, usePriceTrends, usePriceStats } from '../hooks/useBarrels'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts'
import type { MarketComp } from '../types'

const spiritTypeColors: Record<string, string> = {
  bourbon: '#92400E',
  rye: '#c2410c',
  scotch: '#ca8a04',
  rum: '#d97706',
  tequila: '#0369a1',
  brandy: '#7c3aed',
  other: '#6b7280',
}

function CompCard({ comp }: { comp: MarketComp }) {
  return (
    <div className="card p-5 hover:border-amber-800/50 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <span 
              className="badge"
              style={{ 
                backgroundColor: `${spiritTypeColors[comp.spirit_type]}30`,
                color: spiritTypeColors[comp.spirit_type],
                borderColor: `${spiritTypeColors[comp.spirit_type]}50`
              }}
            >
              {comp.spirit_type.charAt(0).toUpperCase() + comp.spirit_type.slice(1)}
            </span>
            <span className="badge-gray text-xs">{comp.source}</span>
          </div>
          <p className="text-gray-500 text-sm">
            {new Date(comp.transaction_date).toLocaleDateString()}
          </p>
        </div>
        <div className="text-right">
          <p className="font-display text-xl font-bold text-amber-500">
            ${comp.price_per_proof_gallon.toFixed(2)}
          </p>
          <p className="text-gray-500 text-xs">per proof gal</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <p className="text-gray-500 text-xs mb-1">Age</p>
          <p className="text-gray-200 font-medium">{comp.age_years} years</p>
        </div>
        <div>
          <p className="text-gray-500 text-xs mb-1">Proof</p>
          <p className="text-gray-200 font-medium">{comp.proof}</p>
        </div>
        <div>
          <p className="text-gray-500 text-xs mb-1">Volume</p>
          <p className="text-gray-200 font-medium">{comp.volume_proof_gallons.toFixed(0)} PG</p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-0.5 border-charcoal-800">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <Building2 className="w-4 h-4 text-gray-500" />
            <span className="text-gray-400 text-sm">{comp.seller}</span>
          </div>
          <ArrowUpRight className="w-4 h-4 text-gray-600" />
          <span className="text-gray-400 text-sm">{comp.buyer}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Package className="w-4 h-4 text-gray-500" />
          <span className="text-gray-400 text-sm">{comp.barrel_count} barrels</span>
        </div>
      </div>
    </div>
  )
}

export default function MarketComps() {
  const [spiritType, setSpiritType] = useState<string>('bourbon')
  const [ageRange, setAgeRange] = useState<string>('')
  const [page, setPage] = useState(1)

  const { data: compsData, isLoading: compsLoading } = useMarketComps({ 
    page, 
    per_page: 10,
    spirit_type: spiritType,
    age_range: ageRange || undefined
  })

  const { data: priceTrends, isLoading: trendsLoading } = usePriceTrends(spiritType, 12)
  const { data: priceStats, isLoading: statsLoading } = usePriceStats({ spirit_type: spiritType })

  const isLoading = compsLoading || trendsLoading || statsLoading

  if (isLoading) {
    return <LoadingSpinner fullPage text="Loading market data..." />
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="page-title mb-2">Market Comps</h1>
        <p className="text-gray-400">
          Real-time comparable transactions and pricing intelligence for bulk spirits
        </p>
      </div>

      {/* Price Overview Stats */}
      {priceStats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="card p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-500 text-sm">Average Price</span>
              <DollarSign className="w-5 h-5 text-amber-500" />
            </div>
            <p className="stat-value text-amber-500">
              ${priceStats.overall.avg_price.toFixed(2)}
            </p>
            <p className="text-gray-500 text-xs mt-1">per proof gallon</p>
          </div>

          <div className="card p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-500 text-sm">Median Price</span>
              <BarChart3 className="w-5 h-5 text-amber-500" />
            </div>
            <p className="stat-value">
              ${priceStats.overall.median_price.toFixed(2)}
            </p>
            <p className="text-gray-500 text-xs mt-1">per proof gallon</p>
          </div>

          <div className="card p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-500 text-sm">Price Range</span>
              <TrendingUp className="w-5 h-5 text-amber-500" />
            </div>
            <p className="stat-value text-sm">
              ${priceStats.overall.min_price.toFixed(2)} - ${priceStats.overall.max_price.toFixed(2)}
            </p>
            <p className="text-gray-500 text-xs mt-1">per proof gallon</p>
          </div>

          <div className="card p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-500 text-sm">Transactions</span>
              <Calendar className="w-5 h-5 text-amber-500" />
            </div>
            <p className="stat-value">
              {priceStats.overall.transaction_count.toLocaleString()}
            </p>
            <p className="text-gray-500 text-xs mt-1">Last 12 months</p>
          </div>
        </div>
      )}

      {/* Price Trends Chart */}
      {priceTrends && priceTrends.length > 0 && (
        <div className="card p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-display font-semibold text-gray-200">Price Trends</h3>
              <p className="text-gray-500 text-sm">12-month price history for {spiritType}</p>
            </div>
            <div className="flex items-center space-x-2">
              <Wine className="w-5 h-5 text-amber-500" />
              <select
                value={spiritType}
                onChange={(e) => setSpiritType(e.target.value)}
                className="input py-2 text-sm"
              >
                <option value="bourbon">Bourbon</option>
                <option value="rye">Rye</option>
                <option value="scotch">Scotch</option>
                <option value="rum">Rum</option>
                <option value="tequila">Tequila</option>
              </select>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={priceTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                <XAxis 
                  dataKey="month" 
                  stroke="#6b7280" 
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis 
                  stroke="#6b7280" 
                  fontSize={12}
                  tickLine={false}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1a1a1a', 
                    border: '0.5px solid #262626',
                    borderRadius: '8px'
                  }}
                  labelStyle={{ color: '#9ca3af' }}
                  formatter={(value: number) => [`$${value.toFixed(2)}`, 'Avg Price']}
                />
                <Line 
                  type="monotone" 
                  dataKey="avg_price" 
                  stroke="#92400E" 
                  strokeWidth={2}
                  dot={{ fill: '#92400E', strokeWidth: 0, r: 4 }}
                  activeDot={{ r: 6, fill: '#d97706' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Price by Age Chart */}
      {priceStats?.by_age && priceStats.by_age.length > 0 && (
        <div className="card p-6 mb-8">
          <h3 className="font-display font-semibold text-gray-200 mb-6">
            Average Price by Age
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priceStats.by_age}>
                <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                <XAxis 
                  dataKey="age" 
                  stroke="#6b7280" 
                  fontSize={12}
                  tickLine={false}
                  tickFormatter={(value) => `${value}yr`}
                />
                <YAxis 
                  stroke="#6b7280" 
                  fontSize={12}
                  tickLine={false}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1a1a1a', 
                    border: '0.5px solid #262626',
                    borderRadius: '8px'
                  }}
                  labelStyle={{ color: '#9ca3af' }}
                  formatter={(value: number) => [`$${value.toFixed(2)}`, 'Avg Price']}
                  labelFormatter={(label) => `${label} years old`}
                />
                <Bar dataKey="avg_price" fill="#92400E" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-500" />
          <select
            value={spiritType}
            onChange={(e) => setSpiritType(e.target.value)}
            className="input py-2"
          >
            <option value="bourbon">Bourbon</option>
            <option value="rye">Rye</option>
            <option value="scotch">Scotch</option>
            <option value="rum">Rum</option>
            <option value="tequila">Tequila</option>
          </select>
        </div>
        <div className="flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-gray-500" />
          <select
            value={ageRange}
            onChange={(e) => setAgeRange(e.target.value)}
            className="input py-2"
          >
            <option value="">All Ages</option>
            <option value="2-4">2-4 years</option>
            <option value="5-7">5-7 years</option>
            <option value="8-10">8-10 years</option>
            <option value="11+">11+ years</option>
          </select>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="mb-6">
        <h3 className="font-display font-semibold text-gray-200 mb-4">
          Recent Comparable Transactions
        </h3>
      </div>

      {compsData?.items && compsData.items.length > 0 ? (
        <>
          <div className="space-y-4">
            {compsData.items.map((comp: MarketComp) => (
              <CompCard key={comp.id} comp={comp} />
            ))}
          </div>

          {/* Pagination */}
          {compsData.total_pages > 1 && (
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-0.5 border-charcoal-800">
              <p className="text-gray-500 text-sm">
                Showing {((page - 1) * 10) + 1} - {Math.min(page * 10, compsData.total)} of {compsData.total} transactions
              </p>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="btn-secondary text-sm disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-gray-400 text-sm px-3">
                  Page {page} of {compsData.total_pages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(compsData.total_pages, p + 1))}
                  disabled={page === compsData.total_pages}
                  className="btn-secondary text-sm disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-charcoal-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="w-8 h-8 text-gray-500" />
          </div>
          <h3 className="font-display text-lg font-semibold text-gray-300 mb-2">
            No transactions found
          </h3>
          <p className="text-gray-500">
            Try adjusting your filters
          </p>
        </div>
      )}
    </div>
  )
}
