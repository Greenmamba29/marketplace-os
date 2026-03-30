import { cn } from '@/lib/utils'

type StatusType = 
  | 'draft' 
  | 'published' 
  | 'bidding' 
  | 'evaluating' 
  | 'awarded' 
  | 'closed' 
  | 'cancelled'
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'completed'
  | 'in_stock'
  | 'low_stock'
  | 'out_of_stock'

interface StatusBadgeProps {
  status: StatusType
  className?: string
}

const statusConfig: Record<StatusType, { label: string; className: string }> = {
  // RFQ Statuses
  draft: { 
    label: 'Draft', 
    className: 'bg-gray-500/20 text-gray-400 border-gray-500/30' 
  },
  published: { 
    label: 'Published', 
    className: 'bg-sky-ag/20 text-sky-ag border-sky-ag/30' 
  },
  bidding: { 
    label: 'Bidding Open', 
    className: 'bg-field-gold/20 text-field-gold border-field-gold/30' 
  },
  evaluating: { 
    label: 'Evaluating', 
    className: 'bg-purple-500/20 text-purple-500 border-purple-500/30' 
  },
  awarded: { 
    label: 'Awarded', 
    className: 'bg-crop-green/20 text-crop-green border-crop-green/30' 
  },
  closed: { 
    label: 'Closed', 
    className: 'bg-gray-500/20 text-gray-400 border-gray-500/30' 
  },
  cancelled: { 
    label: 'Cancelled', 
    className: 'bg-red-500/20 text-red-400 border-red-500/30' 
  },
  
  // Order Statuses
  pending: { 
    label: 'Pending', 
    className: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30' 
  },
  confirmed: { 
    label: 'Confirmed', 
    className: 'bg-sky-ag/20 text-sky-ag border-sky-ag/30' 
  },
  processing: { 
    label: 'Processing', 
    className: 'bg-purple-500/20 text-purple-500 border-purple-500/30' 
  },
  shipped: { 
    label: 'Shipped', 
    className: 'bg-field-gold/20 text-field-gold border-field-gold/30' 
  },
  delivered: { 
    label: 'Delivered', 
    className: 'bg-crop-green/20 text-crop-green border-crop-green/30' 
  },
  completed: { 
    label: 'Completed', 
    className: 'bg-crop-green/20 text-crop-green border-crop-green/30' 
  },
  
  // Stock Statuses
  in_stock: { 
    label: 'In Stock', 
    className: 'bg-crop-green/20 text-crop-green border-crop-green/30' 
  },
  low_stock: { 
    label: 'Low Stock', 
    className: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30' 
  },
  out_of_stock: { 
    label: 'Out of Stock', 
    className: 'bg-red-500/20 text-red-400 border-red-500/30' 
  },
}

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.draft
  
  return (
    <span className={cn('status-pill border', config.className, className)}>
      {config.label}
    </span>
  )
}
