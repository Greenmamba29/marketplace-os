import { CheckCircle, AlertTriangle, ShieldAlert } from 'lucide-react'
import { DeviceClass } from '../types'

interface FDAStatusBadgeProps {
  deviceClass: DeviceClass
  clearanceType?: string
  clearanceNumber?: string
  status?: 'active' | 'recalled' | 'discontinued'
  showDetails?: boolean
}

export function FDAStatusBadge({
  deviceClass,
  clearanceType,
  clearanceNumber,
  status = 'active',
  showDetails = false,
}: FDAStatusBadgeProps) {
  const getClassConfig = (cls: DeviceClass) => {
    switch (cls) {
      case 'I':
        return {
          icon: CheckCircle,
          className: 'fda-class-i',
          label: 'Class I',
          description: 'Low Risk',
        }
      case 'II':
        return {
          icon: AlertTriangle,
          className: 'fda-class-ii',
          label: 'Class II',
          description: 'Moderate Risk',
        }
      case 'III':
        return {
          icon: ShieldAlert,
          className: 'fda-class-iii',
          label: 'Class III',
          description: 'High Risk',
        }
    }
  }

  const config = getClassConfig(deviceClass)
  const Icon = config.icon

  if (status === 'recalled') {
    return (
      <div className="inline-flex flex-col">
        <span className="clinical-badge bg-medical-red/10 text-medical-red border border-medical-red/20">
          <ShieldAlert className="w-3.5 h-3.5 mr-1" />
          RECALLED
        </span>
        {showDetails && clearanceNumber && (
          <span className="text-xs text-medical-red mt-1">{clearanceNumber}</span>
        )}
      </div>
    )
  }

  if (status === 'discontinued') {
    return (
      <div className="inline-flex flex-col">
        <span className="clinical-badge bg-surface-200 text-surface-600">
          Discontinued
        </span>
        {showDetails && clearanceNumber && (
          <span className="text-xs text-surface-500 mt-1">{clearanceNumber}</span>
        )}
      </div>
    )
  }

  return (
    <div className="inline-flex flex-col">
      <span className={config.className}>
        <Icon className="w-3.5 h-3.5 mr-1" />
        {config.label}
      </span>
      {showDetails && (
        <div className="mt-1 text-xs text-surface-500 space-y-0.5">
          <p>{config.description}</p>
          {clearanceType && <p>{clearanceType}</p>}
          {clearanceNumber && <p className="font-mono">{clearanceNumber}</p>}
        </div>
      )}
    </div>
  )
}

interface RegulatorySummaryProps {
  fdaProductCode: string
  deviceClass: DeviceClass
  clearance: {
    type: string
    number: string
    clearedDate: string
    status: 'active' | 'recalled' | 'discontinued'
  }
  ceMarked?: boolean
  iso13485?: boolean
}

export function RegulatorySummary({
  fdaProductCode,
  deviceClass,
  clearance,
  ceMarked,
  iso13485,
}: RegulatorySummaryProps) {
  return (
    <div className="clinical-card p-4">
      <h4 className="text-sm font-semibold text-surface-900 mb-3">Regulatory Information</h4>
      
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <span className="text-sm text-surface-600">FDA Device Class</span>
          <FDAStatusBadge
            deviceClass={deviceClass}
            clearanceType={clearance.type}
            clearanceNumber={clearance.number}
            status={clearance.status}
          />
        </div>

        <div className="flex items-start justify-between">
          <span className="text-sm text-surface-600">FDA Product Code</span>
          <span className="text-sm font-mono text-surface-900">{fdaProductCode}</span>
        </div>

        <div className="flex items-start justify-between">
          <span className="text-sm text-surface-600">Clearance Date</span>
          <span className="text-sm text-surface-900">
            {new Date(clearance.clearedDate).toLocaleDateString()}
          </span>
        </div>

        {ceMarked !== undefined && (
          <div className="flex items-start justify-between">
            <span className="text-sm text-surface-600">CE Marked</span>
            <span className={`text-sm ${ceMarked ? 'text-medical-green' : 'text-surface-500'}`}>
              {ceMarked ? 'Yes' : 'No'}
            </span>
          </div>
        )}

        {iso13485 !== undefined && (
          <div className="flex items-start justify-between">
            <span className="text-sm text-surface-600">ISO 13485</span>
            <span className={`text-sm ${iso13485 ? 'text-medical-green' : 'text-surface-500'}`}>
              {iso13485 ? 'Certified' : 'Not Certified'}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
