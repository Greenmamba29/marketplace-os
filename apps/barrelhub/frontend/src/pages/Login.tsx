import { Link } from 'react-router-dom';
import { Layers, ArrowRight } from 'lucide-react';

export default function Login() {
  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-4">
      <Link to="/" className="flex items-center gap-2 mb-12">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
          <Layers className="w-6 h-6 text-white" />
        </div>
        <span className="font-display font-bold text-2xl text-white">UniformOS</span>
      </Link>
      
      <div className="w-full max-w-md p-8 bg-surface-50 border border-surface-200 rounded-2xl space-y-6 shadow-2xl">
        <div className="text-center">
          <h1 className="text-2xl font-display font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-sm text-surface-400">Enter your credentials to access your dashboard.</p>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-surface-400 ml-1">Work Email</label>
            <input type="email" placeholder="manager@example.com" className="w-full" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-surface-400 ml-1">Password</label>
            <input type="password" placeholder="••••••••" className="w-full" />
          </div>
          <button className="btn btn-primary w-full py-3 mt-2 shadow-lg shadow-primary/20">Sign In</button>
        </div>
        
        <div className="text-center text-sm text-surface-400">
          Don't have an account? <Link to="/register" className="text-primary font-medium hover:underline">Request Access</Link>
        </div>
      </div>
      
      <div className="mt-8 text-xs text-surface-400 text-center space-y-2">
        <div>Forgot password? <a href="#" className="hover:text-white transition-colors">Reset here</a></div>
        <div>By signing in, you agree to our Terms and Privacy Policy.</div>
      </div>
    </div>
  );
}
