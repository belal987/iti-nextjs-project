"use client";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  return (
    <header className="h-16 bg-white dark:bg-[#1e1e1e] border-b border-gray-200 dark:border-neutral-800 flex items-center px-6 justify-between transition-colors">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-neutral-100"></h2>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
          AG
        </div>
      </div>
    </header>
  );
}