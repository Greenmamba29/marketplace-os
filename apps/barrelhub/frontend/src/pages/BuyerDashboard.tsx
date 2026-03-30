import { 
  BarChart3, 
  Package, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  TrendingUp,
  FileText,
  Search,
  Wine,
  TrendingDown,
  Activity,
  DollarSign
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function BuyerDashboard() {
  const stats = [
    { label: 'Total Portfolio Val.', value: '$4.2M', icon: TrendingUp, color: 'text-accent-success' },
    { label: 'Active Bids', value: '14', icon: Activity, color: 'text-primary' },
    { label: 'Yield Projection', value: '+12.5%', icon: BarChart3, color: 'text-accent-info' },
    { label: 'Annual Storage Cost', value: '$84k', icon: DollarSign, color: 'text-accent-error' },
  ];

  const holdings = [
    { id: 'BR-4592', name: 'KY Bourbon - Rickhouse B', status: 'Aged (6Y)', valuation: '$850k', barrels: 42, trend: '+4.2%' },
    { id: 'BR-5102', name: 'Islay Single Malt - Warehouse 4', status: 'Aged (12Y)', valuation: '$2.1M', barrels: 12, trend: '+8.5%' },
    { id: 'BR-8821', name: 'Añejo Tequila - Jalisco Depot', status: 'Aged (3Y)', valuation: '$420k', barrels: 25, trend: '+1.5%' },
  ];

  return (
    <div className="p-10 min-h-screen bg-surface">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="flex justify-between items-end">
          <div className="space-y-2">
            <h1 className="text-4xl font-display font-bold text-white mb-2 italic">Portfolio Hub</h1>
            <p className="text-surface-400 text-lg">Managing institution-grade bulk spirit assets.</p>
          </div>
          <div className="flex gap-4">
            <button className="btn btn-secondary py-3 px-6 text-sm font-bold uppercase tracking-widest">Market Index</button>
            <button className="btn btn-primary py-3 px-6 text-sm font-bold uppercase tracking-widest shadow-xl shadow-primary/20">New Bid</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, type: 'spring' }}
              className="p-8 bg-surface-50 border border-surface-200 rounded-3xl relative overflow-hidden group hover:border-primary/50 transition-all"
            >
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <stat.icon className="w-20 h-20" />
              </div>
              <div className="relative">
                <div className={`p-3 bg-surface-100 rounded-2xl w-fit ${stat.color} mb-6`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="text-3xl font-display font-bold text-white mb-2">{stat.value}</div>
                <div className="text-xs uppercase tracking-widest font-bold text-surface-400">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            <h2 className="text-2xl font-display font-bold text-white flex items-center gap-3">
              <Wine className="w-6 h-6 text-primary" /> Core Holdings
            </h2>
            <div className="table-container shadow-2xl">
              <table>
                <thead>
                  <tr className="bg-surface-100/50 backdrop-blur-md">
                    <th className="py-5">ID / Asset Name</th>
                    <th>Status</th>
                    <th>Valuation</th>
                    <th>Units</th>
                    <th>Yield (YTD)</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-200/50">
                  {holdings.map(h => (
                    <tr key={h.id} className="hover:bg-primary/5 transition-colors group">
                      <td className="py-6">
                        <div className="font-mono text-xs text-primary mb-1">{h.id}</div>
                        <div className="text-white font-bold">{h.name}</div>
                      </td>
                      <td>
                        <span className="badge badge-info bg-primary/10 text-primary border-primary/20">{h.status}</span>
                      </td>
                      <td className="text-white font-display font-bold text-lg">{h.valuation}</td>
                      <td className="text-surface-400">{h.barrels} barrels</td>
                      <td className="text-accent-success font-bold font-mono">{h.trend}</td>
                      <td className="text-right">
                        <button className="p-2 text-surface-400 hover:text-primary transition-colors">
                          <FileText className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-10">
            <h2 className="text-2xl font-display font-bold text-white flex items-center gap-3">
              <Activity className="w-6 h-6 text-primary" /> Intelligence
            </h2>
            <div className="p-8 bg-surface-50 border border-surface-200 rounded-3xl space-y-8 relative overflow-hidden">
              <div className="flex justify-between items-center pb-4 border-b border-surface-200">
                <span className="text-sm font-bold text-white uppercase tracking-wider">Bourbon Index (BXI)</span>
                <span className="text-accent-success font-bold font-mono">+2.4%</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-surface-200">
                <span className="text-sm font-bold text-white uppercase tracking-wider">Scotch Peat (SPX)</span>
                <span className="text-accent-error font-bold font-mono">-0.8%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-white uppercase tracking-wider">Agave Premium (APX)</span>
                <span className="text-accent-info font-bold font-mono">+12.1%</span>
              </div>
              
              <div className="pt-6">
                <div className="p-6 bg-primary/5 border border-primary/20 rounded-2xl relative overflow-hidden group cursor-pointer hover:bg-primary/10 transition-colors">
                  <div className="absolute top-0 right-0 -mt-4 -mr-4 opacity-5 group-hover:opacity-10 transition-all rotate-12">
                    <TrendingUp className="w-24 h-24" />
                  </div>
                  <h3 className="text-white font-bold mb-2">Arbitrage Alert</h3>
                  <p className="text-xs text-surface-400 mb-4 leading-relaxed">High demand for 4Y+ Bourbon in European bottler network. Average bid premiums rising to 18% over NAV.</p>
                  <button className="text-primary font-bold text-xs uppercase tracking-widest flex items-center gap-2">Execute Strategy <ChevronRight className="w-3 h-3" /></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChevronRight(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
