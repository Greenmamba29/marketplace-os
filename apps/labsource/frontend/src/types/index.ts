export interface Product {
  id: string;
  name: string;
  category: string;
  brand: string;
  moq: string;
  leadTime: string;
  casNumber?: string;
  purity?: string;
  catalogNumber: string;
  imageUrl: string;
}

export interface RFQ {
  id: string;
  productId: string;
  status: 'pending' | 'quoted' | 'closed';
  quantity: number;
  institutionType: string;
  createdAt: string;
}
