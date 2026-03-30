import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './hooks/useAuth'
import { Layout } from './components/Layout'
import { Landing } from './pages/Landing'
import { VendorDirectory } from './pages/VendorDirectory'
import { RFPMatcher } from './pages/RFPMatcher'
import { ComplianceCenter } from './pages/ComplianceCenter'
import { RFQWizard } from './pages/RFQWizard'
import { AdminDashboard } from './pages/AdminDashboard'
import { VendorProfile } from './pages/VendorProfile'
import { RFPDetail } from './pages/RFPDetail'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { BuyerDashboard } from './pages/BuyerDashboard'
import { VendorDashboard } from './pages/VendorDashboard'
import Pricing from './pages/Pricing'

function App() {
  const { user, isLoading } = useAuthStore()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/vendors" element={<VendorDirectory />} />
      <Route path="/vendors/:id" element={<VendorProfile />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/rfps" element={<RFPMatcher />} />
      <Route path="/rfps/:id" element={<RFPDetail />} />

      {/* Protected Routes */}
      <Route element={<Layout />}>
        <Route 
          path="/compliance" 
          element={user ? <ComplianceCenter /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/rfq-wizard" 
          element={user ? <RFQWizard /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/rfq-wizard/:rfpId" 
          element={user ? <RFQWizard /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/buyer-dashboard" 
          element={user?.role === 'BUYER' ? <BuyerDashboard /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/vendor-dashboard" 
          element={user?.role === 'VENDOR' ? <VendorDashboard /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/admin" 
          element={user?.role === 'ADMIN' ? <AdminDashboard /> : <Navigate to="/login" />} 
        />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

export default App
