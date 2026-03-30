import { Tag, Building2, FileCode } from 'lucide-react'

interface CodeBadgeProps {
  code: string
  description?: string
  type: 'naics' | 'psc' | 'cage'
  isPrimary?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const typeConfig = {
  naics: {
    icon: Building2,
    label: 'NAICS',
    className: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  },
  psc: {
    icon: FileCode,
    label: 'PSC',
    className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  },
  cage: {
    icon: Tag,
    label: 'CAGE',
    className: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  },
}

const sizeClasses = {
  sm: 'text-xs px-2 py-0.5 gap-1',
  md: 'text-sm px-2.5 py-1 gap-1.5',
  lg: 'text-base px-3 py-1.5 gap-2',
}

const iconSizes = {
  sm: 'w-3 h-3',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
}

export function CodeBadge({ 
  code, 
  description, 
  type, 
  isPrimary = false,
  size = 'md' 
}: CodeBadgeProps) {
  const config = typeConfig[type]
  const Icon = config.icon

  return (
    <div 
      className={`inline-flex items-center gap-1.5 rounded-lg border font-mono ${config.className} ${sizeClasses[size]} ${isPrimary ? 'ring-1 ring-offset-1 ring-offset-slate-900 ring-blue-500/50' : ''}`}
      title={description}
    >
      <Icon className={iconSizes[size]} />
      <span className="font-semibold">{code}</span>
      {description && size === 'lg' && (
        <span className="text-slate-400 ml-1">- {description}</span>
      )}
    </div>
  )
}

interface CodeListProps {
  codes: Array<{ code: string; description?: string; isPrimary?: boolean }>
  type: 'naics' | 'psc' | 'cage'
  maxDisplay?: number
  size?: 'sm' | 'md' | 'lg'
}

export function CodeList({ codes, type, maxDisplay = 3, size = 'sm' }: CodeListProps) {
  if (!codes || codes.length === 0) {
    return <span className="text-slate-500 text-sm">None specified</span>
  }

  const displayCodes = codes.slice(0, maxDisplay)
  const remaining = codes.length - maxDisplay

  return (
    <div className="flex flex-wrap gap-1.5">
      {displayCodes.map((item) => (
        <CodeBadge 
          key={item.code} 
          code={item.code} 
          description={item.description}
          type={type}
          isPrimary={item.isPrimary}
          size={size}
        />
      ))}
      {remaining > 0 && (
        <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-medium bg-slate-700 text-slate-400 border border-slate-600">
          +{remaining} more
        </span>
      )}
    </div>
  )
}
