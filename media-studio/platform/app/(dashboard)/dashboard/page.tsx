import { getAccountBalance } from "@ultimate-multimodal/muapi-client";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { StepCard } from "@/components/dashboard/MetricCard";
import { getJobs, getProjects } from "@/lib/storage";

export default async function DashboardOverviewPage() {
  const [jobs, projects, balance] = await Promise.all([
    getJobs(),
    getProjects(),
    getAccountBalance().catch(() => null),
  ]);

  const activeJobs = jobs.filter((j) => j.status === "pending" || j.status === "processing").length;
  const completedToday = jobs.filter((j) => {
    const d = new Date(j.createdAt);
    const today = new Date();
    return d.toDateString() === today.toDateString() && j.status === "completed";
  }).length;

  return (
    <div>
      <h1 className="dashboard-headline">
        Your <em>media studio</em> at a glance
      </h1>
      <p className="mt-4 text-[var(--color-stone)]">
        Monitor generations, projects, and API usage.
      </p>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard title="Generations today" value={completedToday} />
        <MetricCard title="Active jobs" value={activeJobs} />
        <MetricCard title="Projects" value={projects.length} />
        <MetricCard
          title="Credits remaining"
          value={balance ?? "—"}
          subtitle={balance === null ? "Configure API key in Settings" : undefined}
        />
      </div>

      <div className="mt-16 grid gap-6 md:grid-cols-3">
        <StepCard
          number={1}
          title="Configure API"
          description="Add your MuAPI key in Settings to start generating."
          variant="dark"
        />
        <StepCard
          number={2}
          title="Create UGC"
          description="Use the UGC Studio to build person + product video ads."
          variant="light"
        />
        <StepCard
          number={3}
          title="Monitor jobs"
          description="Track async video generation in the Jobs queue."
          variant="bordered"
        />
      </div>
    </div>
  );
}
