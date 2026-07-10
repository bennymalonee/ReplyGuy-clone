import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";
import { buildMediaStudioUrl, getMediaStudioSetupHint } from "@/lib/media-studio";
import { getCurrentUser } from "@/lib/session";
import { DashboardHeader } from "@/components/dashboard/header";
import { EmbeddedStudio } from "@/components/media-studio/embedded-studio";
import { DashboardShell } from "@/components/dashboard/shell";

export const metadata = {
  title: "Media Studio",
  description: "Use the Ultimate Multimodal media studio inside ReplyGuy.",
};

export default async function MediaStudioBridgePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login");
  }

  const studioUrl = buildMediaStudioUrl("dashboard", user);

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Media Studio"
        text="Create UGC video, image, and campaign assets without leaving ReplyGuy."
      />
      <EmbeddedStudio
        title="Ultimate Multimodal"
        description="Creator workspace for UGC ads, image/video generation, and workflow recipes."
        src={studioUrl}
        setupHint={getMediaStudioSetupHint()}
      />
    </DashboardShell>
  );
}
