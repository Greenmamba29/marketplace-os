import { useState } from 'react'
import { useAuthStore } from '@/hooks/useAuth'
import { useFarCompliance, useDfarsCompliance, useComplianceStats, useDebarredCheck } from '@/hooks/useCompliance'
import { 
  ShieldCheck, 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Clock,
  Download,
  Upload,
  Search,
  Building2
} from 'lucide-react'
import { ComplianceIndicator, ComplianceScore } from '@/components/ComplianceIndicator'
import { DataTable } from '@/components/DataTable'
import type { FARCompliance, DFARSCompliance } from '@/types'

export function ComplianceCenter() {
  const { user } = useAuthStore()
  const [activeTab, setActiveTab] = useState<'far' | 'dfars' | 'exclusions'>('far')
  const [searchCage, setSearchCage] = useState('')

  // For demo, using a mock vendor ID - in real app, this would come from user's vendor profile
  const vendorId = user?.vendor?.id || 'demo-vendor-id'
  
  const { data: farCompliance } = useFarCompliance(vendorId)
  const { data: dfarsCompliance } = useDfarsCompliance(vendorId)
  const { data: stats } = useComplianceStats()
  const { data: debarredCheck, refetch: checkDebarred } = useDebarredCheck(undefined, searchCage || undefined)

  const handleDebarredCheck = () => {
    if (searchCage) {
      checkDebarred()
    }
  }

  const farColumns = [
    {
      key: 'clauseNumber',
      header: 'FAR Clause',
      render: (item: FARCompliance) => (
        <div>
          <code className="font-mono text-blue-400">{item.clauseNumber}</code>
          <p className="text-sm text-slate-400">{item.clauseTitle}</p>
        </div>
      ),
    },
    {
      key: 'applicable',
      header: 'Applicable',
      render: (item: FARCompliance) => (
        <span className={`badge ${item.applicable ? 'badge-success' : 'badge-info'}`}>
          {item.applicable ? 'Yes' : 'No'}
        </span>
      ),
    },
    {
      key: 'certified',
      header: 'Certified',
      render: (item: FARCompliance) => (
        <ComplianceIndicator 
          status={item.certified ? 'COMPLIANT' : 'PENDING'} 
        />
      ),
    },
    {
      key: 'certificationDate',
      header: 'Certified Date',
      render: (item: FARCompliance) => (
        <span className="text-slate-400">
          {item.certificationDate || 'N/A'}
        </span>
      ),
    },
    {
      key: 'expirationDate',
      header: 'Expires',
      render: (item: FARCompliance) => (
        <span className="text-slate-400">
          {item.expirationDate || 'N/A'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (item: FARCompliance) => (
        <div className="flex items-center gap-2">
          {item.documentUrl ? (
            <button className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white">
              <Download className="w-4 h-4" />
            </button>
          ) : (
            <button className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white">
              <Upload className="w-4 h-4" />
            </button>
          )}
        </div>
      ),
    },
  ]

  const dfarsColumns = [
    {
      key: 'clauseNumber',
      header: 'DFARS Clause',
      render: (item: DFARSCompliance) => (
        <div>
          <code className="font-mono text-emerald-400">{item.clauseNumber}</code>
          <p className="text-sm text-slate-400">{item.clauseTitle}</p>
        </div>
      ),
    },
    {
      key: 'applicable',
      header: 'Applicable',
      render: (item: DFARSCompliance) => (
        <span className={`badge ${item.applicable ? 'badge-success' : 'badge-info'}`}>
          {item.applicable ? 'Yes' : 'No'}
        </span>
      ),
    },
    {
      key: 'certified',
      header: 'Certified',
      render: (item: DFARSCompliance) => (
        <ComplianceIndicator 
          status={item.certified ? 'COMPLIANT' : 'PENDING'} 
        />
      ),
    },
    {
      key: 'cyberComplianceLevel',
      header: 'Cyber Level',
      render: (item: DFARSCompliance) => (
        <span className="text-slate-400">
          {item.cyberComplianceLevel || 'N/A'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (item: DFARSCompliance) => (
        <div className="flex items-center gap-2">
          {item.documentUrl ? (
            <button className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white">
              <Download className="w-4 h-4" />
            </button>
          ) : (
            <button className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white">
              <Upload className="w-4 h-4" />
            </button>
          )}
        </div>
      ),
    },
  ]

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white">Compliance Center</h1>
              <p className="text-slate-400 mt-1">
                Manage FAR/DFARS compliance and certifications
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="card p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Compliant Vendors</p>
                <p className="text-xl font-semibold text-white">{stats?.compliantVendors || 0}</p>
              </div>
            </div>
          </div>
          <div className="card p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Pending Reviews</p>
                <p className="text-xl font-semibold text-white">{stats?.pendingReviews || 0}</p>
              </div>
            </div>
          </div>
          <div className="card p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">FAR Clauses</p>
                <p className="text-xl font-semibold text-white">{stats?.farClausesTracked || 0}</p>
              </div>
            </div>
          </div>
          <div className="card p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">DFARS Clauses</p>
                <p className="text-xl font-semibold text-white">{stats?.dfarsClausesTracked || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Debarred Check */}
        <div className="card p-6 mb-8">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            Excluded Parties Check
          </h3>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Enter CAGE Code to check exclusions..."
                value={searchCage}
                onChange={(e) => setSearchCage(e.target.value)}
                className="form-input"
              />
            </div>
            <button 
              onClick={handleDebarredCheck}
              className="btn btn-primary flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              Check
            </button>
          </div>
          
          {debarredCheck && (
            <div className={`mt-4 p-4 rounded-lg ${debarredCheck.isDebarred ? 'bg-red-500/10 border border-red-500/20' : 'bg-emerald-500/10 border border-emerald-500/20'}`}>
              <div className="flex items-center gap-2">
                {debarredCheck.isDebarred ? (
                  <XCircle className="w-5 h-5 text-red-400" />
                ) : (
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                )}
                <span className={debarredCheck.isDebarred ? 'text-red-400' : 'text-emerald-400'}>
                  {debarredCheck.isDebarred 
                    ? 'Entity found in exclusions list' 
                    : 'No exclusions found for this entity'}
                </span>
              </div>
              {debarredCheck.matches.length > 0 && (
                <div className="mt-3 space-y-2">
                  {debarredCheck.matches.map((match, idx) => (
                    <div key={idx} className="text-sm text-slate-400">
                      <p className="font-medium text-slate-300">{match.name}</p>
                      <p>Type: {match.type} | Effective: {match.effectiveDate}</p>
                      {match.terminationDate && <p>Termination: {match.terminationDate}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="border-b border-slate-800 mb-6">
          <div className="flex gap-6">
            <button
              onClick={() => setActiveTab('far')}
              className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'far'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              FAR Compliance
            </button>
            <button
              onClick={() => setActiveTab('dfars')}
              className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'dfars'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              DFARS Compliance
            </button>
            <button
              onClick={() => setActiveTab('exclusions')}
              className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'exclusions'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Exclusions
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'far' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">FAR Clause Compliance</h3>
              <ComplianceScore 
                score={farCompliance?.filter(c => c.certified).length || 0}
                total={farCompliance?.filter(c => c.applicable).length || 0}
              />
            </div>
            <DataTable
              columns={farColumns}
              data={farCompliance || []}
              keyExtractor={(item) => item.id}
              emptyMessage="No FAR compliance records found"
            />
          </div>
        )}

        {activeTab === 'dfars' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">DFARS Clause Compliance</h3>
              <ComplianceScore 
                score={dfarsCompliance?.filter(c => c.certified).length || 0}
                total={dfarsCompliance?.filter(c => c.applicable).length || 0}
              />
            </div>
            <DataTable
              columns={dfarsColumns}
              data={dfarsCompliance || []}
              keyExtractor={(item) => item.id}
              emptyMessage="No DFARS compliance records found"
            />
          </div>
        )}

        {activeTab === 'exclusions' && (
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-white mb-4">About Excluded Parties</h3>
            <p className="text-slate-400 mb-4">
              The System for Award Management (SAM) Exclusions section contains information about 
              entities that are excluded from receiving federal contracts, certain subcontracts, 
              and certain types of federal financial and non-financial assistance and benefits.
            </p>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5" />
                <div>
                  <p className="text-white font-medium">Debarment</p>
                  <p className="text-slate-400 text-sm">
                    Debarment is a serious action that prohibits a company or individual from 
                    participating in federal contracts or subcontracts.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-amber-400 mt-0.5" />
                <div>
                  <p className="text-white font-medium">Suspension</p>
                  <p className="text-slate-400 text-sm">
                    Suspension is a temporary exclusion pending completion of an investigation 
                    or legal proceedings.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
