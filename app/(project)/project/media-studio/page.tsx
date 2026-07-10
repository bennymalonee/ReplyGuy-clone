import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";
import { buildMediaStudioUrl } from "@/lib/media-studio";
import { getCurrentUser } from "@/lib/session";

export const metadata = {
  title: "Media Studio",
};

export default async function ProjectMediaStudioPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login");
  }

  const studioUrl = buildMediaStudioUrl("studio", user);

  if (!studioUrl) {
    redirect("/dashboard/media-studio");
  }

  redirect(studioUrl);
}
