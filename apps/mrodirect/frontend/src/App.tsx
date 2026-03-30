import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './Layout';

// Lazy load pages
const Landing = lazy(() => import('./pages/Landing'));
const PartsDirectory = lazy(() => import('./pages/PartsDirectory'));
const PartDetail = lazy(() => import('./pages/PartDetail'));
const RFQWizard = lazy(() => import('./pages/RFQWizard'));
const BuyerDashboard = lazy(() => import('./pages/BuyerDashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Pricing = lazy(() => import('./pages/Pricing'));
const OrderSuccess = lazy(() => import('./pages/OrderSuccess'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Loading component
const Loading = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const App: React.FC = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Landing />} />
          <Route path="parts" element={<PartsDirectory />} />
          <Route path="parts/:id" element={<PartDetail />} />
          <Route path="rfq/new" element={<RFQWizard />} />
          <Route path="order-success" element={<OrderSuccess />} />
          <Route path="pricing" element={<Pricing />} />
          <Route path="dashboard" element={<BuyerDashboard />} />
          <Route path="admin" element={<AdminDashboard />} />
        </Route>
        
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default App;
