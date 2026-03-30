import { useAuthStore } from '../store/auth';
import { Equipment, RFQ } from '../types';

export const useAuth = () => {
  const { user, isAuthenticated, login, logout } = useAuthStore();
  return { user, isAuthenticated, login, logout };
};

export const useEquipment = () => {
  const mockEquipment: Equipment[] = [
    { id: '1', name: 'Caterpillar 320 GC', category: 'Excavators', make: 'Caterpillar', model: '320 GC', year: 2022, hours: 1200, condition: 'Used', price: 145000, location: 'Houston, TX', supplierId: 's1' },
    { id: '2', name: 'Komatsu PC210LC-11', category: 'Excavators', make: 'Komatsu', model: 'PC210LC-11', year: 2021, hours: 2100, condition: 'Used', price: 132000, location: 'Chicago, IL', supplierId: 's2' },
    { id: '3', name: 'Liebherr LTM 1100', category: 'Cranes', make: 'Liebherr', model: 'LTM 1100', year: 2019, hours: 4500, condition: 'Refurbished', price: 450000, location: 'Hamburg, DE', supplierId: 's3' },
    { id: '4', name: 'John Deere 850K', category: 'Bulldozers', make: 'John Deere', model: '850K', year: 2023, hours: 500, condition: 'New', price: 210000, location: 'Atlanta, GA', supplierId: 's1' },
    { id: '5', name: 'Hyster H190FT', category: 'Forklifts', make: 'Hyster', model: 'H190FT', year: 2020, hours: 3200, condition: 'Used', price: 45000, location: 'Miami, FL', supplierId: 's4' },
    { id: '6', name: 'Cummins C2500 D5A', category: 'Generators', make: 'Cummins', model: 'C2500 D5A', year: 2022, hours: 100, condition: 'New', price: 320000, location: 'Dubai, UAE', supplierId: 's5' },
    { id: '7', name: 'Atlas Copco XAS 185', category: 'Compressors', make: 'Atlas Copco', model: 'XAS 185', year: 2021, hours: 800, condition: 'Used', price: 18500, location: 'Denver, CO', supplierId: 's2' },
    { id: '8', name: 'Volvo A40G', category: 'Articulated Haulers', make: 'Volvo', model: 'A40G', year: 2022, hours: 1500, condition: 'Used', price: 285000, location: 'Phoenix, AZ', supplierId: 's1' },
  ];
  return { data: mockEquipment, isLoading: false };
};

export const useRFQ = () => {
  const mockRFQs: RFQ[] = [
    { id: 'RFQ-001', equipmentType: 'Excavator', specs: {}, country: 'USA', budget: 150000, timeline: '1 month', status: 'quoted', createdAt: '2026-03-20' },
  ];
  return { data: mockRFQs, isLoading: false };
};
