import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Package, MessageSquare, Clock } from 'lucide-react';
import { Card, CardContent, CardFooter } from './ui/Card';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { RFQSubmission } from '@types/index';

export interface RFQCardProps {
  rfq: RFQSubmission;
  showActions?: boolean;
}

export const RFQCard: React.FC<RFQCardProps> = ({ rfq, showActions = true }) => {
  const getStatusBadge = (status: RFQSubmission['status']) => {
    const variants: Record<string, Badge['props']['variant']> = {
      draft: 'default',
      submitted: 'info',
      open: 'success',
      closing_soon: 'warning',
      closed: 'default',
      awarded: 'primary',
      cancelled: 'danger',
    };
    return (
      <Badge variant={variants[status] || 'default'} size="sm" className="capitalize">
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getTimeRemaining = (deadline: string) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diff = deadlineDate.getTime() - now.getTime();
    
    if (diff <= 0) return 'Expired';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h remaining`;
    return `${hours}h remaining`;
  };

  return (
    <Card hover className="h-full flex flex-col">
      <CardContent className="flex-1 p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          {getStatusBadge(rfq.status)}
          <span className="text-xs text-concrete-500 font-mono">{rfq.rfq_number}</span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-concrete-100 mb-1">
          <Link to={`/rfqs/${rfq.id}`} className="hover:text-orange-500 transition-colors">
            {rfq.title}
          </Link>
        </h3>
        {rfq.project && (
          <p className="text-sm text-concrete-500 mb-3">{rfq.project.name}</p>
        )}

        {/* Items Summary */}
        <div className="flex items-center gap-2 text-sm mb-3">
          <Package className="w-4 h-4 text-concrete-500" />
          <span className="text-concrete-300">
            {rfq.items.length} item{rfq.items.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-concrete-500" />
            <span className="text-concrete-300">
              {rfq.delivery_address.city}, {rfq.delivery_address.state}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-concrete-500" />
            <span className="text-concrete-300">
              Delivery: {formatDate(rfq.delivery_date)}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-concrete-500" />
            <span className={`${
              new Date(rfq.acceptance_deadline) < new Date(Date.now() + 24 * 60 * 60 * 1000)
                ? 'text-orange-400'
                : 'text-concrete-300'
            }`}>
              {getTimeRemaining(rfq.acceptance_deadline)}
            </span>
          </div>
        </div>

        {/* Quotes Received */}
        {rfq.quotes_received > 0 && (
          <div className="flex items-center gap-2 text-sm">
            <MessageSquare className="w-4 h-4 text-concrete-500" />
            <span className="text-concrete-300">
              {rfq.quotes_received} quote{rfq.quotes_received !== 1 ? 's' : ''} received
            </span>
          </div>
        )}

        {/* Best Price */}
        {rfq.best_price && (
          <div className="mt-3 pt-3 border-t border-concrete-800">
            <span className="text-sm text-concrete-400">Best quote: </span>
            <span className="text-lg font-semibold text-green-400">
              ${rfq.best_price.toLocaleString()}
            </span>
          </div>
        )}
      </CardContent>

      {showActions && (
        <CardFooter className="px-5 py-4">
          <Button variant="outline" size="sm" className="w-full" asChild>
            <Link to={`/rfqs/${rfq.id}`}>View RFQ</Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};
