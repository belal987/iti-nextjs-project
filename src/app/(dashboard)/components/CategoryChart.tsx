"use client";
import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function CategoryChart() {
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    async function fetchChartData() {
      try {
        const res = await fetch('/api/dashboard/stats');
        const data = await res.json();
        const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
        
        if (data.categoryStats && Array.isArray(data.categoryStats)) {
          const formattedData = data.categoryStats.map((item: any, index: number) => ({
            name: item.categoryName,
            total: item.total,
            color: colors[index % colors.length]
          }));
          setChartData(formattedData);
        }
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    }
    fetchChartData();
  }, []);

  return (
    <div className="p-6 bg-[#171717] rounded-xl border border-gray-800 shadow-lg">
      <h3 className="text-xl font-semibold mb-6 text-white tracking-tight">Products by category</h3>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
            <XAxis dataKey="name" stroke="#737373" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#737373" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip 
              cursor={{ fill: '#262626' }} 
              contentStyle={{ backgroundColor: '#171717', border: '1px solid #404040', borderRadius: '8px' }} 
              itemStyle={{ color: '#fff' }} 
            />
            <Bar dataKey="total" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}