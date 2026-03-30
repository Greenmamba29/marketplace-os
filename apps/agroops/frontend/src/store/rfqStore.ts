import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { RFQItem } from '@/types'

interface RFQDraft {
  title: string
  description: string
  crop_type: string
  acres: number
  planting_date: string
  target_application_date: string
  items: RFQItem[]
  delivery_location: string
  delivery_state: string
  delivery_date_start: string
  delivery_date_end: string
  payment_terms: string
  credit_terms_requested: boolean
  bid_deadline: string
  min_supplier_rating: number
}

interface RFQStore {
  draft: Partial<RFQDraft>
  currentStep: number
  setDraftField: <K extends keyof RFQDraft>(field: K, value: RFQDraft[K]) => void
  addItem: (item: Omit<RFQItem, 'id'>) => void
  removeItem: (index: number) => void
  updateItem: (index: number, item: Partial<RFQItem>) => void
  setStep: (step: number) => void
  nextStep: () => void
  prevStep: () => void
  clearDraft: () => void
}

const initialDraft: Partial<RFQDraft> = {
  title: '',
  description: '',
  crop_type: '',
  acres: 0,
  items: [],
  payment_terms: 'Net 30',
  credit_terms_requested: false,
  min_supplier_rating: 0,
}

export const useRFQStore = create<RFQStore>()(
  persist(
    (set) => ({
      draft: initialDraft,
      currentStep: 1,
      
      setDraftField: (field, value) =>
        set((state) => ({
          draft: { ...state.draft, [field]: value },
        })),
      
      addItem: (item) =>
        set((state) => ({
          draft: {
            ...state.draft,
            items: [
              ...(state.draft.items || []),
              { ...item, id: `temp-${Date.now()}` },
            ],
          },
        })),
      
      removeItem: (index) =>
        set((state) => ({
          draft: {
            ...state.draft,
            items: (state.draft.items || []).filter((_, i) => i !== index),
          },
        })),
      
      updateItem: (index, item) =>
        set((state) => ({
          draft: {
            ...state.draft,
            items: (state.draft.items || []).map((existing, i) =>
              i === index ? { ...existing, ...item } : existing
            ),
          },
        })),
      
      setStep: (step) => set({ currentStep: step }),
      
      nextStep: () =>
        set((state) => ({ currentStep: Math.min(state.currentStep + 1, 5) })),
      
      prevStep: () =>
        set((state) => ({ currentStep: Math.max(state.currentStep - 1, 1) })),
      
      clearDraft: () =>
        set({
          draft: initialDraft,
          currentStep: 1,
        }),
    }),
    {
      name: 'agroops-rfq-draft',
    }
  )
)
