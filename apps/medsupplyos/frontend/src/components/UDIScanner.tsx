import { useState, useRef, useCallback } from 'react'
import { ScanLine, X, Camera, Keyboard } from 'lucide-react'
import { toast } from './ui/Toaster'

interface UDIScannerProps {
  onScan: (udi: string) => void
  onClose: () => void
}

export function UDIScanner({ onScan, onClose }: UDIScannerProps) {
  const [mode, setMode] = useState<'camera' | 'manual'>('manual')
  const [manualInput, setManualInput] = useState('')
  const [isScanning, setIsScanning] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      setIsScanning(true)
    } catch (error) {
      toast.error('Camera access denied', 'Please allow camera access or use manual entry')
      setMode('manual')
    }
  }, [])

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    setIsScanning(false)
  }, [])

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (manualInput.trim()) {
      // Validate UDI format
      if (validateUDI(manualInput.trim())) {
        onScan(manualInput.trim())
      } else {
        toast.error('Invalid UDI', 'Please enter a valid UDI format')
      }
    }
  }

  const validateUDI = (udi: string): boolean => {
    // Basic UDI validation - should start with GS1, HIBCC, or ICCBBA prefix
    const validPrefixes = ['01', '+', '=']
    return udi.length >= 14 && validPrefixes.some(prefix => udi.startsWith(prefix) || udi.includes(prefix))
  }

  const handleModeChange = (newMode: 'camera' | 'manual') => {
    setMode(newMode)
    if (newMode === 'camera') {
      startCamera()
    } else {
      stopCamera()
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-white rounded-clinical max-w-md w-full overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-surface-200">
          <h3 className="text-lg font-semibold text-surface-900 flex items-center gap-2">
            <ScanLine className="w-5 h-5 text-clinical-500" />
            Scan UDI
          </h3>
          <button
            onClick={() => {
              stopCamera()
              onClose()
            }}
            className="text-surface-400 hover:text-surface-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4">
          {/* Mode toggle */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => handleModeChange('camera')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-clinical text-sm font-medium transition-colors ${
                mode === 'camera'
                  ? 'bg-clinical-500 text-white'
                  : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
              }`}
            >
              <Camera className="w-4 h-4" />
              Camera
            </button>
            <button
              onClick={() => handleModeChange('manual')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-clinical text-sm font-medium transition-colors ${
                mode === 'manual'
                  ? 'bg-clinical-500 text-white'
                  : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
              }`}
            >
              <Keyboard className="w-4 h-4" />
              Manual
            </button>
          </div>

          {mode === 'camera' ? (
            <div className="relative">
              <div className="udi-scanner-frame mx-auto">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                <div className="udi-scan-line" />
                <div className="absolute inset-0 border-2 border-clinical-400/30 rounded-lg" />
              </div>
              <p className="text-center text-sm text-surface-500 mt-4">
                Position the UDI barcode within the frame
              </p>
            </div>
          ) : (
            <form onSubmit={handleManualSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1">
                    Enter UDI
                  </label>
                  <input
                    type="text"
                    value={manualInput}
                    onChange={(e) => setManualInput(e.target.value)}
                    placeholder="(01)12345678901234(11)250101..."
                    className="clinical-input font-mono text-sm"
                    autoFocus
                  />
                  <p className="text-xs text-surface-500 mt-1">
                    Enter the full UDI string including all data elements
                  </p>
                </div>
                <button
                  type="submit"
                  disabled={!manualInput.trim()}
                  className="clinical-button w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ScanLine className="w-4 h-4 mr-2" />
                  Scan UDI
                </button>
              </div>
            </form>
          )}

          <div className="mt-4 p-3 bg-surface-50 rounded-clinical">
            <p className="text-xs text-surface-600">
              <strong>UDI Format:</strong> UDIs typically start with (01) for the Device 
              Identifier, followed by production identifiers like lot number (10), 
              expiration date (17), or serial number (21).
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

interface UDIDisplayProps {
  udi: string
  showBarcode?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function UDIDisplay({ udi, showBarcode = true, size = 'md' }: UDIDisplayProps) {
  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  }

  // Parse UDI components
  const parseUDI = (udi: string) => {
    const components: { code: string; value: string; label: string }[] = []
    
    // GS1-128 format parsing
    const diMatch = udi.match(/\(01\)(\d+)/)
    if (diMatch) {
      components.push({ code: '01', value: diMatch[1], label: 'Device Identifier (DI)' })
    }
    
    const lotMatch = udi.match(/\(10\)([^)]+)/)
    if (lotMatch) {
      components.push({ code: '10', value: lotMatch[1], label: 'Lot/Batch Number' })
    }
    
    const expMatch = udi.match(/\(17\)(\d{6})/)
    if (expMatch) {
      const year = expMatch[1].substring(0, 2)
      const month = expMatch[1].substring(2, 4)
      const day = expMatch[1].substring(4, 6)
      components.push({ code: '17', value: `20${year}-${month}-${day}`, label: 'Expiration Date' })
    }
    
    const serialMatch = udi.match(/\(21\)([^)]+)/)
    if (serialMatch) {
      components.push({ code: '21', value: serialMatch[1], label: 'Serial Number' })
    }
    
    return components
  }

  const components = parseUDI(udi)

  return (
    <div className={`${sizeClasses[size]} space-y-2`}>
      <div className="font-mono text-surface-900 break-all bg-surface-50 p-2 rounded">
        {udi}
      </div>
      
      {components.length > 0 && (
        <div className="space-y-1">
          {components.map((comp, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs">
              <span className="clinical-badge bg-clinical-100 text-clinical-700">
                ({comp.code})
              </span>
              <span className="text-surface-600">{comp.label}:</span>
              <span className="font-mono text-surface-900">{comp.value}</span>
            </div>
          ))}
        </div>
      )}
      
      {showBarcode && (
        <div className="mt-3 p-3 bg-white border border-surface-200 rounded-clinical">
          <svg className="w-full h-12" viewBox="0 0 200 50">
            {/* Simplified barcode representation */}
            {Array.from({ length: 50 }).map((_, i) => (
              <rect
                key={i}
                x={i * 4}
                y={0}
                width={Math.random() > 0.5 ? 2 : 1}
                height={40}
                fill="#000"
              />
            ))}
          </svg>
          <p className="text-center text-xs text-surface-500 mt-1 font-mono">
            *{udi.substring(0, 20)}...*
          </p>
        </div>
      )}
    </div>
  )
}
