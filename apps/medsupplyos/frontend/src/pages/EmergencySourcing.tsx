import { useState } from 'react'
import {
  AlertTriangle,
  Clock,
  MapPin,
  Phone,
  CheckCircle,
  X,
  Search,
  Send,
  Building2,
  Package,
  Activity,
} from 'lucide-react'
import { toast } from '../components/ui/Toaster'

interface EmergencyRequest {
  id: string
  equipment: string
  quantity: number
  requiredBy: string
  justification: string
  patientImpact: string
}

interface SourcingResult {
  supplierId: string
  supplierName: string
  distance: string
  availability: 'in_stock' | 'limited' | 'manufacturing'
  quantity: number
  unitPrice: number
  deliveryTime: string
  contactName: string
  contactPhone: string
}

export function EmergencySourcing() {
  const [step, setStep] = useState<'request' | 'searching' | 'results'>('request')
  const [request, setRequest] = useState<EmergencyRequest>({
    id: '',
    equipment: '',
    quantity: 1,
    requiredBy: '',
    justification: '',
    patientImpact: '',
  })

  // Mock sourcing results
  const sourcingResults: SourcingResult[] = [
    {
      supplierId: 'S001',
      supplierName: 'MedSupply Direct',
      distance: '12 miles',
      availability: 'in_stock',
      quantity: 25,
      unitPrice: 450.00,
      deliveryTime: '2 hours',
      contactName: 'John Smith',
      contactPhone: '(555) 123-4567',
    },
    {
      supplierId: 'S002',
      supplierName: 'Critical Care Medical',
      distance: '28 miles',
      availability: 'in_stock',
      quantity: 15,
      unitPrice: 475.00,
      deliveryTime: '4 hours',
      contactName: 'Sarah Johnson',
      contactPhone: '(555) 234-5678',
    },
    {
      supplierId: 'S003',
      supplierName: 'Regional Medical Supply',
      distance: '45 miles',
      availability: 'limited',
      quantity: 8,
      unitPrice: 425.00,
      deliveryTime: '6 hours',
      contactName: 'Mike Davis',
      contactPhone: '(555) 345-6789',
    },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStep('searching')
    
    // Simulate search delay
    setTimeout(() => {
      setStep('results')
      toast.success('Search Complete', `Found ${sourcingResults.length} potential suppliers`)
    }, 2000)
  }

  const handleSelectSupplier = (supplier: SourcingResult) => {
    toast.success('Supplier Selected', `Contacting ${supplier.supplierName}...`)
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-medical-red/10 rounded-clinical flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-medical-red" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-surface-900">Emergency Sourcing</h1>
            <p className="text-surface-600">Critical care equipment sourcing with expedited delivery</p>
          </div>
        </div>
      </div>

      {/* Alert Banner */}
      <div className="mb-6 p-4 bg-medical-red/10 border border-medical-red/20 rounded-clinical">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-medical-red flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-medical-red">Emergency Use Only</p>
            <p className="text-sm text-medical-red/80 mt-1">
              This feature is for life-threatening emergencies and critical patient care situations only. 
              All requests are logged and require post-event documentation.
            </p>
          </div>
        </div>
      </div>

      {step === 'request' && (
        <form onSubmit={handleSubmit} className="clinical-card p-6 space-y-6">
          <h3 className="text-lg font-semibold text-surface-900">Emergency Request</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-surface-700 mb-1">
                Equipment Needed <span className="text-medical-red">*</span>
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                <input
                  type="text"
                  value={request.equipment}
                  onChange={(e) => setRequest(prev => ({ ...prev, equipment: e.target.value }))}
                  placeholder="Search or describe the equipment..."
                  className="clinical-input pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">
                Quantity Required <span className="text-medical-red">*</span>
              </label>
              <input
                type="number"
                min={1}
                value={request.quantity}
                onChange={(e) => setRequest(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                className="clinical-input"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">
                Required By <span className="text-medical-red">*</span>
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                <input
                  type="datetime-local"
                  value={request.requiredBy}
                  onChange={(e) => setRequest(prev => ({ ...prev, requiredBy: e.target.value }))}
                  className="clinical-input pl-10"
                  required
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-surface-700 mb-1">
                Clinical Justification <span className="text-medical-red">*</span>
              </label>
              <textarea
                value={request.justification}
                onChange={(e) => setRequest(prev => ({ ...prev, justification: e.target.value }))}
                placeholder="Explain why this equipment is needed urgently..."
                rows={3}
                className="clinical-input"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-surface-700 mb-1">
                Patient Impact <span className="text-medical-red">*</span>
              </label>
              <textarea
                value={request.patientImpact}
                onChange={(e) => setRequest(prev => ({ ...prev, patientImpact: e.target.value }))}
                placeholder="Describe the impact on patient care if equipment is not obtained..."
                rows={3}
                className="clinical-input"
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-surface-200">
            <button type="button" className="clinical-button-secondary">
              Cancel
            </button>
            <button type="submit" className="clinical-button bg-medical-red hover:bg-medical-red/90">
              <Send className="w-4 h-4 mr-2" />
              Search Inventory
            </button>
          </div>
        </form>
      )}

      {step === 'searching' && (
        <div className="clinical-card p-12 text-center">
          <div className="w-16 h-16 border-4 border-clinical-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-surface-900 mb-2">Searching Inventory</h3>
          <p className="text-surface-600">
            Checking stock at nearby suppliers and distribution centers...
          </p>
        </div>
      )}

      {step === 'results' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-surface-900">
              Found {sourcingResults.length} Suppliers
            </h3>
            <button
              onClick={() => setStep('request')}
              className="clinical-button-secondary py-1.5 px-3 text-sm"
            >
              New Search
            </button>
          </div>

          <div className="space-y-4">
            {sourcingResults.map((supplier, idx) => (
              <div key={supplier.supplierId} className="clinical-card overflow-hidden">
                <div className="p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-surface-900">{supplier.supplierName}</h4>
                        <span className={`clinical-badge ${
                          supplier.availability === 'in_stock' ? 'bg-medical-green/10 text-medical-green' :
                          supplier.availability === 'limited' ? 'bg-medical-amber/10 text-medical-amber' :
                          'bg-surface-200 text-surface-600'
                        }`}>
                          {supplier.availability.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-surface-600">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {supplier.distance}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {supplier.deliveryTime} delivery
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-clinical-600">
                        ${supplier.unitPrice.toFixed(2)}
                      </p>
                      <p className="text-sm text-surface-500">per unit</p>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4 mb-4">
                    <div className="p-3 bg-surface-50 rounded-clinical">
                      <p className="text-xs text-surface-500 mb-1">Available Quantity</p>
                      <p className="font-medium text-surface-900">{supplier.quantity} units</p>
                    </div>
                    <div className="p-3 bg-surface-50 rounded-clinical">
                      <p className="text-xs text-surface-500 mb-1">Contact</p>
                      <p className="font-medium text-surface-900">{supplier.contactName}</p>
                    </div>
                    <div className="p-3 bg-surface-50 rounded-clinical">
                      <p className="text-xs text-surface-500 mb-1">Phone</p>
                      <p className="font-medium text-surface-900">{supplier.contactPhone}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleSelectSupplier(supplier)}
                      className="clinical-button flex-1"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Select Supplier
                    </button>
                    <a
                      href={`tel:${supplier.contactPhone}`}
                      className="clinical-button-secondary px-3"
                    >
                      <Phone className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
