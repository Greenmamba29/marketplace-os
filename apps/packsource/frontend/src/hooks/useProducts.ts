import { useQuery } from '@tanstack/react-query';
import { Product } from '../types';

const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Standard Corrugated Box',
    category: 'Corrugated Boxes',
    manufacturer: 'PackCo Industries',
    moq: 1000,
    leadTime: '14 days',
    dimensions: '12x12x12"',
    material: 'Double Wall Cardboard',
    printOptions: ['Flexography', 'Digital'],
    imageUrl: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: '2',
    name: 'Kraft Paper Pouch',
    category: 'Flexible Pouches',
    manufacturer: 'EcoPack Solutions',
    moq: 5000,
    leadTime: '21 days',
    dimensions: '150x230mm',
    material: 'Recycled Kraft Paper',
    printOptions: ['Matte Finish', 'Glossy'],
    imageUrl: 'https://images.unsplash.com/photo-1620912189865-1e8a33da4c5e?auto=format&fit=crop&q=80&w=400',
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
