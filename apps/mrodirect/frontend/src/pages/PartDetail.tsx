import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, ChevronRight, ShoppingCart, ShieldCheck, Download, Truck, BarChart3, Star, AlertTriangle } from 'lucide-react';
import { usePart } from '../hooks';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const MOCK_PRICE_HISTORY = [
  { month: 'Oct', price: 42.50 },
  { month: 'Nov', price: 43.20 },
  { month: 'Dec', price: 45.80 },
  { month: 'Jan', price: 45.50 },
  { month: 'Feb', price: 44.90 },
  { month: 'Mar', price: 45.50 }
];

const PartDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: part, isLoading } = usePart(id || '1');

  if (isLoading || !part) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-surface-400 mb-8">
        <Link to="/parts" className="hover:text-primary transition-colors">Directory</Link>
        <ChevronRight className="w-4 h-4" />
        <Link to={`/parts?category=${part.category}`} className="hover:text-primary transition-colors">{part.category}</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-white font-medium">{part.sku}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Main Part Info */}
        <div className="lg:col-span-8 space-y-12">
          <div className="glass border border-surface-200 rounded-3xl p-8 overflow-hidden relative">
            <div className="flex flex-col md:flex-row gap-8 items-start">
               <div className="w-full md:w-64 aspect-square bg-surface-50 rounded-2xl border border-surface-200 flex items-center justify-center p-12">
                  <Package className="w-24 h-24 text-surface-200" />
               </div>
               <div className="flex-1">
                 <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="text-sm font-mono text-primary font-medium tracking-wider mb-2 block uppercase">{part.sku}</span>
                      <h1 className="text-3xl font-display font-bold text-white mb-2">{part.name}</h1>
                      <div className="text-lg text-surface-400">{part.brand} Industrial Systems</div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-white">${part.price.toLocaleString()}</div>
                      <div className="text-xs text-surface-400">Excl. Tax & Shipping</div>
                    </div>
                 </div>
                 <div className="flex flex-wrap gap-4 mb-8">
                   <div className={`badge ${part.availability === 'In Stock' ? 'badge-success' : 'badge-warning'}`}>
                     {part.availability}
                   </div>
                   <div className="badge badge-info flex items-center gap-1">
                     <ShieldCheck className="w-3 h-3" /> ISO 9001 Certified
                   </div>
                   <div className="badge badge-warning flex items-center gap-1">
                     <Star className="w-3 h-3 fill-accent-warning" /> 4.9 (124 reviews)
                   </div>
                 </div>
                 <div className="flex gap-4">
                   <Link to={`/rfq/new?partId=${part.id}`} className="btn btn-primary px-8">
                     Request Bulk Quote
                   </Link>
                   <button className="btn btn-secondary flex items-center gap-2">
                     <ShoppingCart className="w-5 h-5" /> Add to List
                   </button>
                 </div>
               </div>
            </div>
          </div>

          {/* Specs & Documents */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="glass border border-surface-200 rounded-3xl p-8">
                <h3 className="text-xl font-display font-bold text-white mb-6">Technical Specifications</h3>
                <div className="table-container bg-transparent border-0">
                  <table className="w-full">
                    <tbody>
                      {Object.entries(part.specs).map(([key, val]) => (
                        <tr key={key}>
                          <td className="text-sm text-surface-400 py-3 border-b border-surface-100">{key}</td>
                          <td className="text-sm font-mono text-white text-right py-3 border-b border-surface-100 uppercase">{val}</td>
                        </tr>
                      ))}
                      <tr>
                        <td className="text-sm text-surface-400 py-3 border-b border-surface-100">Weight</td>
                        <td className="text-sm font-mono text-white text-right py-3 border-b border-surface-100 uppercase">1.25 KG</td>
                      </tr>
                      <tr>
                        <td className="text-sm text-surface-400 py-3 border-0">Compliance</td>
                        <td className="text-sm font-mono text-white text-right py-3 border-0">ASTM-B117 / ISO-9002</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
             </div>

             <div className="glass border border-surface-200 rounded-3xl p-8">
                <h3 className="text-xl font-display font-bold text-white mb-6">Documentation</h3>
                <div className="space-y-4">
                  {[
                    { name: 'Technical Datasheet', size: '2.4 MB', type: 'PDF' },
                    { name: 'Installation Guide', size: '1.1 MB', type: 'PDF' },
                    { name: 'Certificate of Conformity', size: '0.5 MB', type: 'PDF' },
                    { name: 'CAD Models (STEP)', size: '8.4 MB', type: 'ZIP' }
                  ].map((doc, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-surface-50 border border-surface-100 rounded-xl hover:border-primary/30 transition-colors cursor-pointer group">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 bg-surface-100 rounded-lg flex items-center justify-center group-hover:bg-primary/10">
                            <Download className="w-5 h-5 text-surface-400 group-hover:text-primary" />
                         </div>
                         <div>
                            <div className="text-sm font-medium text-white">{doc.name}</div>
                            <div className="text-xs text-surface-400">{doc.type} • {doc.size}</div>
                         </div>
                      </div>
                    </div>
                  ))}
                </div>
             </div>
          </div>

          {/* Price History */}
          <div className="glass border border-surface-200 rounded-3xl p-8">
            <div className="flex justify-between items-center mb-8">
               <div>
                  <h3 className="text-xl font-display font-bold text-white mb-1">Price Analytics</h3>
                  <p className="text-sm text-surface-400">180-day price trend analysis for {part.sku}</p>
               </div>
               <div className="flex gap-2">
                 <span className="badge badge-success flex items-center gap-1">
                   <BarChart3 className="w-3 h-3" /> Stable Price
                 </span>
               </div>
            </div>
            <div className="h-64 w-full">
               <ResponsiveContainer width="100%" height="100%">
                 <LineChart data={MOCK_PRICE_HISTORY}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#18181B" vertical={false} />
                    <XAxis dataKey="month" stroke="#71717A" fontSize={12} axisLine={false} tickLine={false} />
                    <YAxis stroke="#71717A" fontSize={12} axisLine={false} tickLine={false} tickFormatter={(val) => `$${val}`} />
                    <Tooltip 
                      contentStyle={{ background: '#18181B', border: '1px solid #3F3F46', borderRadius: '12px' }}
                      itemStyle={{ color: '#F97316' }}
                    />
                    <Line type="monotone" dataKey="price" stroke="#F97316" strokeWidth={3} dot={{ fill: '#F97316', r: 4 }} activeDot={{ r: 6 }} />
                 </LineChart>
               </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-8">
           <div className="glass border border-surface-200 rounded-3xl p-8 bg-primary/5">
              <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-wider text-xs">Supplier Comparison</h3>
              <div className="space-y-6">
                 {[
                   { name: 'Global Industrial Co.', rating: 4.8, price: 45.50, delivery: '2-3 Days', verified: true },
                   { name: 'Fastener Solutions LLC', rating: 4.5, price: 44.90, delivery: '4-5 Days', verified: true },
                   { name: 'MRO Express Supply', rating: 4.2, price: 48.20, delivery: 'Next Day', verified: false }
                 ].map((sup, idx) => (
                   <div key={idx} className={`p-4 rounded-2xl border ${idx === 0 ? 'bg-surface-50 border-primary/30' : 'bg-transparent border-surface-200'}`}>
                      <div className="flex justify-between items-start mb-3">
                         <div>
                            <div className="text-sm font-bold text-white flex items-center gap-1">
                              {sup.name}
                              {sup.verified && <ShieldCheck className="w-3 h-3 text-primary" />}
                            </div>
                            <div className="flex items-center gap-1 mt-1">
                               <Star className="w-3 h-3 fill-accent-warning text-accent-warning" />
                               <span className="text-xs text-surface-400">{sup.rating} Rating</span>
                            </div>
                         </div>
                         <div className="text-right">
                            <div className="text-sm font-bold text-white">${sup.price.toFixed(2)}</div>
                            <div className="text-[10px] text-surface-400">Unit Price</div>
                         </div>
                      </div>
                      <div className="flex justify-between items-center text-xs text-surface-400">
                         <div className="flex items-center gap-1">
                            <Truck className="w-3 h-3" /> {sup.delivery}
                         </div>
                         <button className={`text-primary font-bold hover:underline ${idx !== 0 ? 'opacity-0 pointer-events-none' : ''}`}>Best Match</button>
                      </div>
                   </div>
                 ))}
              </div>
              <button className="btn btn-primary w-full mt-8">Purchase from Primary</button>
           </div>

           <div className="glass border border-surface-200 rounded-3xl p-8 bg-surface-50">
              <div className="flex items-center gap-3 text-accent-warning mb-4">
                 <AlertTriangle className="w-5 h-5" />
                 <h4 className="font-bold text-white">Stock Alert</h4>
              </div>
              <p className="text-sm text-surface-400 mb-6 leading-relaxed">
                This part is experiencing high demand. Lead times for orders over 500 units may extend by 14 days.
              </p>
              <div className="flex flex-col gap-2">
                 <div className="text-xs text-surface-400 mb-1">Current Lead Time</div>
                 <div className="flex items-center gap-4">
                    <div className="flex-1 h-2 bg-surface-100 rounded-full overflow-hidden">
                       <div className="h-full bg-accent-warning w-3/4" />
                    </div>
                    <span className="text-sm font-bold text-white">High</span>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default PartDetail;
