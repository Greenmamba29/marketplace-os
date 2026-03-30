import React from 'react';
import { Gavel, Heart, ShoppingBag, TrendingUp } from 'lucide-react';

const BuyerDashboard = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-black font-display uppercase italic tracking-tighter mb-12">Buyer Dashboard</h1>
      <div className="grid md:grid-cols-4 gap-6 mb-12">
        {[
          { label: 'Active Bids', val: '4', icon: Gavel },
          { label: 'Watchlist', val: '12', icon: Heart },
          { label: 'Won Auctions', val: '2', icon: ShoppingBag },
          { label: 'Spent', val: '$14,200', icon: TrendingUp },
        ].map(s => (
          <div key={s.label} className="bg-surface-50 border border-surface-100 p-6 rounded-2xl">
            <s.icon className="w-5 h-5 text-primary mb-4" />
            <div className="text-sm text-surface-400 font-bold uppercase italic tracking-widest">{s.label}</div>
            <div className="text-3xl font-black font-display">{s.val}</div>
          </div>
        ))}
      </div>

      <div className="space-y-8">
        <div className="flex gap-12 border-b border-surface-100">
          <button className="pb-4 border-b-2 border-primary font-black uppercase italic tracking-widest">Active Bids</button>
          <button className="pb-4 text-surface-400 font-black uppercase italic tracking-widest">Watchlist</button>
          <button className="pb-4 text-surface-400 font-black uppercase italic tracking-widest">Orders</button>
        </div>
        <div className="bg-surface-50 rounded-2xl border border-surface-100 p-12 text-center">
          <Gavel className="w-12 h-12 text-surface-200 mx-auto mb-4" />
          <p className="text-surface-400 font-bold">You are currently bidding on 4 assets.</p>
        </div>
      </div>
    </div>
  );
};
export default BuyerDashboard;
