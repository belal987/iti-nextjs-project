"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useSidebar } from "@/context/SidebarContext";
import { LayoutDashboard, Package, Tag, LogOut, X } from "lucide-react";

const links = [
  { href: "/",           label: "Dashboard",  Icon: LayoutDashboard },
  { href: "/products",   label: "Products",   Icon: Package },
  { href: "/categories", label: "Categories", Icon: Tag },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { isOpen, close } = useSidebar();

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-64 lg:static lg:w-60 shrink-0 flex flex-col justify-between min-h-screen border-r transition-all duration-300 ease-in-out transform ${
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}
      style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
    >
      {/* Logo */}
      <div className="relative">
        <div
          className="px-5 py-5 flex items-center gap-3 border-b"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
            A
          </div>
          <span className="font-bold text-[15px] text-[var(--text-primary)]">AdminPanel</span>
        </div>
        <button 
          onClick={close}
          className="lg:hidden absolute right-4 top-5 text-[var(--text-muted)] hover:text-[var(--text-primary)] p-1"
        >
          <X size={20} />
        </button>

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
                <Icon
                  size={16}
                  className={isActive ? "text-white" : "text-[var(--text-muted)]"}
                />
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
