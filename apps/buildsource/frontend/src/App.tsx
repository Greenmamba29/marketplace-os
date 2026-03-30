import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './Layout';

const Landing = lazy(() => import('./pages/Landing'));
const MaterialsDirectory = lazy(() => import('./pages/MaterialsDirectory'));
const MaterialDetail = lazy(() => import('./pages/MaterialDetail'));
const RFQWizard = lazy(() => import('./pages/RFQWizard'));
const BuyerDashboard = lazy(() => import('./pages/BuyerDashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Pricing = lazy(() => import('./pages/Pricing'));
const OrderSuccess = lazy(() => import('./pages/OrderSuccess'));
const NotFound = lazy(() => import('./pages/NotFound'));

const Loading = () => <div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;

const App: React.FC = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Landing />} />
          <Route path="materials" element={<MaterialsDirectory />} />
          <Route path="materials/:id" element={<MaterialDetail />} />
          <Route path="rfq/new" element={<RFQWizard />
          <Route path="order-success" element={<OrderSuccess />} />} />
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
