import { forwardRef } from 'react'
import { clsx } from 'clsx'
import { AlertCircle } from 'lucide-react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  fullWidth?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    label, 
    error, 
    helperText,
    leftIcon,
    rightIcon,
    fullWidth = false,
    ...props 
  }, ref) => {
    return (
      <div className={clsx({ 'w-full': fullWidth })}>
        {label && (
          <label className="block text-sm font-medium text-neutral-300 mb-1.5">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            className={clsx(
              'block rounded-lg bg-[#1A1A1A] border text-white placeholder-neutral-500',
              'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0A0A0A]',
              'transition-all duration-200',
              {
                'border-red-500/50 focus:border-red-500 focus:ring-red-500/20': error,
                'border-white/10 focus:border-[#65A30D] focus:ring-[#65A30D]/20': !error,
                'pl-10': leftIcon,
                'pr-10': rightIcon || error,
                'px-4': !leftIcon && !rightIcon && !error,
                'py-2.5 text-sm': props.type !== 'file',
                'w-full': fullWidth,
              },
              className
            )}
            {...props}
          />
          {rightIcon && !error && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500">
              {rightIcon}
            </div>
          )}
          {error && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500">
              <AlertCircle className="w-5 h-5" />
            </div>
          )}
        </div>
        {(error || helperText) && (
          <p className={clsx('mt-1.5 text-sm', error ? 'text-red-400' : 'text-neutral-500')}>
            {error || helperText}
          </p>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
  fullWidth?: boolean
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, label, error, helperText, fullWidth = false, ...props }, ref) => {
    return (
      <div className={clsx({ 'w-full': fullWidth })}>
        {label && (
          <label className="block text-sm font-medium text-neutral-300 mb-1.5">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          className={clsx(
            'block w-full rounded-lg bg-[#1A1A1A] border text-white placeholder-neutral-500',
            'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0A0A0A]',
            'transition-all duration-200 resize-y',
            {
              'border-red-500/50 focus:border-red-500 focus:ring-red-500/20': error,
              'border-white/10 focus:border-[#65A30D] focus:ring-[#65A30D]/20': !error,
              'px-4 py-2.5 text-sm': true,
            },
            className
          )}
          {...props}
        />
        {(error || helperText) && (
          <p className={clsx('mt-1.5 text-sm', error ? 'text-red-400' : 'text-neutral-500')}>
            {error || helperText}
          </p>
        )}
      </div>
    )
  }
)
TextArea.displayName = 'TextArea'

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  helperText?: string
  options: { value: string; label: string; disabled?: boolean }[]
  fullWidth?: boolean
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, helperText, options, fullWidth = false, ...props }, ref) => {
    return (
      <div className={clsx({ 'w-full': fullWidth })}>
        {label && (
          <label className="block text-sm font-medium text-neutral-300 mb-1.5">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <select
          ref={ref}
          className={clsx(
            'block w-full rounded-lg bg-[#1A1A1A] border text-white',
            'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0A0A0A]',
            'transition-all duration-200 appearance-none',
            'px-4 py-2.5 text-sm',
            {
              'border-red-500/50 focus:border-red-500 focus:ring-red-500/20': error,
              'border-white/10 focus:border-[#65A30D] focus:ring-[#65A30D]/20': !error,
            },
            className
          )}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
        </select>
        {(error || helperText) && (
          <p className={clsx('mt-1.5 text-sm', error ? 'text-red-400' : 'text-neutral-500')}>
            {error || helperText}
          </p>
        )}
      </div>
    )
  }
)
Select.displayName = 'Select'
