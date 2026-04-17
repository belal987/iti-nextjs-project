"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LayoutDashboard, Package, Tag, LogOut } from "lucide-react";

const links = [
  { href: "/",           label: "Dashboard", Icon: LayoutDashboard },
  { href: "/products",   label: "Products",  Icon: Package },
  { href: "/categories", label: "Categories", Icon: Tag },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="w-60 flex flex-col justify-between shrink-0 min-h-screen border-r transition-colors"
      style={{
        background: "var(--bg-card)",
        borderColor: "var(--border)",
      }}
    >
      {/* Logo */}
      <div>
        <div className="px-5 py-5 flex items-center gap-3 border-b" style={{ borderColor: "var(--border)" }}>
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow">
            A
          </div>
          <span className="font-bold text-[15px] text-[var(--text-primary)]">AdminPanel</span>
        </div>

        {/* Nav */}
        <nav className="px-3 py-4 space-y-0.5">
          {links.map(({ href, label, Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-[var(--text-secondary)] hover:bg-slate-100 dark:hover:bg-neutral-800 hover:text-[var(--text-primary)]"
                }`}
              >
                <Icon size={16} className={isActive ? "text-white" : "text-[var(--text-muted)]"} />
                {label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout */}
      <div className="px-3 py-4 border-t" style={{ borderColor: "var(--border)" }}>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-all"
        >
          <LogOut size={15} className="text-red-400" />
          Logout
        </button>
      </div>
    </aside>
  );
}