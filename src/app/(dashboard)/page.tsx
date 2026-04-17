"use client";

import { useState, useEffect } from "react";
import StatsCards from "./components/StatsCards";
import CategoryChart from "./components/CategoryChart";
import TopSellingChart from "./components/TopSellingChart";
import StockVsSalesChart from "./components/StockVsSalesChart";
import { Filter } from "lucide-react";

interface CategoryOption {
  _id: string;
  name: string;
}

export default function DashboardPage() {
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [categories, setCategories] = useState<CategoryOption[]>([]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        if (Array.isArray(data)) {
          setCategories(
            data.map((c: { _id: string; name: string }) => ({
              _id: c._id,
              name: c.name,
            }))
          );
        }
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    }
    fetchCategories();
  }, []);

  return (
    <div className="max-w-screen-xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-neutral-100 tracking-tight">
            Dashboard
          </h1>
          <p className="text-sm text-gray-500 dark:text-neutral-500 mt-1">
            Welcome back — here&apos;s what&apos;s happening with your store.
          </p>
        </div>

        {/* Global Category Filter */}
        <div className="relative flex items-center gap-2">
          <Filter size={16} className="text-gray-400 absolute left-3 pointer-events-none" />
          <select
            id="global-category-filter"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="pl-9 pr-4 py-2 bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-neutral-700 rounded-lg text-sm text-gray-700 dark:text-neutral-200 outline-none focus:border-blue-500 transition-colors appearance-none min-w-[180px]"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Stat Cards */}
      <StatsCards />

      {/* Category Chart + Pie */}
      <section>
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4">
          Inventory Overview
        </h2>
        <CategoryChart categoryFilter={categoryFilter} />
      </section>

      {/* Bottom Charts */}
      <section>
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4">
          Sales Analytics
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TopSellingChart />
          <StockVsSalesChart categoryFilter={categoryFilter} />
        </div>
      </section>
    </div>
  );
}