export interface User {
  id: string;
  email: string;
  name: string;
  role: 'buyer' | 'admin';
  company?: string;
}

export interface Material {
  id: string;
  name: string;
  compounds: string[];
  purity: string;
  origin: string;
  description: string;
  certifications: string[];
  priceHistory: { date: string; price: number }[];
  minOrder: string;
  image: string;
}

export interface MarketStats {
  miners: number;
  countries: number;
  tradedVolume: string;
  priceTrends: { material: string; price: string; change: string }[];
}
