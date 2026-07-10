import * as React from "react";
import Link from "next/link";

import { StudioStatusBar } from "@/components/media-studio/studio-status-bar";
import { cn } from "@/lib/utils";

const baseLinks = [
  { href: "/dashboard/media-studio", label: "Overview" },
  { href: "/dashboard/media-studio/image", label: "Image" },
  { href: "/dashboard/media-studio/video", label: "Video" },
  { href: "/dashboard/media-studio/ugc", label: "UGC" },
  { href: "/dashboard/media-studio/workflows", label: "Workflows" },
  { href: "/dashboard/media-studio/jobs", label: "Jobs" },
  { href: "/dashboard/media-studio/projects", label: "Projects" },
  { href: "/dashboard/media-studio/settings", label: "Settings" },
];

function withCampaign(href: string, campaignId?: string) {
  if (!campaignId) return href;
  const separator = href.includes("?") ? "&" : "?";
  return `${href}${separator}campaignId=${campaignId}`;
}

export function StudioShell({
  title,
  description,
  campaignId,
  campaignName,
  children,
}: {
  title: string;
  description: string;
  campaignId?: string;
  campaignName?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="media-studio-theme space-y-8 text-white">
      <div className="rounded-3xl border border-white/10 bg-black p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-emerald-300">
              MuAPI Studio
            </p>
            <h1 className="studio-headline mt-3 text-4xl md:text-5xl">{title}</h1>
            <p className="mt-3 max-w-3xl text-sm text-white/70 md:text-base">
              {description}
            </p>
            <div className="mt-4">
              <StudioStatusBar campaignId={campaignId} campaignName={campaignName} />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {baseLinks.map((link) => (
              <Link
                key={link.href}
                href={withCampaign(link.href, campaignId)}
                className={cn(
                  "rounded-full border border-white/15 px-4 py-2 text-sm text-white/80 transition hover:border-white/40 hover:text-white"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}
