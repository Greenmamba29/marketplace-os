import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Shield, 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  Download,
  Search,
  Beaker,
  ChevronRight,
  Clock,
  Globe,
  Sparkles,
  Loader2
} from 'lucide-react';
import { useComplianceByCAS, useComplianceReports, useGenerateAIReport, useAlertsByCAS } from '@/hooks';
import CASSearch from '@/components/CASSearch';
import { ComplianceDisplay } from '@/components/ComplianceBadge';
import toast from 'react-hot-toast';

// Document card
function DocumentCard({ doc }: { doc: any }) {
  const icons: Record<string, typeof FileText> = {
    sds: FileText,
    coa: FileText,
    reach_dossier: Shield,
    tsca_certificate: CheckCircle,
    safety_assessment: AlertTriangle,
  };
  
  const Icon = icons[doc.type] || FileText;
  
  return (
    <a
      href={doc.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-between p-4 bg-surface-50 border border-surface-200 rounded-lg hover:border-primary/50 transition-colors"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <div>
          <p className="text-white font-medium">{doc.name}</p>
          <p className="text-sm text-surface-400 capitalize">{doc.type.replace('_', ' ')}</p>
        </div>
      </div>
      <Download className="w-5 h-5 text-surface-400" />
    </a>
  );
}

// AI Report card
function AIReportCard({ report }: { report: any }) {
  return (
    <div className="p-6 bg-surface-50 border border-surface-200 rounded-xl">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-white font-medium capitalize">{report.report_type.replace('_', ' ')}</p>
            <p className="text-sm text-surface-400">
              Generated {new Date(report.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          report.risk_level === 'low' ? 'bg-accent-success/10 text-accent-success' :
          report.risk_level === 'medium' ? 'bg-accent-warning/10 text-accent-warning' :
          'bg-accent-error/10 text-accent-error'
        }`}>
          {report.risk_level} risk
        </span>
      </div>
      
      {report.key_findings.length > 0 && (
        <div className="mb-4">
          <p className="text-sm text-surface-400 mb-2">Key Findings</p>
          <ul className="space-y-1">
            {report.key_findings.slice(0, 3).map((finding: string, i: number) => (
              <li key={i} className="text-sm text-white flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                {finding}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {report.recommendations.length > 0 && (
        <div>
          <p className="text-sm text-surface-400 mb-2">Recommendations</p>
          <ul className="space-y-1">
            {report.recommendations.slice(0, 2).map((rec: string, i: number) => (
              <li key={i} className="text-sm text-white flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-accent-warning mt-0.5 flex-shrink-0" />
                {rec}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      <div className="mt-4 pt-4 border-t border-surface-200 flex items-center justify-between">
        <span className="text-sm text-surface-400">
          Valid until {new Date(report.valid_until).toLocaleDateString()}
        </span>
        <button className="text-sm text-primary hover:underline">
          View full report →
        </button>
      </div>
    </div>
  );
}

// Regulatory alert card
function AlertCard({ alert }: { alert: any }) {
  return (
    <div className="p-4 bg-surface-50 border border-surface-200 rounded-lg">
      <div className="flex items-start gap-3">
        <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
          alert.severity === 'critical' ? 'bg-accent-error' :
          alert.severity === 'high' ? 'bg-accent-warning' :
          alert.severity === 'medium' ? 'bg-accent-info' :
          'bg-surface-400'
        }`} />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-surface-400 uppercase">{alert.regulation_type}</span>
            <span className="text-xs text-surface-400">·</span>
            <span className="text-xs text-surface-400">
              {new Date(alert.created_at).toLocaleDateString()}
            </span>
          </div>
          <p className="text-white font-medium">{alert.title}</p>
          <p className="text-sm text-surface-400 mt-1">{alert.description}</p>
          {alert.effective_date && (
            <p className="text-sm text-accent-warning mt-2">
              Effective: {new Date(alert.effective_date).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ComplianceReports() {
  const { casNumber } = useParams<{ casNumber?: string }>();
  const [searchCAS, setSearchCAS] = useState(casNumber || '');
  const [activeTab, setActiveTab] = useState('overview');
  
  const { data: compliance, isLoading: complianceLoading } = useComplianceByCAS(searchCAS);
  const { data: reports, isLoading: reportsLoading } = useComplianceReports(searchCAS);
  const { data: alerts, isLoading: alertsLoading } = useAlertsByCAS(searchCAS);
  const generateAIReport = useGenerateAIReport();
  
  const tabs = [
    { id: 'overview', label: 'Overview', icon: Shield },
    { id: 'reports', label: 'AI Reports', icon: Sparkles },
    { id: 'alerts', label: 'Alerts', icon: AlertTriangle },
    { id: 'documents', label: 'Documents', icon: FileText },
  ];
  
  const handleGenerateReport = async (type: 'full_assessment' | 'reach_summary' | 'tsca_check' | 'safety_review') => {
    if (!searchCAS) {
      toast.error('Please search for a chemical first');
      return;
    }
    
    try {
      await generateAIReport.mutateAsync({ casNumber: searchCAS, reportType: type });
      toast.success('AI report generation started');
    } catch (error) {
      toast.error('Failed to generate report');
    }
  };

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <div className="bg-surface-50 border-b border-surface-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-display font-bold text-white">Compliance Center</h1>
              <p className="text-surface-400 mt-1">Verify regulatory status and generate compliance reports</p>
            </div>
          </div>
          
          {/* Search */}
          <div className="mt-6 max-w-xl">
            <CASSearch 
              placeholder="Search chemical by CAS number or name..."
              onSelect={(cas) => setSearchCAS(cas)}
            />
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!searchCAS ? (
          <div className="text-center py-20">
            <Shield className="w-16 h-16 text-surface-300 mx-auto mb-4" />
            <h2 className="text-xl font-medium text-white mb-2">Search for a chemical</h2>
            <p className="text-surface-400">Enter a CAS number or chemical name to view compliance information</p>
          </div>
        ) : (
          <>
            {/* Chemical header */}
            <div className="bg-surface-50 border border-surface-200 rounded-xl p-6 mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Beaker className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="cas-number text-lg text-primary">{searchCAS}</p>
                  <p className="text-white font-medium">{compliance ? 'Chemical found in registry' : 'Searching registry...'}</p>
                </div>
              </div>
              
              {complianceLoading ? (
                <div className="flex items-center gap-2 text-surface-400">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading compliance data...
                </div>
              ) : compliance ? (
                <div className="flex flex-wrap gap-2">
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
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                    compliance.epa_status === 'approved' 
                      ? 'bg-accent-success/10 text-accent-success border-accent-success/30' 
                      : compliance.epa_status === 'restricted'
                      ? 'bg-accent-warning/10 text-accent-warning border-accent-warning/30'
                      : 'bg-accent-error/10 text-accent-error border-accent-error/30'
                  }`}>
                    EPA: {compliance.epa_status.replace('_', ' ')}
                  </span>
                </div>
              ) : (
                <p className="text-surface-400">No compliance data available for this chemical</p>
              )}
            </div>
            
            {/* Tabs */}
            <div className="border-b border-surface-200 mb-8">
              <div className="flex gap-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
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
            
            {/* Overview Tab */}
            {activeTab === 'overview' && compliance && (
              <div className="max-w-3xl">
                <ComplianceDisplay compliance={compliance} showDetails />
                
                {/* Quick actions */}
                <div className="mt-8">
                  <h3 className="text-lg font-medium text-white mb-4">Generate Report</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { type: 'full_assessment', label: 'Full Assessment', icon: Shield },
                      { type: 'reach_summary', label: 'REACH Summary', icon: Globe },
                      { type: 'tsca_check', label: 'TSCA Check', icon: CheckCircle },
                      { type: 'safety_review', label: 'Safety Review', icon: AlertTriangle },
                    ].map(({ type, label, icon: Icon }) => (
                      <button
                        key={type}
                        onClick={() => handleGenerateReport(type as any)}
                        disabled={generateAIReport.isPending}
                        className="p-4 bg-surface-50 border border-surface-200 rounded-xl hover:border-primary/50 transition-colors text-center disabled:opacity-50"
                      >
                        <Icon className="w-6 h-6 text-primary mx-auto mb-2" />
                        <p className="text-sm text-white">{label}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {/* AI Reports Tab */}
            {activeTab === 'reports' && (
              <div className="space-y-6">
                {reportsLoading ? (
                  <div className="text-center py-12">
                    <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto" />
                  </div>
                ) : reports && reports.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {reports.map((report) => (
                      <AIReportCard key={report.id} report={report} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-surface-50 border border-surface-200 rounded-xl">
                    <Sparkles className="w-12 h-12 text-surface-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">No AI reports yet</h3>
                    <p className="text-surface-400 mb-4">Generate your first compliance report</p>
                    <button
                      onClick={() => handleGenerateReport('full_assessment')}
                      className="px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-600 transition-colors"
                    >
                      Generate Report
                    </button>
                  </div>
                )}
              </div>
            )}
            
            {/* Alerts Tab */}
            {activeTab === 'alerts' && (
              <div className="space-y-4">
                {alertsLoading ? (
                  <div className="text-center py-12">
                    <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto" />
                  </div>
                ) : alerts && alerts.length > 0 ? (
                  alerts.map((alert) => (
                    <AlertCard key={alert.id} alert={alert} />
                  ))
                ) : (
                  <div className="text-center py-12 bg-surface-50 border border-surface-200 rounded-xl">
                    <AlertTriangle className="w-12 h-12 text-surface-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">No alerts</h3>
                    <p className="text-surface-400">No regulatory alerts for this chemical</p>
                  </div>
                )}
              </div>
            )}
            
            {/* Documents Tab */}
            {activeTab === 'documents' && (
              <div className="space-y-4">
                {compliance?.documents && compliance.documents.length > 0 ? (
                  compliance.documents.map((doc) => (
                    <DocumentCard key={doc.id} doc={doc} />
                  ))
                ) : (
                  <div className="text-center py-12 bg-surface-50 border border-surface-200 rounded-xl">
                    <FileText className="w-12 h-12 text-surface-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">No documents</h3>
                    <p className="text-surface-400">No compliance documents available for this chemical</p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
