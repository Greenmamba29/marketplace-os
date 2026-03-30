import { useQuery, useMutation } from '@tanstack/react-query';
import { Part, RFQ, Order, Supplier } from '../types';

// Mock Data
const MOCK_PARTS: Part[] = [
  {
    id: '1',
    name: 'Heavy Duty Ball Bearing',
    sku: 'BB-7890-X',
    brand: 'SKF',
    category: 'Bearings',
    description: 'High-performance ball bearing for industrial machinery.',
    specs: { 'Inner Diameter': '40mm', 'Outer Diameter': '80mm', 'Width': '18mm' },
    availability: 'In Stock',
    price: 45.50
  },
  {
    id: '2',
    name: 'Industrial Servo Motor',
    sku: 'SM-200-PRO',
    brand: 'Siemens',
    category: 'Motors',
    description: 'Precision servo motor with integrated encoder.',
    specs: { 'Power': '2.0kW', 'Torque': '10Nm', 'Voltage': '400V' },
    availability: 'Low Stock',
    price: 1250.00
  },
  {
    id: '3',
    name: 'Hydraulic Pump Assembly',
    sku: 'HP-450-SYS',
    brand: 'Bosch Rexroth',
    category: 'Hydraulics',
    description: 'Variable displacement piston pump for hydraulic systems.',
    specs: { 'Pressure': '350 bar', 'Flow Rate': '60 L/min' },
    availability: 'In Stock',
    price: 3400.00
  }
];

export const useParts = (filters?: any) => {
  return useQuery({
    queryKey: ['parts', filters],
    queryFn: async () => {
      // Simulate API delay
      await new Promise(r => setTimeout(r, 500));
      return MOCK_PARTS;
    }
  });
};

export const usePart = (id: string) => {
  return useQuery({
    queryKey: ['part', id],
    queryFn: async () => {
      await new Promise(r => setTimeout(r, 300));
      return MOCK_PARTS.find(p => p.id === id) || MOCK_PARTS[0];
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
          id: 'ORD-12345',
          partId: '1',
          supplierId: 'sup-1',
          quantity: 10,
          totalPrice: 455.00,
          status: 'Delivered',
          createdAt: '2024-03-15'
        },
        {
          id: 'ORD-12346',
          partId: '2',
          supplierId: 'sup-2',
          quantity: 2,
          totalPrice: 2500.00,
          status: 'Shipped',
          createdAt: '2024-03-20'
        }
      ] as Order[];
    }
  });
};
