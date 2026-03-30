import { useState, useCallback } from 'react'
import { Search, X } from 'lucide-react'
import { useDebounce } from '@/hooks/useDebounce'

interface SearchBarProps {
  placeholder?: string
  onSearch: (query: string) => void
  initialValue?: string
  className?: string
}

export default function SearchBar({ 
  placeholder = 'Search...', 
  onSearch,
  initialValue = '',
  className 
}: SearchBarProps) {
  const [value, setValue] = useState(initialValue)
  
  const debouncedSearch = useDebounce((query: string) => {
    onSearch(query)
  }, 300)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setValue(newValue)
    debouncedSearch(newValue)
  }

  const handleClear = () => {
    setValue('')
    onSearch('')
  }

  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-3 bg-dark-800 border border-0.5 border-dark-600/50 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-field-gold/50 focus:border-field-gold transition-all"
      />
      {value && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  )
}

// Custom debounce hook
export function useDebounce<T extends (...args: any[]) => void>(
  callback: T,
  delay: number
) {
  const timeoutRef = React.useRef<NodeJS.Timeout>()

  return useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      timeoutRef.current = setTimeout(() => {
        callback(...args)
      }, delay)
    },
    [callback, delay]
  )
}

import React from 'react'
