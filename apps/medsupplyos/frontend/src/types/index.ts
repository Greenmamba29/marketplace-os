export interface Product {
  id: string;
  name: string;
  sku: string;
  manufacturer: string;
  category: string;
  description: string;
  specs: Record<string, string>;
  fdaStatus: 'Cleared' | 'Pending' | 'Class I' | 'Class II' | 'Class III';
  sterilization?: string;
  availability: 'In Stock' | 'Allocated' | 'Lead Time';
  price: number;
}

export interface RFQ {
  id: string;
  facilityName: string;
  items: { productId: string; quantity: number }[];
  regulatoryRequirements: string[];
  status: 'Draft' | 'Sent' | 'Negotiating' | 'Finalized';
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'buyer' | 'admin';
  organization?: string;
}
