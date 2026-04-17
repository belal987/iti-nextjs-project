import { PanelLeft } from "lucide-react";
import { useSidebar } from "@/context/SidebarContext";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const { toggle } = useSidebar();

  return (
    <header className="h-16 bg-white dark:bg-[#1e1e1e] border-b border-gray-200 dark:border-neutral-800 flex items-center px-4 md:px-6 justify-between transition-colors sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button
          onClick={toggle}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800 text-[var(--text-muted)] transition-colors"
          title="Toggle Sidebar"
        >
          <PanelLeft size={20} />
        </button>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-neutral-100"></h2>
      </div>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
          AG
        </div>
      </div>
    </header>
  );
}