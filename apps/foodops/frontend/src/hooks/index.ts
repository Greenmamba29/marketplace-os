import { useQuery } from '@tanstack/react-query';
import { create } from 'zustand';
import { Product, MarketStats, User } from '../types';

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

export const useProducts = (category?: string) => {
  return useQuery<Product[]>({
    queryKey: ['products', category],
    queryFn: async () => {
      const products: Product[] = [
        {
          id: 'p1',
          name: 'Premium Wagyu Ribeye',
          category: 'Proteins',
          distributor: 'Prime Cuts Distro',
          description: 'A5 Grade Japanese Wagyu, perfectly marbled and vacuum sealed.',
          nutrition: { protein: '22g', fat: '35g', calories: '410' },
          certifications: ['USDA Choice', 'Halal'],
          pricing: { unit: 'lb', price: 85, bulkPrice: 72 },
          stock: 'Available',
          image: 'https://images.unsplash.com/photo-1546248133-125ac896d884?auto=format&fit=crop&q=80&w=400'
        },
        {
          id: 'p2',
          name: 'Organic Hass Avocados',
          category: 'Produce',
          distributor: 'Green Valley Fresh',
          description: 'Large, creamy Hass avocados grown without synthetic pesticides.',
          nutrition: { fiber: '7g', potassium: '485mg', calories: '160' },
          certifications: ['USDA Organic', 'Non-GMO'],
          pricing: { unit: 'case', price: 42, bulkPrice: 38 },
          stock: 'In Stock',
          image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&q=80&w=400'
        }
      ];
      return category ? products.filter(p => p.category === category) : products;
    }
  });
};

export const useMarketStats = () => {
  return useQuery<MarketStats>({
    queryKey: ['market-stats'],
    queryFn: async () => ({
      skus: 320000,
      distributors: 1800,
      accuracy: 99.2,
      dailyDeliveries: 12450
    })
  });
};
