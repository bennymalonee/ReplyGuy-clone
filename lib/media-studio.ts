import { env } from "@/env.mjs";

type StudioTarget = "studio" | "dashboard";

export function getMediaStudioBaseUrl(): string | null {
  const value =
    process.env.MEDIA_STUDIO_URL ??
    process.env.NEXT_PUBLIC_MEDIA_STUDIO_URL ??
    null;

  if (!value) {
    return null;
  }

  return value.replace(/\/+$/, "");
}

export function buildMediaStudioUrl(
  target: StudioTarget,
  user?: { email?: string | null; name?: string | null },
): string | null {
  const baseUrl = getMediaStudioBaseUrl();
  if (!baseUrl) {
    return null;
  }

  const pathname = target === "dashboard" ? "/dashboard" : "/";
  const url = new URL(`${baseUrl}${pathname}`);

  url.searchParams.set("from", "replyguy");

  if (user?.email) {
    url.searchParams.set("email", user.email);
  }

  if (user?.name) {
    url.searchParams.set("name", user.name);
  }

  return url.toString();
}

export function getMediaStudioSetupHint(): string {
  return `Set MEDIA_STUDIO_URL or NEXT_PUBLIC_MEDIA_STUDIO_URL to your deployed studio URL (for example http://localhost:3001 or https://studio.yourdomain.com) so ReplyGuy can embed the app in an iframe.`;
}
