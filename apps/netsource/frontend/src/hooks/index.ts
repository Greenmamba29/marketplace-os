import { Product } from '../types';
import { useAuthStore } from '../store/auth';
export const useAuth = () => {
  const { user, isAuthenticated, login, logout } = useAuthStore() as any;
  return { user, isAuthenticated, login, logout };
};
export const useProducts = () => {
  const mock: Product[] = [
    { id: '1', partNumber: 'C9300-48P-A', name: 'Catalyst 9300 48-port PoE+', brand: 'Cisco', category: 'Switches', condition: 'New Retail', price: 4200, warranty: 'Lifetime', taaCompliant: true },
    { id: '2', partNumber: 'MX204-HW-BASE', name: 'MX204 Universal Routing Platform', brand: 'Juniper', category: 'Routers', condition: 'New Retail', price: 18500, warranty: '1 Year', taaCompliant: true },
    { id: '3', partNumber: 'PA-3220', name: 'PA-3220 Next-Gen Firewall', brand: 'Palo Alto', category: 'Firewalls', condition: 'Refurbished', price: 6800, warranty: '90 Days', taaCompliant: false },
    { id: '4', partNumber: 'APIN0305', name: 'Aruba AP-305 Wireless Access Point', brand: 'Aruba', category: 'Access Points', condition: 'New Open Box', price: 350, warranty: '1 Year', taaCompliant: true },
    { id: '5', partNumber: 'N9K-C93180YC-FX', name: 'Nexus 93180YC-FX Switch', brand: 'Cisco', category: 'Switches', condition: 'Used', price: 5400, warranty: '30 Days', taaCompliant: true },
    { id: '6', partNumber: 'FG-100F', name: 'FortiGate 100F Firewall', brand: 'Fortinet', category: 'Firewalls', condition: 'New Retail', price: 2100, warranty: '1 Year', taaCompliant: true },
    { id: '7', partNumber: 'DL380-GEN10', name: 'ProLiant DL380 Gen10 Server', brand: 'HPE', category: 'Servers', condition: 'Refurbished', price: 3200, warranty: '1 Year', taaCompliant: true },
    { id: '8', partNumber: 'QSFP-40G-SR4', name: '40GBASE-SR4 QSFP Transceiver', brand: 'Cisco', category: 'Cables', condition: 'New Retail', price: 150, warranty: 'Lifetime', taaCompliant: false },
  ];
  return { data: mock, isLoading: false };
};
