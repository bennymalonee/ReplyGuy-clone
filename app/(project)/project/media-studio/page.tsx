import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";
import { buildMediaStudioUrl, getMediaStudioSetupHint } from "@/lib/media-studio";
import { getCurrentUser } from "@/lib/session";
import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardShell } from "@/components/dashboard/shell";
import { EmbeddedStudio } from "@/components/media-studio/embedded-studio";

export const metadata = {
  title: "Media Studio",
};

export default async function ProjectMediaStudioPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login");
  }

  const studioUrl = buildMediaStudioUrl("studio", user);

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Media Studio"
        text="Generate UGC assets for the campaign work you are doing in ReplyGuy."
      />
      <EmbeddedStudio
        title="Ultimate Multimodal Studio"
        description="Use the embedded creator app to make ad creatives, lifestyle try-ons, and video assets."
        src={studioUrl}
        setupHint={getMediaStudioSetupHint()}
      />
    </DashboardShell>
  );
}
