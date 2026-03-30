import { useEffect, useState } from 'react'
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'

interface Toast {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  title: string
  message?: string
}

interface ToastStore {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
}

const useToastStore = (() => {
  let listeners: ((toasts: Toast[]) => void)[] = []
  let toasts: Toast[] = []

  const notify = () => {
    listeners.forEach(listener => listener([...toasts]))
  }

  return {
    subscribe: (listener: (toasts: Toast[]) => void) => {
      listeners.push(listener)
      listener([...toasts])
      return () => {
        listeners = listeners.filter(l => l !== listener)
      }
    },
    addToast: (toast: Omit<Toast, 'id'>) => {
      const id = Math.random().toString(36).substring(7)
      toasts = [...toasts, { ...toast, id }]
      notify()
      setTimeout(() => {
        toasts = toasts.filter(t => t.id !== id)
        notify()
      }, 5000)
    },
    removeToast: (id: string) => {
      toasts = toasts.filter(t => t.id !== id)
      notify()
    },
  }
})()

export const toast = {
  success: (title: string, message?: string) =>
    useToastStore.addToast({ type: 'success', title, message }),
  error: (title: string, message?: string) =>
    useToastStore.addToast({ type: 'error', title, message }),
  info: (title: string, message?: string) =>
    useToastStore.addToast({ type: 'info', title, message }),
  warning: (title: string, message?: string) =>
    useToastStore.addToast({ type: 'warning', title, message }),
}

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => {
    return useToastStore.subscribe(setToasts)
  }, [])

  const getIcon = (type: Toast['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-medical-green" />
      case 'error':
        return <AlertCircle className="w-5 h-5 text-medical-red" />
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-medical-amber" />
      case 'info':
        return <Info className="w-5 h-5 text-clinical-500" />
    }
  }

  const getStyles = (type: Toast['type']) => {
    switch (type) {
      case 'success':
        return 'border-medical-green/20 bg-medical-green/5'
      case 'error':
        return 'border-medical-red/20 bg-medical-red/5'
      case 'warning':
        return 'border-medical-amber/20 bg-medical-amber/5'
      case 'info':
        return 'border-clinical-500/20 bg-clinical-500/5'
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-start gap-3 p-4 rounded-clinical border shadow-clinical-lg min-w-[320px] max-w-md animate-in slide-in-from-right ${getStyles(toast.type)}`}
        >
          {getIcon(toast.type)}
          <div className="flex-1 min-w-0">
            <p className="font-medium text-surface-900">{toast.title}</p>
            {toast.message && (
              <p className="text-sm text-surface-600 mt-1">{toast.message}</p>
            )}
          </div>
          <button
            onClick={() => useToastStore.removeToast(toast.id)}
            className="text-surface-400 hover:text-surface-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
