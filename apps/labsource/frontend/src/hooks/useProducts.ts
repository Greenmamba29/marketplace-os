import { useQuery } from '@tanstack/react-query';
import { Product } from '../types';

const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Erlenmeyer Flask, 500mL',
    category: 'Glassware',
    brand: 'Pyrex',
    moq: '12 Units',
    leadTime: '3 days',
    catalogNumber: '4980-500',
    imageUrl: 'https://images.unsplash.com/photo-1581093588401-fbb62a02f120?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: '2',
    name: 'Sodium Chloride, ACS Reagent',
    category: 'Reagents',
    brand: 'Sigma-Aldrich',
    moq: '500g',
    leadTime: '2 days',
    casNumber: '7647-14-5',
    purity: '≥99.0%',
    catalogNumber: 'S7653',
    imageUrl: 'https://images.unsplash.com/photo-1582719471384-894fbb16e024?auto=format&fit=crop&q=80&w=400',
  }
];

export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      await new Promise(r => setTimeout(r, 500));
      return MOCK_PRODUCTS;
    }
  });
}
