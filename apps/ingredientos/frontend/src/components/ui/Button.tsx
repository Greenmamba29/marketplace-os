import { cn } from '../../utils/cn'
import { Loader2 } from 'lucide-react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className,
  disabled,
  ...props 
}: ButtonProps) => {
  const variants = {
    primary: 'bg-saffron-500 text-slate-950 hover:bg-saffron-400',
    secondary: 'bg-slate-800 text-slate-100 hover:bg-slate-700 border border-slate-700/50',
    ghost: 'text-slate-400 hover:text-saffron-400 hover:bg-saffron-500/10',
    outline: 'border border-slate-700/50 text-slate-300 hover:border-saffron-500/50 hover:text-saffron-400 bg-transparent',
    danger: 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  }

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
      {!isLoading && leftIcon}
      {children}
      {!isLoading && rightIcon}
    </button>
  )
}

export default Button
