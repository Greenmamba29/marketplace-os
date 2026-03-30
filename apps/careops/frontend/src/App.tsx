import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './layout/Layout';
import Landing from './pages/Landing';
import StaffDirectory from './pages/StaffDirectory';
import CaregiverProfile from './pages/CaregiverProfile';
import PlacementWizard from './pages/PlacementWizard';
import AgencyDashboard from './pages/AgencyDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Pricing from './pages/Pricing';
import NotFound from './pages/NotFound';

function ProtectedRoute({ children, requireAdmin = false }: { children: React.ReactNode; requireAdmin?: boolean }) {
  const isAuthenticated = true; 
  const user = { role: 'agency' };
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
        <Route path="/staff" element={<StaffDirectory />} />
        <Route path="/staff/:id" element={<CaregiverProfile />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/placement" element={<ProtectedRoute><PlacementWizard /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><AgencyDashboard /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute requireAdmin><AdminDashboard /></ProtectedRoute>} />
      </Route>
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
