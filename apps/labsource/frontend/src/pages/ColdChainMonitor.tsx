import { useState } from 'react'
import { 
  Thermometer, 
  Snowflake, 
  AlertTriangle, 
  CheckCircle2, 
  Truck,
  MapPin,
  Clock,
  TrendingUp,
  TrendingDown,
  Minus,
  Bell,
  Check
} from 'lucide-react'
import { 
  useActiveShipments, 
  useColdChainAlerts, 
  useAcknowledgeAlert,
  useTemperatureLog 
} from '../hooks/useColdChain'
import TemperatureGauge from '../components/TemperatureGauge'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'

interface Shipment {
  id: string
  trackingNumber: string
  carrier: string
  origin: string
  destination: string
  status: 'in-transit' | 'delivered' | 'breached'
  currentTemp: number
  minTemp: number
  maxTemp: number
  targetTemp: number
  eta: string
  lastReading: string
  excursionCount: number
}

export default function ColdChainMonitor() {
  const [selectedShipment, setSelectedShipment] = useState<string | null>(null)
  
  const { data: shipments, isLoading: shipmentsLoading } = useActiveShipments()
  const { data: alerts, isLoading: alertsLoading } = useColdChainAlerts()
  const { data: tempLog } = useTemperatureLog(selectedShipment || '')
  const acknowledgeAlert = useAcknowledgeAlert()

  const activeShipments = shipments?.data || []
  const activeAlerts = alerts?.data || []

  // Mock temperature history data for demo
  const mockTempHistory = [
    { time: '00:00', temp: -18.5 },
    { time: '04:00', temp: -19.2 },
    { time: '08:00', temp: -18.8 },
    { time: '12:00', temp: -20.1 },
    { time: '16:00', temp: -19.5 },
    { time: '20:00', temp: -18.9 },
    { time: '24:00', temp: -19.3 },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'in-transit':
        return <Truck className="w-5 h-5 text-science-500" />
      case 'delivered':
        return <CheckCircle2 className="w-5 h-5 text-emerald-500" />
      case 'breached':
        return <AlertTriangle className="w-5 h-5 text-rose-500" />
      default:
        return <Truck className="w-5 h-5 text-slate-500" />
    }
  }

  const getTempTrend = (current: number, previous: number) => {
    const diff = current - previous
    if (diff > 0.5) return <TrendingUp className="w-4 h-4 text-rose-400" />
    if (diff < -0.5) return <TrendingDown className="w-4 h-4 text-blue-400" />
    return <Minus className="w-4 h-4 text-slate-400" />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="section-title">Cold Chain Monitor</h1>
          <p className="text-slate-400 mt-1">Real-time temperature monitoring for temperature-sensitive shipments</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-950 border border-emerald-800 rounded-lg">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="text-sm text-emerald-400">{activeShipments.filter((s: any) => s.status === 'in-transit').length} Active</span>
          </div>
          {activeAlerts.length > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 bg-rose-950 border border-rose-800 rounded-lg">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span className="text-sm text-rose-400">{activeAlerts.length} Alerts</span>
            </div>
          )}
        </div>
      </div>

      {/* Alerts Section */}
      {activeAlerts.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-medium text-slate-400 flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Active Alerts
          </h2>
          {activeAlerts.map((alert: any) => (
            <div 
              key={alert.id} 
              className={`card p-4 border-l-4 ${
                alert.severity === 'critical' ? 'border-l-rose-500 bg-rose-950/20' :
                alert.severity === 'high' ? 'border-l-orange-500 bg-orange-950/20' :
                alert.severity === 'medium' ? 'border-l-amber-500 bg-amber-950/20' :
                'border-l-blue-500 bg-blue-950/20'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <AlertTriangle className={`w-5 h-5 flex-shrink-0 ${
                    alert.severity === 'critical' ? 'text-rose-500' :
                    alert.severity === 'high' ? 'text-orange-500' :
                    alert.severity === 'medium' ? 'text-amber-500' :
                    'text-blue-500'
                  }`} />
                  <div>
                    <p className="text-slate-200 font-medium">{alert.message}</p>
                    <p className="text-sm text-slate-500 mt-1">
                      Shipment: {alert.shipmentId} • {new Date(alert.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
                {!alert.acknowledged && (
                  <button
                    onClick={() => acknowledgeAlert.mutate(alert.id)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm rounded-lg transition-colors"
                  >
                    <Check className="w-4 h-4" />
                    Acknowledge
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Active Shipments Grid */}
      <div>
        <h2 className="text-sm font-medium text-slate-400 mb-4">Active Shipments</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {shipmentsLoading ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="card p-4 animate-pulse">
                <div className="h-4 bg-slate-800 rounded w-3/4 mb-3" />
                <div className="h-3 bg-slate-800 rounded w-1/2" />
              </div>
            ))
          ) : activeShipments.length > 0 ? (
            activeShipments.map((shipment: any) => (
              <button
                key={shipment.id}
                onClick={() => setSelectedShipment(shipment.id)}
                className={`card p-4 text-left transition-all ${
                  selectedShipment === shipment.id 
                    ? 'border-science-600 ring-1 ring-science-600' 
                    : 'hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(shipment.status)}
                    <div>
                      <p className="font-medium text-slate-200">{shipment.trackingNumber}</p>
                      <p className="text-xs text-slate-500">{shipment.carrier}</p>
                    </div>
                  </div>
                  <TemperatureGauge 
                    current={shipment.currentTemp}
                    min={shipment.minTemp}
                    max={shipment.maxTemp}
                    target={shipment.targetTemp}
                    size="sm"
                  />
                </div>
                <div className="flex items-center gap-4 text-sm text-slate-400">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {shipment.origin} → {shipment.destination}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    ETA: {new Date(shipment.eta).toLocaleDateString()}
                  </div>
                </div>
                {shipment.excursionCount > 0 && (
                  <div className="mt-3 flex items-center gap-2 text-rose-400 text-sm">
                    <AlertTriangle className="w-4 h-4" />
                    {shipment.excursionCount} temperature excursion{shipment.excursionCount > 1 ? 's' : ''}
                  </div>
                )}
              </button>
            ))
          ) : (
            <div className="card p-8 text-center col-span-full">
              <Snowflake className="w-12 h-12 text-slate-700 mx-auto mb-4" />
              <p className="text-slate-500">No active cold chain shipments</p>
            </div>
          )}
        </div>
      </div>

      {/* Temperature History Chart */}
      {selectedShipment && (
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-lg font-semibold text-slate-100">
              Temperature History
            </h2>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-science-500 rounded-full" />
                <span className="text-slate-400">Temperature</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-rose-500 rounded-full" />
                <span className="text-slate-400">Excursion</span>
              </div>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockTempHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis 
                  dataKey="time" 
                  stroke="#64748b" 
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis 
                  stroke="#64748b" 
                  fontSize={12}
                  tickLine={false}
                  domain={[-25, -15]}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0f172a', 
                    border: '1px solid #1e293b',
                    borderRadius: '8px'
                  }}
                  labelStyle={{ color: '#94a3b8' }}
                />
                <ReferenceLine y={-20} stroke="#0891B2" strokeDasharray="3 3" />
                <ReferenceLine y={-15} stroke="#f43f5e" strokeDasharray="3 3" />
                <Line 
                  type="monotone" 
                  dataKey="temp" 
                  stroke="#0891B2" 
                  strokeWidth={2}
                  dot={{ fill: '#0891B2', strokeWidth: 0, r: 4 }}
                  activeDot={{ r: 6, fill: '#22d3ee' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
            <span>Target: -20°C</span>
            <span>Last reading: 2 minutes ago</span>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-science-950 rounded-lg flex items-center justify-center">
              <Truck className="w-5 h-5 text-science-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-100">{activeShipments.length}</p>
              <p className="text-sm text-slate-500">Active Shipments</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-950 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-100">
                {activeShipments.filter((s: any) => s.status === 'delivered').length}
              </p>
              <p className="text-sm text-slate-500">Delivered Today</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-rose-950 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-rose-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-100">
                {activeShipments.reduce((sum: number, s: any) => sum + (s.excursionCount || 0), 0)}
              </p>
              <p className="text-sm text-slate-500">Total Excursions</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-950 rounded-lg flex items-center justify-center">
              <Thermometer className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-100">99.7%</p>
              <p className="text-sm text-slate-500">Compliance Rate</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
