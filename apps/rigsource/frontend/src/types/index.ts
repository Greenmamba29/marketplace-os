export interface Equipment {
  id: string;
  name: string;
  category: string;
  make: string;
  model: string;
  year: number;
  hours: number;
  condition: 'New' | 'Used' | 'Refurbished';
  price: number;
  location: string;
  supplierId: string;
  specs?: Record<string, string>;
  images?: string[];
}

export interface Supplier {
  id: string;
  name: string;
  location: string;
  rating: number;
  verified: boolean;
}

export interface RFQ {
  id: string;
  equipmentType: string;
  specs: any;
  country: string;
  budget: number;
  timeline: string;
  status: 'pending' | 'quoted' | 'ordered' | 'cancelled';
  createdAt: string;
}

export interface Order {
  id: string;
  equipmentId: string;
  equipmentName: string;
  amount: number;
  status: 'processing' | 'shipped' | 'delivered';
  date: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'buyer' | 'admin';
}
