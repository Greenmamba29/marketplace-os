import { useParams, useNavigate, Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { Sprout, Shield, Truck, Beaker, FileText, CheckCircle2, ArrowLeft, Info } from 'lucide-react';

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
        Back to Catalog
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-6">
          <div className="aspect-square bg-surface-50 border border-surface-200 rounded-2xl overflow-hidden">
            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <div className="text-sm text-primary font-medium uppercase tracking-wider mb-2">{product.category}</div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">{product.name}</h1>
            <p className="text-surface-400 text-lg">Premium {product.category.toLowerCase()} supplied by {product.supplier}.</p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="p-4 bg-surface-50 border border-surface-200 rounded-xl">
              <div className="flex items-center gap-2 text-surface-400 text-sm mb-1">
                <Sprout className="w-4 h-4" />
                <span>Minimum Order</span>
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
            <h3 className="text-xl font-display font-bold text-white">Product Specifications</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4">
              <div className="flex items-center gap-3">
                <Beaker className="w-5 h-5 text-primary" />
                <div>
                  <div className="text-xs text-surface-400">Active Ingredients</div>
                  <div className="text-sm font-medium text-white">{product.activeIngredients}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-primary" />
                <div>
                  <div className="text-xs text-surface-400">EPA Registration</div>
                  <div className="text-sm font-medium text-white">{product.epaRegNo}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Info className="w-5 h-5 text-primary" />
                <div>
                  <div className="text-xs text-surface-400">Application Rate</div>
                  <div className="text-sm font-medium text-white">{product.applicationRate}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-primary" />
                <div>
                  <div className="text-xs text-surface-400">Resistance Management</div>
                  <div className="text-sm font-medium text-white">Group 9 (HRAC)</div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-surface-200">
            <button 
              onClick={() => navigate('/rfq')}
              className="w-full bg-primary text-white py-4 rounded-xl font-bold hover:bg-primary-600 transition-colors shadow-lg shadow-primary/20"
            >
              Request Custom Quote
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
