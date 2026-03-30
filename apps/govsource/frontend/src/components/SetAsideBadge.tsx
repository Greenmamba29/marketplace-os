import type { SetAsideType } from '@/types'
import { 
  Award, 
  MapPin, 
  Shield, 
  User, 
  Building,
  Star,
  CheckCircle
} from 'lucide-react'

interface SetAsideBadgeProps {
  type: SetAsideType
  showLabel?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const setAsideConfig: Record<SetAsideType, {
  label: string
  className: string
  icon: typeof Award
}> = {
  '8(a)': {
    label: '8(a)',
    className: 'badge-8a',
    icon: Award,
  },
  'HUBZone': {
    label: 'HUBZone',
    className: 'badge-hubzone',
    icon: MapPin,
  },
  'SDVOSB': {
    label: 'SDVOSB',
    className: 'badge-sdvosb',
    icon: Shield,
  },
  'VOSB': {
    label: 'VOSB',
    className: 'badge-sdvosb',
    icon: Shield,
  },
  'WOSB': {
    label: 'WOSB',
    className: 'badge-wosb',
    icon: User,
  },
  'EDWOSB': {
    label: 'EDWOSB',
    className: 'badge-wosb',
    icon: User,
  },
  'SDB': {
    label: 'SDB',
    className: 'badge-8a',
    icon: Building,
  },
  'NONE': {
    label: 'Full & Open',
    className: 'badge-info',
    icon: CheckCircle,
  },
}

const sizeClasses = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-2.5 py-1',
  lg: 'text-base px-3 py-1.5',
}

const iconSizes = {
  sm: 'w-3 h-3',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
}

export function SetAsideBadge({ type, showLabel = true, size = 'md' }: SetAsideBadgeProps) {
  const config = setAsideConfig[type] || setAsideConfig['NONE']
  const Icon = config.icon

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-medium border ${config.className} ${sizeClasses[size]}`}>
      <Icon className={iconSizes[size]} />
      {showLabel && config.label}
    </span>
  )
}

interface SetAsideListProps {
  setAsides: SetAsideType[]
  maxDisplay?: number
  size?: 'sm' | 'md' | 'lg'
}

export function SetAsideList({ setAsides, maxDisplay = 3, size = 'sm' }: SetAsideListProps) {
  if (!setAsides || setAsides.length === 0 || setAsides.includes('NONE')) {
    return <SetAsideBadge type="NONE" size={size} />
  }

  const displaySetAsides = setAsides.slice(0, maxDisplay)
  const remaining = setAsides.length - maxDisplay

  return (
    <div className="flex flex-wrap gap-1.5">
      {displaySetAsides.map((type) => (
        <SetAsideBadge key={type} type={type} size={size} />
      ))}
      {remaining > 0 && (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-700 text-slate-400 border border-slate-600`}>
          +{remaining} more
        </span>
      )}
    </div>
  )
}
