import { notFound } from "next/navigation";

import { StudioShell } from "@/components/media-studio/studio-shell";
import { getMediaStudioJobs } from "@/lib/media-studio-storage";
import { getCurrentUser } from "@/lib/session";

export default async function MediaStudioJobsPage() {
  const user = await getCurrentUser();
  if (!user?.id) return notFound();

  const jobs = await getMediaStudioJobs(user.id);

  return (
    <StudioShell
      title="Generation jobs"
      description="Track all native media generation jobs launched from the main ReplyGuy app."
    >
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-950">
        <div className="grid grid-cols-[1.4fr_1fr_1fr] gap-4 border-b border-white/10 px-5 py-3 text-xs uppercase tracking-[0.2em] text-white/45">
          <span>Job</span>
          <span>Model</span>
          <span>Status</span>
        </div>
        {jobs.length === 0 ? (
          <p className="px-5 py-8 text-sm text-white/60">No media studio jobs yet.</p>
        ) : (
          jobs.map((job) => (
            <div
              key={job.id}
              className="grid grid-cols-[1.4fr_1fr_1fr] gap-4 border-b border-white/10 px-5 py-4 text-sm last:border-b-0"
            >
              <div>
                <p className="font-medium">{job.type}</p>
                <p className="mt-1 text-xs text-white/50">{job.id}</p>
              </div>
              <p className="text-white/70">{job.model}</p>
              <p className="capitalize text-white/80">{job.status}</p>
            </div>
          ))
        )}
      </div>
    </StudioShell>
  );
}
