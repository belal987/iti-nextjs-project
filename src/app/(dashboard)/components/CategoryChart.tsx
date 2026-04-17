"use client";
import { useState, useEffect, useMemo } from "react";
import { useTheme } from "next-themes";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, PieChart, Pie, Legend,
} from "recharts";

interface CategoryStat {
  _id: string;
  categoryName: string;
  total: number;
  inStock: number;
  lowStock: number;
  outOfStock: number;
}

interface Props { categoryFilter?: string }

const PALETTE = ["#6366f1","#10b981","#f59e0b","#ef4444","#8b5cf6","#06b6d4","#f97316","#84cc16"];

export default function CategoryChart({ categoryFilter }: Props) {
  const { resolvedTheme } = useTheme();
  const dark = resolvedTheme === "dark";

  const colors = {
    grid:    dark ? "#262626" : "#e8edf3",
    axis:    dark ? "#6b7280" : "#94a3b8",
    ttBg:    dark ? "#1e1e1e" : "#ffffff",
    ttBorder:dark ? "#404040" : "#e2e8f0",
    ttText:  dark ? "#f1f5f9" : "#0f172a",
  };

  const [data, setData] = useState<CategoryStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"bar" | "stacked">("bar");

  useEffect(() => {
    fetch("/api/dashboard/stats")
      .then(r => r.json())
      .then(d => { if (Array.isArray(d.categoryStats)) setData(d.categoryStats); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() =>
    !categoryFilter || categoryFilter === "all"
      ? data
      : data.filter(d => d._id === categoryFilter || d.categoryName === categoryFilter),
    [data, categoryFilter]
  );

  const barData = filtered.map((item, i) => ({
    name: item.categoryName,
    total: item.total,
    inStock: item.inStock,
    lowStock: item.lowStock,
    outOfStock: item.outOfStock,
    color: PALETTE[i % PALETTE.length],
  }));

  const pieData = [
    { name: "In Stock",     value: data.reduce((s,d)=>s+d.inStock,0),    fill:"#10b981" },
    { name: "Low Stock",    value: data.reduce((s,d)=>s+d.lowStock,0),   fill:"#f59e0b" },
    { name: "Out of Stock", value: data.reduce((s,d)=>s+d.outOfStock,0), fill:"#ef4444" },
  ].filter(d => d.value > 0);

  const ttStyle  = { backgroundColor: colors.ttBg, border: `1px solid ${colors.ttBorder}`, borderRadius: "10px", boxShadow:"0 4px 16px rgb(0 0 0/.12)" };
  const ttItem   = { color: colors.ttText, fontSize: "13px" };
  const ttLabel  = { color: colors.ttText, fontWeight: 600, marginBottom: 4 };

  if (loading) return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <div className="lg:col-span-2 dash-card h-[340px] animate-pulse bg-slate-100 dark:bg-neutral-800" />
      <div className="dash-card h-[340px] animate-pulse bg-slate-100 dark:bg-neutral-800" />
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

      {/* ── Bar / Stacked Chart ── */}
      <div className="lg:col-span-2 dash-card">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-sm font-semibold text-[var(--text-primary)]">Products by Category</p>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">Distribution across your store</p>
          </div>
          <div className="flex gap-1 p-1 bg-slate-100 dark:bg-neutral-800 rounded-lg">
            {(["bar","stacked"] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                  tab === t
                    ? "bg-white dark:bg-neutral-700 text-[var(--text-primary)] shadow-sm"
                    : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                }`}
              >
                {t === "bar" ? "Bar" : "Stacked"}
              </button>
            ))}
          </div>
        </div>

        {barData.length === 0 ? (
          <div className="h-[260px] flex items-center justify-center text-[var(--text-muted)] text-sm">
            No data for selected category
          </div>
        ) : (
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              {tab === "bar" ? (
                <BarChart data={barData} barSize={28} margin={{ top: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: colors.axis, fontSize: 12 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fill: colors.axis, fontSize: 12 }} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={ttStyle} itemStyle={ttItem} labelStyle={ttLabel} cursor={{ fill: dark ? "#262626" : "#f1f5f9" }} />
                  <Bar dataKey="total" radius={[6,6,0,0]}>
                    {barData.map((e,i) => <Cell key={i} fill={e.color} />)}
                  </Bar>
                </BarChart>
              ) : (
                <BarChart data={barData} barSize={24} margin={{ top: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: colors.axis, fontSize: 12 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fill: colors.axis, fontSize: 12 }} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={ttStyle} itemStyle={ttItem} labelStyle={ttLabel} cursor={{ fill: dark ? "#262626" : "#f1f5f9" }} />
                  <Legend formatter={v => <span style={{ color: colors.axis, fontSize: 12 }}>{v}</span>} />
                  <Bar dataKey="inStock"    name="In Stock"     stackId="a" fill="#10b981" />
                  <Bar dataKey="lowStock"   name="Low Stock"    stackId="a" fill="#f59e0b" />
                  <Bar dataKey="outOfStock" name="Out of Stock" stackId="a" fill="#ef4444" radius={[6,6,0,0]} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* ── Pie ── */}
      <div className="dash-card">
        <div className="mb-5">
          <p className="text-sm font-semibold text-[var(--text-primary)]">Stock Distribution</p>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">Overall stock health</p>
        </div>
        {pieData.length === 0 ? (
          <div className="h-[260px] flex items-center justify-center text-[var(--text-muted)] text-sm">
            No stock data available
          </div>
        ) : (
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="45%" innerRadius={62} outerRadius={92} paddingAngle={3} dataKey="value">
                  {pieData.map((e,i) => <Cell key={i} fill={e.fill} />)}
                </Pie>
                <Tooltip contentStyle={ttStyle} itemStyle={ttItem} />
                <Legend formatter={v => <span style={{ color: colors.axis, fontSize: 12 }}>{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}