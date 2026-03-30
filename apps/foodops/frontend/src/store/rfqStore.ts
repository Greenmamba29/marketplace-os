import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { RFQ, RFQItem, TemperatureZone } from '../types'

interface RFQState {
  currentRFQ: Partial<RFQ> | null
  currentStep: number
  items: RFQItem[]
  deliveryRequirements: {
    deliveryDate: string
    deliveryWindow: { earliest: string; latest: string }
    temperatureRequirements: TemperatureZone[]
    specialInstructions: string
  }
}

interface RFQStore extends RFQState {
  // Actions
  setCurrentStep: (step: number) => void
  addItem: (item: RFQItem) => void
  removeItem: (itemId: string) => void
  updateItem: (itemId: string, updates: Partial<RFQItem>) => void
  setDeliveryRequirements: (requirements: Partial<RFQState['deliveryRequirements']>) => void
  clearRFQ: () => void
  submitRFQ: () => Promise<void>
}

const initialState: RFQState = {
  currentRFQ: null,
  currentStep: 1,
  items: [],
  deliveryRequirements: {
    deliveryDate: '',
    deliveryWindow: { earliest: '', latest: '' },
    temperatureRequirements: [],
    specialInstructions: '',
  },
}

export const useRFQStore = create<RFQStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      setCurrentStep: (step: number) => {
        set({ currentStep: step })
      },

      addItem: (item: RFQItem) => {
        set((state) => ({
          items: [...state.items, item],
        }))
      },

      removeItem: (itemId: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== itemId),
        }))
      },

      updateItem: (itemId: string, updates: Partial<RFQItem>) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === itemId ? { ...item, ...updates } : item
          ),
        }))
      },

      setDeliveryRequirements: (requirements) => {
        set((state) => ({
          deliveryRequirements: { ...state.deliveryRequirements, ...requirements },
        }))
      },

      clearRFQ: () => {
        set(initialState)
      },

      submitRFQ: async () => {
        const state = get()
        
        // TODO: Replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        // Mock successful submission
        console.log('RFQ Submitted:', {
          items: state.items,
          deliveryRequirements: state.deliveryRequirements,
        })
        
        set(initialState)
      },
    }),
    {
      name: 'foodops-rfq-draft',
    }
  )
)
