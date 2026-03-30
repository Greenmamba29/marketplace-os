import { useMemo } from 'react'

interface TemperatureGaugeProps {
  current: number
  min: number
  max: number
  target: number
  unit?: 'C' | 'F'
  size?: 'sm' | 'md' | 'lg'
}

export default function TemperatureGauge({
  current,
  min,
  max,
  target,
  unit = 'C',
  size = 'md',
}: TemperatureGaugeProps) {
  const sizeConfig = {
    sm: { width: 120, height: 60, stroke: 8, font: 'text-sm' },
    md: { width: 180, height: 90, stroke: 12, font: 'text-base' },
    lg: { width: 240, height: 120, stroke: 16, font: 'text-xl' },
  }

  const cfg = sizeConfig[size]
  const radius = (cfg.width / 2) - cfg.stroke
  const centerX = cfg.width / 2
  const centerY = cfg.height - cfg.stroke

  // Calculate gauge position
  const range = max - min
  const normalizedValue = Math.max(0, Math.min(1, (current - min) / range))
  const angle = Math.PI + (normalizedValue * Math.PI)

  // Determine color based on temperature
  const getColor = () => {
    const tolerance = (max - min) * 0.1
    if (current < min - tolerance || current > max + tolerance) return '#f43f5e' // rose-500
    if (current < min || current > max) return '#f59e0b' // amber-500
    return '#0891B2' // science-600
  }

  const arcPath = useMemo(() => {
    const startX = centerX + radius * Math.cos(Math.PI)
    const startY = centerY + radius * Math.sin(Math.PI)
    const endX = centerX + radius * Math.cos(0)
    const endY = centerY + radius * Math.sin(0)
    return `M ${startX} ${startY} A ${radius} ${radius} 0 0 1 ${endX} ${endY}`
  }, [centerX, centerY, radius])

  const valuePath = useMemo(() => {
    const endX = centerX + radius * Math.cos(angle)
    const endY = centerY + radius * Math.sin(angle)
    const largeArc = angle > Math.PI * 1.5 ? 0 : 1
    return `M ${centerX - radius} ${centerY} A ${radius} ${radius} 0 ${largeArc} 1 ${endX} ${endY}`
  }, [centerX, centerY, radius, angle])

  return (
    <div className="relative inline-flex flex-col items-center">
      <svg width={cfg.width} height={cfg.height} className="overflow-visible">
        {/* Background arc */}
        <path
          d={arcPath}
          fill="none"
          stroke="#1e293b"
          strokeWidth={cfg.stroke}
          strokeLinecap="round"
        />
        {/* Value arc */}
        <path
          d={valuePath}
          fill="none"
          stroke={getColor()}
          strokeWidth={cfg.stroke}
          strokeLinecap="round"
        />
        {/* Min/Max markers */}
        <text x={10} y={cfg.height - 5} className="fill-slate-500 text-xs">
          {min}°{unit}
        </text>
        <text x={cfg.width - 35} y={cfg.height - 5} className="fill-slate-500 text-xs">
          {max}°{unit}
        </text>
      </svg>
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full pt-2 ${cfg.font} font-mono font-semibold`}>
        <span style={{ color: getColor() }}>{current.toFixed(1)}°{unit}</span>
      </div>
      <div className="text-xs text-slate-500 mt-1">
        Target: {target}°{unit}
      </div>
    </div>
  )
}
