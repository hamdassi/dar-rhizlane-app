import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import type { ProcessedReport } from '../types';
import { KpiCard } from './KpiCard';

interface DashboardProps {
  report: ProcessedReport;
}

const COLORS = ['#FBBF24', '#38B2AC', '#F97316', '#60A5FA', '#A78BFA']; // Amber, Teal, Orange, Blue, Violet

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/90 text-gray-800 backdrop-blur-sm p-3 shadow-lg rounded-lg border border-gray-200">
        <p className="font-bold text-amber-600 mb-1">{label}</p>
        {payload.map((pld: any) => {
            const formattedValue = (val: any) => {
                if (pld.dataKey.toLowerCase().includes('rate')) {
                    return `${val.toLocaleString(undefined, {minimumFractionDigits: 1, maximumFractionDigits: 1})}%`;
                }
                if (pld.dataKey === 'adr') {
                    return val.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });
                }
                return val.toLocaleString();
            };
            return (
                <p key={pld.dataKey} style={{ color: pld.color }} className="text-sm text-gray-700">
                    <span className="font-semibold">{pld.name}</span>: {formattedValue(pld.value)}
                </p>
            );
        })}
      </div>
    );
  }
  return null;
};


export const Dashboard: React.FC<DashboardProps> = ({ report }) => {
  const { fileName, data } = report;
  const { kpis, revenueDistribution, occupancyEvolution, adrByCategory, roomsSoldByCategory, detailedData } = data;
  const uniqueId = React.useId();

  return (
    <div aria-labelledby={uniqueId}>
      <h2 id={uniqueId} className="text-3xl font-bold font-serif text-amber-600 mb-8 text-center">
        Analysis for <span className="text-gray-800">{fileName}</span>
      </h2>
      <div className="space-y-8">
        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KpiCard 
              title="Total Revenue" 
              value={kpis.totalRevenue} 
              iconBgClass="bg-emerald-100"
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" /></svg>}
          />
          <KpiCard 
              title="Occupancy Rate" 
              value={kpis.occupancyRate} 
              iconBgClass="bg-sky-100"
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
          />
          <KpiCard 
              title="Average Daily Rate" 
              value={kpis.averageDailyRate} 
              iconBgClass="bg-amber-100"
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" /></svg>}
          />
          <KpiCard 
              title="Analysis Period" 
              value={kpis.analysisPeriod} 
              isText={true} 
              iconBgClass="bg-slate-100"
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
            <h3 className="text-xl font-bold mb-4 text-gray-900 font-serif">Revenue Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={revenueDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={110} fill="#8884d8" label={{ fill: '#374151' }}>
                  {revenueDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => value.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })} contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }} />
                <Legend wrapperStyle={{ color: '#4b5563' }}/>
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
            <h3 className="text-xl font-bold mb-4 text-gray-900 font-serif">Occupancy Evolution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={occupancyEvolution} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" stroke="#6b7280" />
                  <YAxis unit="%" stroke="#6b7280" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ color: '#4b5563' }}/>
                  <Line type="monotone" dataKey="rate" name="Occupancy Rate" stroke={COLORS[1]} strokeWidth={2.5} dot={{ r: 4, fill: COLORS[1] }} activeDot={{ r: 6, stroke: '#f9fafb' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
            <h3 className="text-xl font-bold mb-4 text-gray-900 font-serif">ADR by Category</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={adrByCategory} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
                  <XAxis type="number" unit="€" stroke="#6b7280" />
                  <YAxis dataKey="category" type="category" width={100} stroke="#6b7280" tick={{ fill: '#6b7280' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ color: '#4b5563' }}/>
                  <Bar dataKey="adr" name="ADR" fill={COLORS[2]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
            <h3 className="text-xl font-bold mb-4 text-gray-900 font-serif">Rooms Sold by Category</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={roomsSoldByCategory} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="category" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ color: '#4b5563' }}/>
                  <Bar dataKey="roomsSold" name="Rooms Sold" fill={COLORS[0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Detailed Table */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
          <h3 className="text-xl font-bold mb-4 text-gray-900 font-serif">Detailed Performance Data</h3>
          <div className="overflow-x-auto">
              <table className="w-full text-left">
              <thead className="bg-gray-50 text-amber-600 uppercase text-xs font-semibold">
                  <tr>
                  <th className="p-4 rounded-tl-lg">Category</th>
                  <th className="p-4 text-right">Rooms Sold</th>
                  <th className="p-4 text-right">ADR</th>
                  <th className="p-4 text-right rounded-tr-lg">Revenue</th>
                  </tr>
              </thead>
              <tbody>
                  {detailedData.map((row, index) => (
                  <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="p-4 font-medium text-gray-800">{row.category}</td>
                      <td className="p-4 text-right text-gray-600">{row.roomsSold.toLocaleString()}</td>
                      <td className="p-4 text-right text-gray-600">{row.adr.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</td>
                      <td className="p-4 text-right font-semibold text-emerald-600">{row.revenue.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</td>
                  </tr>
                  ))}
              </tbody>
              </table>
          </div>
        </div>
      </div>
    </div>
  );
};