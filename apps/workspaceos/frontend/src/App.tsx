import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks';
import Layout from '@/components/Layout';
import Landing from '@/pages/Landing';
import ProductDirectory from '@/pages/ProductDirectory';
import ProductDetail from '@/pages/ProductDetail';
import RFQWizard from '@/pages/RFQWizard';
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
      <Route path="/products" element={<ProductDirectory />} />
      <Route path="/products/:id" element={<ProductDetail />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/pricing" element={<Pricing />} />
      
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
