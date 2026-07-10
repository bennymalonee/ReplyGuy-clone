import Link from "next/link";
import { notFound } from "next/navigation";

import { StudioShell } from "@/components/media-studio/studio-shell";
import { getMediaStudioProjects } from "@/lib/media-studio-storage";
import { getCurrentUser } from "@/lib/session";

export default async function MediaStudioProjectsPage({
  searchParams,
}: {
  searchParams?: { campaignId?: string };
}) {
  const user = await getCurrentUser();
  if (!user?.id) return notFound();

  const campaignId = searchParams?.campaignId;
  const projects = await getMediaStudioProjects(user.id, campaignId);

  return (
    <StudioShell
      title="Saved projects"
      description="See stored workflow outputs and campaign drafts from the native media studio."
      campaignId={campaignId}
    >
      {projects.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-zinc-950 p-6 text-sm text-white/65">
          <p>No projects have been saved yet.</p>
          <Link
            href={`/dashboard/media-studio/ugc/video-factory${campaignId ? `?campaignId=${campaignId}` : ""}`}
            className="studio-cta mt-4 inline-block no-underline"
          >
            Create your first UGC ad
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {projects.map((project) => (
            <div
              key={project.id}
              className="rounded-2xl border border-white/10 bg-zinc-950 p-6"
            >
              <p className="text-lg font-semibold">{project.name}</p>
              <p className="mt-1 text-sm text-white/60">{project.workflow}</p>
              {project.campaignId ? (
                <Link
                  href={`/project?id=${project.campaignId}`}
                  className="mt-2 inline-block text-sm text-emerald-300"
                >
                  View campaign
                </Link>
              ) : null}
              <p className="mt-4 text-xs uppercase tracking-[0.2em] text-white/45">
                {project.outputs.length} outputs
              </p>
            </div>
          ))}
        </div>
      )}
    </StudioShell>
  );
}
