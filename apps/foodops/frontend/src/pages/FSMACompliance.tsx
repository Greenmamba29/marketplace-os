import { useState } from 'react'
import { 
  ClipboardCheck, 
  Search, 
  Filter, 
  Calendar, 
  Thermometer,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Download,
  FileText,
  QrCode,
  Clock,
  Package,
  TrendingUp,
  Shield,
  AlertOctagon
} from 'lucide-react'
import { Card, CardHeader, CardContent } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Badge } from '../components/ui/Badge'
import { StatsCard } from '../components/ui/StatsCard'
import type { LotRecord, TemperatureExcursion } from '../types'

// Mock data
const mockLots: LotRecord[] = [
  {
    id: '1',
    lotNumber: 'LOT-2024-001',
    ingredientId: '1',
    ingredientName: 'Organic Chicken Breast',
    supplierId: 'sup-1',
    supplierName: 'Premium Poultry Farms',
    quantityReceived: 100,
    quantityRemaining: 45,
    unitOfMeasure: 'lb',
    productionDate: '2024-01-10',
    receivedDate: '2024-01-11',
    expiryDate: '2024-01-16',
    temperatureAtReceipt: 2.5,
    temperatureZone: 'refrigerated',
    poNumber: 'PO-2024-001',
    invoiceNumber: 'INV-001',
    status: 'in_use',
    traceabilityLotCode: 'PPF-20240110-A',
    killStepApplied: true,
    createdAt: '2024-01-11T08:00:00Z',
    updatedAt: '2024-01-11T08:00:00Z',
  },
  {
    id: '2',
    lotNumber: 'LOT-2024-002',
    ingredientId: '2',
    ingredientName: 'Atlantic Salmon Fillet',
    supplierId: 'sup-2',
    supplierName: 'Ocean Fresh Seafood',
    quantityReceived: 50,
    quantityRemaining: 50,
    unitOfMeasure: 'lb',
    productionDate: '2024-01-12',
    receivedDate: '2024-01-13',
    expiryDate: '2024-01-15',
    temperatureAtReceipt: 1.8,
    temperatureZone: 'refrigerated',
    poNumber: 'PO-2024-002',
    invoiceNumber: 'INV-002',
    status: 'in_stock',
    traceabilityLotCode: 'OFS-20240112-B',
    killStepApplied: false,
    createdAt: '2024-01-13T09:00:00Z',
    updatedAt: '2024-01-13T09:00:00Z',
  },
  {
    id: '3',
    lotNumber: 'LOT-2024-003',
    ingredientId: '5',
    ingredientName: 'Heavy Cream',
    supplierId: 'sup-5',
    supplierName: 'Dairyland Farms',
    quantityReceived: 24,
    quantityRemaining: 12,
    unitOfMeasure: 'qt',
    productionDate: '2024-01-08',
    receivedDate: '2024-01-09',
    expiryDate: '2024-01-22',
    temperatureAtReceipt: 3.2,
    temperatureZone: 'refrigerated',
    poNumber: 'PO-2024-003',
    invoiceNumber: 'INV-003',
    status: 'in_use',
    traceabilityLotCode: 'DF-20240108-C',
    killStepApplied: true,
    createdAt: '2024-01-09T10:00:00Z',
    updatedAt: '2024-01-09T10:00:00Z',
  },
]

const mockExcursions: TemperatureExcursion[] = [
  {
    id: '1',
    sensorId: 'SENSOR-001',
    sensorLocation: 'Walk-in Cooler #1',
    temperatureZone: 'refrigerated',
    startTime: '2024-01-14T02:30:00Z',
    endTime: '2024-01-14T03:15:00Z',
    minTemperature: 1.5,
    maxTemperature: 8.2,
    duration: 45,
    affectedLots: ['LOT-2024-001'],
    severity: 'minor',
    status: 'resolved',
    correctiveAction: 'Adjusted thermostat setting, verified temperature return to normal range.',
    investigatedBy: 'John Smith',
  },
]

const complianceStats = {
  totalLots: 156,
  traceableLots: 156,
  complianceRate: 100,
  activeExcursions: 0,
  resolvedExcursions: 12,
  avgResponseTime: 18, // minutes
}

