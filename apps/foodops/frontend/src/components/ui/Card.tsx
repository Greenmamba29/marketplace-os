import { forwardRef } from 'react'
import { clsx } from 'clsx'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined'
  hover?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', hover = false, padding = 'md', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx(
          'rounded-xl transition-all duration-200',
          {
            'bg-[#141414] border border-white/[0.08]': variant === 'default',
            'bg-[#1A1A1A] shadow-lg': variant === 'elevated',
            'bg-transparent border border-white/[0.08]': variant === 'outlined',
            'hover:border-white/15 hover:-translate-y-0.5': hover,
            'p-0': padding === 'none',
            'p-4': padding === 'sm',
            'p-6': padding === 'md',
            'p-8': padding === 'lg',
          },
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
Card.displayName = 'Card'

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  subtitle?: string
  action?: React.ReactNode
}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, title, subtitle, action, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx('flex items-start justify-between mb-4', className)}
        {...props}
      >
        <div className="flex-1 min-w-0">
          {title && <h3 className="text-lg font-semibold text-white">{title}</h3>}
          {subtitle && <p className="text-sm text-neutral-500 mt-1">{subtitle}</p>}
          {children}
        </div>
        {action && <div className="ml-4 flex-shrink-0">{action}</div>}
      </div>
    )
  }
)
CardHeader.displayName = 'CardHeader'

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={clsx('', className)} {...props}>
        {children}
      </div>
    )
  }
)
CardContent.displayName = 'CardContent'

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: 'left' | 'center' | 'right' | 'between'
}

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, align = 'left', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx(
          'mt-4 pt-4 border-t border-white/[0.08] flex items-center gap-3',
          {
            'justify-start': align === 'left',
            'justify-center': align === 'center',
            'justify-end': align === 'right',
            'justify-between': align === 'between',
          },
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
CardFooter.displayName = 'CardFooter'
