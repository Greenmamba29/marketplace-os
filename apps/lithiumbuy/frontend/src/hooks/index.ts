import { useQuery } from '@tanstack/react-query';
import { create } from 'zustand';
import { Material, MarketStats, User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: (user) => set({ user, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));

export const useAuth = () => {
  const { user, isAuthenticated, login, logout } = useAuthStore();
  return { user, isAuthenticated, login, logout };
};

export const useMaterials = () => {
  return useQuery<Material[]>({
    queryKey: ['materials'],
    queryFn: async () => [
      {
        id: 'li-carb-1',
        name: 'Battery Grade Lithium Carbonate',
        compounds: ['Li2CO3'],
        purity: '99.5% min',
        origin: 'Chile',
        description: 'Ultra-high purity lithium carbonate for high-performance EV battery cathode production.',
        certifications: ['ISO 9001', 'SGS Verified'],
        priceHistory: [
          { date: 'Jan', price: 13500 },
          { date: 'Feb', price: 14200 },
          { date: 'Mar', price: 13800 },
        ],
        minOrder: '20 MT',
        image: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&q=80&w=400'
      },
      {
        id: 'li-hyd-1',
        name: 'Lithium Hydroxide Monohydrate',
        compounds: ['LiOH·H2O'],
        purity: '56.5% min',
        origin: 'Australia',
        description: 'Premium grade lithium hydroxide preferred for high-nickel cathode chemistries.',
        certifications: ['COA Provided', 'Responsible Sourcing'],
        priceHistory: [
          { date: 'Jan', price: 15500 },
          { date: 'Feb', price: 15800 },
          { date: 'Mar', price: 16100 },
        ],
        minOrder: '15 MT',
        image: 'https://images.unsplash.com/photo-1628533224917-fa93850500f2?auto=format&fit=crop&q=80&w=400'
      }
    ]
  });
};

export const useMarketStats = () => {
  return useQuery<MarketStats>({
    queryKey: ['market-stats'],
    queryFn: async () => ({
      miners: 850,
      countries: 45,
      tradedVolume: '$48M',
      priceTrends: [
        { material: 'Li Carbonate', price: '$13.8k/t', change: '-1.2%' },
        { material: 'Li Hydroxide', price: '$16.1k/t', change: '+2.4%' },
        { material: 'Spodumene', price: '$1,200/t', change: '+0.5%' }
      ]
    })
  });
};
