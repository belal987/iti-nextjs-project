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
  Legend,
} from "recharts";
import { BarChart2 } from "lucide-react";

interface StockVsSalesItem {
  _id: string;
  categoryName: string;
  totalStock: number;
  totalSold: number;
}

interface Props {
  categoryFilter?: string;
}

export default function StockVsSalesChart({ categoryFilter }: Props) {
  const [rawData, setRawData] = useState<StockVsSalesItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/dashboard/stats");
        const json = await res.json();
        if (json.stockVsSales && Array.isArray(json.stockVsSales)) {
          setRawData(json.stockVsSales);
        }
      } catch (error) {
        console.error("Error fetching stock vs sales:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const chartData = useMemo(() => {
    const filtered =
      categoryFilter && categoryFilter !== "all"
        ? rawData.filter(
            (d) => d._id === categoryFilter || d.categoryName === categoryFilter
          )
        : rawData;

    return filtered.map((item) => ({
      name: item.categoryName,
      "Remaining Stock": item.totalStock,
      "Units Sold": item.totalSold,
    }));
  }, [rawData, categoryFilter]);

  const tooltipStyle = {
    backgroundColor: "#171717",
    border: "1px solid #404040",
    borderRadius: "8px",
  };

  if (loading) {
    return (
      <div className="p-6 bg-[#171717] rounded-xl border border-gray-800 h-[320px] flex items-center justify-center">
        <div className="w-full space-y-3">
          <div className="h-4 bg-neutral-800 rounded w-52 animate-pulse" />
          <div className="h-[240px] bg-neutral-800 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-[#171717] rounded-xl border border-gray-800 shadow-lg">
      <div className="flex items-center gap-2 mb-5">
        <BarChart2 size={18} className="text-cyan-400" />
        <h3 className="text-base font-semibold text-white tracking-tight">
          Stock vs Sales by Category
        </h3>
      </div>

      {chartData.length === 0 ? (
        <div className="h-[240px] flex items-center justify-center text-gray-500 text-sm">
          {categoryFilter && categoryFilter !== "all"
            ? "No data for selected category"
            : "No data available"}
        </div>
      ) : (
        <div className="h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
              <XAxis
                dataKey="name"
                stroke="#737373"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis stroke="#737373" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                cursor={{ fill: "#262626" }}
                contentStyle={tooltipStyle}
                itemStyle={{ color: "#fff" }}
              />
              <Legend
                formatter={(value) => (
                  <span style={{ color: "#9ca3af", fontSize: "12px" }}>{value}</span>
                )}
              />
              <Bar dataKey="Remaining Stock" fill="#06b6d4" radius={[4, 4, 0, 0]} barSize={20} />
              <Bar dataKey="Units Sold" fill="#f97316" radius={[4, 4, 0, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
