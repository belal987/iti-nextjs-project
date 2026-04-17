"use client";

import { useState, useEffect } from "react";
import StatsCards from "./components/StatsCards";
import CategoryChart from "./components/CategoryChart";
import TopSellingChart from "./components/TopSellingChart";
import StockVsSalesChart from "./components/StockVsSalesChart";
import { ChevronDown } from "lucide-react";

interface CategoryOption { _id: string; name: string; }

export default function DashboardPage() {
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [categories, setCategories] = useState<CategoryOption[]>([]);

  useEffect(() => {
    fetch("/api/categories")
      .then(r => r.json())
      .then(d => { if (Array.isArray(d)) setCategories(d.map((c: { _id: string; name: string }) => ({ _id: c._id, name: c.name }))); })
      .catch(console.error);
  }, []);

  return (
    <div className="max-w-screen-xl mx-auto space-y-8 pb-10">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">
            Dashboard
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-0.5">
            Welcome back — here&apos;s your store at a glance.
          </p>
        </div>

        {/* Global category filter */}
        <div className="flex items-center gap-2">
          <div className="shrink-0 p-2.5 bg-slate-50 dark:bg-neutral-800 border border-[var(--border)] rounded-lg text-[var(--text-muted)]">
            <Filter size={15} />
          </div>
          <div className="relative">
            <select
              id="global-category-filter"
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="ctrl pr-10 min-w-[170px] cursor-pointer"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none"
            />
          </div>
        </div>
      </div>

      {/* ── Stat cards ── */}
      <StatsCards />

      {/* ── Inventory overview ── */}
      <section>
        <p className="section-label">Inventory Overview</p>
        <CategoryChart categoryFilter={categoryFilter} />
      </section>

      {/* ── Sales analytics ── */}
      <section>
        <p className="section-label">Sales Analytics</p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <TopSellingChart />
          <StockVsSalesChart categoryFilter={categoryFilter} />
        </div>
      </section>
    </div>
  );
}