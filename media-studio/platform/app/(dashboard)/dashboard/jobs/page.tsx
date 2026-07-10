import { JobQueueTable } from "@/components/dashboard/JobQueueTable";
import { getJobs } from "@/lib/storage";

export default async function DashboardJobsPage() {
  const jobs = await getJobs();

  return (
    <div>
      <h1 className="dashboard-headline">Job <em>queue</em></h1>
      <p className="mt-4 text-[var(--color-stone)]">
        Track async generation jobs and their status.
      </p>
      <div className="mt-8">
        <JobQueueTable jobs={jobs} />
      </div>
    </div>
  );
}
