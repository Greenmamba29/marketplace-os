import type { SamStatus } from '@/types'
import { CheckCircle, XCircle, Clock, AlertCircle, Ban } from 'lucide-react'

interface SamStatusBadgeProps {
  status: SamStatus
  showLabel?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const statusConfig: Record<SamStatus, {
  label: string
  className: string
  icon: typeof CheckCircle
}> = {
  'ACTIVE': {
    label: 'Active',
    className: 'badge-success',
    icon: CheckCircle,
  },
  'INACTIVE': {
    label: 'Inactive',
    className: 'badge-error',
    icon: XCircle,
  },
  'EXPIRED': {
    label: 'Expired',
    className: 'badge-error',
    icon: AlertCircle,
  },
  'PENDING': {
    label: 'Pending',
    className: 'badge-warning',
    icon: Clock,
  },
  'SUSPENDED': {
    label: 'Suspended',
    className: 'badge-error',
    icon: Ban,
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

export function SamStatusBadge({ 
  status, 
  showLabel = true, 
  size = 'md' 
}: SamStatusBadgeProps) {
  const config = statusConfig[status] || statusConfig['INACTIVE']
  const Icon = config.icon

  return (
    <span className={`inline-flex items-center rounded-full font-medium border ${config.className} ${sizeClasses[size]}`}>
      <Icon className={iconSizes[size]} />
      {showLabel && config.label}
    </span>
  )
}
