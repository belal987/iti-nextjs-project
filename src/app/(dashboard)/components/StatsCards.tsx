"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { CheckCircle, AlertCircle, AlertTriangle, Layers, Package } from "lucide-react";

interface Stats {
  total: number;
  inStock: number;
  lowStock: number;
  outOfStock: number;
  categories: number;
}

const cards = [
  {
    key: "total" as keyof Stats,
    label: "Total Products",
    sub: "across all categories",
    Icon: Package,
    href: "/products",
    iconBg: "bg-blue-50 dark:bg-blue-500/10",
    iconCls: "text-blue-500",
    accent: "bg-blue-500",
    ring: "ring-blue-500/10 dark:ring-blue-500/20",
    hover: "hover:ring-blue-500/30 hover:border-blue-300 dark:hover:border-blue-600",
  },
  {
    key: "inStock" as keyof Stats,
    label: "In Stock",
    sub: "stock > 10 units",
    Icon: CheckCircle,
    href: "/products?stock=in-stock",
    iconBg: "bg-emerald-50 dark:bg-emerald-500/10",
    iconCls: "text-emerald-500",
    accent: "bg-emerald-500",
    ring: "ring-emerald-500/10 dark:ring-emerald-500/20",
    hover: "hover:ring-emerald-500/30 hover:border-emerald-300 dark:hover:border-emerald-600",
  },
  {
    key: "lowStock" as keyof Stats,
    label: "Low Stock",
    sub: "1 – 10 units left",
    Icon: AlertCircle,
    href: "/products?stock=low-stock",
    iconBg: "bg-amber-50 dark:bg-amber-500/10",
    iconCls: "text-amber-500",
    accent: "bg-amber-500",
    ring: "ring-amber-500/10 dark:ring-amber-500/20",
    hover: "hover:ring-amber-500/30 hover:border-amber-300 dark:hover:border-amber-600",
  },
  {
    key: "outOfStock" as keyof Stats,
    label: "Out of Stock",
    sub: "needs restocking",
    Icon: AlertTriangle,
    href: "/products?stock=out-of-stock",
    iconBg: "bg-red-50 dark:bg-red-500/10",
    iconCls: "text-red-500",
    accent: "bg-red-500",
    ring: "ring-red-500/10 dark:ring-red-500/20",
    hover: "hover:ring-red-500/30 hover:border-red-300 dark:hover:border-red-600",
  },
  {
    key: "categories" as keyof Stats,
    label: "Categories",
    sub: "active categories",
    Icon: Layers,
    href: "/categories",
    iconBg: "bg-purple-50 dark:bg-purple-500/10",
    iconCls: "text-purple-500",
    accent: "bg-purple-500",
    ring: "ring-purple-500/10 dark:ring-purple-500/20",
    hover: "hover:ring-purple-500/30 hover:border-purple-300 dark:hover:border-purple-600",
  },
];

export default function StatsCards() {
  const [stats, setStats] = useState<Stats>({
    total: 0, inStock: 0, lowStock: 0, outOfStock: 0, categories: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/stats")
      .then(r => r.json())
      .then(d => setStats({
        total: d.totalProducts ?? 0,
        inStock: d.inStockProducts ?? 0,
        lowStock: d.lowStockProducts ?? 0,
        outOfStock: d.outOfStockProducts ?? 0,
        categories: d.totalCategories ?? 0,
      }))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map(({ key, label, sub, Icon, href, iconBg, iconCls, accent, ring, hover }) => (
        <Link
          key={key}
          href={href}
          className={`relative dash-card ring-1 ${ring} ${hover} flex flex-col gap-3 overflow-hidden cursor-pointer transition-all duration-200 group`}
        >
          {/* accent bar */}
          <div className={`absolute top-0 left-0 right-0 h-[3px] rounded-t-[0.875rem] ${accent}`} />

          <div className="flex items-center justify-between pt-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              {label}
            </p>
            <span className={`p-1.5 rounded-lg ${iconBg} group-hover:scale-110 transition-transform`}>
              <Icon size={16} className={iconCls} />
            </span>
          </div>

          {loading ? (
            <div className="h-8 w-20 rounded-lg bg-slate-200 dark:bg-neutral-700 animate-pulse" />
          ) : (
            <p className="text-3xl font-bold tracking-tight text-[var(--text-primary)] group-hover:scale-[1.02] transition-transform origin-left">
              {stats[key].toLocaleString()}
            </p>
          )}

          <p className="text-xs text-[var(--text-muted)]">{sub}</p>

          {/* bottom hover indicator */}
          <div className={`absolute bottom-0 left-0 right-0 h-[2px] ${accent} scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left rounded-b-[0.875rem]`} />
        </Link>
      ))}
    </div>
  );
}