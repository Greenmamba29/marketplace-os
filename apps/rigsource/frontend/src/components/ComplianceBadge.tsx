import { Shield, AlertTriangle, CheckCircle, XCircle, Info } from 'lucide-react';
import type { ComplianceRecord } from '@/types';

interface ComplianceBadgeProps {
  type: 'reach' | 'tsca' | 'epa' | 'overall';
  status: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const statusConfig: Record<string, { icon: typeof CheckCircle; color: string; label: string }> = {
  // REACH statuses
  registered: { icon: CheckCircle, color: 'text-accent-success', label: 'REACH Registered' },
  pre_registered: { icon: Info, color: 'text-accent-info', label: 'REACH Pre-registered' },
  exempt: { icon: CheckCircle, color: 'text-accent-success', label: 'REACH Exempt' },
  not_required: { icon: Info, color: 'text-surface-400', label: 'REACH N/A' },
  pending: { icon: AlertTriangle, color: 'text-accent-warning', label: 'REACH Pending' },
  
  // TSCA statuses
  listed: { icon: CheckCircle, color: 'text-accent-success', label: 'TSCA Listed' },
  snur: { icon: AlertTriangle, color: 'text-accent-warning', label: 'TSCA SNUR' },
  pmn: { icon: Info, color: 'text-accent-info', label: 'TSCA PMN' },
  not_listed: { icon: XCircle, color: 'text-accent-error', label: 'TSCA Not Listed' },
  
  // EPA statuses
  approved: { icon: CheckCircle, color: 'text-accent-success', label: 'EPA Approved' },
  restricted: { icon: AlertTriangle, color: 'text-accent-warning', label: 'EPA Restricted' },
  banned: { icon: XCircle, color: 'text-accent-error', label: 'EPA Banned' },
  under_review: { icon: Info, color: 'text-accent-info', label: 'EPA Review' },
  
  // Overall
  compliant: { icon: CheckCircle, color: 'text-accent-success', label: 'Compliant' },
  warning: { icon: AlertTriangle, color: 'text-accent-warning', label: 'Warning' },
  non_compliant: { icon: XCircle, color: 'text-accent-error', label: 'Non-Compliant' },
};

export default function ComplianceBadge({ 
  type, 
  status, 
  showLabel = true, 
  size = 'md',
  className = '' 
}: ComplianceBadgeProps) {
  const config = statusConfig[status] || { icon: Info, color: 'text-surface-400', label: status };
  const Icon = config.icon;
  
  const sizeClasses = {
    sm: 'text-xs gap-1 px-2 py-0.5',
    md: 'text-sm gap-1.5 px-3 py-1',
    lg: 'text-base gap-2 px-4 py-2',
  };
  
  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <span 
      className={`inline-flex items-center rounded-full border border-current/30 bg-current/10 ${config.color} ${sizeClasses[size]} ${className}`}
    >
      <Icon className={iconSizes[size]} />
      {showLabel && <span>{config.label}</span>}
    </span>
  );
}

// Full compliance display for a chemical
interface ComplianceDisplayProps {
  compliance: ComplianceRecord | null | undefined;
  showDetails?: boolean;
  className?: string;
}

export function ComplianceDisplay({ compliance, showDetails = false, className = '' }: ComplianceDisplayProps) {
  if (!compliance) {
    return (
      <div className={`p-4 bg-surface-50 border border-surface-200 rounded-lg ${className}`}>
        <div className="flex items-center gap-3 text-surface-400">
          <Shield className="w-5 h-5" />
          <span>No compliance data available</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex flex-wrap gap-2">
        <ComplianceBadge type="reach" status={compliance.reach_status} />
        <ComplianceBadge type="tsca" status={compliance.tsca_status} />
        <ComplianceBadge type="epa" status={compliance.epa_status} />
      </div>
      
      {showDetails && (
        <div className="mt-4 space-y-4">
          {compliance.reach_registration_number && (
            <div className="text-sm">
              <span className="text-surface-400">REACH Registration:</span>{' '}
              <span className="font-mono text-white">{compliance.reach_registration_number}</span>
            </div>
          )}
          
          {compliance.ghs_classification.length > 0 && (
            <div>
              <span className="text-sm text-surface-400">GHS Classification:</span>
              <div className="mt-2 flex flex-wrap gap-1">
                {compliance.ghs_classification.map((cls, i) => (
                  <span 
                    key={i} 
                    className="px-2 py-1 bg-accent-warning/10 text-accent-warning text-xs rounded border border-accent-warning/30"
                  >
                    {cls}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {compliance.hazard_codes.length > 0 && (
            <div>
              <span className="text-sm text-surface-400">Hazard Codes:</span>
              <div className="mt-2 flex flex-wrap gap-1">
                {compliance.hazard_codes.map((code, i) => (
                  <span 
                    key={i} 
                    className="px-2 py-1 bg-accent-error/10 text-accent-error text-xs rounded border border-accent-error/30 font-mono"
                  >
                    {code}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          <div className="text-xs text-surface-400 pt-2 border-t border-surface-200">
            Last updated: {new Date(compliance.last_updated).toLocaleDateString()}
            {compliance.next_review_date && (
              <span className="ml-4">
                Next review: {new Date(compliance.next_review_date).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
