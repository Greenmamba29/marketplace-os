import { useState } from 'react'
import {
  TrendingDown,
  Building2,
  Search,
  Filter,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  DollarSign,
  Package,
  Download,
} from 'lucide-react'
import { useGPOList, usePriceBenchmark, useGPOSavingsAnalysis } from '../hooks/useGPO'
import { GPOBenchmarkCard, GPOSavingsWidget } from '../components/GPOPricingCard'

export function GPOBenchmark() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedEquipment, setSelectedEquipment] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'benchmark' | 'contracts' | 'analysis'>('benchmark')

  const { data: gpos } = useGPOList()
  const { data: benchmark } = usePriceBenchmark(selectedEquipment || '')
  const { data: savingsAnalysis } = useGPOSavingsAnalysis('org-123', '2024')

  // Mock equipment for search
  const equipmentList = [
    { id: 'eq-1', name: 'Surgical Ventilator SV800', manufacturer: 'Medtronic', listPrice: 45000 },
    { id: 'eq-2', name: 'Patient Monitor MX450', manufacturer: 'Philips', listPrice: 12500 },
    { id: 'eq-3', name: 'Infusion Pump Alaris', manufacturer: 'BD', listPrice: 3200 },
    { id: 'eq-4', name: 'Defibrillator LIFEPAK 15', manufacturer: 'Stryker', listPrice: 18500 },
    { id: 'eq-5', name: 'Ultrasound System LOGIQ', manufacturer: 'GE Healthcare', listPrice: 85000 },
  ]

  const filteredEquipment = equipmentList.filter(eq =>
    eq.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    eq.manufacturer.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 flex items-center gap-2">
            <TrendingDown className="w-6 h-6 text-medical-green" />
            GPO Benchmark
          </h1>
          <p className="text-surface-600 mt-1">
            Compare pricing across GPO contracts and identify savings opportunities
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="clinical-button-secondary">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-surface-200">
        <nav className="flex gap-6">
          {[
            { id: 'benchmark', label: 'Price Benchmark', icon: BarChart3 },
            { id: 'contracts', label: 'GPO Contracts', icon: Building2 },
            { id: 'analysis', label: 'Savings Analysis', icon: DollarSign },
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
      {activeTab === 'benchmark' && (
        <div className="space-y-6">
          {/* Search */}
          <div className="clinical-card p-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search equipment to compare GPO pricing..."
                className="w-full pl-12 pr-4 py-3 rounded-clinical border border-surface-200 focus:outline-none focus:ring-2 focus:ring-clinical-500 focus:border-clinical-500"
              />
            </div>

            {searchQuery && (
              <div className="mt-4 border border-surface-200 rounded-clinical overflow-hidden">
                {filteredEquipment.map((eq) => (
                  <button
                    key={eq.id}
                    onClick={() => {
                      setSelectedEquipment(eq.id)
                      setSearchQuery('')
                    }}
                    className="w-full flex items-center justify-between p-3 hover:bg-surface-50 transition-colors border-b border-surface-100 last:border-b-0"
                  >
                    <div className="text-left">
                      <p className="font-medium text-surface-900">{eq.name}</p>
                      <p className="text-sm text-surface-500">{eq.manufacturer}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-surface-900">${eq.listPrice.toLocaleString()}</p>
                      <p className="text-xs text-surface-500">List price</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Selected Equipment Benchmark */}
          {selectedEquipment && benchmark ? (
            <GPOBenchmarkCard benchmark={benchmark} />
          ) : (
            <div className="clinical-card p-12 text-center">
              <BarChart3 className="w-16 h-16 text-surface-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-surface-900 mb-2">Compare Equipment Pricing</h3>
              <p className="text-surface-600 max-w-md mx-auto">
                Search for equipment above to see pricing across all your GPO contracts 
                and identify the best savings opportunities.
              </p>
            </div>
          )}

          {/* Quick Compare */}
          <div className="clinical-card">
            <div className="p-4 border-b border-surface-200">
              <h3 className="font-semibold text-surface-900">Quick Compare - Popular Equipment</h3>
            </div>
            <div className="p-4">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-surface-200">
                      <th className="text-left py-2 px-3 text-sm font-medium text-surface-600">Equipment</th>
                      <th className="text-left py-2 px-3 text-sm font-medium text-surface-600">List Price</th>
                      <th className="text-left py-2 px-3 text-sm font-medium text-surface-600">Best GPO Price</th>
                      <th className="text-left py-2 px-3 text-sm font-medium text-surface-600">Savings</th>
                      <th className="text-left py-2 px-3 text-sm font-medium text-surface-600">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {equipmentList.slice(0, 3).map((eq) => (
                      <tr key={eq.id} className="border-b border-surface-100 last:border-b-0">
                        <td className="py-3 px-3">
                          <p className="font-medium text-surface-900">{eq.name}</p>
                          <p className="text-sm text-surface-500">{eq.manufacturer}</p>
                        </td>
                        <td className="py-3 px-3 text-surface-900">
                          ${eq.listPrice.toLocaleString()}
                        </td>
                        <td className="py-3 px-3">
                          <span className="font-medium text-medical-green">
                            ${(eq.listPrice * 0.78).toLocaleString()}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <span className="clinical-badge bg-medical-green/10 text-medical-green">
                            22% off
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <button
                            onClick={() => setSelectedEquipment(eq.id)}
                            className="text-clinical-600 hover:text-clinical-700 text-sm font-medium flex items-center gap-1"
                          >
                            Compare
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'contracts' && (
        <div className="space-y-6">
          {/* GPO List */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {gpos?.data?.map((gpo: any) => (
              <div key={gpo.id} className="clinical-card p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 bg-clinical-100 rounded-clinical flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-clinical-600" />
                  </div>
                  <span className="clinical-badge bg-medical-green/10 text-medical-green">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Active
                  </span>
                </div>
                <h3 className="font-semibold text-surface-900 mb-1">{gpo.name}</h3>
                <p className="text-sm text-surface-600 mb-3">{gpo.legalName}</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-surface-500">Contracts:</span>
                    <span className="font-medium text-surface-900">{gpo.statistics?.contractsActive || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-surface-500">Members:</span>
                    <span className="font-medium text-surface-900">{gpo.statistics?.totalMembers?.toLocaleString() || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-surface-500">Avg Savings:</span>
                    <span className="font-medium text-medical-green">{gpo.statistics?.averageSavings || 0}%</span>
                  </div>
                </div>
                <button className="clinical-button w-full mt-4 py-2 text-sm">
                  View Contracts
                </button>
              </div>
            ))}
          </div>

          {/* Contract Status */}
          <div className="clinical-card">
            <div className="p-4 border-b border-surface-200 flex items-center justify-between">
              <h3 className="font-semibold text-surface-900">Contract Status</h3>
              <button className="clinical-button-secondary py-1.5 px-3 text-sm">
                <Filter className="w-4 h-4 mr-1" />
                Filter
              </button>
            </div>
            <div className="p-4">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-surface-200">
                      <th className="text-left py-2 px-3 text-sm font-medium text-surface-600">Contract</th>
                      <th className="text-left py-2 px-3 text-sm font-medium text-surface-600">GPO</th>
                      <th className="text-left py-2 px-3 text-sm font-medium text-surface-600">Expiration</th>
                      <th className="text-left py-2 px-3 text-sm font-medium text-surface-600">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { id: 'C-001', name: 'Surgical Supplies 2024', gpo: 'Premier', expires: '2024-12-31', status: 'active' },
                      { id: 'C-002', name: 'Imaging Equipment', gpo: 'Vizient', expires: '2024-09-30', status: 'expiring_soon' },
                      { id: 'C-003', name: 'Patient Monitoring', gpo: 'HealthTrust', expires: '2025-03-15', status: 'active' },
                    ].map((contract) => (
                      <tr key={contract.id} className="border-b border-surface-100 last:border-b-0">
                        <td className="py-3 px-3">
                          <p className="font-medium text-surface-900">{contract.name}</p>
                          <p className="text-xs text-surface-500 font-mono">{contract.id}</p>
                        </td>
                        <td className="py-3 px-3 text-surface-900">{contract.gpo}</td>
                        <td className="py-3 px-3 text-surface-900">
                          {new Date(contract.expires).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-3">
                          <span className={`clinical-badge ${
                            contract.status === 'active' ? 'bg-medical-green/10 text-medical-green' :
                            contract.status === 'expiring_soon' ? 'bg-medical-amber/10 text-medical-amber' :
                            'bg-surface-200 text-surface-600'
                          }`}>
                            {contract.status === 'expiring_soon' && <AlertTriangle className="w-3 h-3 mr-1" />}
                            {contract.status.replace('_', ' ')}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'analysis' && (
        <div className="space-y-6">
          {/* Savings Overview */}
          <GPOSavingsWidget
            totalSavings={186420}
            savingsPercent={23.4}
            contractCount={12}
            missedOpportunities={3}
          />

          {/* Savings by Category */}
          <div className="clinical-card">
            <div className="p-4 border-b border-surface-200">
              <h3 className="font-semibold text-surface-900">Savings by Category</h3>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                {[
                  { category: 'Surgical Instruments', spend: 850000, savings: 195500, percent: 23 },
                  { category: 'Patient Monitoring', spend: 420000, savings: 88200, percent: 21 },
                  { category: 'Imaging Equipment', spend: 680000, savings: 149600, percent: 22 },
                  { category: 'Infusion Pumps', spend: 180000, savings: 39600, percent: 22 },
                ].map((cat, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-surface-900">{cat.category}</span>
                        <span className="text-sm text-medical-green font-medium">
                          ${cat.savings.toLocaleString()} saved
                        </span>
                      </div>
                      <div className="h-2 bg-surface-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-medical-green rounded-full"
                          style={{ width: `${cat.percent}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-surface-500">
                          Spend: ${cat.spend.toLocaleString()}
                        </span>
                        <span className="text-xs text-medical-green">
                          {cat.percent}% savings
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Missed Opportunities */}
          <div className="clinical-card">
            <div className="p-4 border-b border-surface-200 flex items-center justify-between">
              <h3 className="font-semibold text-surface-900 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-medical-amber" />
                Missed GPO Opportunities
              </h3>
              <span className="clinical-badge bg-medical-amber/10 text-medical-amber">
                Potential: $24,500
              </span>
            </div>
            <div className="p-4">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-surface-200">
                      <th className="text-left py-2 px-3 text-sm font-medium text-surface-600">Equipment</th>
                      <th className="text-left py-2 px-3 text-sm font-medium text-surface-600">Amount Spent</th>
                      <th className="text-left py-2 px-3 text-sm font-medium text-surface-600">GPO Price</th>
                      <th className="text-left py-2 px-3 text-sm font-medium text-surface-600">Missed Savings</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: 'Surgical Kit SK-2024', spent: 15000, gpoPrice: 12000, missed: 3000 },
                      { name: 'Patient Monitor MX200', spent: 8500, gpoPrice: 6800, missed: 1700 },
                      { name: 'Infusion Set IS-500', spent: 45000, gpoPrice: 36000, missed: 9000 },
                    ].map((item, idx) => (
                      <tr key={idx} className="border-b border-surface-100 last:border-b-0">
                        <td className="py-3 px-3">
                          <p className="font-medium text-surface-900">{item.name}</p>
                        </td>
                        <td className="py-3 px-3 text-surface-900">
                          ${item.spent.toLocaleString()}
                        </td>
                        <td className="py-3 px-3 text-medical-green">
                          ${item.gpoPrice.toLocaleString()}
                        </td>
                        <td className="py-3 px-3">
                          <span className="clinical-badge bg-medical-amber/10 text-medical-amber">
                            ${item.missed.toLocaleString()}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
