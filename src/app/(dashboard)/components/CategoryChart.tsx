"use client";
import { useState, useEffect, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Legend,
} from "recharts";

interface CategoryStat {
  _id: string;
  categoryName: string;
  total: number;
  inStock: number;
  lowStock: number;
  outOfStock: number;
}

interface Props {
  categoryFilter?: string; // optional global category filter
}

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#f97316"];

export default function CategoryChart({ categoryFilter }: Props) {
  const [chartData, setChartData] = useState<CategoryStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"bar" | "pie">("bar");

  useEffect(() => {
    async function fetchChartData() {
      try {
        const res = await fetch("/api/dashboard/stats");
        const data = await res.json();
        if (data.categoryStats && Array.isArray(data.categoryStats)) {
          setChartData(data.categoryStats);
        }
      } catch (error) {
        console.error("Error fetching chart data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchChartData();
  }, []);

  const filteredData = useMemo(() => {
    if (!categoryFilter || categoryFilter === "all") return chartData;
    return chartData.filter((d) => d._id === categoryFilter || d.categoryName === categoryFilter);
  }, [chartData, categoryFilter]);

  const barData = filteredData.map((item, index) => ({
    name: item.categoryName,
    total: item.total,
    inStock: item.inStock,
    lowStock: item.lowStock,
    outOfStock: item.outOfStock,
    color: COLORS[index % COLORS.length],
  }));

  const totalInStock = chartData.reduce((s, d) => s + d.inStock, 0);
  const totalLowStock = chartData.reduce((s, d) => s + d.lowStock, 0);
  const totalOutOfStock = chartData.reduce((s, d) => s + d.outOfStock, 0);
  const stockPieData = [
    { name: "In Stock", value: totalInStock, fill: "#10b981" },
    { name: "Low Stock", value: totalLowStock, fill: "#f59e0b" },
    { name: "Out of Stock", value: totalOutOfStock, fill: "#ef4444" },
  ].filter((d) => d.value > 0);

  const tooltipStyle = {
    backgroundColor: "#171717",
    border: "1px solid #404040",
    borderRadius: "8px",
  };

  if (loading) {
    return (
      <div className="p-6 bg-[#171717] rounded-xl border border-gray-800 h-[360px] flex items-center justify-center">
        <div className="w-full space-y-3">
          <div className="h-4 bg-neutral-800 rounded w-40 animate-pulse" />
          <div className="h-[260px] bg-neutral-800 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Bar / Stacked Chart */}
      <div className="lg:col-span-2 p-6 bg-[#171717] rounded-xl border border-gray-800 shadow-lg">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-semibold text-white tracking-tight">
            Products by Category
          </h3>
          <div className="flex gap-1 bg-neutral-900 rounded-lg p-1">
            <button
              onClick={() => setActiveTab("bar")}
              className={`px-3 py-1 rounded text-xs font-medium transition ${
                activeTab === "bar"
                  ? "bg-blue-600 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Bar
            </button>
            <button
              onClick={() => setActiveTab("pie")}
              className={`px-3 py-1 rounded text-xs font-medium transition ${
                activeTab === "pie"
                  ? "bg-blue-600 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Stacked
            </button>
          </div>
        </div>

        {barData.length === 0 ? (
          <div className="h-[260px] flex items-center justify-center text-gray-500 text-sm">
            No data for selected category
          </div>
        ) : activeTab === "bar" ? (
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
                <XAxis dataKey="name" stroke="#737373" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#737373" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip cursor={{ fill: "#262626" }} contentStyle={tooltipStyle} itemStyle={{ color: "#fff" }} />
                <Bar dataKey="total" radius={[4, 4, 0, 0]}>
                  {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
                <XAxis dataKey="name" stroke="#737373" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#737373" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip cursor={{ fill: "#262626" }} contentStyle={tooltipStyle} itemStyle={{ color: "#fff" }} />
                <Legend wrapperStyle={{ fontSize: "12px", color: "#9ca3af" }} />
                <Bar dataKey="inStock" name="In Stock" stackId="a" fill="#10b981" />
                <Bar dataKey="lowStock" name="Low Stock" stackId="a" fill="#f59e0b" />
                <Bar dataKey="outOfStock" name="Out of Stock" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Stock Status Pie */}
      <div className="p-6 bg-[#171717] rounded-xl border border-gray-800 shadow-lg">
        <h3 className="text-base font-semibold text-white tracking-tight mb-5">
          Stock Distribution
        </h3>
        {stockPieData.length === 0 ? (
          <div className="h-[260px] flex items-center justify-center text-gray-500 text-sm">
            No stock data available
          </div>
        ) : (
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stockPieData}
                  cx="50%"
                  cy="45%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {stockPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} itemStyle={{ color: "#fff" }} />
                <Legend
                  formatter={(value) => (
                    <span style={{ color: "#9ca3af", fontSize: "12px" }}>{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}