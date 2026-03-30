import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProducts } from '../hooks';
import { ShieldCheck, Truck, Package, Info, FileText, CheckCircle, Globe } from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams();
  const { data: products } = useProducts();
  const product = products?.find(p => p.id === id);

  if (!product) return <div className="p-24 text-center">Product not found.</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          <div className="bg-surface-50 border border-surface-100 p-10 rounded-[2.5rem]">
             <div className="flex flex-wrap gap-3 mb-6">
                <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded border border-primary/20">{product.brand}</span>
                <span className="px-3 py-1 bg-surface-100 text-surface-400 text-[10px] font-black uppercase tracking-widest rounded border border-surface-200">{product.condition}</span>
                {product.taaCompliant && <span className="badge-taa">TAA Compliant</span>}
             </div>
             <div className="font-mono text-primary font-bold tracking-widest mb-2 italic">SKU: {product.partNumber}</div>
             <h1 className="text-4xl font-black font-display italic uppercase tracking-tight mb-8 leading-tight">{product.name}</h1>
             
             <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-8 border-y border-surface-100/50">
               <div><div className="text-xs text-surface-400 uppercase font-black italic mb-2">Warranty</div><div className="font-bold">{product.warranty}</div></div>
               <div><div className="text-xs text-surface-400 uppercase font-black italic mb-2">Category</div><div className="font-bold">{product.category}</div></div>
               <div><div className="text-xs text-surface-400 uppercase font-black italic mb-2">Stock</div><div className="font-bold text-accent-success">In Stock</div></div>
               <div><div className="text-xs text-surface-400 uppercase font-black italic mb-2">Compliance</div><div className="font-bold text-blue-400">{product.taaCompliant ? 'TAA/NDAA' : 'Standard'}</div></div>
             </div>

             <div className="py-12">
               <h3 className="text-lg font-bold mb-6 flex items-center gap-2 uppercase italic tracking-widest"><Info className="w-5 h-5 text-primary"/> Product Information</h3>
               <p className="text-surface-400 leading-relaxed mb-6">High-performance network hardware designed for high-availability enterprise environments. Includes latest firmware and verification certificate.</p>
               <div className="space-y-3">
                 {['Next business day replacement', 'Original packaging included', 'Serial number tracking', 'Firmware version 17.06.01'].map(item => (
                   <div key={item} className="flex items-center gap-3 text-sm font-medium"><CheckCircle className="w-4 h-4 text-primary" /> {item}</div>
                 ))}
               </div>
             </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
             <div className="bg-surface-50 p-8 rounded-3xl border border-surface-100">
                <h3 className="font-bold mb-6 uppercase italic tracking-widest text-xs">Compatible Components</h3>
                <ul className="space-y-4 text-sm font-mono text-surface-400">
                  <li className="flex justify-between"><span>PWR-C1-715WAC-P</span> <span className="text-primary hover:underline cursor-pointer">View</span></li>
                  <li className="flex justify-between"><span>C9300-NM-8X</span> <span className="text-primary hover:underline cursor-pointer">View</span></li>
                  <li className="flex justify-between"><span>STACK-T1-50CM</span> <span className="text-primary hover:underline cursor-pointer">View</span></li>
                </ul>
             </div>
             <div className="bg-surface-50 p-8 rounded-3xl border border-surface-100">
                <h3 className="font-bold mb-6 uppercase italic tracking-widest text-xs">Technical Docs</h3>
                <div className="space-y-4">
                  <button className="w-full flex justify-between items-center text-sm font-bold bg-surface-100 p-3 rounded hover:bg-surface-200 transition-colors"><span>Datasheet (PDF)</span> <FileText className="w-4 h-4"/></button>
                  <button className="w-full flex justify-between items-center text-sm font-bold bg-surface-100 p-3 rounded hover:bg-surface-200 transition-colors"><span>Compliance Cert</span> <ShieldCheck className="w-4 h-4"/></button>
                </div>
             </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-surface-50 border border-primary/20 p-8 rounded-[2rem] sticky top-24">
             <div className="text-xs text-surface-400 uppercase font-black italic mb-2 tracking-widest">Price starting at</div>
             <div className="text-5xl font-black font-display mb-8 text-white">${$product.price.toLocaleString()}</div>
             <div className="space-y-4">
               <Link to="/rfq" className="btn btn-primary w-full py-5 uppercase italic font-black text-lg">Add to RFQ List</Link>
               <button className="btn btn-secondary w-full py-5 uppercase italic font-black text-lg">Get Flash Quote</button>
             </div>
             <div className="mt-8 space-y-4 text-xs font-bold text-surface-400">
               <div className="flex items-center gap-2"><Truck className="w-4 h-4"/> Ships from Amsterdam, NL</div>
               <div className="flex items-center gap-2"><Globe className="w-4 h-4"/> Global delivery in 3-5 days</div>
               <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4"/> Verified Genuine Hardware</div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProductDetail;
