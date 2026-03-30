import { forwardRef } from 'react'
import { clsx } from 'clsx'
import { Thermometer, Snowflake, Flame } from 'lucide-react'
import type { TemperatureZone } from '../../types'

interface TemperatureIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  zone: TemperatureZone
  temperature?: number
  showIcon?: boolean
  showLabel?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const zoneConfig = {
  frozen: {
    icon: Snowflake,
    label: 'Frozen',
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/10',
    borderColor: 'border-cyan-500/30',
    range: '-25°C to -18°C',
  },
  refrigerated: {
    icon: Thermometer,
    label: 'Refrigerated',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
    range: '0°C to 4°C',
  },
  ambient: {
    icon: Flame,
    label: 'Ambient',
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30',
    range: '15°C to 25°C',
  },
}

export const TemperatureIndicator = forwardRef<HTMLDivElement, TemperatureIndicatorProps>(
  ({ 
    className, 
    zone, 
    temperature,
    showIcon = true,
    showLabel = true,
    size = 'md',
    ...props 
  }, ref) => {
    const config = zoneConfig[zone]
    const Icon = config.icon

    return (
      <div
        ref={ref}
        className={clsx(
          'inline-flex items-center gap-2 rounded-lg border',
          config.bgColor,
          config.borderColor,
          {
            'px-2 py-1': size === 'sm',
            'px-3 py-1.5': size === 'md',
            'px-4 py-2': size === 'lg',
          },
          className
        )}
        {...props}
      >
        {showIcon && (
          <Icon className={clsx(config.color, {
            'w-3 h-3': size === 'sm',
            'w-4 h-4': size === 'md',
            'w-5 h-5': size === 'lg',
          })} />
        )}
        <div className="flex flex-col">
          {showLabel && (
            <span className={clsx('font-medium', config.color, {
              'text-xs': size === 'sm',
              'text-sm': size === 'md' || size === 'lg',
            })}>
              {config.label}
            </span>
          )}
          {temperature !== undefined && (
            <span className="text-xs text-neutral-400">
              {temperature}°C
            </span>
          )}
          {!temperature && showLabel && size !== 'sm' && (
            <span className="text-xs text-neutral-500">
              {config.range}
            </span>
          )}
        </div>
      </div>
    )
  }
)
TemperatureIndicator.displayName = 'TemperatureIndicator'

// Temperature Gauge for real-time monitoring
interface TemperatureGaugeProps extends React.HTMLAttributes<HTMLDivElement> {
  currentTemp: number
  minTemp: number
  maxTemp: number
  zone: TemperatureZone
  label?: string
}

export const TemperatureGauge = forwardRef<HTMLDivElement, TemperatureGaugeProps>(
  ({ className, currentTemp, minTemp, maxTemp, zone, label, ...props }, ref) => {
    const range = maxTemp - minTemp
    const percentage = Math.min(Math.max(((currentTemp - minTemp) / range) * 100, 0), 100)
    
    const isExcursion = currentTemp < minTemp || currentTemp > maxTemp
    
    const zoneColors = {
      frozen: 'from-cyan-500 to-blue-500',
      refrigerated: 'from-blue-400 to-blue-600',
      ambient: 'from-amber-400 to-orange-500',
    }

    return (
      <div
        ref={ref}
        className={clsx('p-4 rounded-xl bg-[#141414] border border-white/[0.08]', className)}
        {...props}
      >
        {label && (
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-white">{label}</span>
            <TemperatureIndicator zone={zone} size="sm" showLabel={false} />
          </div>
        )}
        
        <div className="flex items-end gap-2 mb-2">
          <span className={clsx(
            'text-3xl font-bold',
            isExcursion ? 'text-red-400' : 'text-white'
          )}>
            {currentTemp}°C
          </span>
          <span className="text-sm text-neutral-500 mb-1">
            Target: {minTemp}°C - {maxTemp}°C
          </span>
        </div>
        
        {/* Gauge Bar */}
        <div className="relative h-2 bg-neutral-800 rounded-full overflow-hidden">
          <div 
            className={clsx(
              'absolute h-full rounded-full transition-all duration-500',
              'bg-gradient-to-r',
              zoneColors[zone]
            )}
            style={{ width: `${percentage}%` }}
          />
          {isExcursion && (
            <div className="absolute inset-0 bg-red-500/20 animate-pulse" />
          )}
        </div>
        
        {/* Markers */}
        <div className="flex justify-between mt-1 text-xs text-neutral-500">
          <span>{minTemp}°C</span>
          <span>{maxTemp}°C</span>
        </div>
        
        {isExcursion && (
          <div className="mt-3 p-2 rounded-lg bg-red-500/10 border border-red-500/30">
            <p className="text-sm text-red-400 font-medium">
              ⚠️ Temperature Excursion Detected
            </p>
          </div>
        )}
      </div>
    )
  }
)
TemperatureGauge.displayName = 'TemperatureGauge'
