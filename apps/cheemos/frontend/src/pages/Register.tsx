import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Beaker, Eye, EyeOff, Loader2, Building2, User, FlaskConical } from 'lucide-react';
import { useAuth } from '@/hooks';
import toast from 'react-hot-toast';

export default function Register() {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    company_name: '',
    role: 'buyer' as 'buyer' | 'supplier',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    
    try {
      await register({
        email: formData.email,
        password: formData.password,
        first_name: formData.first_name,
        last_name: formData.last_name,
        company_name: formData.company_name,
        role: formData.role,
      });
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
    }
  };

  const canProceed = step === 1 
    ? formData.first_name && formData.last_name && formData.email
    : formData.company_name && formData.password && formData.confirmPassword;

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Beaker className="w-6 h-6 text-white" />
            </div>
            <span className="font-display font-bold text-2xl text-white">ChemOS</span>
          </Link>
        </div>
        
        {/* Form card */}
        <div className="bg-surface-50 border border-surface-200 rounded-2xl p-8">
          <h1 className="text-2xl font-display font-bold text-white text-center mb-2">
            Create your account
          </h1>
          <p className="text-surface-400 text-center mb-8">
            Join the global specialty chemicals marketplace
          </p>
          
          {/* Step indicator */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step >= 1 ? 'bg-primary text-white' : 'bg-surface-100 text-surface-400'
            }`}>
              1
            </div>
            <div className={`w-16 h-0.5 ${step >= 2 ? 'bg-primary' : 'bg-surface-200'}`} />
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step >= 2 ? 'bg-primary text-white' : 'bg-surface-100 text-surface-400'
            }`}>
              2
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-surface-400 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                      placeholder="John"
                      className="w-full px-4 py-3 bg-surface border border-surface-200 rounded-lg text-white placeholder-surface-400 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-surface-400 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                      placeholder="Doe"
                      className="w-full px-4 py-3 bg-surface border border-surface-200 rounded-lg text-white placeholder-surface-400 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-surface-400 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@company.com"
                    className="w-full px-4 py-3 bg-surface border border-surface-200 rounded-lg text-white placeholder-surface-400 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-surface-400 mb-2">
                    I am a...
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <label className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                      formData.role === 'buyer' ? 'border-primary bg-primary/10' : 'border-surface-200'
                    }`}>
                      <input
                        type="radio"
                        name="role"
                        value="buyer"
                        checked={formData.role === 'buyer'}
                        onChange={handleChange}
                        className="hidden"
                      />
                      <Building2 className={`w-5 h-5 ${formData.role === 'buyer' ? 'text-primary' : 'text-surface-400'}`} />
                      <span className={formData.role === 'buyer' ? 'text-white' : 'text-surface-400'}>Buyer</span>
                    </label>
                    <label className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                      formData.role === 'supplier' ? 'border-primary bg-primary/10' : 'border-surface-200'
                    }`}>
                      <input
                        type="radio"
                        name="role"
                        value="supplier"
                        checked={formData.role === 'supplier'}
                        onChange={handleChange}
                        className="hidden"
                      />
                      <FlaskConical className={`w-5 h-5 ${formData.role === 'supplier' ? 'text-primary' : 'text-surface-400'}`} />
                      <span className={formData.role === 'supplier' ? 'text-white' : 'text-surface-400'}>Supplier</span>
                    </label>
                  </div>
                </div>
              </>
            )}
            
            {step === 2 && (
              <>
                <div>
                  <label className="block text-sm font-medium text-surface-400 mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleChange}
                    placeholder="Acme Chemicals Ltd"
                    className="w-full px-4 py-3 bg-surface border border-surface-200 rounded-lg text-white placeholder-surface-400 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-surface-400 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 bg-surface border border-surface-200 rounded-lg text-white placeholder-surface-400 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all pr-12"
                      required
                      minLength={8}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  <p className="text-xs text-surface-400 mt-1">Must be at least 8 characters</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-surface-400 mb-2">
                    Confirm Password
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 bg-surface border border-surface-200 rounded-lg text-white placeholder-surface-400 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    required
                  />
                </div>
              </>
            )}
            
            <div className="flex gap-4">
              {step === 2 && (
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 px-6 py-3 bg-surface-100 text-white font-medium rounded-lg hover:bg-surface-200 transition-colors"
                >
                  Back
                </button>
              )}
              {step === 1 ? (
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  disabled={!canProceed}
                  className="w-full px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50"
                >
                  Continue
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!canProceed || isLoading}
                  className="flex-1 px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Create Account
                </button>
              )}
            </div>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-surface-400">
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
        
        {/* Footer */}
        <p className="text-center text-sm text-surface-400 mt-8">
          By creating an account, you agree to our{' '}
          <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link>
          {' '}and{' '}
          <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
        </p>
      </div>
    </div>
  );
}
