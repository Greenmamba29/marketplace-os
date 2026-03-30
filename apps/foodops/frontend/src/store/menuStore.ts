import { create } from 'zustand'
import type { MenuItem, RecipeComponent } from '../types'

interface MenuState {
  menuItems: MenuItem[]
  selectedMenuItems: string[]
  generatedOrder: {
    ingredientId: string
    ingredientName: string
    quantity: number
    unitOfMeasure: string
  }[] | null
}

interface MenuStore extends MenuState {
  // Actions
  setMenuItems: (items: MenuItem[]) => void
  addMenuItem: (item: MenuItem) => void
  updateMenuItem: (id: string, updates: Partial<MenuItem>) => void
  removeMenuItem: (id: string) => void
  toggleMenuItemSelection: (id: string) => void
  selectAllMenuItems: () => void
  deselectAllMenuItems: () => void
  generateOrderFromSelection: () => void
  clearGeneratedOrder: () => void
}

export const useMenuStore = create<MenuStore>((set, get) => ({
  menuItems: [],
  selectedMenuItems: [],
  generatedOrder: null,

  setMenuItems: (items: MenuItem[]) => {
    set({ menuItems: items })
  },

  addMenuItem: (item: MenuItem) => {
    set((state) => ({
      menuItems: [...state.menuItems, item],
    }))
  },

  updateMenuItem: (id: string, updates: Partial<MenuItem>) => {
    set((state) => ({
      menuItems: state.menuItems.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      ),
    }))
  },

  removeMenuItem: (id: string) => {
    set((state) => ({
      menuItems: state.menuItems.filter((item) => item.id !== id),
      selectedMenuItems: state.selectedMenuItems.filter((itemId) => itemId !== id),
    }))
  },

  toggleMenuItemSelection: (id: string) => {
    set((state) => ({
      selectedMenuItems: state.selectedMenuItems.includes(id)
        ? state.selectedMenuItems.filter((itemId) => itemId !== id)
        : [...state.selectedMenuItems, id],
    }))
  },

  selectAllMenuItems: () => {
    set((state) => ({
      selectedMenuItems: state.menuItems.map((item) => item.id),
    }))
  },

  deselectAllMenuItems: () => {
    set({ selectedMenuItems: [] })
  },

  generateOrderFromSelection: () => {
    const { menuItems, selectedMenuItems } = get()
    
    const selectedItems = menuItems.filter((item) =>
      selectedMenuItems.includes(item.id)
    )
    
    // Aggregate ingredients from all selected menu items
    const ingredientMap = new Map<string, { name: string; quantity: number; uom: string }>()
    
    selectedItems.forEach((menuItem) => {
      menuItem.recipe.forEach((component) => {
        const existing = ingredientMap.get(component.ingredientId)
        if (existing) {
          existing.quantity += component.quantity
        } else {
          ingredientMap.set(component.ingredientId, {
            name: component.ingredientName,
            quantity: component.quantity,
            uom: component.unitOfMeasure,
          })
        }
      })
    })
    
    const generatedOrder = Array.from(ingredientMap.entries()).map(
      ([ingredientId, data]) => ({
        ingredientId,
        ingredientName: data.name,
        quantity: data.quantity,
        unitOfMeasure: data.uom,
      })
    )
    
    set({ generatedOrder })
  },

  clearGeneratedOrder: () => {
    set({ generatedOrder: null })
  },
}))
