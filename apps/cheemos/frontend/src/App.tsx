import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks';
import Layout from '@/components/Layout';
import Landing from '@/pages/Landing';
import CASDirectory from '@/pages/CASDirectory';
import ChemicalDetail from '@/pages/ChemicalDetail';
import RFQWizard from '@/pages/RFQWizard';
import BuyerDashboard from '@/pages/BuyerDashboard';
import AdminDashboard from '@/pages/AdminDashboard';
import MarketIntel from '@/pages/MarketIntel';
import ComplianceReports from '@/pages/ComplianceReports';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Pricing from '@/pages/Pricing';
import NotFound from '@/pages/NotFound';

// Protected route component
function ProtectedRoute({ children, requireAdmin = false }: { children: React.ReactNode; requireAdmin?: boolean }) {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (requireAdmin && user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
}

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/cas" element={<CASDirectory />} />
      <Route path="/cas/:casNumber" element={<ChemicalDetail />} />
      <Route path="/chemical/:id" element={<ChemicalDetail />} />
      <Route path="/market-intel" element={<MarketIntel />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Protected routes */}
      <Route element={<Layout />}>
        <Route 
          path="/rfq" 
          element={
            <ProtectedRoute>
              <RFQWizard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/rfq/:chemicalId" 
          element={
            <ProtectedRoute>
              <RFQWizard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <BuyerDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/compliance" 
          element={
            <ProtectedRoute>
              <ComplianceReports />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/compliance/:casNumber" 
          element={
            <ProtectedRoute>
              <ComplianceReports />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute requireAdmin>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
      </Route>
      
      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
