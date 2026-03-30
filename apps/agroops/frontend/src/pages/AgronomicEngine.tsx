import { useState } from 'react'
import { 
  Sprout, 
  CloudSun, 
  Thermometer, 
  Droplets, 
  Calendar,
  MapPin,
  ArrowRight,
  Check,
  AlertTriangle,
  Info,
  Loader2
} from 'lucide-react'
import { Navbar, Footer, LoadingSpinner } from '@/components'
import { useCrops, useRecommendations, useWeatherForecast } from '@/hooks'
import { formatDate, addDays } from '@/lib/utils'

const soilTypes = [
  { value: 'clay', label: 'Clay', description: 'Heavy, slow-draining soil' },
  { value: 'sandy', label: 'Sandy', description: 'Light, fast-draining soil' },
  { value: 'loam', label: 'Loam', description: 'Balanced, ideal for most crops' },
  { value: 'silt', label: 'Silt', description: 'Fine, fertile soil' },
  { value: 'peat', label: 'Peat', description: 'Organic, moisture-retentive' },
]

const growthStages: Record<string, string[]> = {
  corn: ['Pre-Plant', 'VE-V3', 'V4-V6', 'V7-V10', 'V11-VT', 'R1-R2', 'R3-R4', 'R5-R6'],
  soybean: ['Pre-Plant', 'VE-VC', 'V1-V3', 'V4-V6', 'R1-R2', 'R3-R4', 'R5-R6', 'R7-R8'],
  wheat: ['Pre-Plant', 'GS10-GS21', 'GS30-GS32', 'GS37-GS39', 'GS45-GS55', 'GS60-GS69', 'GS70-GS89'],
  cotton: ['Pre-Plant', 'Cotyledon', 'First Square', 'First Flower', 'Peak Bloom', 'First Open Boll', 'Defoliation'],
}

