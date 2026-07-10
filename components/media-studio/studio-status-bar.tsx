"use client";

import Link from "next/link";

import { useStudioSettings } from "@/components/media-studio/use-studio-hooks";

interface StudioStatusBarProps {
  campaignId?: string;
  campaignName?: string;
}

export function StudioStatusBar({ campaignId, campaignName }: StudioStatusBarProps) {
  const { balance } = useStudioSettings();

  return (
    <div className="flex flex-wrap items-center gap-3">
      {campaignId ? (
        <Link
          href={`/project?id=${campaignId}`}
          className="rounded-full border border-emerald-300/30 bg-emerald-300/10 px-4 py-2 text-sm text-emerald-200 no-underline"
        >
          Linked to {campaignName ?? "campaign"}
        </Link>
      ) : null}
      {balance !== null ? (
        <span className="rounded-full border border-white/15 px-4 py-2 text-sm text-white/75">
          MuAPI credits: <strong className="text-white">{balance}</strong>
        </span>
      ) : null}
    </div>
  );
}
