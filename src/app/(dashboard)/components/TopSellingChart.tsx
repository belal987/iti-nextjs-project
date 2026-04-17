"use client";
import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { TrendingUp } from "lucide-react";

interface TopProduct {
  _id: string;
  name: string;
  sold: number;
  stock: number;
  price: number;
  categoryName?: string;
}

const COLORS = ["#6366f1", "#8b5cf6", "#a78bfa", "#c4b5fd", "#ddd6fe"];

export default function TopSellingChart() {
  const [data, setData] = useState<TopProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/dashboard/stats");
        const json = await res.json();
        if (json.topSellingProducts && Array.isArray(json.topSellingProducts)) {
          setData(json.topSellingProducts);
        }
      } catch (error) {
        console.error("Error fetching top selling products:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const chartData = data.map((p) => ({
    name: p.name.length > 18 ? p.name.slice(0, 18) + "…" : p.name,
    fullName: p.name,
    sold: p.sold,
    stock: p.stock,
  }));

  const tooltipStyle = {
    backgroundColor: "#171717",
    border: "1px solid #404040",
    borderRadius: "8px",
  };

  if (loading) {
    return (
      <div className="p-6 bg-[#171717] rounded-xl border border-gray-800 h-[320px] flex items-center justify-center">
        <div className="w-full space-y-3">
          <div className="h-4 bg-neutral-800 rounded w-48 animate-pulse" />
          <div className="h-[240px] bg-neutral-800 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-[#171717] rounded-xl border border-gray-800 shadow-lg">
      <div className="flex items-center gap-2 mb-5">
        <TrendingUp size={18} className="text-indigo-400" />
        <h3 className="text-base font-semibold text-white tracking-tight">
          Top Selling Products
        </h3>
      </div>

      {chartData.length === 0 ? (
        <div className="h-[240px] flex items-center justify-center text-gray-500 text-sm">
          No sales data yet — update products with sold quantities
        </div>
      ) : (
        <div className="h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ left: 8, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#262626" horizontal={false} />
              <XAxis type="number" stroke="#737373" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis
                type="category"
                dataKey="name"
                stroke="#737373"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                width={110}
              />
              <Tooltip
                cursor={{ fill: "#262626" }}
                contentStyle={tooltipStyle}
                itemStyle={{ color: "#fff" }}
                formatter={(value, _name, props) => [
                  `${value} units`,
                  `Sold (${(props.payload as { fullName?: string })?.fullName ?? ""})`,
                ]}
              />
              <Bar dataKey="sold" radius={[0, 4, 4, 0]} barSize={20}>
                {chartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
