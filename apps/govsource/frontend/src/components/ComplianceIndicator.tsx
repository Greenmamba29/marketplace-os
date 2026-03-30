import { CheckCircle, XCircle, AlertCircle, Clock } from 'lucide-react'

interface ComplianceIndicatorProps {
  status: 'COMPLIANT' | 'NON_COMPLIANT' | 'PENDING' | 'WAIVED'
  showLabel?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const statusConfig = {
  'COMPLIANT': {
    label: 'Compliant',
    className: 'text-emerald-400',
    icon: CheckCircle,
  },
  'NON_COMPLIANT': {
    label: 'Non-Compliant',
    className: 'text-red-400',
    icon: XCircle,
  },
  'PENDING': {
    label: 'Pending',
    className: 'text-amber-400',
    icon: Clock,
  },
  'WAIVED': {
    label: 'Waived',
    className: 'text-blue-400',
    icon: AlertCircle,
  },
}

const sizeClasses = {
  sm: 'text-xs gap-1',
  md: 'text-sm gap-1.5',
  lg: 'text-base gap-2',
}

const iconSizes = {
  sm: 'w-3.5 h-3.5',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
}

export function ComplianceIndicator({ 
  status, 
  showLabel = true, 
  size = 'md' 
}: ComplianceIndicatorProps) {
  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <span className={`inline-flex items-center font-medium ${config.className} ${sizeClasses[size]}`}>
      <Icon className={iconSizes[size]} />
      {showLabel && config.label}
    </span>
  )
}

interface ComplianceScoreProps {
  score: number
  total: number
  size?: 'sm' | 'md' | 'lg'
}

export function ComplianceScore({ score, total, size = 'md' }: ComplianceScoreProps) {
  const percentage = Math.round((score / total) * 100)
  
  let colorClass = 'text-emerald-400'
  if (percentage < 80) colorClass = 'text-amber-400'
  if (percentage < 60) colorClass = 'text-red-400'

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  }

  return (
    <div className={`inline-flex items-center gap-2 ${sizeClasses[size]}`}>
      <div className="w-16 h-2 bg-slate-700 rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full ${percentage >= 80 ? 'bg-emerald-500' : percentage >= 60 ? 'bg-amber-500' : 'bg-red-500'}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className={`font-medium ${colorClass}`}>
        {score}/{total}
      </span>
    </div>
  )
}
