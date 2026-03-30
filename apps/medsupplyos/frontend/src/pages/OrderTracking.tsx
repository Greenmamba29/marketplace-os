import { useParams } from 'react-router-dom'
import {
  Package,
  Truck,
  CheckCircle,
  MapPin,
  Calendar,
  Snowflake,
  Barcode,
  FileText,
  AlertTriangle,
  ArrowRight,
  Clock,
} from 'lucide-react'
import { useOrder, useOrderTracking, useOrderCompliance } from '../hooks/useOrders'
import { UDIDisplay } from '../components/UDIScanner'
import { FDAStatusBadge } from '../components/FDAStatusBadge'

export function OrderTracking() {
  const { orderId } = useParams<{ orderId: string }>()
  const { data: order, isLoading: orderLoading } = useOrder(orderId || '')
  const { data: tracking } = useOrderTracking(orderId || '')
  const { data: compliance } = useOrderCompliance(orderId || '')

  if (orderLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-clinical-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="clinical-card p-12 text-center">
        <Package className="w-16 h-16 text-surface-300 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-surface-900 mb-2">Order Not Found</h2>
        <p className="text-surface-600">The order you're looking for doesn't exist.</p>
      </div>
    )
  }

  const statusSteps = [
    { id: 'confirmed', label: 'Confirmed', icon: CheckCircle },
    { id: 'processing', label: 'Processing', icon: Package },
    { id: 'shipped', label: 'Shipped', icon: Truck },
    { id: 'in_transit', label: 'In Transit', icon: MapPin },
    { id: 'delivered', label: 'Delivered', icon: CheckCircle },
  ]

  const currentStepIndex = statusSteps.findIndex(s => s.id === order.status)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-surface-900">{order.orderNumber}</h1>
            <span className={`clinical-badge ${
              order.status === 'delivered' ? 'bg-medical-green/10 text-medical-green' :
              order.status === 'shipped' || order.status === 'in_transit' ? 'bg-clinical-100 text-clinical-700' :
              order.status === 'pending' ? 'bg-medical-amber/10 text-medical-amber' :
              'bg-surface-200 text-surface-600'
            }`}>
              {order.status.replace('_', ' ').toUpperCase()}
            </span>
          </div>
          <p className="text-surface-600">
            PO: {order.poNumber} • Ordered {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="clinical-button-secondary">
            <FileText className="w-4 h-4 mr-2" />
            Download Invoice
          </button>
        </div>
      </div>

      {/* Progress Tracker */}
      <div className="clinical-card p-6">
        <div className="flex items-center justify-between">
          {statusSteps.map((step, idx) => {
            const Icon = step.icon
            const isCompleted = idx <= currentStepIndex
            const isCurrent = idx === currentStepIndex

            return (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isCompleted ? 'bg-medical-green' :
                    isCurrent ? 'bg-clinical-500' :
                    'bg-surface-200'
                  }`}>
                    <Icon className={`w-5 h-5 ${
                      isCompleted || isCurrent ? 'text-white' : 'text-surface-500'
                    }`} />
                  </div>
                  <span className={`text-xs mt-2 ${
                    isCompleted ? 'text-medical-green' :
                    isCurrent ? 'text-clinical-600' :
                    'text-surface-500'
                  }`}>
                    {step.label}
                  </span>
                </div>
                {idx < statusSteps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 ${
                    idx < currentStepIndex ? 'bg-medical-green' : 'bg-surface-200'
                  }`} />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="clinical-card">
            <div className="p-4 border-b border-surface-200">
              <h3 className="font-semibold text-surface-900">Order Items</h3>
            </div>
            <div className="divide-y divide-surface-200">
              {order.items.map((item: any, idx: number) => (
                <div key={idx} className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-surface-900">{item.description}</p>
                      <p className="text-sm text-surface-500 mt-1">
                        Qty: {item.quantity} × ${item.unitPrice.toFixed(2)}
                      </p>
                      {item.lotNumber && (
                        <p className="text-xs text-surface-500 mt-1">
                          Lot: {item.lotNumber}
                        </p>
                      )}
                      {item.expirationDate && (
                        <p className="text-xs text-surface-500">
                          Expires: {new Date(item.expirationDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-surface-900">${item.totalPrice.toFixed(2)}</p>
                      {item.udiNumbers && item.udiNumbers.length > 0 && (
                        <span className="clinical-badge bg-clinical-100 text-clinical-700 text-xs mt-1">
                          <Barcode className="w-3 h-3 mr-1" />
                          {item.udiNumbers.length} UDI tracked
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 bg-surface-50 border-t border-surface-200">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-surface-600">Subtotal</span>
                  <span className="text-surface-900">${order.totals.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-surface-600">Tax</span>
                  <span className="text-surface-900">${order.totals.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-surface-600">Shipping</span>
                  <span className="text-surface-900">${order.totals.shipping.toFixed(2)}</span>
                </div>
                {order.totals.discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-surface-600">Discount</span>
                    <span className="text-medical-green">-${order.totals.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-surface-200">
                  <span className="font-medium text-surface-900">Total</span>
                  <span className="font-bold text-surface-900">${order.totals.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tracking Events */}
          {tracking?.events && (
            <div className="clinical-card">
              <div className="p-4 border-b border-surface-200">
                <h3 className="font-semibold text-surface-900 flex items-center gap-2">
                  <Truck className="w-5 h-5 text-clinical-500" />
                  Tracking History
                </h3>
              </div>
              <div className="p-4">
                <div className="space-y-4">
                  {tracking.events.map((event: any, idx: number) => (
                    <div key={idx} className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-clinical-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Clock className="w-4 h-4 text-clinical-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-surface-900">{event.status}</p>
                        <p className="text-sm text-surface-600">{event.description}</p>
                        <div className="flex items-center gap-4 mt-1 text-xs text-surface-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(event.timestamp).toLocaleString()}
                          </span>
                          {event.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {event.location}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* UDI Tracking */}
          {order.udiTracking && order.udiTracking.length > 0 && (
            <div className="clinical-card">
              <div className="p-4 border-b border-surface-200">
                <h3 className="font-semibold text-surface-900 flex items-center gap-2">
                  <Barcode className="w-5 h-5 text-clinical-500" />
                  UDI Tracking
                </h3>
              </div>
              <div className="p-4">
                <div className="space-y-4">
                  {order.udiTracking.map((udi: any, idx: number) => (
                    <div key={idx} className="p-4 border border-surface-200 rounded-clinical">
                      <UDIDisplay udi={udi.udi} size="sm" />
                      <div className="mt-3 pt-3 border-t border-surface-200">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-surface-600">Status</span>
                          <span className={`clinical-badge ${
                            udi.status === 'received' ? 'bg-medical-green/10 text-medical-green' :
                            udi.status === 'in_transit' ? 'bg-clinical-100 text-clinical-700' :
                            'bg-surface-200 text-surface-600'
                          }`}>
                            {udi.status.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Shipping Info */}
          <div className="clinical-card p-6">
            <h3 className="font-semibold text-surface-900 mb-4">Shipping Information</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-surface-500">Carrier</p>
                <p className="font-medium text-surface-900">{order.shipping.carrier || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-surface-500">Tracking Number</p>
                <p className="font-mono text-sm text-surface-900">{order.shipping.trackingNumber || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-surface-500">Estimated Delivery</p>
                <p className="font-medium text-surface-900">
                  {order.shipping.estimatedDelivery
                    ? new Date(order.shipping.estimatedDelivery).toLocaleDateString()
                    : 'TBD'}
                </p>
              </div>
              {order.shipping.coldChain && (
                <div className="flex items-center gap-2 p-2 bg-clinical-50 rounded-clinical">
                  <Snowflake className="w-4 h-4 text-clinical-500" />
                  <span className="text-sm text-clinical-700">Cold Chain Required</span>
                </div>
              )}
            </div>
          </div>

          {/* Compliance */}
          {compliance && (
            <div className="clinical-card p-6">
              <h3 className="font-semibold text-surface-900 mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-medical-green" />
                Compliance Status
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-surface-600">FDA Verified</span>
                  {compliance.fdaVerified ? (
                    <CheckCircle className="w-5 h-5 text-medical-green" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-medical-amber" />
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-surface-600">UDI Recorded</span>
                  {compliance.udiRecorded ? (
                    <CheckCircle className="w-5 h-5 text-medical-green" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-medical-amber" />
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-surface-600">Lot Tracked</span>
                  {compliance.lotTracked ? (
                    <CheckCircle className="w-5 h-5 text-medical-green" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-medical-amber" />
                  )}
                </div>
                {order.shipping.coldChain && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-surface-600">Temperature Maintained</span>
                    {compliance.temperatureMaintained ? (
                      <CheckCircle className="w-5 h-5 text-medical-green" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-medical-amber" />
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="clinical-card p-6">
            <h3 className="font-semibold text-surface-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full text-left p-3 rounded-clinical hover:bg-surface-50 transition-colors flex items-center gap-3">
                <FileText className="w-5 h-5 text-clinical-500" />
                <span className="text-sm text-surface-700">View Certificate of Analysis</span>
              </button>
              <button className="w-full text-left p-3 rounded-clinical hover:bg-surface-50 transition-colors flex items-center gap-3">
                <Barcode className="w-5 h-5 text-clinical-500" />
                <span className="text-sm text-surface-700">Print UDI Labels</span>
              </button>
              <button className="w-full text-left p-3 rounded-clinical hover:bg-surface-50 transition-colors flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-medical-amber" />
                <span className="text-sm text-surface-700">Report Issue</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
