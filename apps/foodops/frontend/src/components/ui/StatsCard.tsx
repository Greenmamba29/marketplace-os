import { forwardRef } from 'react'
import { clsx } from 'clsx'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface StatsCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  value: string | number
  subtitle?: string
  change?: number
  changeLabel?: string
  icon?: React.ReactNode
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info'
}

export const StatsCard = forwardRef<HTMLDivElement, StatsCardProps>(
  ({ 
    className, 
    title, 
    value, 
    subtitle,
    change,
    changeLabel = 'vs last period',
    icon,
    variant = 'default',
    ...props 
  }, ref) => {
    const isPositive = change && change > 0
    const isNegative = change && change < 0
    const isNeutral = change === 0 || change === undefined

    const variantStyles = {
      default: 'bg-[#141414] border-white/[0.08]',
      success: 'bg-green-500/5 border-green-500/20',
      warning: 'bg-amber-500/5 border-amber-500/20',
      error: 'bg-red-500/5 border-red-500/20',
      info: 'bg-blue-500/5 border-blue-500/20',
    }

    return (
      <div
        ref={ref}
        className={clsx(
          'rounded-xl border p-5 transition-all duration-200 hover:border-white/15',
          variantStyles[variant],
          className
        )}
        {...props}
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-neutral-500">{title}</p>
            <p className="text-2xl font-bold text-white mt-1">{value}</p>
            
            {subtitle && (
              <p className="text-sm text-neutral-500 mt-1">{subtitle}</p>
            )}
            
            {change !== undefined && (
              <div className="flex items-center gap-1.5 mt-2">
                <span className={clsx(
                  'flex items-center gap-1 text-xs font-medium',
                  isPositive && 'text-green-400',
                  isNegative && 'text-red-400',
                  isNeutral && 'text-neutral-400'
                )}>
                  {isPositive && <TrendingUp className="w-3 h-3" />}
                  {isNegative && <TrendingDown className="w-3 h-3" />}
                  {isNeutral && <Minus className="w-3 h-3" />}
                  {isPositive && '+'}{change}%
                </span>
                <span className="text-xs text-neutral-600">{changeLabel}</span>
              </div>
            )}
          </div>
          
          {icon && (
            <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-neutral-400">
              {icon}
            </div>
          )}
        </div>
      </div>
    )
  }
)
StatsCard.displayName = 'StatsCard'
