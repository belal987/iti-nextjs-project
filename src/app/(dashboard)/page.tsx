import Link from "next/link";
import StatsChart from "@/components/charts/StatsChart";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/products" className="bg-white dark:bg-[#1e1e1e] p-6 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-800 hover:shadow-md transition-shadow">
          <h3 className="text-gray-500 dark:text-neutral-400 text-sm font-medium">Total Products</h3>
          <p className="text-3xl font-bold mt-2 text-gray-900 dark:text-neutral-100">155</p>
        </Link>
        <div className="bg-white dark:bg-[#1e1e1e] p-6 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-800">
          <h3 className="text-gray-500 dark:text-neutral-400 text-sm font-medium">Out of Stock</h3>
          <p className="text-3xl font-bold mt-2 text-red-600 dark:text-red-400">8</p>
        </div>
        <Link href="/categories" className="bg-white dark:bg-[#1e1e1e] p-6 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-800 hover:shadow-md transition-shadow">
          <h3 className="text-gray-500 dark:text-neutral-400 text-sm font-medium">Total Categories</h3>
          <p className="text-3xl font-bold mt-2 text-gray-900 dark:text-neutral-100">12</p>
        </Link>
      </div>

      <div className="bg-white dark:bg-[#1e1e1e] p-6 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-800">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-neutral-100">Stock Overview</h3>
        <StatsChart />
      </div>
    </div>
  );
}
