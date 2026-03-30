import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './layout/Layout';
import Landing from './pages/Landing';
import ProductDirectory from './pages/ProductDirectory';
import ProductDetail from './pages/ProductDetail';
import RFQWizard from './pages/RFQWizard';
import BuyerDashboard from './pages/BuyerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Pricing from './pages/Pricing';
import NotFound from './pages/NotFound';

function ProtectedRoute({ children, requireAdmin = false }: { children: React.ReactNode; requireAdmin?: boolean }) {
  const isAuthenticated = true; 
  const user = { role: 'buyer' };
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (requireAdmin && user.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      <Route element={<Layout />}>
        <Route path="/products" element={<ProductDirectory />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/rfq" element={<ProtectedRoute><RFQWizard /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><BuyerDashboard /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute requireAdmin><AdminDashboard /></ProtectedRoute>} />
      </Route>
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
