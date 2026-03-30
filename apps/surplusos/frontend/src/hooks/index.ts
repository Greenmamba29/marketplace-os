import { Listing } from '../types';
import { useAuthStore } from '../store/auth';
export const useAuth = () => {
  const { user, isAuthenticated, login, logout } = useAuthStore() as any;
  return { user, isAuthenticated, login, logout };
};
export const useListings = () => {
  const mock: Listing[] = [
    { id: '1', title: 'Industrial CNC Lathe - Haas ST-20', category: 'Industrial', condition: 'Used', askingPrice: 45000, auctionEndDate: '2026-04-01T15:00:00', currentBid: 32000, location: 'Houston, TX', sellerId: 's1', saleType: 'Auction' },
    { id: '2', title: 'Bulk IT Asset Lot - 50x Dell Latitude', category: 'IT Assets', condition: 'Refurbished', askingPrice: 12500, auctionEndDate: '2026-03-30T10:00:00', currentBid: 8500, location: 'Chicago, IL', sellerId: 's2', saleType: 'Lot' },
    { id: '3', title: 'Laboratory Centrifuge - Thermo Fisher', category: 'Lab', condition: 'Used', askingPrice: 3200, auctionEndDate: '2026-03-29T18:00:00', currentBid: 2100, location: 'Boston, MA', sellerId: 's3', saleType: 'Auction' },
    { id: '4', title: 'Forklift Toyota 8FGCU25', category: 'Vehicles', condition: 'Used', askingPrice: 18000, auctionEndDate: '2026-04-05T12:00:00', currentBid: 15500, location: 'Miami, FL', sellerId: 's1', saleType: 'Auction' },
    { id: '5', title: 'Industrial Generator 500kW', category: 'Industrial', condition: 'New', askingPrice: 120000, auctionEndDate: '', currentBid: 0, location: 'Phoenix, AZ', sellerId: 's4', saleType: 'Fixed' },
    { id: '6', title: 'Server Rack Enclosures - Lot of 10', category: 'IT Assets', condition: 'Used', askingPrice: 5000, auctionEndDate: '2026-04-02T14:00:00', currentBid: 2800, location: 'Denver, CO', sellerId: 's5', saleType: 'Auction' },
    { id: '7', title: 'HPLC System - Agilent 1260', category: 'Lab', condition: 'Used', askingPrice: 22000, auctionEndDate: '2026-03-31T16:00:00', currentBid: 18000, location: 'San Diego, CA', sellerId: 's3', saleType: 'Auction' },
    { id: '8', title: 'Office Furniture Lot - 100 Desks', category: 'Real Estate', condition: 'Used', askingPrice: 8000, auctionEndDate: '2026-04-10T11:00:00', currentBid: 4500, location: 'Atlanta, GA', sellerId: 's6', saleType: 'Lot' },
  ];
  return { data: mock, isLoading: false };
};