export const FSMACompliance = () => {
  const [activeTab, setActiveTab] = useState<'lots' | 'traceability' | 'excursions'>('lots')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLot, setSelectedLot] = useState<LotRecord | null>(null)

  const filteredLots = mockLots.filter(lot => 
    lot.lotNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lot.ingredientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lot.supplierName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getDaysToExpiry = (expiryDate: string) => {
    const expiry = new Date(expiryDate)
    const today = new Date()
    const diffTime = expiry.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const renderLotsTab = () => (
    <div className="space-y-6">
      {/* Search */}
      <div className="flex gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search by lot number, ingredient, or supplier..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-5 h-5" />}
            fullWidth
          />
        </div>
        <Button variant="secondary" leftIcon={<Filter className="w-4 h-4" />}>
          Filter
        </Button>
        <Button variant="secondary" leftIcon={<Download className="w-4 h-4" />}>
          Export
        </Button>
      </div>

      {/* Lots Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left py-3 px-4 text-sm font-medium text-neutral-400">Lot Number</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-neutral-400">Ingredient</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-neutral-400">Supplier</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-neutral-400">Quantity</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-neutral-400">Status</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-neutral-400">Expiry</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-neutral-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLots.map((lot) => {
                const daysToExpiry = getDaysToExpiry(lot.expiryDate)
                return (
                  <tr key={lot.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                    <td className="py-3 px-4">
                      <span className="font-mono text-sm text-white">{lot.lotNumber}</span>
                    </td>
                    <td className="py-3 px-4 text-white">{lot.ingredientName}</td>
                    <td className="py-3 px-4 text-neutral-400">{lot.supplierName}</td>
                    <td className="py-3 px-4 text-right text-white">
                      {lot.quantityRemaining} / {lot.quantityReceived} {lot.unitOfMeasure}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Badge 
                        variant={lot.status === 'in_stock' ? 'success' : lot.status === 'in_use' ? 'info' : 'default'} 
                        size="sm"
                      >
                        {lot.status.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Badge 
                        variant={daysToExpiry <= 2 ? 'error' : daysToExpiry <= 5 ? 'warning' : 'success'} 
                        size="sm"
                      >
                        {daysToExpiry} days
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        leftIcon={<ArrowRight className="w-4 h-4" />}
                        onClick={() => setSelectedLot(lot)}
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )

  const renderTraceabilityTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader 
          title="Lot Traceability Lookup"
          subtitle="Enter a lot number to trace its complete journey"
        />
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Enter lot number (e.g., LOT-2024-001)"
                leftIcon={<QrCode className="w-5 h-5" />}
                fullWidth
              />
            </div>
            <Button leftIcon={<Search className="w-4 h-4" />}>
              Trace Lot
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Traceability Chain */}
      {selectedLot && (
        <Card>
          <CardHeader 
            title={`Traceability: ${selectedLot.lotNumber}`}
            subtitle={selectedLot.ingredientName}
          />
          <CardContent>
            <div className="relative">
              {/* Timeline */}
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-[#65A30D]/30" />
              
              <div className="space-y-6">
                {/* Production */}
                <div className="relative pl-12">
                  <div className="absolute left-0 w-8 h-8 rounded-full bg-[#65A30D] flex items-center justify-center">
                    <Package className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-white">Production</p>
                    <p className="text-sm text-neutral-400">
                      {new Date(selectedLot.productionDate).toLocaleDateString()} at {selectedLot.supplierName}
                    </p>
                    <p className="text-sm text-neutral-500 mt-1">
                      Traceability Code: {selectedLot.traceabilityLotCode}
                    </p>
                  </div>
                </div>

                {/* Receipt */}
                <div className="relative pl-12">
                  <div className="absolute left-0 w-8 h-8 rounded-full bg-[#65A30D] flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-white">Receipt</p>
                    <p className="text-sm text-neutral-400">
                      {new Date(selectedLot.receivedDate).toLocaleDateString()} at Your Facility
                    </p>
                    <p className="text-sm text-neutral-500 mt-1">
                      PO: {selectedLot.poNumber} | Invoice: {selectedLot.invoiceNumber}
                    </p>
                    <p className="text-sm text-neutral-500">
                      Temperature at Receipt: {selectedLot.temperatureAtReceipt}°C
                    </p>
                  </div>
                </div>

                {/* Current Status */}
                <div className="relative pl-12">
                  <div className="absolute left-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                    <Clock className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-white">Current Status</p>
                    <p className="text-sm text-neutral-400">
                      {selectedLot.quantityRemaining} {selectedLot.unitOfMeasure} remaining
                    </p>
                    <p className="text-sm text-neutral-500 mt-1">
                      Expires: {new Date(selectedLot.expiryDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-white/5 flex gap-3">
              <Button variant="outline" size="sm" leftIcon={<Download className="w-4 h-4" />}>
                Export Traceability Report
              </Button>
              <Button variant="outline" size="sm" leftIcon={<FileText className="w-4 h-4" />}>
                View Documents
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )

  const renderExcursionsTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard
          title="Active Excursions"
          value={complianceStats.activeExcursions.toString()}
          variant="success"
          icon={<Thermometer className="w-5 h-5" />}
        />
        <StatsCard
          title="Resolved This Month"
          value={complianceStats.resolvedExcursions.toString()}
          variant="info"
          icon={<CheckCircle2 className="w-5 h-5" />}
        />
        <StatsCard
          title="Avg Response Time"
          value={`${complianceStats.avgResponseTime} min`}
          variant="warning"
          icon={<Clock className="w-5 h-5" />}
        />
      </div>

      <Card>
        <CardHeader title="Temperature Excursions" />
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left py-3 px-4 text-sm font-medium text-neutral-400">Location</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-neutral-400">Date/Time</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-neutral-400">Duration</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-neutral-400">Severity</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-neutral-400">Status</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-neutral-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockExcursions.map((excursion) => (
                  <tr key={excursion.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                    <td className="py-3 px-4 text-white">{excursion.sensorLocation}</td>
                    <td className="py-3 px-4 text-neutral-400">
                      {new Date(excursion.startTime).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right text-white">{excursion.duration} min</td>
                    <td className="py-3 px-4 text-center">
                      <Badge 
                        variant={excursion.severity === 'critical' ? 'error' : excursion.severity === 'major' ? 'warning' : 'info'} 
                        size="sm"
                      >
                        {excursion.severity}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Badge 
                        variant={excursion.status === 'resolved' ? 'success' : excursion.status === 'investigating' ? 'warning' : 'error'} 
                        size="sm"
                      >
                        {excursion.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">FSMA Compliance</h1>
          <p className="text-neutral-400">Lot traceability, temperature monitoring, and food safety compliance</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/10 border border-green-500/30">
            <Shield className="w-5 h-5 text-green-400" />
            <span className="text-sm font-medium text-green-400">
              {complianceStats.complianceRate}% Compliant
            </span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard
          title="Total Lots"
          value={complianceStats.totalLots.toString()}
          icon={<Package className="w-5 h-5" />}
        />
        <StatsCard
          title="Traceable Lots"
          value={complianceStats.traceableLots.toString()}
          variant="success"
          icon={<CheckCircle2 className="w-5 h-5" />}
        />
        <StatsCard
          title="Active Alerts"
          value={mockExcursions.filter(e => e.status !== 'resolved').length.toString()}
          variant={mockExcursions.filter(e => e.status !== 'resolved').length > 0 ? 'warning' : 'success'}
          icon={<AlertOctagon className="w-5 h-5" />}
        />
        <StatsCard
          title="Documents"
          value="24"
          icon={<FileText className="w-5 h-5" />}
        />
      </div>

      {/* Tabs */}
      <div className="border-b border-white/5">
        <div className="flex gap-1">
          {[
            { id: 'lots', label: 'Lot Tracking', icon: Package },
            { id: 'traceability', label: 'Traceability', icon: QrCode },
            { id: 'excursions', label: 'Temp Excursions', icon: Thermometer },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-[#65A30D] text-[#A3E635]'
                  : 'border-transparent text-neutral-400 hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'lots' && renderLotsTab()}
      {activeTab === 'traceability' && renderTraceabilityTab()}
      {activeTab === 'excursions' && renderExcursionsTab()}
    </div>
  )
}
