import { forwardRef } from 'react'
import { clsx } from 'clsx'

export type BadgeVariant = 
  | 'default'
  | 'primary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'frozen'
  | 'refrigerated'
  | 'ambient'
  | 'rte'
  | 'raw'
  | 'organic'
  | 'kosher'
  | 'halal'
  | 'allergen'
  | 'expiry-critical'
  | 'expiry-warning'
  | 'expiry-good'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  size?: 'sm' | 'md'
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-neutral-800 text-neutral-300 border-neutral-700',
  primary: 'bg-[#65A30D]/15 text-[#A3E635] border-[#65A30D]/30',
  success: 'bg-green-500/15 text-green-400 border-green-500/30',
  warning: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  error: 'bg-red-500/15 text-red-400 border-red-500/30',
  info: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  frozen: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
  refrigerated: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  ambient: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  rte: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  raw: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
  organic: 'bg-[#65A30D]/15 text-[#A3E635] border-[#65A30D]/30',
  kosher: 'bg-violet-500/15 text-violet-400 border-violet-500/30',
  halal: 'bg-teal-500/15 text-teal-400 border-teal-500/30',
  allergen: 'bg-red-500/15 text-red-400 border-red-500/30',
  'expiry-critical': 'bg-red-500/20 text-red-300 border-red-500/40',
  'expiry-warning': 'bg-amber-500/20 text-amber-300 border-amber-500/40',
  'expiry-good': 'bg-green-500/20 text-green-300 border-green-500/40',
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', size = 'md', children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={clsx(
          'inline-flex items-center font-medium border rounded-full',
          {
            'px-2 py-0.5 text-xs': size === 'sm',
            'px-3 py-1 text-sm': size === 'md',
          },
          variantStyles[variant],
          className
        )}
        {...props}
      >
        {children}
      </span>
    )
  }
)
Badge.displayName = 'Badge'

// Temperature Zone Badge
interface TempZoneBadgeProps extends Omit<BadgeProps, 'variant'> {
  zone: 'frozen' | 'refrigerated' | 'ambient'
}

export const TempZoneBadge = forwardRef<HTMLSpanElement, TempZoneBadgeProps>(
  ({ zone, ...props }, ref) => {
    const labels = {
      frozen: 'Frozen',
      refrigerated: 'Refrigerated',
      ambient: 'Ambient',
    }
    return (
      <Badge ref={ref} variant={zone} {...props}>
        {labels[zone]}
      </Badge>
    )
  }
)
TempZoneBadge.displayName = 'TempZoneBadge'

// Food Safety Badge
interface FoodSafetyBadgeProps extends Omit<BadgeProps, 'variant'> {
  category: 'RTE' | 'raw' | 'processed'
}

export const FoodSafetyBadge = forwardRef<HTMLSpanElement, FoodSafetyBadgeProps>(
  ({ category, ...props }, ref) => {
    const labels = {
      RTE: 'Ready-to-Eat',
      raw: 'Raw',
      processed: 'Processed',
    }
    return (
      <Badge ref={ref} variant={category === 'RTE' ? 'rte' : category === 'raw' ? 'raw' : 'default'} {...props}>
        {labels[category]}
      </Badge>
    )
  }
)
FoodSafetyBadge.displayName = 'FoodSafetyBadge'

// Certification Badge
interface CertificationBadgeProps extends Omit<BadgeProps, 'variant'> {
  certification: 'organic' | 'kosher' | 'halal' | 'non_gmo' | 'gluten_free' | 'vegan'
}

export const CertificationBadge = forwardRef<HTMLSpanElement, CertificationBadgeProps>(
  ({ certification, ...props }, ref) => {
    const labels = {
      organic: 'Organic',
      kosher: 'Kosher',
      halal: 'Halal',
      non_gmo: 'Non-GMO',
      gluten_free: 'GF',
      vegan: 'Vegan',
    }
    const variants: Record<string, BadgeVariant> = {
      organic: 'organic',
      kosher: 'kosher',
      halal: 'halal',
      non_gmo: 'primary',
      gluten_free: 'success',
      vegan: 'success',
    }
    return (
      <Badge ref={ref} variant={variants[certification]} size="sm" {...props}>
        {labels[certification]}
      </Badge>
    )
  }
)
CertificationBadge.displayName = 'CertificationBadge'

// Expiry Badge
interface ExpiryBadgeProps extends Omit<BadgeProps, 'variant'> {
  daysToExpiry: number
}

export const ExpiryBadge = forwardRef<HTMLSpanElement, ExpiryBadgeProps>(
  ({ daysToExpiry, ...props }, ref) => {
    let variant: BadgeVariant = 'expiry-good'
    let label = `${daysToExpiry} days`
    
    if (daysToExpiry <= 3) {
      variant = 'expiry-critical'
      label = daysToExpiry === 0 ? 'Expires today' : daysToExpiry === 1 ? '1 day' : `${daysToExpiry} days`
    } else if (daysToExpiry <= 7) {
      variant = 'expiry-warning'
    }
    
    return (
      <Badge ref={ref} variant={variant} size="sm" {...props}>
        {label}
      </Badge>
    )
  }
)
ExpiryBadge.displayName = 'ExpiryBadge'
