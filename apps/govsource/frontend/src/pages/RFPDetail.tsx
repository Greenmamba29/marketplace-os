import { useParams, Link } from 'react-router-dom'
import { useRFP, useMatchRFPToVendors } from '@/hooks/useRFPs'
import { 
  Building2, 
  Calendar, 
  DollarSign, 
  FileText,
  Users,
  Target,
  ArrowRight,
  CheckCircle,
  Download,
  ShieldCheck
} from 'lucide-react'
import { SetAsideBadge } from '@/components/SetAsideBadge'
import { SecurityClearanceBadge } from '@/components/SecurityClearanceBadge'
import { CodeList } from '@/components/CodeBadge'
import { format } from 'date-fns'

export function RFPDetail() {
  const { id } = useParams()
  const { data: rfp, isLoading } = useRFP(id || '')
  const { data: matches } = useMatchRFPToVendors(id || '')

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!rfp) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-white">RFP Not Found</h2>
          <p className="text-slate-400 mt-2">The RFP you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(value)
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <code className="text-blue-400 font-mono">{rfp.solicitationNumber}</code>
                <span className={`badge ${
                  rfp.status === 'OPEN' ? 'badge-success' : 
                  rfp.status === 'CLOSED' ? 'badge-error' : 
                  rfp.status === 'AWARDED' ? 'badge-info' : 'badge-warning'
                }`}>
                  {rfp.status}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-white">{rfp.title}</h1>
              <div className="flex items-center gap-2 text-slate-400 mt-2">
                <Building2 className="w-4 h-4" />
                <span>{rfp.agency.name}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link 
                to={`/rfq-wizard/${rfp.id}`}
                className="btn btn-primary"
              >
                <Target className="w-4 h-4 mr-2" />
                Create RFQ
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Description</h2>
              <p className="text-slate-300 whitespace-pre-wrap">{rfp.description}</p>
            </div>

            {/* Evaluation Criteria */}
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Evaluation Criteria</h2>
              <div className="space-y-3">
                {rfp.evaluationCriteria.map((criteria, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                    <span className="text-slate-300">{criteria.factor}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-slate-400 text-sm">{criteria.description}</span>
                      <span className="text-blue-400 font-medium">{criteria.weight}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* FAR Clauses */}
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Applicable FAR Clauses</h2>
              <div className="space-y-2">
                {rfp.farClauses.filter(c => c.applicable).map((clause, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-slate-800/50 rounded-lg">
                    <code className="text-blue-400 font-mono text-sm flex-shrink-0">{clause.number}</code>
                    <div>
                      <p className="text-white text-sm">{clause.title}</p>
                      <p className="text-slate-400 text-sm">{clause.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Vendor Matches */}
            {matches && matches.length > 0 && (
              <div className="card p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Matched Vendors</h2>
                <div className="space-y-3">
                  {matches.map((match, idx) => (
                    <div key={idx} className="p-4 bg-slate-800/50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white font-medium">Vendor ID: {match.vendorId}</p>
                          <div className="flex items-center gap-2 mt-1">
                            {match.reasons.map((reason, ridx) => (
                              <span key={ridx} className="text-xs text-slate-400 bg-slate-700 px-2 py-0.5 rounded">
                                {reason}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-2xl font-bold text-emerald-400">
                            {Math.round(match.score * 100)}%
                          </span>
                          <p className="text-sm text-slate-500">Match Score</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Key Details */}
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Key Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-slate-400">Estimated Value</label>
                  <p className="text-white font-medium">
                    {formatCurrency(rfp.estimatedValue.min)} - {formatCurrency(rfp.estimatedValue.max)}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-slate-400">Set-Aside</label>
                  <div className="mt-1">
                    <SetAsideBadge type={rfp.setAside} />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-slate-400">Security Clearance</label>
                  <div className="mt-1">
                    <SecurityClearanceBadge clearance={rfp.securityClearanceRequired} />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-slate-400">Contract Type</label>
                  <p className="text-white">{rfp.contractType.replace(/_/g, ' ')}</p>
                </div>
                <div>
                  <label className="text-sm text-slate-400">Period of Performance</label>
                  <p className="text-white">
                    {rfp.periodOfPerformance.totalMonths} months
                    ({rfp.periodOfPerformance.basePeriod} base + {rfp.periodOfPerformance.optionPeriods} options)
                  </p>
                </div>
              </div>
            </div>

            {/* Important Dates */}
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Important Dates</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-slate-500" />
                  <div>
                    <p className="text-sm text-slate-400">Issue Date</p>
                    <p className="text-white">{format(new Date(rfp.importantDates.issueDate), 'MMM d, yyyy')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-slate-500" />
                  <div>
                    <p className="text-sm text-slate-400">Questions Due</p>
                    <p className="text-white">{format(new Date(rfp.importantDates.questionsDue), 'MMM d, yyyy')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="text-sm text-blue-400">Proposal Due</p>
                    <p className="text-white font-medium">{format(new Date(rfp.importantDates.proposalDue), 'MMM d, yyyy')}</p>
                  </div>
                </div>
                {rfp.importantDates.awardDate && (
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-slate-500" />
                    <div>
                      <p className="text-sm text-slate-400">Expected Award</p>
                      <p className="text-white">{format(new Date(rfp.importantDates.awardDate), 'MMM d, yyyy')}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* NAICS/PSC Codes */}
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Classification</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">NAICS Codes</label>
                  <CodeList 
                    codes={rfp.naicsCodes.map(code => ({ code, description: '' }))}
                    type="naics"
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">PSC Codes</label>
                  <CodeList 
                    codes={rfp.pscCodes.map(code => ({ code, description: '' }))}
                    type="psc"
                  />
                </div>
              </div>
            </div>

            {/* Attachments */}
            {rfp.attachments.length > 0 && (
              <div className="card p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Attachments</h2>
                <div className="space-y-2">
                  {rfp.attachments.map((attachment) => (
                    <a
                      key={attachment.id}
                      href={attachment.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors"
                    >
                      <FileText className="w-5 h-5 text-blue-400" />
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm truncate">{attachment.name}</p>
                        <p className="text-slate-500 text-xs">{(attachment.size / 1024).toFixed(1)} KB</p>
                      </div>
                      <Download className="w-4 h-4 text-slate-500" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
