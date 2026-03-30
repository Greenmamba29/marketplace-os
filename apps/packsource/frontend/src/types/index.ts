export interface Product {
  id: string;
  name: string;
  category: string;
  manufacturer: string;
  moq: number;
  leadTime: string;
  dimensions?: string;
  material: string;
  printOptions: string[];
  imageUrl: string;
}

export interface RFQ {
  id: string;
  productId: string;
  status: 'pending' | 'quoted' | 'closed';
  quantity: number;
  specs: any;
  createdAt: string;
}
