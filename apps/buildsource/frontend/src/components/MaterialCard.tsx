import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Truck, Clock, Leaf, FileText } from 'lucide-react';
import { Card, CardContent, CardFooter } from './ui/Card';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { Material } from '@types/index';

export interface MaterialCardProps {
  material: Material;
  showActions?: boolean;
  onAddToProject?: (material: Material) => void;
  onRequestQuote?: (material: Material) => void;
}

export const MaterialCard: React.FC<MaterialCardProps> = ({
  material,
  showActions = true,
  onAddToProject,
  onRequestQuote,
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  return (
    <Card hover className="h-full flex flex-col">
      <CardContent className="flex-1 p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <Badge variant="default" size="sm" className="mb-2 capitalize">
              {material.material_type.replace('_', ' ')}
            </Badge>
            <h3 className="text-lg font-semibold text-concrete-100 line-clamp-2">
              <Link to={`/materials/${material.id}`} className="hover:text-orange-500 transition-colors">
                {material.name}
              </Link>
            </h3>
          </div>
          {material.leed_points > 0 && (
            <Badge variant="leed-certified" size="sm">
              <Leaf className="w-3 h-3 mr-1" />
              LEED
            </Badge>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-concrete-400 line-clamp-2 mb-4">{material.description}</p>

        {/* Specs */}
        <div className="space-y-2 mb-4">
          {material.grade_specification && (
            <div className="flex items-center gap-2 text-sm">
              <FileText className="w-4 h-4 text-concrete-500" />
              <span className="text-concrete-300">{material.grade_specification}</span>
            </div>
          )}
          {material.astm_standard && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-concrete-500 font-mono text-xs">ASTM</span>
              <span className="text-concrete-300 font-mono text-xs">{material.astm_standard}</span>
            </div>
          )}
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-concrete-500" />
            <span className="text-concrete-400">
              {material.regional_sourcing_radius_miles} mi radius
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-concrete-500" />
            <span className="text-concrete-400">
              {material.delivery_lead_time_days} day lead
            </span>
          </div>
          {material.min_truck_load && (
            <div className="flex items-center gap-2 text-sm">
              <Truck className="w-4 h-4 text-concrete-500" />
              <span className="text-concrete-400">
                Min {material.min_truck_load} {material.unit_of_measure}
              </span>
            </div>
          )}
          {material.recycled_content_percent > 0 && (
            <div className="flex items-center gap-2 text-sm">
              <Leaf className="w-4 h-4 text-green-500" />
              <span className="text-green-400">
                {material.recycled_content_percent}% recycled
              </span>
            </div>
          )}
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-orange-500">
            {formatPrice(material.unit_price)}
          </span>
          <span className="text-sm text-concrete-500">/ {material.unit_of_measure}</span>
        </div>

        {/* Supplier */}
        {material.supplier && (
          <p className="mt-2 text-sm text-concrete-500">
            by {material.supplier.company_name}
          </p>
        )}
      </CardContent>

      {showActions && (
        <CardFooter className="px-5 py-4">
          <div className="flex gap-2 w-full">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => onAddToProject?.(material)}
            >
              Add to Project
            </Button>
            <Button
              variant="primary"
              size="sm"
              className="flex-1"
              onClick={() => onRequestQuote?.(material)}
            >
              Request Quote
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};