export default function AgronomicEngine() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    crop_id: '',
    soil_type: '',
    growth_stage: '',
    planting_date: '',
    acres: '',
    state: '',
    zip_code: '',
  })
  
  const { data: crops, isLoading: cropsLoading } = useCrops()
  const recommendations = useRecommendations()
  
  // Mock weather data for demo
  const { data: weatherData } = useWeatherForecast(41.5868, -93.6250, 7)
  
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }
  
  const handleSubmit = async () => {
    await recommendations.mutateAsync({
      crop_id: formData.crop_id,
      soil_type: formData.soil_type || undefined,
      growth_stage: formData.growth_stage || undefined,
      planting_date: formData.planting_date || undefined,
      acres: formData.acres ? parseInt(formData.acres) : undefined,
      state: formData.state,
    })
    setStep(4)
  }
  
  const selectedCrop = crops?.find((c: any) => c.id === formData.crop_id)
  const availableStages = selectedCrop ? growthStages[selectedCrop.name.toLowerCase()] || [] : []
  
  const isStepValid = () => {
    switch (step) {
      case 1: return formData.crop_id && formData.state
      case 2: return formData.growth_stage
      case 3: return true
      default: return false
    }
  }

  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />
      
      {/* Header */}
      <div className="bg-gradient-to-br from-field-gold/10 to-crop-green/5 border-b border-0.5 border-dark-600/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-field-gold/20 rounded-xl flex items-center justify-center">
              <Sprout className="w-6 h-6 text-field-gold" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold text-white">
                Agronomic Recommendation Engine
              </h1>
              <p className="text-gray-400">
                Get AI-powered input recommendations based on your crop, soil, and local conditions
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-12">
          {[1, 2, 3, 4].map((s, index) => (
            <div key={s} className="flex items-center">
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm
                ${step >= s 
                  ? 'bg-field-gold text-white' 
                  : 'bg-dark-700 text-gray-500'}
              `}>
                {step > s ? <Check className="w-5 h-5" /> : s}
              </div>
              {index < 3 && (
                <div className={`
                  w-16 sm:w-24 h-0.5 mx-2
                  ${step > s ? 'bg-field-gold' : 'bg-dark-700'}
                `} />
              )}
            </div>
          ))}
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <div className="card p-6">
              {/* Step 1: Crop & Location */}
              {step === 1 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-white mb-6">Select Your Crop & Location</h2>
                  
                  <div>
                    <label className="form-label">Select Crop *</label>
                    {cropsLoading ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      <div className="grid sm:grid-cols-2 gap-3">
                        {crops?.map((crop: any) => (
                          <button
                            key={crop.id}
                            onClick={() => handleInputChange('crop_id', crop.id)}
                            className={`
                              p-4 rounded-xl border text-left transition-all
                              ${formData.crop_id === crop.id
                                ? 'bg-field-gold/10 border-field-gold text-white'
                                : 'bg-dark-800 border-dark-600/50 text-gray-400 hover:border-dark-600'}
                            `}
                          >
                            <div className="flex items-center gap-3">
                              <Sprout className={`w-5 h-5 ${formData.crop_id === crop.id ? 'text-field-gold' : 'text-gray-500'}`} />
                              <span className="font-medium">{crop.name}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="form-label">State *</label>
                      <select
                        value={formData.state}
                        onChange={(e) => handleInputChange('state', e.target.value)}
                        className="input-field"
                      >
                        <option value="">Select State</option>
                        {['IA', 'IL', 'IN', 'NE', 'KS', 'MN', 'MO', 'OH', 'SD', 'ND', 'TX', 'CA'].map(state => (
                          <option key={state} value={state}>{state}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="form-label">ZIP Code</label>
                      <input
                        type="text"
                        value={formData.zip_code}
                        onChange={(e) => handleInputChange('zip_code', e.target.value)}
                        placeholder="50001"
                        className="input-field"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="form-label">Soil Type (Optional)</label>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {soilTypes.map((soil) => (
                        <button
                          key={soil.value}
                          onClick={() => handleInputChange('soil_type', soil.value)}
                          className={`
                            p-3 rounded-lg border text-left transition-all
                            ${formData.soil_type === soil.value
                              ? 'bg-field-gold/10 border-field-gold'
                              : 'bg-dark-800 border-dark-600/50 hover:border-dark-600'}
                          `}
                        >
                          <span className={`font-medium ${formData.soil_type === soil.value ? 'text-field-gold' : 'text-gray-300'}`}>
                            {soil.label}
                          </span>
                          <p className="text-xs text-gray-500 mt-1">{soil.description}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              {/* Step 2: Growth Stage */}
              {step === 2 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-white mb-6">Current Growth Stage</h2>
                  
                  <div>
                    <label className="form-label">Select Growth Stage *</label>
                    <div className="space-y-2">
                      {availableStages.map((stage) => (
                        <button
                          key={stage}
                          onClick={() => handleInputChange('growth_stage', stage)}
                          className={`
                            w-full p-4 rounded-xl border text-left transition-all flex items-center justify-between
                            ${formData.growth_stage === stage
                              ? 'bg-field-gold/10 border-field-gold'
                              : 'bg-dark-800 border-dark-600/50 hover:border-dark-600'}
                          `}
                        >
                          <span className={`font-medium ${formData.growth_stage === stage ? 'text-field-gold' : 'text-gray-300'}`}>
                            {stage}
                          </span>
                          {formData.growth_stage === stage && <Check className="w-5 h-5 text-field-gold" />}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="form-label">Planting Date (Optional)</label>
                      <input
                        type="date"
                        value={formData.planting_date}
                        onChange={(e) => handleInputChange('planting_date', e.target.value)}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="form-label">Total Acres (Optional)</label>
                      <input
                        type="number"
                        value={formData.acres}
                        onChange={(e) => handleInputChange('acres', e.target.value)}
                        placeholder="e.g., 500"
                        className="input-field"
                      />
                    </div>
                  </div>
                </div>
              )}
              
              {/* Step 3: Review */}
              {step === 3 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-white mb-6">Review Your Information</h2>
                  
                  <div className="bg-dark-800 rounded-xl p-6 space-y-4">
                    <div className="flex justify-between py-2 border-b border-dark-600/30">
                      <span className="text-gray-500">Crop</span>
                      <span className="text-white font-medium">{selectedCrop?.name}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-dark-600/30">
                      <span className="text-gray-500">State</span>
                      <span className="text-white font-medium">{formData.state}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-dark-600/30">
                      <span className="text-gray-500">Growth Stage</span>
                      <span className="text-white font-medium">{formData.growth_stage}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-dark-600/30">
                      <span className="text-gray-500">Soil Type</span>
                      <span className="text-white font-medium">
                        {soilTypes.find(s => s.value === formData.soil_type)?.label || 'Not specified'}
                      </span>
                    </div>
                    {formData.planting_date && (
                      <div className="flex justify-between py-2 border-b border-dark-600/30">
                        <span className="text-gray-500">Planting Date</span>
                        <span className="text-white font-medium">{formatDate(formData.planting_date)}</span>
                      </div>
                    )}
                    {formData.acres && (
                      <div className="flex justify-between py-2">
                        <span className="text-gray-500">Total Acres</span>
                        <span className="text-white font-medium">{formData.acres} acres</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="bg-field-gold/10 border border-field-gold/30 rounded-xl p-4 flex items-start gap-3">
                    <Info className="w-5 h-5 text-field-gold flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-300">
                      Our AI will analyze your crop, growth stage, soil conditions, and local weather 
                      to provide personalized input recommendations with optimal timing windows.
                    </p>
                  </div>
                </div>
              )}
              
              {/* Step 4: Results */}
              {step === 4 && (
                <div className="space-y-6">
                  {recommendations.isPending ? (
                    <div className="text-center py-12">
                      <Loader2 className="w-12 h-12 text-field-gold animate-spin mx-auto mb-4" />
                      <p className="text-gray-400">Generating recommendations...</p>
                    </div>
                  ) : recommendations.data ? (
                    <>
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-white">
                          Recommended Inputs for {selectedCrop?.name}
                        </h2>
                        <button 
                          onClick={() => setStep(1)}
                          className="text-sm text-field-gold hover:underline"
                        >
                          Start Over
                        </button>
                      </div>
                      
                      <div className="space-y-4">
                        {recommendations.data.recommendations?.map((rec: any, index: number) => (
                          <div key={index} className="card p-4 hover:border-field-gold/30 transition-all">
                            <div className="flex items-start gap-4">
                              <div className={`
                                w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0
                                ${rec.priority === 'critical' ? 'bg-red-500/20 text-red-400' :
                                  rec.priority === 'high' ? 'bg-orange-500/20 text-orange-400' :
                                  rec.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                  'bg-green-500/20 text-green-400'}
                              `}>
                                <AlertTriangle className="w-5 h-5" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-start justify-between mb-2">
                                  <div>
                                    <h3 className="font-semibold text-white">{rec.input_name}</h3>
                                    <p className="text-sm text-gray-400">{rec.category}</p>
                                  </div>
                                  <span className={`
                                    px-2 py-1 text-xs rounded-full
                                    ${rec.priority === 'critical' ? 'bg-red-500/20 text-red-400' :
                                      rec.priority === 'high' ? 'bg-orange-500/20 text-orange-400' :
                                      rec.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                      'bg-green-500/20 text-green-400'}
                                  `}>
                                    {rec.priority}
                                  </span>
                                </div>
                                
                                <p className="text-sm text-gray-300 mb-3">{rec.reason}</p>
                                
                                <div className="grid sm:grid-cols-3 gap-4 text-sm">
                                  <div>
                                    <span className="text-gray-500">Suggested Rate:</span>
                                    <p className="text-white">{rec.suggested_rate}</p>
                                  </div>
                                  <div>
                                    <span className="text-gray-500">Est. Cost/Acre:</span>
                                    <p className="text-white">${rec.estimated_cost_per_acre?.toFixed(2)}</p>
                                  </div>
                                  <div>
                                    <span className="text-gray-500">Timing Window:</span>
                                    <p className="text-white">
                                      {formatDate(rec.timing_window.start_date)} - {formatDate(rec.timing_window.end_date)}
                                    </p>
                                  </div>
                                </div>
                                
                                <div className="flex gap-2 mt-4">
                                  <button className="btn-primary text-sm py-2">
                                    Add to RFQ
                                  </button>
                                  <button className="btn-secondary text-sm py-2">
                                    View Product
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-gray-400">No recommendations available</p>
                    </div>
                  )}
                </div>
              )}
              
              {/* Navigation Buttons */}
              {step < 4 && (
                <div className="flex justify-between mt-8 pt-6 border-t border-dark-600/30">
                  <button
                    onClick={() => setStep(Math.max(1, step - 1))}
                    disabled={step === 1}
                    className="btn-secondary disabled:opacity-50"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => step === 3 ? handleSubmit() : setStep(step + 1)}
                    disabled={!isStepValid() || recommendations.isPending}
                    className="btn-primary"
                  >
                    {step === 3 ? (
                      recommendations.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          Generating...
                        </>
                      ) : (
                        <>Generate Recommendations <ArrowRight className="w-4 h-4 ml-2" /></>
                      )
                    ) : (
                      <>Next <ArrowRight className="w-4 h-4 ml-2" /></>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Weather Widget */}
            <div className="card p-6">
              <div className="flex items-center gap-2 mb-4">
                <CloudSun className="w-5 h-5 text-field-gold" />
                <h3 className="font-semibold text-white">Weather Forecast</h3>
              </div>
              
              {weatherData ? (
                <div className="space-y-3">
                  {weatherData.forecast_days?.slice(0, 5).map((day: any, index: number) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b border-dark-600/20 last:border-0">
                      <span className="text-sm text-gray-400">
                        {index === 0 ? 'Today' : new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                      </span>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-white">{day.temp_high}° / {day.temp_low}°</span>
                        <span className="text-xs text-gray-500">{day.precipitation_chance}% rain</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-500">Enter location to see forecast</p>
                </div>
              )}
            </div>
            
            {/* Growing Degree Days */}
            {formData.planting_date && selectedCrop && (
              <div className="card p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Thermometer className="w-5 h-5 text-field-gold" />
                  <h3 className="font-semibold text-white">Growing Degree Days</h3>
                </div>
                <div className="text-center py-4">
                  <p className="text-4xl font-display font-bold text-field-gold">1,247</p>
                  <p className="text-sm text-gray-500 mt-1">GDD Accumulated (Base 50°F)</p>
                  <div className="mt-4 bg-dark-700 rounded-full h-2 overflow-hidden">
                    <div className="bg-field-gold h-full rounded-full" style={{ width: '65%' }} />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Target: 2,400 GDD for {selectedCrop.name}</p>
                </div>
              </div>
            )}
            
            {/* Tips */}
            <div className="card p-6">
              <div className="flex items-center gap-2 mb-4">
                <Info className="w-5 h-5 text-field-gold" />
                <h3 className="font-semibold text-white">Agronomic Tips</h3>
              </div>
              <ul className="space-y-3 text-sm text-gray-400">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-crop-green flex-shrink-0 mt-0.5" />
                  Apply nitrogen before predicted rainfall for better uptake
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-crop-green flex-shrink-0 mt-0.5" />
                  Scout fields weekly during critical growth stages
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-crop-green flex-shrink-0 mt-0.5" />
                  Consider split applications for improved efficiency
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
