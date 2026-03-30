import { FileCheck, FileX, Download } from 'lucide-react'

interface CoABadgeProps {
  available: boolean
  onDownload?: () => void
  size?: 'sm' | 'md'
}

export default function CoABadge({ available, onDownload, size = 'md' }: CoABadgeProps) {
  const sizeClass = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-2.5 py-1'
  
  if (!available) {
    return (
      <span className={`inline-flex items-center gap-1 font-medium rounded-full border bg-slate-800 text-slate-400 border-slate-700 ${sizeClass}`}>
        <FileX className="w-3.5 h-3.5" />
        No CoA
      </span>
    )
  }

  if (onDownload) {
    return (
      <button
        onClick={onDownload}
        className={`inline-flex items-center gap-1 font-medium rounded-full border bg-science-950 text-science-300 border-science-800 hover:bg-science-900 transition-colors ${sizeClass}`}
      >
        <Download className="w-3.5 h-3.5" />
        CoA
      </button>
    )
  }

  return (
    <span className={`inline-flex items-center gap-1 font-medium rounded-full border bg-science-950 text-science-300 border-science-800 ${sizeClass}`}>
      <FileCheck className="w-3.5 h-3.5" />
      CoA Ready
    </span>
  )
}
