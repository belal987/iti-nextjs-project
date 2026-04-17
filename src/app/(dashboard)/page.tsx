import StatsCards from "../../../src/app/(dashboard)/components/StatsCards";
import CategoryChart from "../../../src/app/(dashboard)/components/CategoryChart";

export default function DashboardPage() {
  return (
    <main className="p-8">
      {/* العنوان والترحيب */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-400">Welcome to your admin panel</p>
      </div>

      {/* كروت الإحصائيات */}
      <StatsCards />

      {/* الرسم البياني للأصناف */}
      <div className="mt-10">
        <CategoryChart />
      </div>
    </main>
  );
}