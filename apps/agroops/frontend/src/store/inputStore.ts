import { create } from 'zustand'
import type { InputFilters } from '@/types'

interface InputStore {
  filters: InputFilters
  setFilters: (filters: Partial<InputFilters>) => void
  clearFilters: () => void
  selectedCategory: string | null
  setSelectedCategory: (category: string | null) => void
  compareList: string[]
  addToCompare: (id: string) => void
  removeFromCompare: (id: string) => void
  clearCompareList: () => void
}

const initialFilters: InputFilters = {
  category: undefined,
  formulation_type: undefined,
  crop_compatibility: undefined,
  state: undefined,
  price_min: undefined,
  price_max: undefined,
  brand: undefined,
  in_stock_only: false,
  epa_registered_only: false,
  search: undefined,
}

export const useInputStore = create<InputStore>((set) => ({
  filters: initialFilters,
  selectedCategory: null,
  compareList: [],
  
  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    })),
  
  clearFilters: () =>
    set({
      filters: initialFilters,
      selectedCategory: null,
    }),
  
  setSelectedCategory: (category) =>
    set((state) => ({
      selectedCategory: category,
      filters: {
        ...state.filters,
        category: category ? [category as any] : undefined,
      },
    })),
  
  addToCompare: (id) =>
    set((state) => ({
      compareList: state.compareList.includes(id)
        ? state.compareList
        : [...state.compareList, id].slice(0, 4), // Max 4 items
    })),
  
  removeFromCompare: (id) =>
    set((state) => ({
      compareList: state.compareList.filter((item) => item !== id),
    })),
  
  clearCompareList: () => set({ compareList: [] }),
}))
