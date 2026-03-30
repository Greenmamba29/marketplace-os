export interface User {
  id: string;
  email: string;
  name: string;
  role: 'buyer' | 'admin';
  company?: string;
}

export interface Component {
  id: string;
  name: string;
  category: 'EV Motors' | 'Battery Cells' | 'Charging Systems' | 'Inverters' | 'Solar Panels' | 'Grid Hardware';
  manufacturer: string;
  description: string;
  specs: Record<string, string>;
  certifications: string[];
  priceTiers: { minQuantity: number; price: number }[];
  image: string;
  stock: number;
  leadTime: string;
}

export interface RFQ {
  id: string;
  buyerId: string;
  projectType: 'EV Fleet' | 'Grid Storage' | 'Solar' | 'Mixed';
  components: { componentId: string; quantity: number }[];
  status: 'pending' | 'quoted' | 'accepted' | 'closed';
  createdAt: string;
  specs?: string;
}

export interface MarketStats {
  totalComponents: number;
  manufacturers: number;
  onTimeDelivery: number;
  activeRFQs: number;
}
