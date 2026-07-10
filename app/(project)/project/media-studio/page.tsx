import Link from "next/link";

import { SearchParams } from "@/types";

export const metadata = {
  title: "Media Studio",
};

interface ProjectMediaStudioPageProps {
  searchParams: SearchParams<"id">;
}

export default function ProjectMediaStudioPage({
  searchParams,
}: ProjectMediaStudioPageProps) {
  const campaignId = searchParams.id as string | undefined;
  const query = campaignId ? `?campaignId=${campaignId}` : "";

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-card p-6">
        <h1 className="text-3xl font-semibold">Project media studio</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Launch native UGC workflows inside ReplyGuy. Outputs from these flows
          {campaignId ? " will be linked to this campaign." : " can be linked to a campaign when opened from a project."}
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Link
          href={`/dashboard/media-studio/ugc/video-factory${query}`}
          className="rounded-2xl border border-border bg-card p-5 transition hover:border-primary/50"
        >
          <p className="font-semibold">UGC Video Factory</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Creator photo + product + script to vertical ad.
          </p>
        </Link>
        <Link
          href={`/dashboard/media-studio/ugc/ads-workflow${query}`}
          className="rounded-2xl border border-border bg-card p-5 transition hover:border-primary/50"
        >
          <p className="font-semibold">UGC Ads Workflow</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Selfie and product into a composite clip.
          </p>
        </Link>
        <Link
          href={`/dashboard/media-studio/ugc/lifestyle-try-on${query}`}
          className="rounded-2xl border border-border bg-card p-5 transition hover:border-primary/50"
        >
          <p className="font-semibold">Lifestyle Try-On</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Turn product shots into social-ready try-on imagery.
          </p>
        </Link>
      </div>
    </div>
  );
}
