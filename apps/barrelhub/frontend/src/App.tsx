import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks';
import Layout from '@/components/Layout';
import Landing from '@/pages/Landing';
import ListingDirectory from '@/pages/ListingDirectory';
import BarrelDetail from '@/pages/BarrelDetail';
import AcquisitionWizard from '@/pages/AcquisitionWizard';
import BuyerDashboard from '@/pages/BuyerDashboard';
import AdminDashboard from '@/pages/AdminDashboard';
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
      <Route path="/listings" element={<ListingDirectory />} />
      <Route path="/listings/:id" element={<BarrelDetail />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/pricing" element={<Pricing />} />
      
      {/* Protected routes */}
      <Route element={<Layout />}>
        <Route 
          path="/acquire" 
          element={
            <ProtectedRoute>
              <AcquisitionWizard />
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
