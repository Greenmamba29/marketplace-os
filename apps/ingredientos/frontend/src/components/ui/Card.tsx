import { cn } from '../../utils/cn'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  onClick?: () => void
}

export const Card = ({ children, className, hover = false, onClick }: CardProps) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-slate-900 border border-slate-700/50 rounded-xl overflow-hidden',
        hover && 'transition-all duration-300 hover:border-saffron-500/50 hover:shadow-glow-saffron cursor-pointer',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  )
}

export const CardHeader = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn('px-6 py-4 border-b border-slate-700/50', className)}>
    {children}
  </div>
)

export const CardContent = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn('p-6', className)}>
    {children}
  </div>
)

export const CardFooter = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn('px-6 py-4 border-t border-slate-700/50', className)}>
    {children}
  </div>
)

export default Card
