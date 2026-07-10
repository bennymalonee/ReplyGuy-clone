import "../../styles/dashboard-theme.css";
import { DashboardNav } from "@/components/dashboard/DashboardNav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="dashboard-theme min-h-screen font-[family-name:var(--font-body)]"
      style={{ fontFamily: "var(--font-inter), sans-serif" }}
    >
      <DashboardNav />
      <main className="mx-auto max-w-[1200px] px-8 py-12">{children}</main>
    </div>
  );
}
