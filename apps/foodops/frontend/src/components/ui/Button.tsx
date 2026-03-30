import { forwardRef } from 'react'
import { clsx } from 'clsx'
import { Loader2 } from 'lucide-react'

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  fullWidth?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = 'primary', 
    size = 'md', 
    isLoading = false,
    leftIcon,
    rightIcon,
    fullWidth = false,
    children,
    disabled,
    ...props 
  }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={clsx(
          'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0A0A0A]',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          {
            // Primary
            'bg-[#65A30D] text-white hover:bg-[#84CC16] focus:ring-[#65A30D]': variant === 'primary',
            // Secondary
            'bg-neutral-800 text-white hover:bg-neutral-700 focus:ring-neutral-600': variant === 'secondary',
            // Outline
            'bg-transparent border border-white/20 text-white hover:bg-white/5 hover:border-white/30 focus:ring-white/30': variant === 'outline',
            // Ghost
            'bg-transparent text-neutral-400 hover:text-white hover:bg-white/5': variant === 'ghost',
            // Danger
            'bg-red-600 text-white hover:bg-red-500 focus:ring-red-500': variant === 'danger',
            // Sizes
            'px-3 py-1.5 text-sm': size === 'sm',
            'px-4 py-2.5 text-sm': size === 'md',
            'px-6 py-3 text-base': size === 'lg',
            // Full width
            'w-full': fullWidth,
          },
          className
        )}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
        {!isLoading && leftIcon}
        {children}
        {!isLoading && rightIcon}
      </button>
    )
  }
)
Button.displayName = 'Button'
