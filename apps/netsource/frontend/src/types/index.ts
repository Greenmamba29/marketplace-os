export interface Product {
  id: string;
  partNumber: string;
  name: string;
  brand: string;
  category: string;
  condition: 'New Retail' | 'New Open Box' | 'Refurbished' | 'Used';
  price: number;
  warranty: string;
  taaCompliant: boolean;
}
export interface User { id: string; name: string; email: string; role: 'buyer' | 'admin'; }
