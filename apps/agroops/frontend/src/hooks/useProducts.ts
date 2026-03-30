import { useQuery } from '@tanstack/react-query';
import { Product } from '../types';

const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'NitroBoost 46-0-0',
    category: 'Fertilizers',
    supplier: 'AgroChem Global',
    moq: '20 Tons',
    leadTime: '7 days',
    activeIngredients: 'Urea Nitrogen 46%',
    epaRegNo: 'EXEMPT',
    applicationRate: '150-200 lbs/acre',
    imageUrl: 'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: '2',
    name: 'Glyphos-Ultra Herbicide',
    category: 'Herbicides',
    supplier: 'FieldGuard Inc',
    moq: '500 Gallons',
    leadTime: '5 days',
    activeIngredients: 'Glyphosate 41%',
    epaRegNo: '524-529',
    applicationRate: '32 oz/acre',
    imageUrl: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&q=80&w=400',
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
