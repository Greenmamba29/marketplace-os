import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, AuthState } from '../types'

interface AuthStore extends AuthState {
  login: (email: string, password: string) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
  setUser: (user: User) => void
  updateUser: (updates: Partial<User>) => void
}

interface RegisterData {
  email: string
  password: string
  name: string
  organizationName: string
  organizationType: string
}

const mockUser: User = {
  id: '1',
  email: 'chef@restaurant.com',
  name: 'Executive Chef',
  role: 'buyer',
  organizationId: 'org-1',
  organizationName: 'Gourmet Bistro',
  organizationType: 'restaurant',
  permissions: ['read:ingredients', 'write:rfq', 'read:orders'],
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true })
        try {
          // TODO: Replace with actual API call
          // const response = await api.post('/auth/login', { email, password })
          
          // Mock login for development
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          if (email === 'admin@foodops.io') {
            mockUser.role = 'admin'
            mockUser.name = 'System Administrator'
          }
          
          set({
            user: mockUser,
            token: 'mock-jwt-token',
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      register: async (data: RegisterData) => {
        set({ isLoading: true })
        try {
          // TODO: Replace with actual API call
          await new Promise(resolve => setTimeout(resolve, 1500))
          
          const newUser: User = {
            id: '2',
            email: data.email,
            name: data.name,
            role: 'buyer',
            organizationId: 'org-new',
            organizationName: data.organizationName,
            organizationType: data.organizationType as any,
            permissions: ['read:ingredients', 'write:rfq'],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
          
          set({
            user: newUser,
            token: 'mock-jwt-token-new',
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        })
      },

      setUser: (user: User) => {
        set({ user, isAuthenticated: true })
      },

      updateUser: (updates: Partial<User>) => {
        const currentUser = get().user
        if (currentUser) {
          set({ user: { ...currentUser, ...updates } })
        }
      },
    }),
    {
      name: 'foodops-auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
