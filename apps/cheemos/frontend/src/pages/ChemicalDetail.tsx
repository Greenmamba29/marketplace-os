import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Beaker, 
  ChevronLeft, 
  ExternalLink, 
  FileText, 
  Shield, 
  TrendingUp,
  FlaskConical,
  AlertTriangle,
  Thermometer,
  Package,
  Clock,
  Download,
  Loader2,
  CheckCircle,
  Quote
} from 'lucide-react';
import { useChemical, useChemicalOfferings, useComplianceByCAS, useAlertsByCAS, usePriceHistory } from '@/hooks';
import { ComplianceDisplay } from '@/components/ComplianceBadge';
import PriceChart from '@/components/PriceChart';
import { motion } from 'framer-motion';

// Tab component
function Tabs({ tabs, activeTab, onChange }: { tabs: { id: string; label: string; icon: typeof Beaker }[]; activeTab: string; onChange: (id: string) => void }) {
  return (
    <div className="border-b border-surface-200">
      <div className="flex gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-surface-400 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Supplier offering card
function OfferingCard({ offering }: { offering: any }) {
  return (
    <div className="p-4 bg-surface-50 border border-surface-200 rounded-lg">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-medium text-white">{offering.supplier?.name || 'Supplier'}</h4>
          <div className="flex items-center gap-2 mt-1">
            {offering.supplier?.is_verified && (
              <span className="flex items-center gap-1 text-xs text-accent-success">
                <CheckCircle className="w-3 h-3" /> Verified
              </span>
            )}
            <span className="text-xs text-surface-400">
              {offering.supplier?.locations?.[0]?.country || 'Global'}
            </span>
          </div>
        </div>
        <div className="text-right">
          {offering.base_price && (
            <p className="text-lg font-mono font-medium text-primary">
              ${offering.base_price}/{offering.unit}
            </p>
          )}
          {offering.is_stock_item && (
            <span className="text-xs text-accent-success">In Stock</span>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4 text-sm mb-4">
        <div>
          <span className="text-surface-400">Grade</span>
          <p className="text-white uppercase">{offering.grade}</p>
        </div>
        <div>
          <span className="text-surface-400">Purity</span>
          <p className="text-white">{offering.purity}%</p>
        </div>
        <div>
          <span className="text-surface-400">Lead Time</span>
          <p className="text-white">{offering.lead_time_days} days</p>
        </div>
      </div>
      
      <div className="flex gap-2">
        <Link
          to={`/rfq/${offering.chemical_id}?supplier=${offering.supplier_id}`}
          className="flex-1 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-600 transition-colors text-center"
        >
          Request Quote
        </Link>
        <button className="px-4 py-2 bg-surface-100 text-white text-sm font-medium rounded-lg hover:bg-surface-200 transition-colors">
          Contact
        </button>
      </div>
    </div>
  );
}

export default function ChemicalDetail() {
  const { id, casNumber } = useParams<{ id?: string; casNumber?: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  
  const { data: chemical, isLoading: chemicalLoading, error: chemicalError } = useChemical(id || '');
  const { data: offerings, isLoading: offeringsLoading } = useChemicalOfferings(id || '');
  const { data: compliance } = useComplianceByCAS(chemical?.cas_number || casNumber || '');
  const { data: alerts } = useAlertsByCAS(chemical?.cas_number || casNumber || '');
  const { data: priceHistory } = usePriceHistory(id || '', 12);
  
  const isLoading = chemicalLoading;
  const error = chemicalError;
  
  const tabs = [
    { id: 'overview', label: 'Overview', icon: Beaker },
    { id: 'compliance', label: 'Compliance', icon: Shield },
    { id: 'pricing', label: 'Pricing', icon: TrendingUp },
    { id: 'suppliers', label: 'Suppliers', icon: Package },
  ];
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }
  
  if (error || !chemical) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-accent-error mx-auto mb-4" />
          <h2 className="text-xl font-medium text-white mb-2">Chemical not found</h2>
          <p className="text-surface-400 mb-4">The chemical you're looking for doesn't exist or has been removed.</p>
          <Link to="/cas" className="text-primary hover:underline">
            Browse CAS Directory
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <div className="bg-surface-50 border-b border-surface-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link to="/cas" className="inline-flex items-center gap-2 text-surface-400 hover:text-white mb-4">
            <ChevronLeft className="w-4 h-4" />
            Back to Directory
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-display font-bold text-white">{chemical.name}</h1>
                <span className="cas-number px-3 py-1 bg-primary/10 border border-primary/30 rounded-full text-sm font-mono text-primary">
                  {chemical.cas_number}
                </span>
              </div>
              <p className="text-surface-400">{chemical.iupac_name}</p>
            </div>
            
            <div className="flex items-center gap-2">
              <Link
                to={`/rfq/${chemical.id}`}
                className="px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-600 transition-colors flex items-center gap-2"
              >
                <Quote className="w-4 h-4" />
                Request Quote
              </Link>
              <button className="p-3 bg-surface-100 border border-surface-200 rounded-lg text-white hover:bg-surface-200 transition-colors">
                <Download className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {/* Quick stats */}
          <div className="flex flex-wrap gap-4 mt-6">
            <div className="flex items-center gap-2 px-4 py-2 bg-surface rounded-lg">
              <FlaskConical className="w-4 h-4 text-primary" />
              <span className="text-sm text-surface-400">Formula:</span>
              <span className="font-mono text-white">{chemical.molecular_formula}</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-surface rounded-lg">
              <span className="text-sm text-surface-400">MW:</span>
              <span className="font-mono text-white">{chemical.molecular_weight} g/mol</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-surface rounded-lg">
              <span className="text-sm text-surface-400">Grade:</span>
              <span className="text-white uppercase">{chemical.grade}</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-surface rounded-lg">
              <span className="text-sm text-surface-400">Purity:</span>
              <span className="text-white">{chemical.purity_min}-{chemical.purity_max}%</span>
            </div>
            {chemical.flashpoint_c && (
              <div className="flex items-center gap-2 px-4 py-2 bg-surface rounded-lg">
                <Thermometer className="w-4 h-4 text-accent-warning" />
                <span className="text-sm text-surface-400">Flashpoint:</span>
                <span className="text-white">{chemical.flashpoint_c}°C</span>
              </div>
            )}
          </div>
          
          {/* Compliance badges */}
          {compliance && (
            <div className="flex flex-wrap gap-2 mt-4">
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                compliance.reach_status === 'registered' 
                  ? 'bg-accent-success/10 text-accent-success border-accent-success/30' 
                  : 'bg-accent-warning/10 text-accent-warning border-accent-warning/30'
              }`}>
                REACH: {compliance.reach_status.replace('_', ' ')}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                compliance.tsca_status === 'listed' 
                  ? 'bg-accent-success/10 text-accent-success border-accent-success/30' 
                  : 'bg-accent-warning/10 text-accent-warning border-accent-warning/30'
              }`}>
                TSCA: {compliance.tsca_status.replace('_', ' ')}
              </span>
            </div>
          )}
        </div>
      </div>
      
      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
        
        <div className="mt-8">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <section className="bg-surface-50 border border-surface-200 rounded-xl p-6">
                  <h3 className="text-lg font-medium text-white mb-4">Description</h3>
                  <p className="text-surface-400 leading-relaxed">{chemical.description}</p>
                </section>
                
                <section className="bg-surface-50 border border-surface-200 rounded-xl p-6">
                  <h3 className="text-lg font-medium text-white mb-4">Specifications</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <span className="text-sm text-surface-400">Category</span>
                      <p className="text-white capitalize">{chemical.category.replace(/_/g, ' ')}</p>
                    </div>
                    <div>
                      <span className="text-sm text-surface-400">Storage</span>
                      <p className="text-white">{chemical.storage_conditions}</p>
                    </div>
                    <div>
                      <span className="text-sm text-surface-400">Shelf Life</span>
                      <p className="text-white">{chemical.shelf_life_months} months</p>
                    </div>
                    {chemical.un_hazmat_number && (
                      <div>
                        <span className="text-sm text-surface-400">UN Hazmat</span>
                        <p className="font-mono text-white">{chemical.un_hazmat_number}</p>
                      </div>
                    )}
                  </div>
                </section>
                
                {/* Documents */}
                <section className="bg-surface-50 border border-surface-200 rounded-xl p-6">
                  <h3 className="text-lg font-medium text-white mb-4">Documents</h3>
                  <div className="flex flex-wrap gap-3">
                    {chemical.sds_url && (
                      <a 
                        href={chemical.sds_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-surface-100 border border-surface-200 rounded-lg text-white hover:border-primary/50 transition-colors"
                      >
                        <FileText className="w-4 h-4 text-accent-warning" />
                        Safety Data Sheet (SDS)
                        <ExternalLink className="w-4 h-4 text-surface-400" />
                      </a>
                    )}
                    {chemical.coa_url && (
                      <a 
                        href={chemical.coa_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-surface-100 border border-surface-200 rounded-lg text-white hover:border-primary/50 transition-colors"
                      >
                        <FileText className="w-4 h-4 text-accent-info" />
                        Certificate of Analysis (COA)
                        <ExternalLink className="w-4 h-4 text-surface-400" />
                      </a>
                    )}
                  </div>
                </section>
              </div>
              
              {/* Sidebar */}
              <div className="space-y-6">
                {priceHistory && priceHistory.length > 0 && (
                  <section className="bg-surface-50 border border-surface-200 rounded-xl p-6">
                    <h3 className="text-lg font-medium text-white mb-4">Price Trend</h3>
                    <PriceChart data={priceHistory} height={200} showVolume={false} />
                  </section>
                )}
                
                {/* Regulatory alerts */}
                {alerts && alerts.length > 0 && (
                  <section className="bg-surface-50 border border-surface-200 rounded-xl p-6">
                    <h3 className="text-lg font-medium text-white mb-4">Regulatory Alerts</h3>
                    <div className="space-y-3">
                      {alerts.slice(0, 3).map((alert) => (
                        <div key={alert.id} className="p-3 bg-surface rounded-lg border border-surface-200">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`w-2 h-2 rounded-full ${
                              alert.severity === 'critical' ? 'bg-accent-error' :
                              alert.severity === 'high' ? 'bg-accent-warning' :
                              alert.severity === 'medium' ? 'bg-accent-info' :
                              'bg-surface-400'
                            }`} />
                            <span className="text-xs text-surface-400 uppercase">{alert.regulation_type}</span>
                          </div>
                          <p className="text-sm text-white">{alert.title}</p>
                          <p className="text-xs text-surface-400 mt-1">
                            {new Date(alert.effective_date).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            </div>
          )}
          
          {/* Compliance Tab */}
          {activeTab === 'compliance' && (
            <div className="max-w-3xl">
              <ComplianceDisplay compliance={compliance} showDetails />
              
              {compliance?.documents && compliance.documents.length > 0 && (
                <section className="mt-8">
                  <h3 className="text-lg font-medium text-white mb-4">Compliance Documents</h3>
                  <div className="space-y-3">
                    {compliance.documents.map((doc) => (
                      <a
                        key={doc.id}
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-4 bg-surface-50 border border-surface-200 rounded-lg hover:border-primary/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-primary" />
                          <div>
                            <p className="text-white">{doc.name}</p>
                            <p className="text-xs text-surface-400 capitalize">{doc.type.replace('_', ' ')}</p>
                          </div>
                        </div>
                        <ExternalLink className="w-4 h-4 text-surface-400" />
                      </a>
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}
          
          {/* Pricing Tab */}
          {activeTab === 'pricing' && (
            <div className="space-y-8">
              {priceHistory && priceHistory.length > 0 ? (
                <PriceChart 
                  data={priceHistory} 
                  title="12-Month Price History"
                  height={400}
                  showVolume
                />
              ) : (
                <div className="text-center py-12 bg-surface-50 border border-surface-200 rounded-xl">
                  <TrendingUp className="w-12 h-12 text-surface-300 mx-auto mb-4" />
                  <p className="text-surface-400">No price history available</p>
                </div>
              )}
            </div>
          )}
          
          {/* Suppliers Tab */}
          {activeTab === 'suppliers' && (
            <div className="space-y-6">
              {offeringsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
              ) : offerings && offerings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {offerings.map((offering) => (
                    <OfferingCard key={offering.id} offering={offering} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-surface-50 border border-surface-200 rounded-xl">
                  <Package className="w-12 h-12 text-surface-300 mx-auto mb-4" />
                  <p className="text-surface-400 mb-4">No suppliers currently offering this chemical</p>
                  <Link 
                    to={`/rfq/${chemical.id}`}
                    className="px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-600 transition-colors"
                  >
                    Submit RFQ to Find Suppliers
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
