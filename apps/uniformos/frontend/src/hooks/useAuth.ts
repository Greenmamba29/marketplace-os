import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'buyer' | 'admin';
  company: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string) => void;
  logout: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  user: {
    id: 'u1',
    name: 'Uniform Manager',
    email: 'manager@example.com',
    role: 'buyer',
    company: 'Logistics Pro Inc.'
  },
  isAuthenticated: true,
  login: (email) => set({ 
    user: { id: 'u1', name: 'Uniform Manager', email, role: 'buyer', company: 'Logistics Pro Inc.' }, 
    isAuthenticated: true 
  }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));
