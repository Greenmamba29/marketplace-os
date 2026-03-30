import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Package, ChevronRight, ShoppingCart, ShieldCheck, Download,
  Truck, BarChart3, Star, AlertTriangle, ArrowLeft, ExternalLink,
  Bookmark, Share2, Clock, CheckCircle, Users
} from 'lucide-react';
import { usePart } from '../hooks';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useShoppingContext, getContinueShoppingUrl, getContinueShoppingLabel } from '../hooks/useShoppingContext';

const MALL_URL = 'https://marketplace-os-hub.netlify.app';
const STORE_URL = 'https://marketplace-os-mrodirect.netlify.app';
const ACCENT = '#F97316';

const MOCK_PRICE_HISTORY = [
  { month: 'Oct', price: 42.50 },
  { month: 'Nov', price: 43.20 },
  { month: 'Dec', price: 45.80 },
  { month: 'Jan', price: 45.50 },
  { month: 'Feb', price: 44.90 },
  { month: 'Mar', price: 45.50 },
];

const PartDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: part, isLoading } = usePart(id || '1');
  const { save } = useShoppingContext();
  const continueUrl = getContinueShoppingUrl();
  const continueLabel = getContinueShoppingLabel();

  useEffect(() => {
    save({ storeId: 'mrodirect', storeName: 'MRODirect', storeUrl: STORE_URL });
  }, []);

  if (isLoading || !part) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">

      {/* ── BREADCRUMB + CONTINUE SHOPPING ── */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div className="flex items-center gap-2 text-sm text-surface-400">
          <a href={MALL_URL} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
            GrahmOS Mall
          </a>
          <ChevronRight className="w-4 h-4" />
          <Link to="/parts" className="hover:text-primary transition-colors">Directory</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to={`/parts?category=${part.category}`} className="hover:text-primary transition-colors">{part.category}</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-white font-medium truncate max-w-[140px]">{part.sku}</span>
        </div>

        {/* Continue Shopping — context-aware return */}
        <a
          href={continueUrl}
          target={continueUrl.startsWith('http') && !continueUrl.includes('mrodirect') ? '_blank' : undefined}
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-xs font-bold text-surface-400 hover:text-primary transition-colors border border-surface-200 hover:border-primary px-4 py-2 rounded-full"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          {continueLabel}
        </a>
      </div>

      {/* ── STATS BAR (OpenSea collection stats pattern) ── */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-10 p-4 bg-surface-50 border border-surface-200 rounded-2xl">
        {[
          { label: 'Unit Price',    value: `$${part.price.toLocaleString()}` },
          { label: 'Min Order',     value: '10 units' },
          { label: 'In Stock',      value: part.availability === 'In Stock' ? 'Yes' : 'Limited' },
          { label: 'Lead Time',     value: '2–5 days' },
          { label: 'Avg Last Sale', value: `$${(part.price * 0.96).toFixed(2)}` },
        ].map((s, i) => (
          <div key={i} className="text-center px-2 border-r border-surface-200/50 last:border-0">
            <p className="text-[10px] text-surface-400 uppercase tracking-widest font-bold mb-1">{s.label}</p>
            <p className="text-lg font-display font-black text-white">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

        {/* ── LEFT: MAIN CONTENT ── */}
        <div className="lg:col-span-8 space-y-8">

          {/* Product card */}
          <div className="bg-surface-50 border border-surface-200 rounded-3xl p-8 overflow-hidden relative">
            <div className="flex flex-col md:flex-row gap-8 items-start">

              {/* Media */}
              <div className="w-full md:w-56 aspect-square bg-[#080C14] rounded-2xl border border-surface-200 flex items-center justify-center p-10 shrink-0">
                <Package className="w-20 h-20 text-surface-200" style={{ color: ACCENT + '60' }} />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <span className="text-xs font-mono font-bold tracking-widest mb-2 block uppercase" style={{ color: ACCENT }}>
                      {part.sku}
                    </span>
                    <h1 className="text-2xl md:text-3xl font-display font-black text-white leading-tight">{part.name}</h1>
                    <p className="text-surface-400 mt-1">{part.brand} Industrial Systems</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button className="w-9 h-9 rounded-full border border-surface-200 flex items-center justify-center hover:border-primary transition-colors">
                      <Bookmark className="w-4 h-4 text-surface-400" />
                    </button>
                    <button className="w-9 h-9 rounded-full border border-surface-200 flex items-center justify-center hover:border-primary transition-colors">
                      <Share2 className="w-4 h-4 text-surface-400" />
                    </button>
                  </div>
                </div>

                {/* Trust badges */}
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className={`inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-1 rounded-full border ${
                    part.availability === 'In Stock'
                      ? 'bg-green-500/10 border-green-500/20 text-green-400'
                      : 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'
                  }`}>
                    <CheckCircle className="w-3 h-3" />{part.availability}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400">
                    <ShieldCheck className="w-3 h-3" />ISO 9001
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400">
                    <Star className="w-3 h-3 fill-current" />4.9 (124 reviews)
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-1 rounded-full bg-surface-100 border border-surface-200 text-surface-400">
                    <Users className="w-3 h-3" />840 orders
                  </span>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <div className="text-3xl font-display font-black text-white">${part.price.toLocaleString()}</div>
                  <div className="text-xs text-surface-400 mt-1">Excl. tax & shipping · Min order: 10 units</div>
                </div>

                {/* ── PRIMARY + SECONDARY CTAs (OpenSea: Buy Now + Make Offer) ── */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    to={`/rfq/new?partId=${part.id}`}
                    className="flex-1 py-4 rounded-xl font-black uppercase tracking-widest text-xs text-black flex items-center justify-center gap-2 shadow-lg transition-all hover:opacity-90"
                    style={{ backgroundColor: ACCENT, boxShadow: `0 8px 24px ${ACCENT}30` }}
                  >
                    <Clock className="w-4 h-4" />
                    Request Bulk Quote — Free
                  </Link>
                  <button className="flex-1 py-4 bg-surface-100 hover:bg-surface-200 border border-surface-200 rounded-xl font-black uppercase tracking-widest text-xs text-white flex items-center justify-center gap-2 transition-all">
                    <ShoppingCart className="w-4 h-4" />
                    Add to List
                  </button>
                </div>

                {/* Continue Shopping — always visible below CTAs */}
                <div className="mt-4 text-center">
                  <a
                    href={continueUrl}
                    target={continueUrl.startsWith('http') && !continueUrl.includes('mrodirect') ? '_blank' : undefined}
                    className="text-[11px] text-surface-400 hover:text-primary transition-colors font-bold uppercase tracking-widest"
                  >
                    ← {continueLabel}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Specs + Docs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-surface-50 border border-surface-200 rounded-3xl p-7">
              <h3 className="text-base font-display font-black text-white mb-5 uppercase tracking-tighter">Technical Specs</h3>
              <table className="w-full">
                <tbody>
                  {Object.entries(part.specs).map(([key, val]) => (
                    <tr key={key} className="border-b border-surface-200/50 last:border-0">
                      <td className="text-xs text-surface-400 py-3 pr-4">{key}</td>
                      <td className="text-xs font-mono text-white text-right py-3 uppercase">{val as string}</td>
                    </tr>
                  ))}
                  <tr className="border-b border-surface-200/50">
                    <td className="text-xs text-surface-400 py-3">Weight</td>
                    <td className="text-xs font-mono text-white text-right py-3">1.25 KG</td>
                  </tr>
                  <tr>
                    <td className="text-xs text-surface-400 py-3">Compliance</td>
                    <td className="text-xs font-mono text-white text-right py-3">ASTM-B117 / ISO-9002</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-surface-50 border border-surface-200 rounded-3xl p-7">
              <h3 className="text-base font-display font-black text-white mb-5 uppercase tracking-tighter">Documentation</h3>
              <div className="space-y-3">
                {[
                  { name: 'Technical Datasheet', size: '2.4 MB', type: 'PDF' },
                  { name: 'Installation Guide', size: '1.1 MB', type: 'PDF' },
                  { name: 'Certificate of Conformity', size: '0.5 MB', type: 'PDF' },
                  { name: 'CAD Models (STEP)', size: '8.4 MB', type: 'ZIP' },
                ].map((doc, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-[#080C14] border border-surface-200/50 rounded-xl hover:border-primary/40 cursor-pointer group transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-surface-100 rounded-lg flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                        <Download className="w-4 h-4 text-surface-400 group-hover:text-primary" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-white">{doc.name}</p>
                        <p className="text-[10px] text-surface-400">{doc.type} · {doc.size}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Price Analytics */}
          <div className="bg-surface-50 border border-surface-200 rounded-3xl p-7">
            <div className="flex justify-between items-center mb-7">
              <div>
                <h3 className="text-base font-display font-black text-white uppercase tracking-tighter">Price Analytics</h3>
                <p className="text-xs text-surface-400 mt-1">180-day price trend · {part.sku}</p>
              </div>
              <span className="text-[10px] font-black px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 flex items-center gap-1">
                <BarChart3 className="w-3 h-3" />Stable
              </span>
            </div>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={MOCK_PRICE_HISTORY}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#18181B" vertical={false} />
                  <XAxis dataKey="month" stroke="#71717A" fontSize={11} axisLine={false} tickLine={false} />
                  <YAxis stroke="#71717A" fontSize={11} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} />
                  <Tooltip contentStyle={{ background: '#18181B', border: '1px solid #3F3F46', borderRadius: '12px' }} itemStyle={{ color: ACCENT }} />
                  <Line type="monotone" dataKey="price" stroke={ACCENT} strokeWidth={3} dot={{ fill: ACCENT, r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* ── RIGHT SIDEBAR ── */}
        <div className="lg:col-span-4 space-y-6">

          {/* Supplier Comparison */}
          <div className="bg-surface-50 border border-surface-200 rounded-3xl p-6">
            <h3 className="text-xs font-black text-white uppercase tracking-widest mb-5">Best Supplier Matches</h3>
            <div className="space-y-4">
              {[
                { name: 'Global Industrial Co.', rating: 4.8, price: 45.50, delivery: '2–3 Days', verified: true, best: true },
                { name: 'Fastener Solutions LLC', rating: 4.5, price: 44.90, delivery: '4–5 Days', verified: true, best: false },
                { name: 'MRO Express Supply',    rating: 4.2, price: 48.20, delivery: 'Next Day',  verified: false, best: false },
              ].map((sup, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border transition-colors ${
                    sup.best ? 'bg-[#080C14] border-primary/30' : 'bg-transparent border-surface-200'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-xs font-bold text-white flex items-center gap-1">
                        {sup.name}
                        {sup.verified && <ShieldCheck className="w-3 h-3 text-primary" />}
                      </p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-[10px] text-surface-400">{sup.rating}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-white">${sup.price.toFixed(2)}</p>
                      <p className="text-[10px] text-surface-400">unit</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-surface-400">
                    <div className="flex items-center gap-1"><Truck className="w-3 h-3" />{sup.delivery}</div>
                    {sup.best && <span className="text-primary font-black">Best Match</span>}
                  </div>
                </div>
              ))}
            </div>
            <Link
              to={`/rfq/new?partId=${part.id}`}
              className="w-full mt-5 py-3 rounded-xl font-black uppercase tracking-widest text-xs text-black flex items-center justify-center gap-2 transition-all hover:opacity-90"
              style={{ backgroundColor: ACCENT }}
            >
              Request Quote from All 3
            </Link>
          </div>

          {/* Stock Alert */}
          <div className="bg-surface-50 border border-surface-200 rounded-3xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-yellow-400" />
              <h4 className="text-xs font-black text-white uppercase tracking-widest">Stock Alert</h4>
            </div>
            <p className="text-xs text-surface-400 leading-relaxed mb-4">
              High demand. Orders over 500 units may have 14-day extended lead times.
            </p>
            <div>
              <p className="text-[10px] text-surface-500 uppercase tracking-widest mb-2">Current Lead Time</p>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-1.5 bg-surface-200 rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-400 w-3/4 rounded-full" />
                </div>
                <span className="text-xs font-bold text-white">High</span>
              </div>
            </div>
          </div>

          {/* Return to mall */}
          <a
            href={MALL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 border border-surface-200 hover:border-primary rounded-xl text-xs font-bold text-surface-400 hover:text-primary transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Back to GrahmOS Mall
          </a>
        </div>
      </div>
    </div>
  );
};

export default PartDetail;
