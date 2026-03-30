import { Snowflake, Thermometer, ThermometerSnowflake, Flame } from 'lucide-react'

interface StorageTempBadgeProps {
  temperature: 'RT' | '2-8C' | '-20C' | '-80C' | 'LN2'
  showLabel?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const tempConfig = {
  'RT': {
    icon: Thermometer,
    label: 'Room Temp',
    color: 'text-slate-400',
    bgColor: 'bg-slate-900',
    borderColor: 'border-slate-700',
  },
  '2-8C': {
    icon: Snowflake,
    label: '2-8°C',
    color: 'text-science-400',
    bgColor: 'bg-science-950',
    borderColor: 'border-science-800',
  },
  '-20C': {
    icon: Snowflake,
    label: '-20°C',
    color: 'text-blue-400',
    bgColor: 'bg-blue-950',
    borderColor: 'border-blue-800',
  },
  '-80C': {
    icon: ThermometerSnowflake,
    label: '-80°C',
    color: 'text-indigo-400',
    bgColor: 'bg-indigo-950',
    borderColor: 'border-indigo-800',
  },
  'LN2': {
    icon: Flame,
    label: 'Liquid N₂',
    color: 'text-violet-400',
    bgColor: 'bg-violet-950',
    borderColor: 'border-violet-800',
  },
}

const sizeConfig = {
  sm: {
    icon: 'w-3 h-3',
    text: 'text-xs',
    padding: 'px-2 py-0.5',
  },
  md: {
    icon: 'w-4 h-4',
    text: 'text-sm',
    padding: 'px-2.5 py-1',
  },
  lg: {
    icon: 'w-5 h-5',
    text: 'text-base',
    padding: 'px-3 py-1.5',
  },
}

export default function StorageTempBadge({ 
  temperature, 
  showLabel = true, 
  size = 'md' 
}: StorageTempBadgeProps) {
  const config = tempConfig[temperature]
  const sizeCfg = sizeConfig[size]
  const Icon = config.icon

  return (
    <span className={`inline-flex items-center gap-1.5 ${sizeCfg.padding} ${config.bgColor} ${config.borderColor} border rounded-full`}>
      <Icon className={`${sizeCfg.icon} ${config.color}`} />
      {showLabel && (
        <span className={`${sizeCfg.text} font-medium ${config.color}`}>
          {config.label}
        </span>
      )}
    </span>
  )
}
