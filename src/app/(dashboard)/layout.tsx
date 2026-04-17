import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen transition-colors" style={{ background: "var(--bg-page)" }}>
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <Navbar />
        <main className="flex-1 p-6 text-[var(--text-primary)]">{children}</main>
      </div>
    </div>
  );
}
