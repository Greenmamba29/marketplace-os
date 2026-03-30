import { useParams, Link } from 'react-router-dom'
import { 
  ArrowLeft, 
  Download, 
  FileText, 
  Shield, 
  Snowflake,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Beaker
} from 'lucide-react'
import { useReagent, useReagentSubstitutes } from '../hooks/useReagents'
import StorageTempBadge from '../components/StorageTempBadge'
import LotStatusBadge from '../components/LotStatusBadge'
import CoABadge from '../components/CoABadge'
import { useDownloadCoA } from '../hooks/useLots'

export default function ReagentDetail() {
  const { id } = useParams<{ id: string }>()
  const { data: reagent, isLoading } = useReagent(id || '')
  const { data: substitutes } = useReagentSubstitutes(id || '')
  const downloadCoA = useDownloadCoA()

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-slate-800 rounded w-1/3 animate-pulse" />
        <div className="h-4 bg-slate-800 rounded w-1/4 animate-pulse" />
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-32 bg-slate-800 rounded animate-pulse" />
            <div className="h-48 bg-slate-800 rounded animate-pulse" />
          </div>
          <div className="h-64 bg-slate-800 rounded animate-pulse" />
        </div>
      </div>
    )
  }

  if (!reagent?.data) {
    return (
      <div className="text-center py-16">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-slate-100 mb-2">Reagent not found</h2>
        <Link to="/reagents" className="text-science-500 hover:text-science-400">
          Back to directory
        </Link>
      </div>
    )
  }

  const r = reagent.data

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Link to="/reagents" className="inline-flex items-center text-slate-400 hover:text-slate-200">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to directory
      </Link>

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl lg:text-3xl font-bold text-slate-100">
            {r.name}
          </h1>
          <div className="flex flex-wrap items-center gap-3 mt-2">
            <span className="text-slate-400 font-mono">{r.catalogNumber}</span>
            {r.casNumber && (
              <span className="text-slate-500">CAS: {r.casNumber}</span>
            )}
            <StorageTempBadge temperature={r.storage?.temperature} />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary">
            <Download className="w-4 h-4 mr-2" />
            SDS
          </button>
          <Link to={`/rfq?reagent=${r.id}`} className="btn-primary">
            Request Quote
          </Link>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <div className="card p-6">
            <h2 className="font-display text-lg font-semibold text-slate-100 mb-4">Description</h2>
            <p className="text-slate-400 leading-relaxed">{r.description}</p>
          </div>

          {/* Specifications */}
          <div className="card p-6">
            <h2 className="font-display text-lg font-semibold text-slate-100 mb-4">Specifications</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {r.specifications?.grade && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center">
                    <Beaker className="w-5 h-5 text-science-500" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Grade</p>
                    <p className="text-slate-200 capitalize">{r.specifications.grade}</p>
                  </div>
                </div>
              )}
              {r.specifications?.purity && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Purity</p>
                    <p className="text-slate-200">{r.specifications.purity}%</p>
                  </div>
                </div>
              )}
              {r.specifications?.concentration && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center">
                    <Beaker className="w-5 h-5 text-science-500" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Concentration</p>
                    <p className="text-slate-200">{r.specifications.concentration}</p>
                  </div>
                </div>
              )}
              {r.specifications?.molecularWeight && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center">
                    <Beaker className="w-5 h-5 text-science-500" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Molecular Weight</p>
                    <p className="text-slate-200">{r.specifications.molecularWeight} g/mol</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Available Lots */}
          <div className="card p-6">
            <h2 className="font-display text-lg font-semibold text-slate-100 mb-4">Available Lots</h2>
            {r.lots?.length > 0 ? (
              <div className="space-y-3">
                {r.lots.map((lot: any) => (
                  <div key={lot.id} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <LotStatusBadge status={lot.status} size="sm" />
                      <div>
                        <p className="font-mono text-sm text-slate-200">{lot.lotNumber}</p>
                        <p className="text-xs text-slate-500">
                          Exp: {new Date(lot.expiryDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="text-sm text-slate-400">
                        {lot.quantityAvailable} {lot.quantityUnit}
                      </p>
                      <CoABadge 
                        available={!!lot.coa} 
                        onDownload={lot.coa ? () => downloadCoA.mutate(lot.id) : undefined}
                        size="sm"
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500">No lots currently available</p>
            )}
          </div>

          {/* Substitutes */}
          {substitutes && substitutes.length > 0 && (
            <div className="card p-6">
              <h2 className="font-display text-lg font-semibold text-slate-100 mb-4">Recommended Substitutes</h2>
              <div className="space-y-3">
                {substitutes.map((sub: any) => (
                  <Link
                    key={sub.id}
                    to={`/reagents/${sub.id}`}
                    className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    <div>
                      <p className="text-slate-200">{sub.name}</p>
                      <p className="text-sm text-slate-500">{sub.catalogNumber}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-slate-300">${sub.pricing?.unitPrice?.toFixed(2)}</span>
                      <ExternalLink className="w-4 h-4 text-slate-500" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Pricing */}
          <div className="card p-6">
            <h2 className="font-display text-lg font-semibold text-slate-100 mb-4">Pricing</h2>
            <div className="mb-4">
              <p className="text-3xl font-bold text-slate-100">
                ${r.pricing?.unitPrice?.toFixed(2) || '0.00'}
              </p>
              <p className="text-slate-500">per {r.pricing?.unitSize}</p>
            </div>
            {r.pricing?.bulkPricing && r.pricing.bulkPricing.length > 0 && (
              <div className="space-y-2 pt-4 border-t border-slate-800">
                <p className="text-sm text-slate-500 mb-2">Bulk Pricing</p>
                {r.pricing.bulkPricing.map((tier: any, i: number) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-slate-400">
                      {tier.minQuantity}+ {r.pricing.unitSize}
                    </span>
                    <span className="text-slate-200">
                      ${tier.pricePerUnit.toFixed(2)} each
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Storage */}
          <div className="card p-6">
            <h2 className="font-display text-lg font-semibold text-slate-100 mb-4">Storage</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Snowflake className="w-5 h-5 text-science-500" />
                <span className="text-slate-300">
                  {r.storage?.temperature === 'RT' && 'Room Temperature'}
                  {r.storage?.temperature === '2-8C' && '2-8°C Refrigerated'}
                  {r.storage?.temperature === '-20C' && '-20°C Frozen'}
                  {r.storage?.temperature === '-80C' && '-80°C Ultra-low'}
                  {r.storage?.temperature === 'LN2' && 'Liquid Nitrogen'}
                </span>
              </div>
              {r.storage?.lightSensitive && (
                <div className="flex items-center gap-3 text-amber-400">
                  <AlertTriangle className="w-5 h-5" />
                  <span>Light Sensitive</span>
                </div>
              )}
              {r.storage?.moistureSensitive && (
                <div className="flex items-center gap-3 text-amber-400">
                  <AlertTriangle className="w-5 h-5" />
                  <span>Moisture Sensitive</span>
                </div>
              )}
            </div>
          </div>

          {/* Compliance */}
          <div className="card p-6">
            <h2 className="font-display text-lg font-semibold text-slate-100 mb-4">Compliance</h2>
            <div className="space-y-2">
              {r.compliance?.animalFree && (
                <div className="flex items-center gap-2 text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-sm">Animal-Free</span>
                </div>
              )}
              {r.compliance?.cliaStatus && r.compliance.cliaStatus !== 'none' && (
                <div className="flex items-center gap-2 text-science-400">
                  <Shield className="w-4 h-4" />
                  <span className="text-sm">CLIA {r.compliance.cliaStatus}</span>
                </div>
              )}
              {r.compliance?.sterile && (
                <div className="flex items-center gap-2 text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-sm">Sterile</span>
                </div>
              )}
              {r.compliance?.endotoxinLevel && (
                <div className="flex items-center gap-2 text-slate-400">
                  <FileText className="w-4 h-4" />
                  <span className="text-sm">Endotoxin: {r.compliance.endotoxinLevel}</span>
                </div>
              )}
            </div>
          </div>

          {/* Manufacturer */}
          <div className="card p-6">
            <h2 className="font-display text-lg font-semibold text-slate-100 mb-4">Manufacturer</h2>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center">
                <Beaker className="w-6 h-6 text-slate-400" />
              </div>
              <div>
                <p className="text-slate-200">{r.manufacturer?.name}</p>
                <div className="flex gap-2 mt-1">
                  {r.manufacturer?.isoCertified && (
                    <span className="text-xs text-emerald-400">ISO Certified</span>
                  )}
                  {r.manufacturer?.gmpCertified && (
                    <span className="text-xs text-science-400">GMP</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
