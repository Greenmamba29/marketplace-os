import { Product } from '../types';
import { useAuthStore } from '../store/auth';
export const useAuth = () => {
  const { user, isAuthenticated, login, logout } = useAuthStore() as any;
  return { user, isAuthenticated, login, logout };
};
export const useProducts = () => {
  const mock: Product[] = [
    { id: '1', name: 'Pro-Series AI 4K Turret Camera', category: 'CCTV/Surveillance', brand: 'Avigilon', compliance: ['NDAA', 'UL Listed'], integrations: ['Milestone', 'Genetec'], price: 850 },
    { id: '2', name: 'Aero-X Access Control Module', category: 'Access Control', brand: 'HID Global', compliance: ['FIPS 201', 'SOC2'], integrations: ['LenelS2', 'Brivo'], price: 1200 },
    { id: '3', name: 'Thermal Perimeter Radar', category: 'Perimeter', brand: 'FLIR', compliance: ['NDAA'], integrations: ['Verint'], price: 4500 },
    { id: '4', name: 'Touchless Biometric Terminal', category: 'Biometrics', brand: 'IDEMIA', compliance: ['GDPR', 'UL'], integrations: ['AMAG'], price: 2100 },
    { id: '5', name: 'Intercom IP Station - 10-Inch', category: 'Intercom', brand: 'Zenitel', compliance: ['IP66', 'IK10'], integrations: ['Cisco CUCM'], price: 1500 },
    { id: '6', name: 'Multi-Sensor Panoramic Camera', category: 'CCTV/Surveillance', brand: 'Hanwha', compliance: ['NDAA', 'TAA'], integrations: ['ExacqVision'], price: 1800 },
    { id: '7', name: 'Wireless Intrusion Sensor Hub', category: 'Intrusion Detection', brand: 'Bosch', compliance: ['UL Listed', 'CP-01'], integrations: ['DMP'], price: 450 },
    { id: '8', name: 'Under Vehicle Inspection Scanner', category: 'Perimeter', brand: 'UVeye', compliance: ['High Security'], integrations: ['Custom API'], price: 25000 },
  ];
  return { data: mock, isLoading: false };
};
