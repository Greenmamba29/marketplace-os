import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProducts } from '../hooks';
import { ShieldAlert, Cpu, Lock, CheckCircle, Info, FileText, Globe, Layers } from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams();
  const { data: products } = useProducts();
  const product = products?.find(p => p.id === id);

  if (!product) return <div className="p-24 text-center">Product not found.</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-12">
          <div className="bg-surface-50 border border-surface-100 p-12 rounded-[3rem]">
             <div className="flex flex-wrap gap-3 mb-8">
                {product.compliance.map(c => <span key={c} className="badge-compliance text-xs px-3 py-1">{c}</span>)}
                <span className="px-3 py-1 bg-surface-100 text-surface-400 text-[10px] font-black uppercase tracking-widest rounded border border-surface-200">BRAND: {product.brand}</span>
             </div>
             <h1 className="text-5xl font-black font-display italic uppercase tracking-tight mb-4 leading-[0.9]">{product.name}</h1>
             <div className="text-lg text-surface-400 font-bold mb-12 uppercase tracking-widest">{product.category}</div>
             
             <div className="grid md:grid-cols-2 gap-12 py-10 border-y border-surface-100/50">
               <div>
                 <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-surface-400 mb-6">Integration Ecosystem</h4>
                 <div className="flex flex-wrap gap-2">
                   {product.integrations.map(i => <span key={i} className="px-4 py-2 bg-surface-100 rounded-lg text-sm font-bold border border-surface-200">{i}</span>)}
                 </div>
               </div>
               <div>
                 <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-surface-400 mb-6">Technical Standards</h4>
                 <div className="space-y-3">
                   <div className="flex items-center gap-3 text-sm font-bold italic"><CheckCircle className="w-4 h-4 text-primary" /> POE+ Support</div>
                   <div className="flex items-center gap-3 text-sm font-bold italic"><CheckCircle className="w-4 h-4 text-primary" /> ONVIF Profile S/G/T</div>
                   <div className="flex items-center gap-3 text-sm font-bold italic"><CheckCircle className="w-4 h-4 text-primary" /> AES-256 Encryption</div>
                 </div>
               </div>
             </div>

             <div className="mt-12">
               <h3 className="text-xl font-black font-display italic uppercase mb-8 flex items-center gap-3"><Layers className="w-6 h-6 text-primary" /> System Capabilities</h3>
               <p className="text-surface-400 leading-relaxed mb-8 font-medium">Engineered for mission-critical security environments. Features high-bandwidth processing for real-time AI analytics and seamless VMS integration. Built-in tamper detection and hardware-level encryption.</p>
               <div className="grid grid-cols-2 gap-6">
                 <div className="p-6 bg-surface-100 rounded-2xl border border-surface-200">
                   <div className="font-black text-xs uppercase mb-2">Op Temp</div>
                   <div className="font-bold">-40°C to 65°C</div>
                 </div>
                 <div className="p-6 bg-surface-100 rounded-2xl border border-surface-200">
                   <div className="font-black text-xs uppercase mb-2">Resolution</div>
                   <div className="font-bold">4K (8MP) @ 60fps</div>
                 </div>
               </div>
             </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-surface-50 border border-surface-100 p-10 rounded-[2.5rem] sticky top-24">
             <div className="text-[10px] text-surface-400 uppercase font-black italic mb-2 tracking-widest">Base Project Pricing</div>
             <div className="text-6xl font-black font-display mb-10 text-white italic tracking-tighter">${$product.price.toLocaleString()}</div>
             <div className="space-y-4">
               <Link to="/rfq" className="btn btn-primary w-full py-6 uppercase italic font-black text-xl shadow-xl shadow-primary/10">Request Project RFQ</Link>
               <button className="btn btn-secondary w-full py-6 uppercase italic font-black text-xl">Download Specs</button>
             </div>
             <div className="mt-10 pt-10 border-t border-surface-100/50 space-y-6">
                <div className="flex items-center gap-4">
                  <ShieldAlert className="w-6 h-6 text-primary" />
                  <div className="text-xs font-bold leading-tight">Certified Professional <br />Installation Required</div>
                </div>
                <div className="flex items-center gap-4">
                  <Globe className="w-6 h-6 text-primary" />
                  <div className="text-xs font-bold leading-tight">Nationwide Integrator <br />Network Available</div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProductDetail;
