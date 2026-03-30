export interface Listing {
  id: string;
  title: string;
  category: string;
  condition: 'New' | 'Used' | 'Refurbished' | 'For Parts';
  askingPrice: number;
  auctionEndDate: string;
  currentBid: number;
  location: string;
  sellerId: string;
  saleType: 'Auction' | 'Fixed' | 'Lot';
}
export interface User { id: string; name: string; email: string; role: 'buyer' | 'admin'; }
