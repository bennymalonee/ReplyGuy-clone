import Link from "next/link";
import { getProjects } from "@/lib/storage";

export default async function DashboardProjectsPage() {
  const projects = await getProjects();

  return (
    <div>
      <h1 className="dashboard-headline">Saved <em>projects</em></h1>
      <p className="mt-4 text-[var(--color-stone)]">
        UGC campaigns and generation outputs.
      </p>

      {projects.length === 0 ? (
        <div className="dashboard-card mt-8">
          <p className="text-[var(--color-stone)]">No projects yet.</p>
          <Link href="/ugc/video-factory" className="dashboard-pill-btn mt-4 inline-block no-underline">
            Create your first UGC ad
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {projects.map((p) => (
            <div key={p.id} className="dashboard-card">
              <h3 className="text-lg font-semibold">{p.name}</h3>
              <p className="mt-1 text-sm text-[var(--color-stone)]">{p.workflow}</p>
              <p className="mt-2 text-xs text-[var(--color-stone)]">
                {new Date(p.createdAt).toLocaleDateString()}
              </p>
              {p.outputs.length > 0 && (
                <p className="mt-2 text-sm">{p.outputs.length} output(s)</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
