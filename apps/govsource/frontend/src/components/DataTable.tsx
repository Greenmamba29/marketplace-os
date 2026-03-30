import { useState } from 'react'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'

interface Column<T> {
  key: string
  header: string
  width?: string
  sortable?: boolean
  render?: (row: T) => React.ReactNode
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  keyExtractor: (row: T) => string
  pagination?: {
    page: number
    perPage: number
    total: number
    onPageChange: (page: number) => void
    onPerPageChange?: (perPage: number) => void
  }
  sortable?: boolean
  onSort?: (key: string, direction: 'asc' | 'desc') => void
  sortKey?: string
  sortDirection?: 'asc' | 'desc'
  loading?: boolean
  emptyMessage?: string
  onRowClick?: (row: T) => void
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  pagination,
  sortable = false,
  onSort,
  sortKey,
  sortDirection,
  loading = false,
  emptyMessage = 'No data available',
  onRowClick,
}: DataTableProps<T>) {
  const [localSortKey, setLocalSortKey] = useState<string | null>(null)
  const [localSortDirection, setLocalSortDirection] = useState<'asc' | 'desc'>('asc')

  const handleSort = (key: string) => {
    if (!sortable) return

    const currentKey = sortKey || localSortKey
    const currentDirection = sortDirection || localSortDirection

    let newDirection: 'asc' | 'desc' = 'asc'
    if (currentKey === key) {
      newDirection = currentDirection === 'asc' ? 'desc' : 'asc'
    }

    if (onSort) {
      onSort(key, newDirection)
    } else {
      setLocalSortKey(key)
      setLocalSortDirection(newDirection)
    }
  }

  const getSortIcon = (key: string) => {
    const currentKey = sortKey || localSortKey
    const currentDirection = sortDirection || localSortDirection

    if (currentKey !== key) {
      return <ArrowUpDown className="w-4 h-4 text-slate-500" />
    }

    return currentDirection === 'asc' 
      ? <ArrowUp className="w-4 h-4 text-blue-400" />
      : <ArrowDown className="w-4 h-4 text-blue-400" />
  }

  const totalPages = pagination ? Math.ceil(pagination.total / pagination.perPage) : 1

  if (loading) {
    return (
      <div className="card p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th 
                  key={column.key}
                  className={`${column.width || ''} ${sortable && column.sortable ? 'cursor-pointer hover:bg-slate-700/50' : ''}`}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center gap-2">
                    {column.header}
                    {sortable && column.sortable && getSortIcon(column.key)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td 
                  colSpan={columns.length} 
                  className="text-center py-12 text-slate-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr 
                  key={keyExtractor(row)}
                  className={onRowClick ? 'cursor-pointer' : ''}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((column) => (
                    <td key={`${keyExtractor(row)}-${column.key}`}>
                      {column.render 
                        ? column.render(row)
                        : (row as Record<string, unknown>)[column.key] as React.ReactNode
                      }
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination && (
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-400">
              Showing {((pagination.page - 1) * pagination.perPage) + 1} to{' '}
              {Math.min(pagination.page * pagination.perPage, pagination.total)} of{' '}
              {pagination.total} entries
            </span>
            {pagination.onPerPageChange && (
              <select
                value={pagination.perPage}
                onChange={(e) => pagination.onPerPageChange?.(Number(e.target.value))}
                className="form-input py-1 text-sm w-20"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => pagination.onPageChange(1)}
              disabled={pagination.page === 1}
              className="p-2 rounded-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => pagination.onPageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="p-2 rounded-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm text-slate-400 px-2">
              Page {pagination.page} of {totalPages}
            </span>
            <button
              onClick={() => pagination.onPageChange(pagination.page + 1)}
              disabled={pagination.page === totalPages}
              className="p-2 rounded-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => pagination.onPageChange(totalPages)}
              disabled={pagination.page === totalPages}
              className="p-2 rounded-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
