import { useState } from 'react'
import {
  ScanLine,
  Search,
  History,
  Package,
  MapPin,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Printer,
  Download,
  QrCode,
  Barcode,
  ArrowRight,
  Filter,
} from 'lucide-react'
import { UDIScanner, UDIDisplay } from '../components/UDIScanner'
import { useUDIScan, useUDIHistory, useRecordUDIMovement } from '../hooks/useEquipment'
import { toast } from '../components/ui/Toaster'

export function UDITracker() {
  const [showScanner, setShowScanner] = useState(false)
  const [searchUdi, setSearchUdi] = useState('')
  const [selectedUdi, setSelectedUdi] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'scan' | 'history' | 'bulk'>('scan')

  const { data: scanResult, isLoading: isScanning } = useUDIScan(selectedUdi || '')
  const { data: historyData } = useUDIHistory(selectedUdi || '')
  const recordMovement = useRecordUDIMovement()

  const handleScan = (udi: string) => {
    setSelectedUdi(udi)
    setSearchUdi(udi)
    setShowScanner(false)
    toast.success('UDI Scanned', `Found device: ${udi.substring(0, 30)}...`)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchUdi.trim()) {
      setSelectedUdi(searchUdi.trim())
    }
  }

  const handleRecordMovement = async (fromLocation: string, toLocation: string, reason: string) => {
    if (!selectedUdi) return
    try {
      await recordMovement.mutateAsync({ udi: selectedUdi, data: { fromLocation, toLocation, reason } })
      toast.success('Movement Recorded', `Device moved from ${fromLocation} to ${toLocation}`)
    } catch (error) {
      toast.error('Failed to record movement', error instanceof Error ? error.message : 'Unknown error')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">UDI Tracker</h1>
          <p className="text-surface-600 mt-1">
            Track medical devices using FDA Unique Device Identifiers
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowScanner(true)}
            className="clinical-button"
          >
            <ScanLine className="w-4 h-4 mr-2" />
            Scan UDI
          </button>
          <button className="clinical-button-secondary">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-surface-200">
        <nav className="flex gap-6">
          {[
            { id: 'scan', label: 'Scan & Lookup', icon: ScanLine },
            { id: 'history', label: 'Movement History', icon: History },
            { id: 'bulk', label: 'Bulk Operations', icon: Package },
          ].map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 pb-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-clinical-500 text-clinical-600'
                    : 'border-transparent text-surface-600 hover:text-surface-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'scan' && (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Search Panel */}
          <div className="clinical-card p-6">
            <h3 className="text-lg font-semibold text-surface-900 mb-4">UDI Lookup</h3>
            <form onSubmit={handleSearch} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1">
                  Enter UDI or Scan
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={searchUdi}
                    onChange={(e) => setSearchUdi(e.target.value)}
                    placeholder="(01)12345678901234..."
                    className="clinical-input flex-1 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowScanner(true)}
                    className="clinical-button-secondary px-3"
                  >
                    <ScanLine className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-xs text-surface-500 mt-1">
                  Enter the full UDI string including all data elements
                </p>
              </div>
              <button
                type="submit"
                disabled={!searchUdi.trim() || isScanning}
                className="clinical-button w-full disabled:opacity-50"
              >
                {isScanning ? (
                  <>
                    <ScanLine className="w-4 h-4 mr-2 animate-spin" />
                    Looking up...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Lookup Device
                  </>
                )}
              </button>
            </form>

            {/* Recent Scans */}
            <div className="mt-6 pt-6 border-t border-surface-200">
              <h4 className="text-sm font-medium text-surface-700 mb-3">Recent Scans</h4>
              <div className="space-y-2">
                {[
                  '(01)00826581005648(11)250101(10)ABC123',
                  '(01)00826581005655(17)250630(21)SN789456',
                  '(01)00826581005662(11)240915(10)LOT456',
                ].map((udi, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSearchUdi(udi)
                      setSelectedUdi(udi)
                    }}
                    className="w-full text-left p-2 rounded-clinical hover:bg-surface-50 transition-colors"
                  >
                    <p className="text-xs font-mono text-surface-600 truncate">{udi}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Device Info Panel */}
          <div>
            {scanResult ? (
              <div className="clinical-card overflow-hidden">
                <div className="p-4 bg-clinical-50 border-b border-clinical-100">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-medical-green" />
                    <span className="font-medium text-clinical-800">Device Verified</span>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* UDI Display */}
                  <div>
                    <h4 className="text-sm font-medium text-surface-700 mb-2">Unique Device Identifier</h4>
                    <UDIDisplay udi={selectedUdi || ''} size="md" />
                  </div>

                  {/* Device Details */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-surface-50 rounded-clinical">
                      <p className="text-xs text-surface-500 mb-1">Device Name</p>
                      <p className="text-sm font-medium text-surface-900">{scanResult.deviceName}</p>
                    </div>
                    <div className="p-3 bg-surface-50 rounded-clinical">
                      <p className="text-xs text-surface-500 mb-1">Manufacturer</p>
                      <p className="text-sm font-medium text-surface-900">{scanResult.manufacturer}</p>
                    </div>
                    <div className="p-3 bg-surface-50 rounded-clinical">
                      <p className="text-xs text-surface-500 mb-1">Catalog Number</p>
                      <p className="text-sm font-mono text-surface-900">{scanResult.catalogNumber}</p>
                    </div>
                    <div className="p-3 bg-surface-50 rounded-clinical">
                      <p className="text-xs text-surface-500 mb-1">FDA Device Class</p>
                      <span className={`clinical-badge ${
                        scanResult.deviceClass === 'I' ? 'fda-class-i' :
                        scanResult.deviceClass === 'II' ? 'fda-class-ii' : 'fda-class-iii'
                      }`}>
                        Class {scanResult.deviceClass}
                      </span>
                    </div>
                  </div>

                  {/* Current Status */}
                  <div className="p-4 bg-medical-green/10 border border-medical-green/20 rounded-clinical">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4 text-medical-green" />
                      <span className="text-sm font-medium text-medical-green">Current Location</span>
                    </div>
                    <p className="text-surface-900">{scanResult.currentLocation}</p>
                    <p className="text-xs text-surface-600 mt-1">
                      Last updated: {new Date(scanResult.lastUpdated).toLocaleString()}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleRecordMovement(scanResult.currentLocation, 'OR-3', 'Scheduled Procedure')}
                      className="clinical-button flex-1"
                    >
                      <ArrowRight className="w-4 h-4 mr-2" />
                      Record Movement
                    </button>
                    <button className="clinical-button-secondary px-3">
                      <Printer className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="clinical-card p-12 text-center">
                <QrCode className="w-16 h-16 text-surface-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-surface-900 mb-2">Scan or Enter UDI</h3>
                <p className="text-surface-600">
                  Use the scanner or enter a UDI manually to view device information and tracking history
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="clinical-card">
          <div className="p-4 border-b border-surface-200 flex items-center justify-between">
            <h3 className="font-semibold text-surface-900">Movement History</h3>
            <div className="flex items-center gap-2">
              <button className="clinical-button-secondary py-1.5 px-3 text-sm">
                <Filter className="w-4 h-4 mr-1" />
                Filter
              </button>
              <button className="clinical-button-secondary py-1.5 px-3 text-sm">
                <Download className="w-4 h-4 mr-1" />
                Export
              </button>
            </div>
          </div>
          <div className="p-4">
            {historyData?.movements ? (
              <div className="space-y-4">
                {historyData.movements.map((movement: any, idx: number) => (
                  <div key={idx} className="flex items-start gap-4 p-4 bg-surface-50 rounded-clinical">
                    <div className="w-10 h-10 bg-clinical-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-clinical-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-surface-900">{movement.fromLocation}</span>
                        <ArrowRight className="w-4 h-4 text-surface-400" />
                        <span className="font-medium text-surface-900">{movement.toLocation}</span>
                      </div>
                      <p className="text-sm text-surface-600">{movement.reason}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-surface-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(movement.timestamp).toLocaleString()}
                        </span>
                        <span>By: {movement.performedBy}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <History className="w-12 h-12 text-surface-300 mx-auto mb-4" />
                <p className="text-surface-600">Select a device to view its movement history</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'bulk' && (
        <div className="clinical-card p-6">
          <h3 className="text-lg font-semibold text-surface-900 mb-4">Bulk UDI Operations</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-4 border border-surface-200 rounded-clinical hover:border-clinical-300 transition-colors cursor-pointer">
              <Barcode className="w-8 h-8 text-clinical-500 mb-3" />
              <h4 className="font-medium text-surface-900 mb-1">Import UDIs</h4>
              <p className="text-sm text-surface-600">
                Bulk import UDI list from CSV or Excel file
              </p>
            </div>
            <div className="p-4 border border-surface-200 rounded-clinical hover:border-clinical-300 transition-colors cursor-pointer">
              <Printer className="w-8 h-8 text-clinical-500 mb-3" />
              <h4 className="font-medium text-surface-900 mb-1">Print Labels</h4>
              <p className="text-sm text-surface-600">
                Generate and print UDI barcode labels
              </p>
            </div>
            <div className="p-4 border border-surface-200 rounded-clinical hover:border-clinical-300 transition-colors cursor-pointer">
              <AlertTriangle className="w-8 h-8 text-medical-amber mb-3" />
              <h4 className="font-medium text-surface-900 mb-1">Recall Check</h4>
              <p className="text-sm text-surface-600">
                Verify UDIs against FDA recall database
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Scanner Modal */}
      {showScanner && (
        <UDIScanner onScan={handleScan} onClose={() => setShowScanner(false)} />
      )}
    </div>
  )
}
