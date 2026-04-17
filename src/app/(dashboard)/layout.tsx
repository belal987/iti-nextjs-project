"use client";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import { SidebarProvider, useSidebar } from "@/context/SidebarContext";

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { isOpen, close } = useSidebar();

  return (
    <div className="flex min-h-screen transition-colors" style={{ background: "var(--bg-page)" }}>
      <Sidebar />
      
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={close}
        />
      )}

      <div className="flex flex-col flex-1 min-w-0">
        <Navbar />
        <main className="flex-1 p-4 md:p-6 text-[var(--text-primary)]">{children}</main>
      </div>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <LayoutContent>{children}</LayoutContent>
    </SidebarProvider>
  );
}
