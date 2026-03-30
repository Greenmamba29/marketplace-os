import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';
import { marketplaces } from '../data/marketplaces';

const data = marketplaces.map(m => ({
  name: m.name,
  gmv: m.gmvY3,
  revenue: m.revenueY3,
  tier: m.tier,
  color: m.color,
  fullName: m.name + ' (' + m.vertical + ')'
}));

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-surface-50 border border-surface-200 p-4 rounded-xl shadow-2xl backdrop-blur-xl">
        <p className="text-sm font-bold text-white mb-2">{label}</p>
        <div className="space-y-1">
          <p className="text-xs text-teal-400 flex items-center justify-between gap-4">
            <span>GMV Y3:</span>
            <span className="font-mono font-bold">${payload[0].value}M</span>
          </p>
          <p className="text-xs text-blue-400 flex items-center justify-between gap-4">
            <span>Revenue Y3:</span>
            <span className="font-mono font-bold">${payload[1].value}M</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

export const RevenueChart: React.FC = () => {
  return (
    <div className="w-full h-[500px] bg-surface-50/50 border border-surface-200/50 rounded-2xl p-6 overflow-x-auto lg:overflow-visible">
      <div className="min-w-[800px] h-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#27272A" vertical={false} />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#71717A', fontSize: 10 }}
              angle={-45}
              textAnchor="end"
              interval={0}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#71717A', fontSize: 10 }}
              label={{ value: 'USD Millions', angle: -90, position: 'insideLeft', fill: '#71717A', fontSize: 10 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ paddingTop: '40px' }}
              formatter={(value) => <span className="text-xs text-surface-400 uppercase tracking-wider">{value}</span>}
            />
            <Bar dataKey="gmv" name="GMV Y3" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-gmv-${index}`} 
                  fill={
                    entry.tier === 1 ? '#0ABFBC' : 
                    entry.tier === 2 ? '#2563EB' : 
                    '#475569'
                  } 
                />
              ))}
            </Bar>
            <Bar dataKey="revenue" name="Revenue Y3" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-rev-${index}`} 
                  fill={
                    entry.tier === 1 ? '#089998' : 
                    entry.tier === 2 ? '#1D4ED8' : 
                    '#334155'
                  } 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
