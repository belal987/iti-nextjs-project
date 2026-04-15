import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white shadow-md">
      <div className="p-4 border-b font-bold text-xl">Admin Panel</div>
      <nav className="p-4 space-y-2">
        <Link href="/dashboard" className="block p-2 hover:bg-gray-100 rounded">Dashboard</Link>
        <Link href="/dashboard/products" className="block p-2 hover:bg-gray-100 rounded">Products</Link>
        <Link href="/categories" className="block p-2 hover:bg-gray-100 rounded">Categories</Link>
      </nav>
    </aside>
  );
}
