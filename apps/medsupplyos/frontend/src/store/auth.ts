import { create } from 'zustand';
import { User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: {
    id: 'med-1',
    email: 'procurement@hospital.org',
    name: 'Dr. Sarah Chen',
    role: 'buyer',
    organization: 'Global Health Network'
  },
  isAuthenticated: true,
  logout: () => set({ user: null, isAuthenticated: false }),
}));
