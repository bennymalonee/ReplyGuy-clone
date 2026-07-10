import Link from "next/link";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";
import { buildMediaStudioUrl, getMediaStudioSetupHint } from "@/lib/media-studio";
import { getCurrentUser } from "@/lib/session";
import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardShell } from "@/components/dashboard/shell";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Media Studio",
  description: "Launch the Ultimate Multimodal media studio.",
};

export default async function MediaStudioBridgePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login");
  }

  const studioUrl = buildMediaStudioUrl("dashboard", user);

  if (studioUrl) {
    redirect(studioUrl);
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Media Studio"
        text="Your ReplyGuy account is ready. Connect a studio URL to open the UGC creator workspace."
      />
      <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
        <p className="text-sm text-muted-foreground">{getMediaStudioSetupHint()}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/dashboard/settings"
            className={cn(buttonVariants({ size: "sm" }))}
          >
            Open Settings
          </Link>
          <Link
            href="https://github.com/bennymalonee/ReplyGuy-clone/tree/main/media-studio"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
            target="_blank"
            rel="noreferrer"
          >
            View media-studio
          </Link>
        </div>
      </div>
    </DashboardShell>
  );
}
