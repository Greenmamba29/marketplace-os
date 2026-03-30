import { TrendingUp, TrendingDown, type LucideIcon } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
  color?: 'gold' | 'green' | 'blue' | 'purple'
}

const colorClasses = {
  gold: 'bg-field-gold/10 text-field-gold border-field-gold/30',
  green: 'bg-crop-green/10 text-crop-green border-crop-green/30',
  blue: 'bg-sky-ag/10 text-sky-ag border-sky-ag/30',
  purple: 'bg-purple-500/10 text-purple-500 border-purple-500/30',
}

export default function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend,
  color = 'gold' 
}: StatCardProps) {
  return (
    <div className="stat-card">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <p className="stat-value">{value}</p>
          {subtitle && <p className="stat-label">{subtitle}</p>}
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      
      {trend && (
        <div className="flex items-center gap-2 mt-4">
          <div className={`flex items-center gap-1 text-sm ${trend.isPositive ? 'text-crop-green' : 'text-red-400'}`}>
            {trend.isPositive ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span>{Math.abs(trend.value)}%</span>
          </div>
          <span className="text-sm text-gray-500">vs last month</span>
        </div>
      )}
    </div>
  )
}
