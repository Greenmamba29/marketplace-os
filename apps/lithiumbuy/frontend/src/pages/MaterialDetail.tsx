import { useParams, Link } from 'react-router-dom';
import { useMaterials } from '@/hooks';
import { Hexagon, Globe, Shield, FileText, BarChart3, Clock, ArrowLeft, Download, Layers, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function MaterialDetail() {
  const { id } = useParams();
  const { data: materials } = useMaterials();
  const material = materials?.find(m => m.id === id);

  if (!material) return <div className="pt-32 text-center text-surface-400">Material not found...</div>;

  return (
    <div className="min-h-screen bg-surface pt-24 pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/materials" className="inline-flex items-center gap-2 text-surface-400 hover:text-white transition-colors mb-12 text-sm font-bold uppercase tracking-widest">
          <ArrowLeft className="w-4 h-4" /> BACK TO MARKET
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Visuals & Specs */}
          <div>
            <div className="aspect-[16/10] bg-surface-50 border border-surface-200 rounded-3xl overflow-hidden mb-10 group relative">
              <img src={material.image} alt={material.name} className="w-full h-full object-cover opacity-70" />
            </div>
            
            <div className="bg-surface-50 border border-surface-200 rounded-3xl p-8 mb-10">
              <h3 className="text-lg font-display font-bold text-white mb-8 flex items-center gap-3">
                <BarChart3 className="w-5 h-5 text-primary" /> PRICE INDEX HISTORY
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={material.priceHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272A" vertical={false} />
                    <XAxis dataKey="date" stroke="#71717A" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="#71717A" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ background: '#18181B', border: '1px solid #27272A', borderRadius: '8px' }}
                      itemStyle={{ color: '#7C3AED' }}
                    />
                    <Line type="monotone" dataKey="price" stroke="#7C3AED" strokeWidth={3} dot={{ fill: '#7C3AED' }} activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 bg-surface-50 border border-surface-200 rounded-2xl">
                <Globe className="w-5 h-5 text-primary mb-3" />
                <p className="text-[10px] text-surface-400 font-black uppercase mb-1">Country of Origin</p>
                <p className="text-lg font-display font-bold text-white">{material.origin}</p>
              </div>
              <div className="p-6 bg-surface-50 border border-surface-200 rounded-2xl">
                <Shield className="w-5 h-5 text-primary mb-3" />
                <p className="text-[10px] text-surface-400 font-black uppercase mb-1">Assay Verification</p>
                <p className="text-lg font-display font-bold text-white">Full COA</p>
              </div>
            </div>
          </div>

          {/* Commerce & Info */}
          <div>
            <div className="mb-12">
              <div className="flex gap-2 mb-4">
                {material.compounds.map(c => (
                  <span key={c} className="px-3 py-1 bg-surface-100 border border-surface-200 rounded-md text-[10px] font-mono font-black text-primary">{c}</span>
                ))}
              </div>
              <h1 className="text-5xl md:text-6xl font-display font-black text-white mb-8 leading-none">{material.name}</h1>
              <p className="text-surface-400 text-xl leading-relaxed font-light">{material.description}</p>
            </div>

            <div className="space-y-6 mb-12">
              <div className="flex justify-between items-center p-6 bg-surface-50 border border-surface-200 rounded-2xl">
                <span className="text-sm font-bold text-white">PURITY TARGET</span>
                <span className="text-2xl font-mono text-primary font-black">{material.purity}</span>
              </div>
              <div className="flex justify-between items-center p-6 bg-surface-50 border border-surface-200 rounded-2xl">
                <span className="text-sm font-bold text-white">MINIMUM ORDER</span>
                <span className="text-xl font-mono text-white font-bold">{material.minOrder}</span>
              </div>
            </div>

            <div className="bg-surface-50 border border-surface-200 rounded-3xl p-8 mb-12">
              <h3 className="text-lg font-display font-bold text-white mb-6 uppercase tracking-widest">Compliance & Standards</h3>
              <div className="flex flex-wrap gap-3">
                {material.certifications.map(cert => (
                  <span key={cert} className="px-5 py-2.5 bg-surface border border-surface-200 rounded-xl text-xs font-bold text-white flex items-center gap-2">
                    <Shield className="w-3 h-3 text-primary" /> {cert}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6">
              <Link 
                to={`/rfq?mat=${material.id}`} 
                className="flex-grow py-5 bg-primary text-white font-black rounded-2xl flex items-center justify-center gap-3 hover:shadow-[0_0_30px_rgba(124,58,237,0.4)] transition-all"
              >
                <FileText className="w-6 h-6" /> REQUEST QUOTE
              </Link>
              <button className="px-10 py-5 bg-surface-100 text-white font-bold rounded-2xl border border-surface-200 flex items-center justify-center gap-3 hover:bg-surface-200 transition-all">
                <Download className="w-5 h-5" /> CERTIFICATE
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
