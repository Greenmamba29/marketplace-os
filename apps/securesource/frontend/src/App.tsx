import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
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

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<Layout />}>
        <Route path="/products" element={<ProductDirectory />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/rfq" element={<RFQWizard />} />
        <Route path="/integrators" element={<ProductDirectory />} />
        <Route path="/dashboard" element={<BuyerDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
export default App;
