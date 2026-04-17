"use client";
import { useState, useEffect } from 'react';
import { Package, AlertTriangle, Layers } from 'lucide-react';

export default function StatsCards() {
  const [stats, setStats] = useState({ total: 0, outOfStock: 0, categories: 0 });

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/dashboard/stats');
        const data = await res.json();
        
        setStats({
          total: data.totalProducts || 0,
          outOfStock: data.outOfStockProducts || 0,
          categories: data.totalCategories || 0
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    }
    fetchData();
  }, []);

  const cardData = [
    { 
      title: "Total Products", 
      value: stats.total.toString(), 
      description: "across all categories", 
      icon: <Package size={20} className="text-gray-400" />, 
      textColor: "text-white" 
    },
    { 
      title: "Out of Stock", 
      value: stats.outOfStock.toString(), 
      description: "needs restocking", 
      icon: <AlertTriangle size={20} className="text-[#f87171]" />, 
      textColor: "text-[#f87171]" 
    },
    { 
      title: "Categories", 
      value: stats.categories.toString(), 
      description: "active categories", 
      icon: <Layers size={20} className="text-blue-400" />, 
      textColor: "text-blue-400" 
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {cardData.map((stat, index) => (
        <div key={index} className="p-6 bg-[#171717] rounded-xl border border-gray-800">
          <div className="flex justify-between items-start mb-4">
            <p className="text-gray-400 text-sm font-medium">{stat.title}</p>
            {stat.icon}
          </div>
          <div className="flex items-baseline gap-2">
            <h2 className={`text-4xl font-bold ${stat.textColor}`}>{stat.value}</h2>
            <span className="text-xs text-gray-500">{stat.description}</span>
          </div>
        </div>
      ))}
    </div>
  );
}