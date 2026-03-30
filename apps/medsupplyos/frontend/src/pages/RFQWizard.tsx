import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ClipboardList } from 'lucide-react';
import toast from 'react-hot-toast';

const RFQWizard: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="py-12 px-4 max-w-2xl mx-auto">
       <div className="glass border border-surface-200 p-10 rounded-[40px]">
          <div className="flex items-center gap-4 mb-8">
             <ClipboardList className="w-8 h-8 text-primary" />
             <h2 className="text-2xl font-display font-bold text-white">Compliance-First RFQ</h2>
          </div>
          <div className="space-y-6">
             <div className="space-y-2">
                <label className="text-xs font-bold text-surface-400 uppercase">Facility Name</label>
                <input type="text" className="w-full" placeholder="e.g. St. Jude Medical Center" />
             </div>
             <div className="space-y-2">
                <label className="text-xs font-bold text-surface-400 uppercase">Regulatory Requirements</label>
                <div className="grid grid-cols-2 gap-2">
                   {['FDA 510(k)', 'CE Mark', 'Health Canada', 'TGA'].map(r => (
                     <label key={r} className="flex items-center gap-2 text-sm text-surface-400 cursor-pointer">
                        <input type="checkbox" className="rounded" /> {r}
                     </label>
                   ))}
                </div>
             </div>
             <div className="space-y-2">
                <label className="text-xs font-bold text-surface-400 uppercase">Quantity & Urgency</label>
                <div className="flex gap-4">
                   <input type="number" className="w-1/2" placeholder="Qty" />
                   <select className="w-1/2"><option>Routine</option><option>Urgent</option><option>Emergency</option></select>
                </div>
             </div>
             <button onClick={() => { toast.success('RFQ Submitted'); navigate('/order-success'); }} className="btn btn-primary w-full py-4 font-bold uppercase tracking-widest text-sm">Submit to Verified Vendors</button>
          </div>
       </div>
    </div>
  );
};

export default RFQWizard;
