"use client";

import type { StoredJob } from "@ultimate-multimodal/shared";

interface JobQueueTableProps {
  jobs: StoredJob[];
}

export function JobQueueTable({ jobs }: JobQueueTableProps) {
  if (!jobs.length) {
    return (
      <p className="text-sm text-[var(--color-stone)]">No jobs in queue.</p>
    );
  }

  return (
    <div className="dashboard-card !p-0 overflow-hidden">
      {jobs.map((job) => (
        <div key={job.id} className="dashboard-accordion-row flex items-center justify-between px-8">
          <div>
            <p className="font-medium text-[var(--color-charcoal)]">{job.type}</p>
            <p className="text-sm text-[var(--color-stone)]">{job.model}</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="dashboard-badge capitalize">{job.status}</span>
            <span className="text-xs text-[var(--color-stone)]">
              {new Date(job.createdAt).toLocaleString()}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
