import { Loader2 } from 'lucide-react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  fullPage?: boolean
  text?: string
}

const sizeMap = {
  sm: 'w-4 h-4',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
}

export function LoadingSpinner({ size = 'md', fullPage = false, text }: LoadingSpinnerProps) {
  const spinner = (
    <div className={`flex flex-col items-center justify-center ${fullPage ? 'min-h-[60vh]' : ''}`}>
      <Loader2 className={`${sizeMap[size]} text-amber-600 animate-spin`} />
      {text && (
        <p className="mt-4 text-gray-500 text-sm">{text}</p>
      )}
    </div>
  )

  if (fullPage) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        {spinner}
      </div>
    )
  }

  return spinner
}
