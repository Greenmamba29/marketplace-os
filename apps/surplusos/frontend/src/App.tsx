import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import ListingDirectory from './pages/ListingDirectory';
import ListingDetail from './pages/ListingDetail';
import SellWizard from './pages/SellWizard';
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
        <Route path="/listings" element={<ListingDirectory />} />
        <Route path="/listings/:id" element={<ListingDetail />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/sell" element={<SellWizard />} />
        <Route path="/auctions" element={<ListingDirectory />} />
        <Route path="/dashboard" element={<BuyerDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
export default App;
