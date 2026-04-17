"use client";
import { useState, useEffect, useMemo } from "react";
import { useTheme } from "next-themes";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from "recharts";
import { BarChart2 } from "lucide-react";

interface StockVsSalesItem {
  _id: string;
  categoryName: string;
  totalStock: number;
  totalSold: number;
}

interface Props { categoryFilter?: string }

export default function StockVsSalesChart({ categoryFilter }: Props) {
  const { resolvedTheme } = useTheme();
  const dark = resolvedTheme === "dark";

  const colors = {
    grid:     dark ? "#262626" : "#e8edf3",
    axis:     dark ? "#6b7280" : "#94a3b8",
    ttBg:     dark ? "#1e1e1e" : "#ffffff",
    ttBorder: dark ? "#404040" : "#e2e8f0",
    ttText:   dark ? "#f1f5f9" : "#0f172a",
  };

  const [rawData, setRawData] = useState<StockVsSalesItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/stats")
      .then(r => r.json())
      .then(d => { if (Array.isArray(d.stockVsSales)) setRawData(d.stockVsSales); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const chartData = useMemo(() => {
    const filtered = categoryFilter && categoryFilter !== "all"
      ? rawData.filter(d => d._id === categoryFilter || d.categoryName === categoryFilter)
      : rawData;
    return filtered.map(item => ({
      name: item.categoryName,
      "Remaining Stock": item.totalStock,
      "Units Sold": item.totalSold,
    }));
  }, [rawData, categoryFilter]);

  const ttStyle = {
    backgroundColor: colors.ttBg,
    border: `1px solid ${colors.ttBorder}`,
    borderRadius: "10px",
    boxShadow: "0 4px 16px rgb(0 0 0/.12)",
  };

  if (loading)
    return <div className="dash-card h-[320px] animate-pulse bg-slate-100 dark:bg-neutral-800" />;

  return (
    <div className="dash-card">
      <div className="flex items-center gap-2.5 mb-5">
        <span className="p-1.5 rounded-lg bg-cyan-50 dark:bg-cyan-500/10">
          <BarChart2 size={16} className="text-cyan-500" />
        </span>
        <div>
          <p className="text-sm font-semibold text-[var(--text-primary)]">Stock vs Sales</p>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">Remaining inventory vs units sold</p>
        </div>
      </div>

      {chartData.length === 0 ? (
        <div className="h-[240px] flex flex-col items-center justify-center gap-2 text-[var(--text-muted)]">
          <BarChart2 size={32} className="opacity-20" />
          <p className="text-sm">
            {categoryFilter && categoryFilter !== "all"
              ? "No data for selected category"
              : "No data available"}
          </p>
        </div>
      ) : (
        <div className="h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} barCategoryGap="32%" margin={{ top: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} vertical={false} />
              <XAxis dataKey="name" tick={{ fill: colors.axis, fontSize: 12 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: colors.axis, fontSize: 12 }} tickLine={false} axisLine={false} />
              <Tooltip
                cursor={{ fill: dark ? "#262626" : "#f1f5f9" }}
                contentStyle={ttStyle}
                itemStyle={{ color: colors.ttText, fontSize: 13 }}
                labelStyle={{ color: colors.ttText, fontWeight: 600, marginBottom: 4 }}
              />
              <Legend formatter={v => <span style={{ color: colors.axis, fontSize: 12 }}>{v}</span>} />
              <Bar dataKey="Remaining Stock" fill="#06b6d4" radius={[5,5,0,0]} barSize={18} />
              <Bar dataKey="Units Sold"      fill="#f97316" radius={[5,5,0,0]} barSize={18} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
