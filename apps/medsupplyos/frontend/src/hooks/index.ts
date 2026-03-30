import { useQuery, useMutation } from '@tanstack/react-query';
import { Product } from '../types';

const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Advanced Patient Monitor X100',
    sku: 'MED-PM-100',
    manufacturer: 'GE Healthcare',
    category: 'Monitoring',
    description: 'High-precision patient monitor with wireless integration.',
    specs: { 'Display': '15.6" Touch', 'Parameters': 'ECG, SpO2, NIBP, Temp', 'Battery': '4 Hours' },
    fdaStatus: 'Cleared',
    availability: 'In Stock',
    price: 12500.00
  },
  {
    id: '2',
    name: 'Sterile Surgical Gown - Large',
    sku: 'MED-SG-L',
    manufacturer: 'Medline',
    category: 'Consumables',
    description: 'Reinforced sterile surgical gown, AAMI Level 3.',
    specs: { 'Size': 'Large', 'Material': 'SMS Fabric', 'Sterility': 'EO Gas' },
    fdaStatus: 'Class II',
    sterilization: 'EO Gas',
    availability: 'In Stock',
    price: 8.50
  }
];

export const useProducts = () => {
  return useQuery({ queryKey: ['products'], queryFn: async () => MOCK_PRODUCTS });
};

export const useProduct = (id: string) => {
  return useQuery({ queryKey: ['product', id], queryFn: async () => MOCK_PRODUCTS.find(p => p.id === id) || MOCK_PRODUCTS[0] });
};

export const useRFQ = () => {
  return { submit: useMutation({ mutationFn: async (data: any) => data }) };
};
