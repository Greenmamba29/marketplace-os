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
  company_name: string
  role: 'buyer' | 'supplier'
}

const mockUser: User = {
  id: '1',
  email: 'demo@ingredientos.io',
  name: 'Demo User',
  company_name: 'Food Innovations Inc.',
  role: 'buyer',
  verified: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        // Mock login - replace with actual API call
        set({ isLoading: true })
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        if (email === 'demo@ingredientos.io' && password === 'demo') {
          set({
            user: mockUser,
            token: 'mock-jwt-token',
            isAuthenticated: true,
            isLoading: false,
          })
        } else {
          set({ isLoading: false })
          throw new Error('Invalid credentials')
        }
      },

      register: async (data: RegisterData) => {
        set({ isLoading: true })
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const newUser: User = {
          id: Math.random().toString(36).substr(2, 9),
          email: data.email,
          name: data.name,
          company_name: data.company_name,
          role: data.role,
          verified: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        
        set({
          user: newUser,
          token: 'mock-jwt-token',
          isAuthenticated: true,
          isLoading: false,
        })
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
        set({ user })
      },

      updateUser: (updates: Partial<User>) => {
        const currentUser = get().user
        if (currentUser) {
          set({ user: { ...currentUser, ...updates } })
        }
      },
    }),
    {
      name: 'ingredientos-auth',
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
)
