import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Plus, 
  Calendar, 
  TrendingUp, 
  Shield, 
  CheckCircle,
  Clock,
  AlertTriangle,
  ChevronRight,
  Download,
  Eye
} from 'lucide-react';
import Card, { CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { useContracts } from '@/hooks/useContracts';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { ContractType } from '@/types';

const contractTypes: { value: ContractType | ''; label: string }[] = [
  { value: '', label: 'All Types' },
  { value: 'spot', label: 'Spot' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'annual', label: 'Annual' },
  { value: 'multi_year', label: 'Multi-Year' },
];

const contractStatuses = [
  { value: '', label: 'All Status' },
  { value: 'active', label: 'Active' },
  { value: 'draft', label: 'Draft' },
  { value: 'completed', label: 'Completed' },
  { value: 'terminated', label: 'Terminated' },
];

export default function ContractManager() {
  const [selectedType, setSelectedType] = useState<ContractType | ''>('');
  const [selectedStatus, setSelectedStatus] = useState('');
  
  const { data: contracts, isLoading } = useContracts(
    {
      contract_type: selectedType || undefined,
      status: selectedStatus || undefined,
    },
    1,
    20
  );

  // Mock contract summary
  const summary = {
    totalContracts: 12,
    activeValue: 8450000,
    expiringSoon: 2,
    avgPrice: 28500,
  };

  return (
    <div className="min-h-screen bg-slate-950 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Contract Manager</h1>
            <p className="text-slate-400">
              Manage your spot purchases and long-term offtake agreements
            </p>
          </div>
          <Link to="/rfq">
            <Button rightIcon={<Plus className="w-4 h-4" />}>
              New Contract
            </Button>
          </Link>
        </div>

        {/* Summary Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Total Contracts</p>
                  <p className="text-3xl font-bold text-white">{summary.totalContracts}</p>
                </div>
                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Active Value</p>
                  <p className="text-3xl font-bold text-white font-mono">
                    {formatCurrency(summary.activeValue, 'USD', { notation: 'compact' })}
                  </p>
                </div>
                <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-emerald-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Expiring Soon</p>
                  <p className="text-3xl font-bold text-amber-400">{summary.expiringSoon}</p>
                </div>
                <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-amber-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Avg. Price/mt</p>
                  <p className="text-3xl font-bold text-white font-mono">
                    {formatCurrency(summary.avgPrice, 'USD', { maximumFractionDigits: 0 })}
                  </p>
                </div>
                <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-cyan-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as ContractType | '')}
            className="w-full sm:w-48"
          >
            {contractTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full sm:w-48"
          >
            {contractStatuses.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>

        {/* Contracts List */}
        <Card>
          <CardHeader>
            <CardTitle>Your Contracts</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {Array(5).fill(0).map((_, i) => (
                  <div key={i} className="h-20 bg-slate-800 animate-pulse rounded-lg" />
                ))}
              </div>
            ) : contracts?.items && contracts.items.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b border-slate-700">
                      <th className="pb-3 text-slate-400 font-medium text-sm">Contract</th>
                      <th className="pb-3 text-slate-400 font-medium text-sm">Type</th>
                      <th className="pb-3 text-slate-400 font-medium text-sm">Material</th>
                      <th className="pb-3 text-slate-400 font-medium text-sm">Quantity</th>
                      <th className="pb-3 text-slate-400 font-medium text-sm">Value</th>
                      <th className="pb-3 text-slate-400 font-medium text-sm">Period</th>
                      <th className="pb-3 text-slate-400 font-medium text-sm">Status</th>
                      <th className="pb-3 text-slate-400 font-medium text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(contracts.items as any[]).map((contract: any) => (
                      <tr key={contract.id} className="border-b border-slate-800 last:border-0">
                        <td className="py-4">
                          <div>
                            <p className="font-medium text-white">{contract.contract_number}</p>
                            <p className="text-slate-500 text-sm">{contract.supplier?.company_name}</p>
                          </div>
                        </td>
                        <td className="py-4">
                          <Badge variant="neutral" className="capitalize">
                            {contract.contract_type.replace('_', '-')}
                          </Badge>
                        </td>
                        <td className="py-4">
                          <p className="text-slate-300 capitalize">{contract.material?.form}</p>
                          <p className="text-slate-500 text-sm capitalize">{contract.material?.grade}</p>
                        </td>
                        <td className="py-4">
                          <p className="text-white">
                            {contract.quantity.toLocaleString()} {contract.unit}
                          </p>
                        </td>
                        <td className="py-4">
                          <p className="text-white font-mono">
                            {formatCurrency(contract.total_amount || contract.quantity * contract.base_price, contract.currency, { maximumFractionDigits: 0 })}
                          </p>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center gap-1 text-slate-400 text-sm">
                            <Calendar className="w-4 h-4" />
                            {formatDate(contract.start_date)} - {formatDate(contract.end_date)}
                          </div>
                        </td>
                        <td className="py-4">
                          <Badge 
                            variant={
                              contract.status === 'active' ? 'success' :
                              contract.status === 'draft' ? 'warning' :
                              contract.status === 'completed' ? 'info' : 'danger'
                            }
                          >
                            {contract.status}
                          </Badge>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center gap-2">
                            <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                              <Eye className="w-4 h-4 text-slate-400" />
                            </button>
                            <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                              <Download className="w-4 h-4 text-slate-400" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-16">
                <FileText className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No contracts found</h3>
                <p className="text-slate-400 mb-6">
                  Start by submitting an RFQ to receive quotes and create contracts
                </p>
                <Link to="/rfq">
                  <Button>Submit RFQ</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Contract Types Info */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          {[
            {
              title: 'Spot Contracts',
              description: 'Immediate delivery, fixed price. Best for urgent needs.',
              icon: CheckCircle,
              color: 'emerald',
            },
            {
              title: 'Quarterly Contracts',
              description: '3-month agreements with scheduled deliveries.',
              icon: Calendar,
              color: 'blue',
            },
            {
              title: 'Annual Contracts',
              description: '12-month offtake agreements with price adjustments.',
              icon: TrendingUp,
              color: 'cyan',
            },
            {
              title: 'Multi-Year Contracts',
              description: 'Long-term supply security with flexible terms.',
              icon: Shield,
              color: 'amber',
            },
          ].map((type) => {
            const Icon = type.icon;
            const colorClasses: Record<string, string> = {
              emerald: 'bg-emerald-500/10 text-emerald-400',
              blue: 'bg-blue-500/10 text-blue-400',
              cyan: 'bg-cyan-500/10 text-cyan-400',
              amber: 'bg-amber-500/10 text-amber-400',
            };
            
            return (
              <Card key={type.title} className="hover:border-slate-600 transition-colors">
                <CardContent className="p-5">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${colorClasses[type.color]}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="font-semibold text-white mb-1">{type.title}</h4>
                  <p className="text-slate-400 text-sm">{type.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
