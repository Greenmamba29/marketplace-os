import { useParams, Link } from 'react-router-dom'
import {
  ArrowLeft,
  Package,
  CheckCircle,
  Snowflake,
  Barcode,
  FileText,
  Building2,
  TrendingDown,
  Star,
  Download,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react'
import { useEquipment, useRegulatoryInfo } from '../hooks/useEquipment'
import { FDAStatusBadge, RegulatorySummary } from '../components/FDAStatusBadge'
import { GPOPricingCard } from '../components/GPOPricingCard'
import { UDIDisplay } from '../components/UDIScanner'
import { toast } from '../components/ui/Toaster'

export function EquipmentDetail() {
  const { id } = useParams<{ id: string }>()
  const { data: equipment, isLoading } = useEquipment(id || '')
  const { data: regulatory } = useRegulatoryInfo(id || '')

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-clinical-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!equipment) {
    return (
      <div className="clinical-card p-12 text-center">
        <Package className="w-16 h-16 text-surface-300 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-surface-900 mb-2">Equipment Not Found</h2>
        <p className="text-surface-600 mb-4">The equipment you're looking for doesn't exist or has been removed.</p>
        <Link to="/equipment" className="clinical-button">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Directory
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-surface-600">
        <Link to="/equipment" className="hover:text-clinical-600 transition-colors">
          Equipment Directory
        </Link>
        <span>/</span>
        <span className="text-surface-900">{equipment.name}</span>
      </div>

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
        <div className="flex-1">
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 bg-clinical-100 rounded-clinical flex items-center justify-center flex-shrink-0">
              <Package className="w-10 h-10 text-clinical-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-surface-900">{equipment.name}</h1>
              <p className="text-surface-600 mt-1">{equipment.manufacturer.name}</p>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className="clinical-badge bg-surface-100 text-surface-600">
                  SKU: {equipment.sku}
                </span>
                <FDAStatusBadge
                  deviceClass={equipment.regulatory.deviceClass}
                  clearanceType={equipment.regulatory.fdaClearance?.type}
                  status={equipment.regulatory.fdaClearance?.status}
                />
                {equipment.physical.coldChainRequired && (
                  <span className="clinical-badge bg-clinical-100 text-clinical-700">
                    <Snowflake className="w-3 h-3 mr-1" />
                    Cold Chain
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to={`/rfq?equipment=${equipment.id}`}
            className="clinical-button"
          >
            Request Quote
          </Link>
          <button
            onClick={() => toast.success('Added to compare', 'Equipment added to comparison list')}
            className="clinical-button-secondary"
          >
            Compare
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <div className="clinical-card p-6">
            <h3 className="text-lg font-semibold text-surface-900 mb-3">Description</h3>
            <p className="text-surface-600 leading-relaxed">{equipment.description}</p>
          </div>

          {/* Specifications */}
          <div className="clinical-card p-6">
            <h3 className="text-lg font-semibold text-surface-900 mb-4">Specifications</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {equipment.physical.dimensions && (
                <div className="p-3 bg-surface-50 rounded-clinical">
                  <p className="text-xs text-surface-500 mb-1">Dimensions</p>
                  <p className="text-sm text-surface-900">
                    {equipment.physical.dimensions.length} x {equipment.physical.dimensions.width} x {equipment.physical.dimensions.height} {equipment.physical.dimensions.unit}
                  </p>
                </div>
              )}
              {equipment.physical.weight && (
                <div className="p-3 bg-surface-50 rounded-clinical">
                  <p className="text-xs text-surface-500 mb-1">Weight</p>
                  <p className="text-sm text-surface-900">
                    {equipment.physical.weight.value} {equipment.physical.weight.unit}
                  </p>
                </div>
              )}
              <div className="p-3 bg-surface-50 rounded-clinical">
                <p className="text-xs text-surface-500 mb-1">Sterility</p>
                <p className="text-sm text-surface-900 capitalize">{equipment.physical.sterility.replace('_', ' ')}</p>
              </div>
              {equipment.physical.shelfLife && (
                <div className="p-3 bg-surface-50 rounded-clinical">
                  <p className="text-xs text-surface-500 mb-1">Shelf Life</p>
                  <p className="text-sm text-surface-900">
                    {equipment.physical.shelfLife.value} {equipment.physical.shelfLife.unit}
                  </p>
                </div>
              )}
              <div className="p-3 bg-surface-50 rounded-clinical">
                <p className="text-xs text-surface-500 mb-1">Lead Time</p>
                <p className="text-sm text-surface-900">{equipment.supplyChain.leadTimeDays} days</p>
              </div>
              <div className="p-3 bg-surface-50 rounded-clinical">
                <p className="text-xs text-surface-500 mb-1">Minimum Order</p>
                <p className="text-sm text-surface-900">{equipment.supplyChain.minimumOrderQuantity} units</p>
              </div>
            </div>
          </div>

          {/* UDI Information */}
          {equipment.udi && (
            <div className="clinical-card p-6">
              <h3 className="text-lg font-semibold text-surface-900 mb-4 flex items-center gap-2">
                <Barcode className="w-5 h-5 text-clinical-500" />
                UDI Information
              </h3>
              <UDIDisplay udi={equipment.udi.fullUdi} showBarcode={true} />
            </div>
          )}

          {/* Documents */}
          <div className="clinical-card p-6">
            <h3 className="text-lg font-semibold text-surface-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-clinical-500" />
              Documents
            </h3>
            <div className="space-y-2">
              {equipment.documents?.map((doc, idx) => (
                <a
                  key={idx}
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 border border-surface-200 rounded-clinical hover:border-clinical-300 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-surface-400" />
                    <div>
                      <p className="text-sm font-medium text-surface-900">{doc.name}</p>
                      <p className="text-xs text-surface-500 capitalize">{doc.type.replace('_', ' ')}</p>
                    </div>
                  </div>
                  <Download className="w-4 h-4 text-surface-400" />
                </a>
              ))}
              {(!equipment.documents || equipment.documents.length === 0) && (
                <p className="text-surface-500 text-center py-4">No documents available</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Pricing */}
          <div className="clinical-card p-6">
            <h3 className="text-lg font-semibold text-surface-900 mb-4">Pricing</h3>
            <div className="space-y-4">
              <div className="flex items-baseline justify-between">
                <span className="text-surface-600">List Price</span>
                <span className="text-2xl font-bold text-surface-900">
                  ${equipment.pricing.listPrice.toFixed(2)}
                </span>
              </div>
              {equipment.pricing.msrp && (
                <div className="flex items-baseline justify-between">
                  <span className="text-surface-600">MSRP</span>
                  <span className="text-surface-500 line-through">
                    ${equipment.pricing.msrp.toFixed(2)}
                  </span>
                </div>
              )}
              <div className="pt-4 border-t border-surface-200">
                <p className="text-sm font-medium text-surface-700 mb-2 flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  GPO Pricing
                </p>
                {equipment.pricing.gpoPricing.length > 0 ? (
                  <div className="space-y-2">
                    {equipment.pricing.gpoPricing.slice(0, 3).map((gpo, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 bg-surface-50 rounded-clinical">
                        <span className="text-sm text-surface-600">{gpo.gpoName}</span>
                        <span className="font-medium text-medical-green">
                          ${gpo.contractPrice.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-surface-500">No GPO contracts available</p>
                )}
              </div>
              <div className="pt-4 border-t border-surface-200">
                <p className="text-sm font-medium text-surface-700 mb-2">Volume Discounts</p>
                {equipment.pricing.volumeDiscounts.length > 0 ? (
                  <div className="space-y-1">
                    {equipment.pricing.volumeDiscounts.map((discount, idx) => (
                      <div key={idx} className="flex items-center justify-between text-sm">
                        <span className="text-surface-600">{discount.minimumQuantity}+ units</span>
                        <span className="text-medical-green">{discount.discountPercent}% off</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-surface-500">No volume discounts available</p>
                )}
              </div>
            </div>
          </div>

          {/* Regulatory Info */}
          <RegulatorySummary
            fdaProductCode={equipment.regulatory.fdaProductCode}
            deviceClass={equipment.regulatory.deviceClass}
            clearance={equipment.regulatory.fdaClearance}
            ceMarked={equipment.regulatory.ceMarked}
            iso13485={equipment.regulatory.iso13485}
          />

          {/* Supplier Info */}
          <div className="clinical-card p-6">
            <h3 className="text-lg font-semibold text-surface-900 mb-4">Supplier</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-surface-500">Manufacturer</p>
                <p className="font-medium text-surface-900">{equipment.manufacturer.name}</p>
              </div>
              <div>
                <p className="text-sm text-surface-500">Catalog Number</p>
                <p className="font-mono text-sm text-surface-900">{equipment.manufacturer.catalogNumber}</p>
              </div>
              {equipment.manufacturer.website && (
                <a
                  href={equipment.manufacturer.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-clinical-600 hover:text-clinical-700"
                >
                  Visit Website
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>

          {/* Availability */}
          <div className="clinical-card p-6">
            <h3 className="text-lg font-semibold text-surface-900 mb-4">Availability</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-surface-600">Stock Status</span>
                <span className={`clinical-badge ${
                  equipment.supplyChain.availableInventory > 10 ? 'bg-medical-green/10 text-medical-green' :
                  equipment.supplyChain.availableInventory > 0 ? 'bg-medical-amber/10 text-medical-amber' :
                  'bg-medical-red/10 text-medical-red'
                }`}>
                  {equipment.supplyChain.availableInventory > 10 ? 'In Stock' :
                   equipment.supplyChain.availableInventory > 0 ? 'Low Stock' : 'Out of Stock'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-surface-600">Available Quantity</span>
                <span className="font-medium text-surface-900">
                  {equipment.supplyChain.availableInventory} units
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-surface-600">Lead Time</span>
                <span className="font-medium text-surface-900">
                  {equipment.supplyChain.leadTimeDays} days
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
