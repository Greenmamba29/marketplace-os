import { TrendingUp, TrendingDown, Minus, type LucideIcon } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  trend?: {
    value: number
    direction: 'up' | 'down' | 'neutral'
    label: string
  }
  color?: 'blue' | 'emerald' | 'amber' | 'purple' | 'red'
}

const colorClasses = {
  blue: {
    bg: 'bg-blue-500/10',
    icon: 'text-blue-400',
    border: 'border-blue-500/20',
  },
  emerald: {
    bg: 'bg-emerald-500/10',
    icon: 'text-emerald-400',
    border: 'border-emerald-500/20',
  },
  amber: {
    bg: 'bg-amber-500/10',
    icon: 'text-amber-400',
    border: 'border-amber-500/20',
  },
  purple: {
    bg: 'bg-purple-500/10',
    icon: 'text-purple-400',
    border: 'border-purple-500/20',
  },
  red: {
    bg: 'bg-red-500/10',
    icon: 'text-red-400',
    border: 'border-red-500/20',
  },
}

export function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend,
  color = 'blue' 
}: StatCardProps) {
  const colors = colorClasses[color]

  return (
    <div className={`card p-6 ${colors.border}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-400">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-white">{value}</p>
          {subtitle && (
            <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
          )}
          {trend && (
            <div className="mt-3 flex items-center gap-2">
              <span className={`inline-flex items-center gap-1 text-sm font-medium ${
                trend.direction === 'up' ? 'text-emerald-400' : 
                trend.direction === 'down' ? 'text-red-400' : 'text-slate-400'
              }`}>
                {trend.direction === 'up' && <TrendingUp className="w-4 h-4" />}
                {trend.direction === 'down' && <TrendingDown className="w-4 h-4" />}
                {trend.direction === 'neutral' && <Minus className="w-4 h-4" />}
                {trend.value > 0 && '+'}{trend.value}%
              </span>
              <span className="text-sm text-slate-500">{trend.label}</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colors.bg}`}>
          <Icon className={`w-6 h-6 ${colors.icon}`} />
        </div>
      </div>
    </div>
  )
}
