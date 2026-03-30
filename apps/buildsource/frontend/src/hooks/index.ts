import { useQuery, useMutation } from '@tanstack/react-query';
import { Material, RFQ, Order } from '../types';

const MOCK_MATERIALS: Material[] = [
  {
    id: '1',
    name: 'Structural Steel I-Beam (Grade 50)',
    sku: 'ST-W12x26',
    brand: 'Nucor',
    category: 'Steel',
    description: 'High-strength structural steel beam for commercial framing.',
    specs: { 'Depth': '12"', 'Weight': '26 lbs/ft', 'Length': '20ft - 40ft' },
    certifications: ['ASTM A572', 'ISO 9001'],
    availability: 'In Stock',
    price: 840.00,
    unit: 'Each'
  },
  {
    id: '2',
    name: 'Portland Cement (Type I/II)',
    sku: 'CM-PT-94LB',
    brand: 'LafargeHolcim',
    category: 'Concrete',
    description: 'General-purpose cement for concrete construction.',
    specs: { 'Weight': '94 lbs per bag', 'Strength': '4000 PSI' },
    certifications: ['ASTM C150'],
    availability: 'In Stock',
    price: 18.50,
    unit: 'Bag'
  },
  {
    id: '3',
    name: 'Premium CDX Plywood 3/4"',
    sku: 'WD-PLY-34',
    brand: 'Georgia-Pacific',
    category: 'Lumber',
    description: 'Structural plywood for subflooring and roofing.',
    specs: { 'Thickness': '3/4"', 'Dimensions': '4ft x 8ft' },
    certifications: ['APA Rated'],
    availability: 'Low Stock',
    price: 54.00,
    unit: 'Sheet'
  }
];

export const useMaterials = (filters?: any) => {
  return useQuery({
    queryKey: ['materials', filters],
    queryFn: async () => {
      await new Promise(r => setTimeout(r, 500));
      return MOCK_MATERIALS;
    }
  });
};

export const useMaterial = (id: string) => {
  return useQuery({
    queryKey: ['material', id],
    queryFn: async () => {
      await new Promise(r => setTimeout(r, 300));
      return MOCK_MATERIALS.find(m => m.id === id) || MOCK_MATERIALS[0];
    }
  });
};

export const useRFQ = () => {
  return {
    submit: useMutation({
      mutationFn: async (rfq: any) => {
        await new Promise(r => setTimeout(r, 1000));
        return { id: 'rfq-' + Math.random().toString(36).substr(2, 9), ...rfq };
      }
    })
  };
};

export const useOrders = () => {
  return useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      await new Promise(r => setTimeout(r, 500));
      return [
        {
          id: 'ORD-B-101',
          projectId: 'Skyline Tower',
          totalPrice: 42500.00,
          status: 'Shipped',
          createdAt: '2024-03-10'
        },
        {
          id: 'ORD-B-102',
          projectId: 'Metro Station',
          totalPrice: 15600.00,
          status: 'Delivered',
          createdAt: '2024-03-18'
        }
      ] as Order[];
    }
  });
};
