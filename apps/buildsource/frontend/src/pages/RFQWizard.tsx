import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, Building2, Calendar, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

const RFQWizard: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const handleSubmit = () => {
    toast.success('Project RFQ Broadcasted!');
    navigate('/order-success');
  };

  return (
    <div className="py-12 px-4 max-w-3xl mx-auto">
       <div className="glass border border-surface-200 rounded-[32px] p-10">
          <h2 className="text-3xl font-display font-bold text-white mb-8">Create Project RFQ</h2>
          
          <div className="space-y-8">
             <div className="space-y-4">
                <label className="text-sm font-medium text-surface-400">Project Name</label>
                <div className="relative">
                   <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 w-5 h-5" />
                   <input type="text" className="w-full pl-12" placeholder="e.g. Skyline Apartments Phase 2" />
                </div>
             </div>

             <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                   <label className="text-sm font-medium text-surface-400">Required By</label>
                   <input type="date" className="w-full" />
                </div>
                <div className="space-y-4">
                   <label className="text-sm font-medium text-surface-400">Project Timeline</label>
                   <select className="w-full">
                      <option>Next 30 Days</option>
                      <option>Next 90 Days</option>
                      <option>12+ Months</option>
                   </select>
                </div>
             </div>

             <div className="space-y-4">
                <label className="text-sm font-medium text-surface-400">Materials List</label>
                <textarea className="w-full h-32" placeholder="List required materials, quantities, and specific grades..." />
             </div>

             <button onClick={handleSubmit} className="btn btn-primary w-full py-4 text-lg">Broadcast to Verified Suppliers</button>
          </div>
       </div>
    </div>
  );
};

export default RFQWizard;
