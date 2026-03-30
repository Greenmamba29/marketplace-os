export interface Part {
  id: string;
  name: string;
  sku: string;
  brand: string;
  category: string;
  description: string;
  specs: Record<string, string>;
  availability: 'In Stock' | 'Low Stock' | 'Out of Stock';
  price: number;
  image?: string;
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
  partId: string;
  quantity: number;
  specs: string;
  deliveryDate: string;
  status: 'Pending' | 'Quoted' | 'Closed';
  createdAt: string;
}

export interface Quote {
  id: string;
  rfqId: string;
  supplierId: string;
  price: number;
  deliveryDate: string;
  validUntil: string;
}

export interface Order {
  id: string;
  partId: string;
  supplierId: string;
  quantity: number;
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
