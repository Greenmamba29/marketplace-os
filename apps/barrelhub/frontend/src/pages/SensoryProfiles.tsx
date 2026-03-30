import { useState } from 'react'
import { 
  Wine, 
  Star, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Search,
  Filter,
  BarChart3,
  Droplets,
  Flame,
  Flower2,
  Apple,
  Sparkles,
  FlameKindling
} from 'lucide-react'
import { useSensoryProfiles, useSensoryDistribution } from '../hooks/useBarrels'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import type { SensoryProfile } from '../types'

const categoryIcons: Record<string, React.ElementType> = {
  vanilla: Sparkles,
  caramel: Flame,
  oak: FlameKindling,
  spice: Flame,
  fruit: Apple,
  floral: Flower2,
}

function SensoryCard({ profile }: { profile: SensoryProfile }) {
  const [showDetails, setShowDetails] = useState(false)

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-400'
    if (score >= 6) return 'text-amber-400'
    return 'text-gray-400'
  }

  const getScoreBg = (score: number) => {
    if (score >= 8) return 'bg-green-900/30'
    if (score >= 6) return 'bg-amber-900/30'
    return 'bg-gray-800'
  }

  return (
    <div className="card overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-0.5 border-charcoal-800">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-display text-lg font-semibold text-gray-100">
              Barrel #{profile.barrel_number}
            </h3>
            <p className="text-gray-500 text-sm">
              Evaluated {new Date(profile.evaluation_date).toLocaleDateString()}
            </p>
          </div>
          <div className={`w-14 h-14 ${getScoreBg(profile.overall_score)} rounded-xl flex flex-col items-center justify-center`}>
            <span className={`text-2xl font-bold ${getScoreColor(profile.overall_score)}`}>
              {profile.overall_score.toFixed(1)}
            </span>
            <span className="text-gray-500 text-xs">/10</span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="p-5 grid grid-cols-3 gap-4">
        <div className="text-center">
          <p className="text-gray-500 text-xs mb-1">Nose Intensity</p>
          <div className="flex items-center justify-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <div 
                key={i} 
                className={`w-2 h-2 rounded-full ${i < profile.nose.intensity / 2 ? 'bg-amber-500' : 'bg-charcoal-700'}`}
              />
            ))}
          </div>
          <p className="text-gray-300 text-sm mt-1">{profile.nose.intensity}/10</p>
        </div>
        <div className="text-center">
          <p className="text-gray-500 text-xs mb-1">Palate Intensity</p>
          <div className="flex items-center justify-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <div 
                key={i} 
                className={`w-2 h-2 rounded-full ${i < profile.palate.intensity / 2 ? 'bg-amber-500' : 'bg-charcoal-700'}`}
              />
            ))}
          </div>
          <p className="text-gray-300 text-sm mt-1">{profile.palate.intensity}/10</p>
        </div>
        <div className="text-center">
          <p className="text-gray-500 text-xs mb-1">Finish Length</p>
          <div className="flex items-center justify-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <div 
                key={i} 
                className={`w-2 h-2 rounded-full ${i < profile.finish.length / 2 ? 'bg-amber-500' : 'bg-charcoal-700'}`}
              />
            ))}
          </div>
          <p className="text-gray-300 text-sm mt-1">{profile.finish.length}/10</p>
        </div>
      </div>

      {/* Flavor Profile */}
      <div className="px-5 pb-5">
        <div className="bg-charcoal-950 rounded-lg p-4">
          <p className="text-gray-500 text-xs mb-3">Flavor Profile</p>
          <div className="space-y-2">
            {[
              { label: 'Vanilla', value: profile.nose.vanilla, palate: profile.palate.vanilla },
              { label: 'Caramel', value: profile.nose.caramel, palate: profile.palate.caramel },
              { label: 'Oak', value: profile.nose.oak, palate: profile.palate.oak },
              { label: 'Spice', value: profile.nose.spice, palate: profile.palate.spice },
              { label: 'Fruit', value: profile.nose.fruit, palate: profile.palate.fruit },
            ].map((flavor) => (
              <div key={flavor.label} className="flex items-center space-x-3">
                <span className="text-gray-400 text-xs w-16">{flavor.label}</span>
                <div className="flex-1 h-2 bg-charcoal-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-amber-600 rounded-full"
                    style={{ width: `${flavor.value * 10}%` }}
                  />
                </div>
                <span className="text-gray-500 text-xs w-8 text-right">{flavor.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tasting Notes */}
      {profile.tasting_notes && (
        <div className="px-5 pb-5">
          <div className="bg-charcoal-950 rounded-lg p-4">
            <p className="text-gray-500 text-xs mb-2">Tasting Notes</p>
            <p className="text-gray-300 text-sm leading-relaxed">{profile.tasting_notes}</p>
          </div>
        </div>
      )}

      {/* Recommended Use */}
      {profile.recommended_use && (
        <div className="px-5 pb-5">
          <div className="flex items-center space-x-2">
            <Star className="w-4 h-4 text-amber-500" />
            <span className="text-gray-400 text-xs">Recommended: </span>
            <span className="text-amber-400 text-sm">{profile.recommended_use}</span>
          </div>
        </div>
      )}
    </div>
  )
}

function ScoreDistributionChart({ data }: { data: { ranges: Array<{ min: number; max: number; count: number }>; average: number } }) {
  const chartData = data.ranges.map(r => ({
    range: `${r.min}-${r.max}`,
    count: r.count,
    label: `${r.min}-${r.max}`
  }))

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
          <XAxis 
            dataKey="range" 
            stroke="#6b7280" 
            fontSize={12}
            tickLine={false}
          />
          <YAxis 
            stroke="#6b7280" 
            fontSize={12}
            tickLine={false}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1a1a1a', 
              border: '0.5px solid #262626',
              borderRadius: '8px'
            }}
            labelStyle={{ color: '#9ca3af' }}
          />
          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={index === 2 ? '#92400E' : '#451a03'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default function SensoryProfiles() {
  const [searchQuery, setSearchQuery] = useState('')
  const [spiritType, setSpiritType] = useState<string>('')
  const [page, setPage] = useState(1)

  const { data: profilesData, isLoading: profilesLoading } = useSensoryProfiles({ 
    page, 
    per_page: 12,
    search: searchQuery || undefined,
    spirit_type: spiritType || undefined
  })

  const { data: distribution, isLoading: distributionLoading } = useSensoryDistribution(spiritType)

  const isLoading = profilesLoading || distributionLoading

  if (isLoading) {
    return <LoadingSpinner fullPage text="Loading sensory profiles..." />
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="page-title mb-2">Sensory Profiles</h1>
        <p className="text-gray-400">
          Professional tasting notes and sensory evaluation scores from certified evaluators
        </p>
      </div>

      {/* Stats Overview */}
      {distribution && (
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold text-gray-200">Score Distribution</h3>
              <BarChart3 className="w-5 h-5 text-amber-500" />
            </div>
            <ScoreDistributionChart data={distribution.overall} />
            <div className="mt-4 flex items-center justify-between">
              <span className="text-gray-500 text-sm">Average Score</span>
              <span className="text-amber-400 font-bold">{distribution.overall.average.toFixed(1)}</span>
            </div>
          </div>

          <div className="lg:col-span-2 card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold text-gray-200">Category Averages</h3>
              <Wine className="w-5 h-5 text-amber-500" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(distribution.by_category || {}).map(([category, data]: [string, { average: number }]) => (
                <div key={category} className="text-center p-4 bg-charcoal-950 rounded-lg">
                  <p className="text-gray-500 text-xs mb-2 capitalize">{category}</p>
                  <p className="text-2xl font-bold text-amber-500">{data.average.toFixed(1)}</p>
                  <div className="flex items-center justify-center mt-2">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-3 h-3 ${i < Math.round(data.average / 2) ? 'text-amber-500' : 'text-charcoal-700'}`}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search by barrel number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-12"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-500" />
          <select
            value={spiritType}
            onChange={(e) => setSpiritType(e.target.value)}
            className="input py-2"
          >
            <option value="">All Spirit Types</option>
            <option value="bourbon">Bourbon</option>
            <option value="rye">Rye</option>
            <option value="scotch">Scotch</option>
            <option value="rum">Rum</option>
            <option value="tequila">Tequila</option>
          </select>
        </div>
      </div>

      {/* Profiles Grid */}
      {profilesData?.items && profilesData.items.length > 0 ? (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {profilesData.items.map((profile: SensoryProfile) => (
              <SensoryCard key={profile.id} profile={profile} />
            ))}
          </div>

          {/* Pagination */}
          {profilesData.total_pages > 1 && (
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-0.5 border-charcoal-800">
              <p className="text-gray-500 text-sm">
                Showing {((page - 1) * 12) + 1} - {Math.min(page * 12, profilesData.total)} of {profilesData.total} profiles
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
                  Page {page} of {profilesData.total_pages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(profilesData.total_pages, p + 1))}
                  disabled={page === profilesData.total_pages}
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
            <Wine className="w-8 h-8 text-gray-500" />
          </div>
          <h3 className="font-display text-lg font-semibold text-gray-300 mb-2">
            No sensory profiles found
          </h3>
          <p className="text-gray-500">
            Try adjusting your search or filters
          </p>
        </div>
      )}
    </div>
  )
}
