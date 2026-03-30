interface LotStatusBadgeProps {
  status: 'available' | 'reserved' | 'expired' | 'quarantined' | 'depleted'
  size?: 'sm' | 'md'
}

const statusConfig = {
  available: {
    label: 'Available',
    className: 'bg-emerald-950 text-emerald-300 border-emerald-800',
  },
  reserved: {
    label: 'Reserved',
    className: 'bg-amber-950 text-amber-300 border-amber-800',
  },
  expired: {
    label: 'Expired',
    className: 'bg-rose-950 text-rose-300 border-rose-800',
  },
  quarantined: {
    label: 'Quarantined',
    className: 'bg-purple-950 text-purple-300 border-purple-800',
  },
  depleted: {
    label: 'Depleted',
    className: 'bg-slate-800 text-slate-400 border-slate-700',
  },
}

export default function LotStatusBadge({ status, size = 'md' }: LotStatusBadgeProps) {
  const config = statusConfig[status]
  const sizeClass = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-2.5 py-1'

  return (
    <span className={`inline-flex items-center font-medium rounded-full border ${sizeClass} ${config.className}`}>
      {config.label}
    </span>
  )
}
