import { Link } from 'react-router-dom'
import { Star, Check, AlertCircle, Sprout, Beaker, Droplets } from 'lucide-react'
import type { AgInput } from '@/types'

interface InputCardProps {
  input: AgInput
  showActions?: boolean
}

const categoryIcons: Record<string, React.ElementType> = {
  seed: Sprout,
  fertilizer: Droplets,
  crop_protection: Beaker,
  equipment: () => null,
  livestock: () => null,
  other: () => null,
}

const categoryLabels: Record<string, string> = {
  seed: 'Seed',
  fertilizer: 'Fertilizer',
  crop_protection: 'Crop Protection',
  equipment: 'Equipment',
  livestock: 'Livestock',
  other: 'Other',
}

const formulationLabels: Record<string, string> = {
  EC: 'Emulsifiable Concentrate',
  SC: 'Suspension Concentrate',
  WG: 'Water Dispersible Granules',
  granular: 'Granular',
  liquid: 'Liquid',
  powder: 'Powder',
  pellet: 'Pellet',
  other: 'Other',
}

export default function InputCard({ input, showActions = true }: InputCardProps) {
  const CategoryIcon = categoryIcons[input.category] || Sprout
  
  const isInStock = input.stock_status === 'in_stock'
  const isLowStock = input.stock_status === 'low_stock'

  return (
    <div className="card group hover:border-field-gold/30 transition-all duration-300">
      {/* Image */}
      <div className="relative aspect-square bg-dark-700 overflow-hidden">
        {input.images && input.images.length > 0 ? (
          <img
            src={input.images[0]}
            alt={input.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-dark-700">
            <CategoryIcon className="w-16 h-16 text-dark-600" />
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <span className="badge-gold">
            {categoryLabels[input.category]}
          </span>
          {input.epa_registration_number && (
            <span className="badge-green flex items-center gap-1">
              <Check className="w-3 h-3" />
              EPA
            </span>
          )}
        </div>
        
        {/* Stock Status */}
        <div className="absolute top-3 right-3">
          {isInStock ? (
            <span className="badge-green">In Stock</span>
          ) : isLowStock ? (
            <span className="badge bg-yellow-500/20 text-yellow-500 border border-yellow-500/30">
              Low Stock
            </span>
          ) : (
            <span className="badge-gray">Out of Stock</span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Brand & Rating */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-field-gold font-medium">{input.brand}</span>
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 text-field-gold fill-field-gold" />
            <span className="text-xs text-gray-400">
              {input.rating.toFixed(1)} ({input.review_count})
            </span>
          </div>
        </div>

        {/* Name */}
        <Link to={`/input/${input.id}`}>
          <h3 className="font-semibold text-white hover:text-field-gold transition-colors line-clamp-2 mb-2">
            {input.name}
          </h3>
        </Link>

        {/* Details */}
        <div className="space-y-1 mb-3">
          {input.formulation_type && (
            <p className="text-xs text-gray-500">
              {formulationLabels[input.formulation_type]}
            </p>
          )}
          {input.active_ingredients && input.active_ingredients.length > 0 && (
            <p className="text-xs text-gray-500 line-clamp-1">
              AI: {input.active_ingredients.map(ai => `${ai.name} ${ai.percentage}%`).join(', ')}
            </p>
          )}
          {input.npk_ratio && (
            <p className="text-xs text-gray-500">
              N-P-K: {input.npk_ratio.nitrogen}-{input.npk_ratio.phosphorus}-{input.npk_ratio.potassium}
            </p>
          )}
        </div>

        {/* Crop Compatibility */}
        {input.crop_compatibility && input.crop_compatibility.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {input.crop_compatibility.slice(0, 3).map((crop) => (
              <span key={crop} className="text-xs px-2 py-0.5 bg-dark-700 text-gray-400 rounded">
                {crop}
              </span>
            ))}
            {input.crop_compatibility.length > 3 && (
              <span className="text-xs px-2 py-0.5 bg-dark-700 text-gray-400 rounded">
                +{input.crop_compatibility.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Price & Supplier */}
        <div className="flex items-end justify-between pt-3 border-t border-0.5 border-dark-600/30">
          <div>
            <p className="text-lg font-bold text-white">
              ${input.base_price.toFixed(2)}
            </p>
            <p className="text-xs text-gray-500">per {input.unit}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">from</p>
            <p className="text-sm text-gray-400">{input.supplier_name}</p>
          </div>
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex gap-2 mt-4">
            <Link
              to={`/input/${input.id}`}
              className="flex-1 btn-secondary text-sm py-2"
            >
              View Details
            </Link>
            <button
              disabled={!isInStock}
              className="flex-1 btn-primary text-sm py-2 disabled:opacity-50"
            >
              Add to RFQ
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
