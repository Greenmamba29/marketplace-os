import { cn } from '@/lib/utils';
import { AlertTriangle, Info, CheckCircle, XCircle, X } from 'lucide-react';

interface AlertProps {
  children: React.ReactNode;
  variant?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  onClose?: () => void;
  className?: string;
}

const variantConfig = {
  info: {
    icon: Info,
    classes: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
    iconClasses: 'text-blue-500',
  },
  success: {
    icon: CheckCircle,
    classes: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
    iconClasses: 'text-emerald-500',
  },
  warning: {
    icon: AlertTriangle,
    classes: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
    iconClasses: 'text-amber-500',
  },
  error: {
    icon: XCircle,
    classes: 'bg-red-500/10 border-red-500/20 text-red-400',
    iconClasses: 'text-red-500',
  },
};

export default function Alert({
  children,
  variant = 'info',
  title,
  onClose,
  className,
}: AlertProps) {
  const config = variantConfig[variant];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        'flex gap-3 p-4 rounded-lg border',
        config.classes,
        className
      )}
      role="alert"
    >
      <Icon className={cn('w-5 h-5 flex-shrink-0 mt-0.5', config.iconClasses)} />
      <div className="flex-1">
        {title && <h4 className="font-semibold mb-1">{title}</h4>}
        <div className="text-sm opacity-90">{children}</div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
