import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useListings } from '../hooks';
import { Gavel, Clock, MapPin, Shield, Download, ArrowRight, User } from 'lucide-react';

const ListingDetail = () => {
  const { id } = useParams();
  const { data: listings } = useListings();
  const asset = listings?.find(l => l.id === id);
  const [timeLeft, setTimeLeft] = useState('02:14:09:55');

  if (!asset) return <div className="p-24 text-center">Asset not found.</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid lg:grid-cols-2 gap-12">
        <div>
          <div className="grid grid-cols-2 gap-2 mb-2">
            {[1,2,3,4].map(i => <div key={i} className="aspect-square bg-surface-50 border border-surface-100 rounded-xl flex items-center justify-center text-xs text-surface-300 font-bold italic uppercase tracking-widest">Image {i}</div>)}
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-md text-[10px] font-black uppercase italic tracking-widest">{asset.saleType}</span>
              <span className="text-surface-400 text-xs font-bold uppercase tracking-widest">Condition: {asset.condition}</span>
            </div>
            <h1 className="text-4xl font-black font-display italic uppercase tracking-tight mb-2">{asset.title}</h1>
            <div className="flex items-center gap-2 text-surface-400"><MapPin className="w-4 h-4"/> {asset.location}</div>
          </div>

          <div className="bg-surface-50 border border-surface-100 p-8 rounded-3xl relative overflow-hidden">
            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <div className="text-xs text-surface-400 uppercase font-black italic mb-2 tracking-widest">Current Bid</div>
                <div className="text-5xl font-black font-display text-white">${$asset.currentBid.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-xs text-surface-400 uppercase font-black italic mb-2 tracking-widest">Time Remaining</div>
                <div className="text-3xl font-black font-display text-primary">{timeLeft}</div>
              </div>
            </div>
            <div className="flex gap-4">
              <button className="btn btn-primary flex-grow py-5 text-xl italic uppercase font-black">Place Bid <ArrowRight /></button>
              <button className="btn btn-secondary px-8 py-5 text-xl italic uppercase font-black">Buy Now ${$asset.askingPrice.toLocaleString()}</button>
            </div>
          </div>

          <div className="bg-surface-50/50 border border-surface-100 rounded-2xl p-6">
            <h3 className="font-bold mb-4 uppercase italic tracking-widest text-xs">Bid History</h3>
            <div className="space-y-4">
              {[
                { user: 'Bider_88', bid: 32000, time: '2m ago' },
                { user: 'LiquidateCorp', bid: 31500, time: '1h ago' },
                { user: 'AssetHunter', bid: 31000, time: '4h ago' },
              ].map((b, i) => (
                <div key={i} className="flex justify-between items-center text-sm border-b border-surface-100/50 pb-2">
                  <div className="flex items-center gap-2 font-medium"><User className="w-3 h-3 text-surface-400" /> {b.user}</div>
                  <div className="font-bold">${$b.bid.toLocaleString()}</div>
                  <div className="text-surface-400 text-xs">{b.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-24">
        <div className="border-b border-surface-100 flex gap-12 mb-12">
          <button className="pb-4 border-b-2 border-primary font-black uppercase italic tracking-widest">Description</button>
          <button className="pb-4 text-surface-400 font-black uppercase italic tracking-widest">Inspection Report</button>
          <button className="pb-4 text-surface-400 font-black uppercase italic tracking-widest">Pickup Logistics</button>
        </div>
        <div className="grid md:grid-cols-3 gap-12">
          <div className="col-span-2 text-surface-300 leading-relaxed space-y-6">
            <p>This unit was operational when removed from service on Feb 15, 2026. Regularly maintained under OEM service contract. Sold as-is, where-is.</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-surface-50 p-4 rounded-xl">
                <div className="text-xs text-surface-400 uppercase mb-1">Manufacturer</div>
                <div className="font-bold">Haas Automation</div>
              </div>
              <div className="bg-surface-50 p-4 rounded-xl">
                <div className="text-xs text-surface-400 uppercase mb-1">Model Year</div>
                <div className="font-bold">2019</div>
              </div>
            </div>
          </div>
          <div>
            <div className="bg-surface-50 border border-surface-100 p-8 rounded-3xl">
               <Shield className="w-10 h-10 text-primary mb-6" />
               <h3 className="text-lg font-bold mb-4 uppercase italic">Verified Inspection</h3>
               <p className="text-sm text-surface-400 mb-8">A multi-point physical inspection was conducted by SurplusOS agents. All motors tested.</p>
               <button className="btn btn-secondary w-full text-xs font-black uppercase italic"><Download className="w-4 h-4"/> Download Report</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ListingDetail;
