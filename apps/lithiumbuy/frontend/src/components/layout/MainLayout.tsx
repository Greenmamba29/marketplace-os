import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import PriceTicker from '../pricing/PriceTicker';

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <PriceTicker />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
