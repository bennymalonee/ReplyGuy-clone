import Link from "next/link";

import { OutputGallery } from "@/components/media-studio/output-gallery";
import { getMediaStudioProjects } from "@/lib/media-studio-storage";
import { getCurrentUser } from "@/lib/session";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CampaignMediaAssetsProps {
  campaignId: string;
  campaignName: string;
}

export async function CampaignMediaAssets({
  campaignId,
  campaignName,
}: CampaignMediaAssetsProps) {
  const user = await getCurrentUser();
  if (!user?.id) return null;

  const projects = await getMediaStudioProjects(user.id, campaignId);
  const outputs = projects.flatMap((project) =>
    project.outputs.map((url) => ({
      title: project.name,
      url,
      subtitle: project.workflow,
    }))
  );

  return (
    <div className="rounded-2xl border p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold">Campaign media assets</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Generated creatives linked to {campaignName}.
          </p>
        </div>
        <Link
          href={`/dashboard/media-studio/ugc?campaignId=${campaignId}`}
          className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
        >
          Create new asset
        </Link>
      </div>
      <div className="mt-6">
        {outputs.length > 0 ? (
          <OutputGallery items={outputs.slice(0, 6)} />
        ) : (
          <p className="text-sm text-muted-foreground">
            No media assets saved for this campaign yet.
          </p>
        )}
      </div>
    </div>
  );
}
