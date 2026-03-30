export interface User {
  id: string;
  email: string;
  name: string;
  role: 'buyer' | 'admin';
  company?: string;
}

export interface Product {
  id: string;
  name: string;
  category: 'Produce' | 'Proteins' | 'Dairy' | 'Dry Goods' | 'Beverages' | 'Specialty';
  distributor: string;
  description: string;
  nutrition: Record<string, string>;
  certifications: string[];
  pricing: { unit: string; price: number; bulkPrice: number };
  stock: string;
  image: string;
}

export interface MarketStats {
  skus: number;
  distributors: number;
  accuracy: number;
  dailyDeliveries: number;
}
