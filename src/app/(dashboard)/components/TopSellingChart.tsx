"use client";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
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

const PALETTE = ["#6366f1","#818cf8","#a5b4fc","#c7d2fe","#e0e7ff"];

export default function TopSellingChart() {
  const { resolvedTheme } = useTheme();
  const dark = resolvedTheme === "dark";

  const colors = {
    grid:    dark ? "#262626" : "#e8edf3",
    axis:    dark ? "#6b7280" : "#94a3b8",
    ttBg:    dark ? "#1e1e1e" : "#ffffff",
    ttBorder:dark ? "#404040" : "#e2e8f0",
    ttText:  dark ? "#f1f5f9" : "#0f172a",
  };

  const [data, setData] = useState<TopProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/stats")
      .then(r => r.json())
      .then(d => { if (Array.isArray(d.topSellingProducts)) setData(d.topSellingProducts); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const chartData = data.map(p => ({
    name: p.name.length > 20 ? p.name.slice(0, 20) + "…" : p.name,
    fullName: p.name,
    sold: p.sold,
  }));

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
        <span className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-500/10">
          <TrendingUp size={16} className="text-indigo-500" />
        </span>
        <div>
          <p className="text-sm font-semibold text-[var(--text-primary)]">Top Selling Products</p>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">Ranked by units sold</p>
        </div>
      </div>

      {chartData.length === 0 ? (
        <div className="h-[240px] flex flex-col items-center justify-center gap-2 text-[var(--text-muted)]">
          <TrendingUp size={32} className="opacity-20" />
          <p className="text-sm">No sales data yet</p>
          <p className="text-xs">Set units sold on products to see rankings</p>
        </div>
      ) : (
        <div className="h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ left: 4, right: 16 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} horizontal={false} />
              <XAxis type="number" tick={{ fill: colors.axis, fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis
                type="category" dataKey="name" width={116}
                tick={{ fill: colors.axis, fontSize: 11 }} tickLine={false} axisLine={false}
              />
              <Tooltip
                cursor={{ fill: dark ? "#262626" : "#f1f5f9" }}
                contentStyle={ttStyle}
                itemStyle={{ color: colors.ttText, fontSize: 13 }}
                labelStyle={{ color: colors.ttText, fontWeight: 600, marginBottom: 4 }}
                formatter={(value, _name, props) => [
                  `${value} units`,
                  (props.payload as { fullName?: string })?.fullName ?? "",
                ]}
              />
              <Bar dataKey="sold" radius={[0, 6, 6, 0]} barSize={18}>
                {chartData.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
