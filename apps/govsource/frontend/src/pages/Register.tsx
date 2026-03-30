import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Building2, Eye, EyeOff, Lock, Mail, User, Briefcase } from 'lucide-react'
import { useAuthStore } from '@/hooks/useAuth'
import toast from 'react-hot-toast'
import type { UserRole } from '@/types'

export function Register() {
  const navigate = useNavigate()
  const { register } = useAuthStore()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    role: 'BUYER' as UserRole,
    companyName: '',
    cageCode: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    setIsLoading(true)

    try {
      await register({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        role: formData.role,
        companyName: formData.role === 'VENDOR' ? formData.companyName : undefined,
        cageCode: formData.role === 'VENDOR' ? formData.cageCode : undefined,
      })
      toast.success('Account created successfully!')
      navigate('/')
    } catch (error) {
      // Error handled by auth store
    } finally {
      setIsLoading(false)
    }
  }

  const nextStep = () => {
    if (step === 1 && (!formData.email || !formData.password || !formData.confirmPassword)) {
      toast.error('Please fill in all fields')
      return
    }
    if (step === 2 && (!formData.firstName || !formData.lastName)) {
      toast.error('Please fill in all fields')
      return
    }
    setStep(step + 1)
  }

  const prevStep = () => setStep(step - 1)

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <Building2 className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">GovSource</span>
          </Link>
          <p className="text-slate-400 mt-2">Create your account</p>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`w-8 h-1 rounded-full transition-colors ${
                s <= step ? 'bg-blue-600' : 'bg-slate-700'
              }`}
            />
          ))}
        </div>

        {/* Registration Form */}
        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 && (
              <>
                <div>
                  <label className="form-label">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="form-input pl-10"
                      placeholder="you@agency.gov"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="form-input pl-10 pr-10"
                      placeholder="Create a password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="form-label">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="form-input pl-10"
                      placeholder="Confirm your password"
                      required
                    />
                  </div>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">First Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="form-input pl-10"
                        placeholder="First name"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="form-label">Last Name</label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="form-input"
                      placeholder="Last name"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label">Account Type</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, role: 'BUYER' })}
                      className={`p-4 rounded-lg border text-left transition-colors ${
                        formData.role === 'BUYER'
                          ? 'border-blue-500 bg-blue-500/10'
                          : 'border-slate-700 hover:border-slate-600'
                      }`}
                    >
                      <Briefcase className="w-6 h-6 text-blue-400 mb-2" />
                      <p className="text-white font-medium">Government Buyer</p>
                      <p className="text-sm text-slate-400">Post RFPs and manage procurement</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, role: 'VENDOR' })}
                      className={`p-4 rounded-lg border text-left transition-colors ${
                        formData.role === 'VENDOR'
                          ? 'border-blue-500 bg-blue-500/10'
                          : 'border-slate-700 hover:border-slate-600'
                      }`}
                    >
                      <Building2 className="w-6 h-6 text-emerald-400 mb-2" />
                      <p className="text-white font-medium">Vendor</p>
                      <p className="text-sm text-slate-400">Bid on government contracts</p>
                    </button>
                  </div>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                {formData.role === 'VENDOR' ? (
                  <>
                    <div>
                      <label className="form-label">Company Name</label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                        <input
                          type="text"
                          value={formData.companyName}
                          onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                          className="form-input pl-10"
                          placeholder="Your company name"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="form-label">CAGE Code</label>
                      <input
                        type="text"
                        value={formData.cageCode}
                        onChange={(e) => setFormData({ ...formData, cageCode: e.target.value.toUpperCase() })}
                        className="form-input font-mono"
                        placeholder="XXXXX"
                        maxLength={5}
                      />
                      <p className="text-sm text-slate-500 mt-1">
                        Your Commercial and Government Entity code from SAM.gov
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Briefcase className="w-8 h-8 text-blue-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Ready to create your account
                    </h3>
                    <p className="text-slate-400">
                      Click the button below to complete your registration as a government buyer.
                    </p>
                  </div>
                )}
              </>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-4">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  className="btn btn-outline"
                >
                  Back
                </button>
              ) : (
                <div />
              )}

              {step < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="btn btn-primary"
                >
                  Continue
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn btn-primary"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      Creating...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </button>
              )}
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-700 text-center">
            <p className="text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-400 hover:text-blue-300">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
