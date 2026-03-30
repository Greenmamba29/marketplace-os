import { forwardRef } from 'react'
import { clsx } from 'clsx'
import { Package, AlertTriangle, Check } from 'lucide-react'
import type { Ingredient } from '../../types'
import { Badge, TempZoneBadge, FoodSafetyBadge, CertificationBadge, ExpiryBadge } from './Badge'
import { TemperatureIndicator } from './TemperatureIndicator'
import { Button } from './Button'

interface IngredientCardProps extends React.HTMLAttributes<HTMLDivElement> {
  ingredient: Ingredient
  onAddToRFQ?: (ingredient: Ingredient) => void
  showActions?: boolean
  variant?: 'default' | 'compact'
}

export const IngredientCard = forwardRef<HTMLDivElement, IngredientCardProps>(
  ({ 
    className, 
    ingredient, 
    onAddToRFQ,
    showActions = true,
    variant = 'default',
    ...props 
  }, ref) => {
    const hasAllergens = ingredient.allergens.length > 0
    const isExpiringSoon = ingredient.minDaysToExpiry <= 7

    if (variant === 'compact') {
      return (
        <div
          ref={ref}
          className={clsx(
            'flex items-center gap-4 p-3 rounded-lg bg-[#141414] border border-white/[0.08]',
            'hover:border-white/15 transition-colors',
            className
          )}
          {...props}
        >
          <div className="w-12 h-12 rounded-lg bg-neutral-800 flex items-center justify-center flex-shrink-0">
            {ingredient.images[0] ? (
              <img 
                src={ingredient.images[0]} 
                alt={ingredient.name}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <Package className="w-6 h-6 text-neutral-500" />
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-white truncate">{ingredient.name}</h4>
            <p className="text-sm text-neutral-500">{ingredient.supplierName}</p>
          </div>
          
          <div className="flex items-center gap-2">
            <TempZoneBadge zone={ingredient.temperatureZone} size="sm" />
            <span className="text-sm font-medium text-white">
              ${ingredient.unitPrice}/{ingredient.unitOfMeasure}
            </span>
          </div>
        </div>
      )
    }

    return (
      <div
        ref={ref}
        className={clsx(
          'rounded-xl bg-[#141414] border border-white/[0.08] overflow-hidden',
          'hover:border-white/15 transition-all duration-200 hover:-translate-y-0.5',
          className
        )}
        {...props}
      >
        {/* Image */}
        <div className="relative h-40 bg-neutral-800">
          {ingredient.images[0] ? (
            <img 
              src={ingredient.images[0]} 
              alt={ingredient.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="w-16 h-16 text-neutral-700" />
            </div>
          )}
          
          {/* Badges Overlay */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            <TempZoneBadge zone={ingredient.temperatureZone} size="sm" />
            <FoodSafetyBadge category={ingredient.foodSafetyCategory} size="sm" />
          </div>
          
          {hasAllergens && (
            <div className="absolute top-3 right-3">
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-red-500/20 border border-red-500/30">
                <AlertTriangle className="w-3 h-3 text-red-400" />
                <span className="text-xs font-medium text-red-400">
                  {ingredient.allergens.length} Allergen{ingredient.allergens.length > 1 ? 's' : ''}
                </span>
              </div>
            </div>
          )}
        </div>
        
        {/* Content */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <h3 className="font-semibold text-white">{ingredient.name}</h3>
              <p className="text-sm text-neutral-500">{ingredient.supplierName}</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-white">${ingredient.unitPrice}</p>
              <p className="text-xs text-neutral-500">per {ingredient.unitOfMeasure}</p>
            </div>
          </div>
          
          <p className="text-sm text-neutral-400 line-clamp-2 mb-3">
            {ingredient.description}
          </p>
          
          {/* Certifications */}
          {ingredient.certifications.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {ingredient.certifications.map((cert) => (
                <CertificationBadge key={cert} certification={cert} />
              ))}
            </div>
          )}
          
          {/* Info Row */}
          <div className="flex items-center justify-between text-xs text-neutral-500 mb-4">
            <span>SKU: {ingredient.sku}</span>
            <span>Min: {ingredient.minOrderQuantity} {ingredient.unitOfMeasure}</span>
          </div>
          
          {/* Actions */}
          {showActions && (
            <div className="flex gap-2">
              <Button 
                variant="primary" 
                size="sm" 
                fullWidth
                leftIcon={<Check className="w-4 h-4" />}
                onClick={() => onAddToRFQ?.(ingredient)}
              >
                Add to RFQ
              </Button>
            </div>
          )}
        </div>
      </div>
    )
  }
)
IngredientCard.displayName = 'IngredientCard'
