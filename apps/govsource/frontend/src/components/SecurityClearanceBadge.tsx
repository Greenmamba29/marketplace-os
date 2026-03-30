import type { SecurityClearance } from '@/types'
import { Lock, Shield, Eye, Unlock } from 'lucide-react'

interface SecurityClearanceBadgeProps {
  clearance: SecurityClearance
  showLabel?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const clearanceConfig: Record<SecurityClearance, {
  label: string
  className: string
  icon: typeof Lock
}> = {
  'TS/SCI': {
    label: 'TS/SCI',
    className: 'clearance-ts',
    icon: Lock,
  },
  'Top Secret': {
    label: 'Top Secret',
    className: 'clearance-ts',
    icon: Lock,
  },
  'Secret': {
    label: 'Secret',
    className: 'clearance-secret',
    icon: Shield,
  },
  'Confidential': {
    label: 'Confidential',
    className: 'clearance-secret',
    icon: Eye,
  },
  'Public Trust': {
    label: 'Public Trust',
    className: 'clearance-public',
    icon: Eye,
  },
  'None': {
    label: 'None Required',
    className: 'clearance-public',
    icon: Unlock,
  },
}

const sizeClasses = {
  sm: 'text-xs px-2 py-0.5 gap-1',
  md: 'text-sm px-2.5 py-1 gap-1.5',
  lg: 'text-base px-3 py-1.5 gap-2',
}

const iconSizes = {
  sm: 'w-3 h-3',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
}

export function SecurityClearanceBadge({ 
  clearance, 
  showLabel = true, 
  size = 'md' 
}: SecurityClearanceBadgeProps) {
  const config = clearanceConfig[clearance] || clearanceConfig['None']
  const Icon = config.icon

  return (
    <span className={`inline-flex items-center rounded-md font-medium ${config.className} ${sizeClasses[size]}`}>
      <Icon className={iconSizes[size]} />
      {showLabel && config.label}
    </span>
  )
}
