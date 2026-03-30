import { cn } from '../../utils/cn'
import { CheckCircle2, Clock, XCircle, HelpCircle } from 'lucide-react'

interface ComplianceBadgeProps {
  status: 'verified' | 'pending' | 'missing' | 'unknown'
  label: string
  className?: string
}

export const ComplianceBadge = ({ status, label, className }: ComplianceBadgeProps) => {
  const configs = {
    verified: {
      icon: CheckCircle2,
      className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    },
    pending: {
      icon: Clock,
      className: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    },
    missing: {
      icon: XCircle,
      className: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    },
    unknown: {
      icon: HelpCircle,
      className: 'bg-slate-700/50 text-slate-400 border-slate-600/50',
    },
  }

  const config = configs[status]
  const Icon = config.icon

  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium border',
      config.className,
      className
    )}>
      <Icon className="w-3.5 h-3.5" />
      {label}
    </span>
  )
}

export default ComplianceBadge
