"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

export default function Sidebar() {
  const pathname = usePathname();
  
  const links = [
    { href: "/", label: "Dashboard" },
    { href: "/products", label: "Products" },
    { href: "/categories", label: "Categories" },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-[#1e1e1e] border-r border-gray-200 dark:border-neutral-800 flex flex-col justify-between transition-colors min-h-screen">
      <div>
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center text-white font-bold text-sm">A</div>
          <span className="font-bold text-xl text-gray-900 dark:text-neutral-100">AdminPanel</span>
        </div>
        <nav className="px-4 py-2 space-y-1">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.href} 
                href={link.href} 
                className={`block px-4 py-2 rounded-md transition-colors ${isActive ? 'bg-blue-600 text-white' : 'text-gray-600 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-neutral-800/50 hover:text-gray-900 dark:hover:text-neutral-200'}`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="p-4 border-t border-gray-200 dark:border-neutral-800">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full flex items-center gap-2 px-4 py-2 text-red-600 dark:text-red-400 font-medium hover:bg-red-50 dark:hover:bg-red-950/30 rounded-md transition-colors"
        >
          <div className="w-3 h-3 bg-red-500 rounded-sm"></div>
          Logout
        </button>
      </div>
    </aside>
  );
}
