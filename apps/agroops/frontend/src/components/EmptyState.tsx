import { type LucideIcon } from 'lucide-react'
import { Link } from 'react-router-dom'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: {
    label: string
    href: string
  }
  secondaryAction?: {
    label: string
    onClick: () => void
  }
}

export default function EmptyState({ 
  icon: Icon, 
  title, 
  description, 
  action,
  secondaryAction 
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-20 h-20 bg-dark-700 rounded-full flex items-center justify-center mb-6">
        <Icon className="w-10 h-10 text-gray-500" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400 max-w-md mb-6">{description}</p>
      
      <div className="flex gap-3">
        {action && (
          <Link to={action.href} className="btn-primary">
            {action.label}
          </Link>
        )}
        {secondaryAction && (
          <button onClick={secondaryAction.onClick} className="btn-secondary">
            {secondaryAction.label}
          </button>
        )}
      </div>
    </div>
  )
}
