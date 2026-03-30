export interface Material {
  id: string;
  name: string;
  sku: string;
  brand: string;
  category: string;
  description: string;
  specs: Record<string, string>;
  certifications: string[];
  availability: 'In Stock' | 'Low Stock' | 'Out of Stock';
  price: number;
  unit: string;
}

export interface Supplier {
  id: string;
  name: string;
  rating: number;
  location: string;
  verified: boolean;
  deliveryTime: string;
}

export interface RFQ {
  id: string;
  projectName: string;
  items: { materialId: string; quantity: number }[];
  timeline: string;
  deliveryAddress: string;
  status: 'Pending' | 'Quoted' | 'Closed';
  createdAt: string;
}

export interface Order {
  id: string;
  projectId: string;
  totalPrice: number;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'buyer' | 'admin';
  company?: string;
}
