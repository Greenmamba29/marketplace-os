import { useAuthStore } from '../store/auth';
import { useQuery } from '@tanstack/react-query';
import { Component, MarketStats, RFQ } from '../types';

export const useAuth = () => {
  const { user, isAuthenticated, login, logout } = useAuthStore();
  return { user, isAuthenticated, login, logout };
};

export const useComponents = (category?: string) => {
  return useQuery<Component[]>({
    queryKey: ['components', category],
    queryFn: async () => {
      // Mock data
      const components: Component[] = [
        {
          id: '1',
          name: 'High-Performance EV Motor X1',
          category: 'EV Motors',
          manufacturer: 'VoltDrive Systems',
          description: 'Next-generation axial flux motor for high-performance electric vehicles.',
          specs: { voltage: '800V', power: '250kW', torque: '450Nm' },
          certifications: ['UL', 'CE', 'ISO 26262'],
          priceTiers: [{ minQuantity: 10, price: 4500 }, { minQuantity: 50, price: 4200 }],
          image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&q=80&w=400',
          stock: 120,
          leadTime: '4-6 weeks'
        },
        {
          id: '2',
          name: 'Lithium Iron Phosphate Battery Pack',
          category: 'Battery Cells',
          manufacturer: 'EnergyCell Corp',
          description: 'High-density LFP battery module for grid storage and heavy-duty EVs.',
          specs: { capacity: '105Ah', voltage: '3.2V', cycles: '6000+' },
          certifications: ['UL 1973', 'IEC 62619'],
          priceTiers: [{ minQuantity: 100, price: 85 }, { minQuantity: 1000, price: 78 }],
          image: 'https://images.unsplash.com/photo-1548333341-8211768f120c?auto=format&fit=crop&q=80&w=400',
          stock: 5000,
          leadTime: '2-4 weeks'
        }
      ];
      return category ? components.filter(c => c.category === category) : components;
    }
  });
};

export const useMarketStats = () => {
  return useQuery<MarketStats>({
    queryKey: ['market-stats'],
    queryFn: async () => ({
      totalComponents: 45200,
      manufacturers: 280,
      onTimeDelivery: 94,
      activeRFQs: 1240
    })
  });
};

export const useRFQs = (userId: string) => {
  return useQuery<RFQ[]>({
    queryKey: ['rfqs', userId],
    queryFn: async () => [
      {
        id: 'RFQ-1001',
        buyerId: userId,
        projectType: 'EV Fleet',
        components: [{ componentId: '1', quantity: 50 }],
        status: 'pending',
        createdAt: new Date().toISOString()
      }
    ]
  });
};
