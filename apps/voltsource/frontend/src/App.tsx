import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks';
import Layout from '@/components/Layout';
import Landing from '@/pages/Landing';
import ComponentsDirectory from '@/pages/ComponentsDirectory';
import ComponentDetail from '@/pages/ComponentDetail';
import RFQWizard from '@/pages/RFQWizard';
import BuyerDashboard from '@/pages/BuyerDashboard';
import AdminDashboard from '@/pages/AdminDashboard';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Pricing from '@/pages/Pricing';
import NotFound from '@/pages/NotFound';

function ProtectedRoute({ requireAdmin = false }: { requireAdmin?: boolean }) {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (requireAdmin && user?.role !== 'admin') return <Navigate to="/dashboard" replace />;
  
  return <Outlet />;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      <Route element={<Layout />}>
        <Route path="/components" element={<ComponentsDirectory />} />
        <Route path="/components/:id" element={<ComponentDetail />} />
        <Route path="/pricing" element={<Pricing />} />
        
        <Route element={<ProtectedRoute />}>
          <Route path="/rfq" element={<RFQWizard />} />
          <Route path="/dashboard" element={<BuyerDashboard />} />
        </Route>
        
        <Route element={<ProtectedRoute requireAdmin />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>
      </Route>
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
