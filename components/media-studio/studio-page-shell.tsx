"use client";

import { Suspense } from "react";
import * as React from "react";

import { StudioShell } from "@/components/media-studio/studio-shell";
import { useStudioCampaign } from "@/components/media-studio/use-studio-hooks";

function StudioShellWithCampaign({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  const { campaignId } = useStudioCampaign();

  return (
    <StudioShell title={title} description={description} campaignId={campaignId}>
      {children}
    </StudioShell>
  );
}

export function StudioPageShell(props: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <Suspense>
      <StudioShellWithCampaign {...props} />
    </Suspense>
  );
}
