import { useParams } from 'react-router-dom'
import { useVendor } from '@/hooks/useVendors'
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  CheckCircle,
  FileText,
  Award,
  TrendingUp,
  Calendar
} from 'lucide-react'
import { SetAsideList } from '@/components/SetAsideBadge'
import { SamStatusBadge } from '@/components/SamStatusBadge'
import { SecurityClearanceBadge } from '@/components/SecurityClearanceBadge'
import { CodeList } from '@/components/CodeBadge'
import { ComplianceIndicator } from '@/components/ComplianceIndicator'
import { StatCard } from '@/components/StatCard'

export function VendorProfile() {
  const { id } = useParams()
  const { data: vendor, isLoading } = useVendor(id || '')

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!vendor) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-white">Vendor Not Found</h2>
          <p className="text-slate-400 mt-2">The vendor you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">{vendor.companyName}</h1>
                {vendor.dbaName && (
                  <p className="text-slate-400">DBA: {vendor.dbaName}</p>
                )}
                <div className="flex flex-wrap items-center gap-3 mt-3">
                  <SamStatusBadge status={vendor.samRegistration.status} />
                  <SetAsideList setAsides={vendor.setAsides} />
                  {vendor.securityClearance && (
                    <SecurityClearanceBadge clearance={vendor.securityClearance} />
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ComplianceIndicator status={vendor.complianceStatus.overallStatus} />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* NAICS & PSC Codes */}
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Capabilities</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">NAICS Codes</label>
                  <CodeList 
                    codes={vendor.naicsCodes.map(n => ({ 
                      code: n.code, 
                      description: n.description, 
                      isPrimary: n.isPrimary 
                    }))}
                    type="naics"
                    maxDisplay={10}
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">PSC Codes</label>
                  <CodeList 
                    codes={vendor.pscCodes.map(p => ({ code: p.code, description: p.description }))}
                    type="psc"
                    maxDisplay={10}
                  />
                </div>
              </div>
            </div>

            {/* Past Performance */}
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Past Performance</h2>
              {vendor.pastPerformance.length > 0 ? (
                <div className="space-y-4">
                  {vendor.pastPerformance.map((performance) => (
                    <div key={performance.id} className="p-4 bg-slate-800/50 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-white font-medium">{performance.agencyName}</p>
                          <p className="text-sm text-slate-400">{performance.contractNumber}</p>
                        </div>
                        <span className="text-emerald-400 font-medium">
                          ${(performance.contractValue / 1000000).toFixed(1)}M
                        </span>
                      </div>
                      <p className="text-slate-400 text-sm mt-2">{performance.description}</p>
                      <div className="flex items-center gap-4 mt-3 text-sm text-slate-500">
                        <span>{performance.startDate} - {performance.endDate}</span>
                        <span>NAICS: {performance.naicsCode}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 text-center py-8">No past performance records available</p>
              )}
            </div>

            {/* Certifications */}
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Certifications</h2>
              {vendor.certifications.length > 0 ? (
                <div className="grid sm:grid-cols-2 gap-4">
                  {vendor.certifications.map((cert) => (
                    <div key={cert.id} className="p-4 bg-slate-800/50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Award className="w-5 h-5 text-blue-400" />
                        <p className="text-white font-medium">{cert.name}</p>
                      </div>
                      <p className="text-sm text-slate-400">{cert.issuingBody}</p>
                      <p className="text-sm text-slate-500 mt-1">
                        Expires: {cert.expirationDate}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 text-center py-8">No certifications on record</p>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Contact Info */}
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Contact Information</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-slate-300">
                  <MapPin className="w-5 h-5 text-slate-500" />
                  <span>
                    {vendor.contactInfo.businessAddress.city}, {vendor.contactInfo.businessAddress.state}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-slate-300">
                  <Phone className="w-5 h-5 text-slate-500" />
                  <span>{vendor.contactInfo.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-300">
                  <Mail className="w-5 h-5 text-slate-500" />
                  <span>{vendor.contactInfo.email}</span>
                </div>
                {vendor.contactInfo.website && (
                  <div className="flex items-center gap-3 text-slate-300">
                    <Globe className="w-5 h-5 text-slate-500" />
                    <a 
                      href={vendor.contactInfo.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300"
                    >
                      {vendor.contactInfo.website}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* SAM Registration */}
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-white mb-4">SAM Registration</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">UEI</span>
                  <span className="text-slate-300 font-mono">{vendor.samRegistration.samUei}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">CAGE Code</span>
                  <span className="text-slate-300 font-mono">{vendor.cageCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Status</span>
                  <SamStatusBadge status={vendor.samRegistration.status} size="sm" />
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Registered</span>
                  <span className="text-slate-300">{vendor.samRegistration.registrationDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Expires</span>
                  <span className="text-slate-300">{vendor.samRegistration.expirationDate}</span>
                </div>
              </div>
            </div>

            {/* Company Info */}
            {vendor.financialInfo && (
              <div className="card p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Company Information</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Business Type</span>
                    <span className="text-slate-300">
                      {vendor.financialInfo.isSmallBusiness ? 'Small Business' : 'Other Than Small'}
                    </span>
                  </div>
                  {vendor.financialInfo.annualRevenue && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Annual Revenue</span>
                      <span className="text-slate-300">
                        ${(vendor.financialInfo.annualRevenue / 1000000).toFixed(1)}M
                      </span>
                    </div>
                  )}
                  {vendor.financialInfo.numberOfEmployees && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Employees</span>
                      <span className="text-slate-300">{vendor.financialInfo.numberOfEmployees}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
