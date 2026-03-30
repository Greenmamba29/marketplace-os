export interface Product {
  id: string;
  name: string;
  category: string;
  brand: string;
  compliance: string[];
  integrations: string[];
  price: number;
}
export interface User { id: string; name: string; email: string; role: 'buyer' | 'admin'; }
