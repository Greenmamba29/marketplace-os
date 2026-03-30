import { useParams, useNavigate, Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { Beaker, Shield, Truck, FileText, CheckCircle2, ArrowLeft, ClipboardList, Activity } from 'lucide-react';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: products } = useProducts();
  const product = products?.find(p => p.id === id);

  if (!product) return <div className="p-20 text-center text-surface-400">Product not found.</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link to="/products" className="inline-flex items-center gap-2 text-surface-400 hover:text-white mb-8 transition-colors">
        <ArrowLeft className="w-5 h-5" />
        Back to Results
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-6">
          <div className="aspect-square bg-white p-12 border border-surface-200 rounded-2xl overflow-hidden">
            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-contain" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 p-3 bg-surface-50 border border-surface-200 rounded-lg text-sm font-medium hover:bg-surface-100">
              <FileText className="w-4 h-4" />
              Download SDS
            </button>
            <button className="flex items-center justify-center gap-2 p-3 bg-surface-50 border border-surface-200 rounded-lg text-sm font-medium hover:bg-surface-100">
              <ClipboardList className="w-4 h-4" />
              Request CoA
            </button>
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm text-primary font-medium uppercase tracking-wider">{product.brand}</span>
              <span className="text-surface-400">•</span>
              <span className="text-sm text-surface-400">Cat #{product.catalogNumber}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">{product.name}</h1>
            <p className="text-surface-400 text-lg">High-precision {product.category.toLowerCase()} for professional research environments.</p>
          </div>

          {product.casNumber && (
            <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl">
              <div className="text-xs text-primary font-medium uppercase mb-1">Chemical Identity</div>
              <div className="flex items-center gap-6">
                <div>
                  <div className="text-xs text-surface-400">CAS Number</div>
                  <div className="text-lg font-mono text-white">{product.casNumber}</div>
                </div>
                <div>
                  <div className="text-xs text-surface-400">Purity</div>
                  <div className="text-lg font-mono text-white">{product.purity}</div>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-6">
            <div className="p-4 bg-surface-50 border border-surface-200 rounded-xl">
              <div className="flex items-center gap-2 text-surface-400 text-sm mb-1">
                <ClipboardList className="w-4 h-4" />
                <span>Unit Size</span>
              </div>
              <div className="text-xl font-bold text-white">{product.moq}</div>
            </div>
            <div className="p-4 bg-surface-50 border border-surface-200 rounded-xl">
              <div className="flex items-center gap-2 text-surface-400 text-sm mb-1">
                <Truck className="w-4 h-4" />
                <span>Lead Time</span>
              </div>
              <div className="text-xl font-bold text-white">{product.leadTime}</div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-display font-bold text-white">Compliance & Quality</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-accent-success" />
                <div>
                  <div className="text-xs text-surface-400">Certification</div>
                  <div className="text-sm font-medium text-white">ISO 9001:2015</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Activity className="w-5 h-5 text-primary" />
                <div>
                  <div className="text-xs text-surface-400">Grade</div>
                  <div className="text-sm font-medium text-white">ACS Reagent Grade</div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-surface-200">
            <button 
              onClick={() => navigate('/rfq')}
              className="w-full bg-primary text-white py-4 rounded-xl font-bold hover:bg-primary-600 transition-colors shadow-lg shadow-primary/20"
            >
              Request Institutional Quote
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
