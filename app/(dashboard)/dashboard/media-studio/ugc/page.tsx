import Link from "next/link";
import { UGC_WORKFLOWS } from "@ultimate-multimodal/workflow-engine";

import { StudioShell } from "@/components/media-studio/studio-shell";

const hrefBySlug: Record<string, string> = {
  "muapi-ugc-video-factory": "/dashboard/media-studio/ugc/video-factory",
  "muapi-ugc-ads-workflow": "/dashboard/media-studio/ugc/ads-workflow",
  "muapi-ugc-lifestyle-try-on": "/dashboard/media-studio/ugc/lifestyle-try-on",
};

export default function MediaStudioUgcPage({
  searchParams,
}: {
  searchParams?: { campaignId?: string };
}) {
  const campaignId = searchParams?.campaignId;
  const query = campaignId ? `?campaignId=${campaignId}` : "";

  return (
    <StudioShell
      title="UGC workflows"
      description="Open the MuAPI workflow recipes directly inside ReplyGuy with no external studio handoff."
      campaignId={campaignId}
    >
      <div className="grid gap-4 lg:grid-cols-3">
        {UGC_WORKFLOWS.map((workflow) => (
          <Link
            key={workflow.slug}
            href={`${hrefBySlug[workflow.slug]}${query}`}
            className="rounded-2xl border border-white/10 bg-zinc-950 p-6 transition hover:border-emerald-300/60"
          >
            <p className="text-xs uppercase tracking-[0.22em] text-emerald-300">UGC</p>
            <h2 className="mt-3 text-xl font-semibold">{workflow.title}</h2>
            <p className="mt-2 text-sm text-white/65">{workflow.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {workflow.steps.map((step) => (
                <span
                  key={step}
                  className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/70"
                >
                  {step}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </StudioShell>
  );
}
