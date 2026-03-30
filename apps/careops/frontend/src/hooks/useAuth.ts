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
  firstName: string
  lastName: string
  role: 'family' | 'caregiver'
  phone?: string
}

const mockUser: User = {
  id: '1',
  email: 'demo@careops.io',
  firstName: 'Sarah',
  lastName: 'Johnson',
  role: 'family',
  phone: '(555) 123-4567',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      token: null,

      login: async (email: string, password: string) => {
        // Mock login - replace with actual API call
        set({ isLoading: true })
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          if (email === 'demo@careops.io' && password === 'demo') {
            set({
              user: mockUser,
              isAuthenticated: true,
              token: 'mock-jwt-token',
              isLoading: false,
            })
          } else if (email && password) {
            // Accept any credentials for demo
            set({
              user: { ...mockUser, email, firstName: email.split('@')[0] },
              isAuthenticated: true,
              token: 'mock-jwt-token',
              isLoading: false,
            })
          } else {
            throw new Error('Invalid credentials')
          }
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      register: async (data: RegisterData) => {
        set({ isLoading: true })
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          const newUser: User = {
            id: Math.random().toString(36).substr(2, 9),
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            role: data.role,
            phone: data.phone,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
          
          set({
            user: newUser,
            isAuthenticated: true,
            token: 'mock-jwt-token',
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
          isAuthenticated: false,
          token: null,
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
      name: 'careops-auth',
    }
  )
)
