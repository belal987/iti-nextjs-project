"use client";
import { useState, useEffect } from "react";
import { Package, CheckCircle, AlertCircle, AlertTriangle, Layers } from "lucide-react";

interface Stats {
  total: number;
  inStock: number;
  lowStock: number;
  outOfStock: number;
  categories: number;
}

export default function StatsCards() {
  const [stats, setStats] = useState<Stats>({
    total: 0,
    inStock: 0,
    lowStock: 0,
    outOfStock: 0,
    categories: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/dashboard/stats");
        const data = await res.json();
        setStats({
          total: data.totalProducts ?? 0,
          inStock: data.inStockProducts ?? 0,
          lowStock: data.lowStockProducts ?? 0,
          outOfStock: data.outOfStockProducts ?? 0,
          categories: data.totalCategories ?? 0,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const cardData = [
    {
      title: "Total Products",
      value: stats.total,
      description: "across all categories",
      icon: <Package size={20} className="text-blue-400" />,
      textColor: "text-white",
      bg: "from-blue-500/10 to-transparent",
      border: "border-blue-500/20",
    },
    {
      title: "In Stock",
      value: stats.inStock,
      description: "stock > 10 units",
      icon: <CheckCircle size={20} className="text-emerald-400" />,
      textColor: "text-emerald-400",
      bg: "from-emerald-500/10 to-transparent",
      border: "border-emerald-500/20",
    },
    {
      title: "Low Stock",
      value: stats.lowStock,
      description: "between 1 – 10 units",
      icon: <AlertCircle size={20} className="text-amber-400" />,
      textColor: "text-amber-400",
      bg: "from-amber-500/10 to-transparent",
      border: "border-amber-500/20",
    },
    {
      title: "Out of Stock",
      value: stats.outOfStock,
      description: "needs restocking",
      icon: <AlertTriangle size={20} className="text-red-400" />,
      textColor: "text-red-400",
      bg: "from-red-500/10 to-transparent",
      border: "border-red-500/20",
    },
    {
      title: "Categories",
      value: stats.categories,
      description: "active categories",
      icon: <Layers size={20} className="text-purple-400" />,
      textColor: "text-purple-400",
      bg: "from-purple-500/10 to-transparent",
      border: "border-purple-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
      {cardData.map((stat, index) => (
        <div
          key={index}
          className={`relative p-5 bg-[#171717] rounded-xl border ${stat.border} overflow-hidden`}
        >
          <div
            className={`absolute inset-0 bg-gradient-to-br ${stat.bg} pointer-events-none`}
          />
          <div className="relative">
            <div className="flex justify-between items-start mb-3">
              <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">
                {stat.title}
              </p>
              {stat.icon}
            </div>
            <div className="flex items-baseline gap-2">
              {loading ? (
                <div className="h-9 w-16 bg-neutral-800 rounded animate-pulse" />
              ) : (
                <h2 className={`text-3xl font-bold ${stat.textColor}`}>
                  {stat.value.toLocaleString()}
                </h2>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}