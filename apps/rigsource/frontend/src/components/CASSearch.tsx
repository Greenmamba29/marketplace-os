import { useState, useRef, useEffect } from 'react';
import { Search, Loader2, Beaker } from 'lucide-react';
import { useChemicalSearch, useCASLookup } from '@/hooks';
import { useNavigate } from 'react-router-dom';

interface CASSearchProps {
  onSelect?: (casNumber: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  className?: string;
}

export default function CASSearch({ 
  onSelect, 
  placeholder = 'Search by name, CAS number, or application...',
  autoFocus = false,
  className = ''
}: CASSearchProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const { data: searchResults, isLoading } = useChemicalSearch(query, 8);

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
    if (e.key === 'Enter' && query.length >= 2) {
      navigate(`/cas?search=${encodeURIComponent(query)}`);
      setIsOpen(false);
    }
  };

  const handleSelect = (casNumber: string, id?: string) => {
    if (onSelect) {
      onSelect(casNumber);
    } else if (id) {
      navigate(`/chemical/${id}`);
    } else {
      navigate(`/cas/${casNumber}`);
    }
    setIsOpen(false);
    setQuery('');
  };

  // Check if query looks like a CAS number
  const isCASFormat = /^\d{2,7}-\d{2}-\d$/.test(query);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(e.target.value.length >= 2);
          }}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="w-full pl-12 pr-4 py-4 bg-surface-50 border border-surface-200 rounded-xl text-white placeholder-surface-400 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
        />
        {isLoading && (
          <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary animate-spin" />
        )}
      </div>

      {/* Dropdown results */}
      {isOpen && query.length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-surface-50 border border-surface-200 rounded-xl shadow-xl shadow-black/20 overflow-hidden z-50">
          {searchResults && searchResults.length > 0 ? (
            <div className="max-h-80 overflow-y-auto">
              <div className="px-4 py-2 text-xs font-medium text-surface-400 uppercase tracking-wider">
                Chemicals
              </div>
              {searchResults.map((chemical) => (
                <button
                  key={chemical.id}
                  onClick={() => handleSelect(chemical.cas_number, chemical.id)}
                  className="w-full px-4 py-3 flex items-start gap-3 hover:bg-surface-100 transition-colors text-left"
                >
                  <div className="w-10 h-10 bg-surface-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Beaker className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white truncate">{chemical.name}</p>
                    <p className="text-sm text-surface-400">
                      <span className="cas-number text-primary">{chemical.cas_number}</span>
                      {' · '}
                      {chemical.molecular_formula}
                      {' · '}
                      {chemical.category}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="px-4 py-6 text-center">
              {isLoading ? (
                <div className="flex items-center justify-center gap-2 text-surface-400">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Searching...
                </div>
              ) : (
                <div className="text-surface-400">
                  <p>No chemicals found</p>
                  {isCASFormat && (
                    <button
                      onClick={() => handleSelect(query)}
                      className="mt-2 text-primary hover:underline"
                    >
                      Search CAS {query} →
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Footer actions */}
          <div className="border-t border-surface-200 px-4 py-2 bg-surface">
            <button
              onClick={() => navigate(`/cas?search=${encodeURIComponent(query)}`)}
              className="text-sm text-primary hover:text-primary-400"
            >
              View all results →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
