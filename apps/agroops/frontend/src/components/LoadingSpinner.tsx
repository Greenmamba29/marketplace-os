import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  fullScreen?: boolean
}

const sizeClasses = {
  sm: 'w-5 h-5',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
}

export default function LoadingSpinner({ 
  size = 'md', 
  className,
  fullScreen = false 
}: LoadingSpinnerProps) {
  const spinner = (
    <div className={cn('relative', sizeClasses[size], className)}>
      <div className="absolute inset-0 border-2 border-dark-600 rounded-full" />
      <div className="absolute inset-0 border-2 border-field-gold rounded-full border-t-transparent animate-spin" />
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-dark-900/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="flex flex-col items-center gap-4">
          {spinner}
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center p-8">
      {spinner}
    </div>
  )
}
