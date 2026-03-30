import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type BadgeVariant = 
  | 'default' 
  | 'primary' 
  | 'success' 
  | 'warning' 
  | 'danger' 
  | 'info'
  | 'leed-certified'
  | 'leed-silver'
  | 'leed-gold'
  | 'leed-platinum';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', size = 'md', ...props }, ref) => {
    const variants = {
      default: 'bg-concrete-800 text-concrete-300 border-concrete-700',
      primary: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      success: 'bg-green-500/20 text-green-400 border-green-500/30',
      warning: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      danger: 'bg-red-500/20 text-red-400 border-red-500/30',
      info: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'leed-certified': 'bg-leed-certified/20 text-leed-certified border-leed-certified/30',
      'leed-silver': 'bg-leed-silver/20 text-leed-silver border-leed-silver/30',
      'leed-gold': 'bg-leed-gold/20 text-leed-gold border-leed-gold/30',
      'leed-platinum': 'bg-leed-platinum/20 text-leed-platinum border-leed-platinum/30',
    };

    const sizes = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-3 py-1 text-sm',
    };

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center font-medium rounded-full border-0.5',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);

Badge.displayName = 'Badge';
