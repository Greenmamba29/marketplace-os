import { cn } from '@/lib/utils';
import LoadingSpinner from './LoadingSpinner';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantClasses = {
  primary: 'bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-500',
  secondary: 'bg-slate-700 hover:bg-slate-600 text-slate-100 focus:ring-slate-500',
  outline: 'border border-slate-600 hover:bg-slate-800 text-slate-300 focus:ring-slate-500',
  ghost: 'hover:bg-slate-800 text-slate-300 focus:ring-slate-500',
  danger: 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-500',
};

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg font-medium',
        'transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2',
        'focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <LoadingSpinner size="sm" />}
      {!isLoading && leftIcon}
      {children}
      {!isLoading && rightIcon}
    </button>
  );
}
