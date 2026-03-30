export interface Product {
  id: string;
  name: string;
  category: string;
  supplier: string;
  moq: string;
  leadTime: string;
  activeIngredients?: string;
  epaRegNo?: string;
  applicationRate?: string;
  imageUrl: string;
}

export interface RFQ {
  id: string;
  productId: string;
  status: 'pending' | 'quoted' | 'closed';
  quantity: number;
  cropType: string;
  acreage: number;
  createdAt: string;
}
