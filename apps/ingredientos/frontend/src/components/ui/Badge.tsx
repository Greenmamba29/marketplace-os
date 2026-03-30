import { cn } from '../../utils/cn'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'saffron' | 'emerald' | 'rose' | 'blue' | 'slate' | 'amber'
  size?: 'sm' | 'md'
  className?: string
}

export const Badge = ({ 
  children, 
  variant = 'slate', 
  size = 'md',
  className 
}: BadgeProps) => {
  const variants = {
    saffron: 'bg-saffron-500/10 text-saffron-400 border-saffron-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    rose: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    slate: 'bg-slate-700/50 text-slate-300 border-slate-600/50',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  }

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
  }

  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 rounded-full font-medium border',
      variants[variant],
      sizes[size],
      className
    )}>
      {children}
    </span>
  )
}

export default Badge
