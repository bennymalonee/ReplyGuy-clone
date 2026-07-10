"use client";

import { useState } from "react";

import { autoSaveStudioProject } from "@/components/media-studio/auto-save-project";
import { GenerationPanel } from "@/components/media-studio/generation-panel";
import { JobProgress } from "@/components/media-studio/job-progress";
import { OutputGallery } from "@/components/media-studio/output-gallery";
import { StudioPageShell } from "@/components/media-studio/studio-page-shell";
import { useStudioCampaign, useStudioSettings } from "@/components/media-studio/use-studio-hooks";

export default function MediaStudioImagePage() {
  const { campaignId } = useStudioCampaign();
  const { imageModels, defaultImageModel } = useStudioSettings();
  const [requestId, setRequestId] = useState<string | null>(null);
  const [outputs, setOutputs] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);

  async function handleComplete(nextOutputs: string[]) {
    setOutputs(nextOutputs);
    const project = await autoSaveStudioProject({
      name: campaignId ? "Campaign image generation" : "Image generation",
      workflow: "image_generate",
      campaignId,
      outputs: nextOutputs,
    });
    setSaved(Boolean(project));
  }

  return (
    <StudioPageShell
      title="Image studio"
      description="Generate concept art, product stills, and campaign images using MuAPI-backed image models."
    >
      <div className="grid gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="rounded-2xl border border-white/10 bg-zinc-950 p-6">
          <GenerationPanel
            type="image_generate"
            defaultModel={defaultImageModel}
            models={imageModels}
            onGenerated={(id) => {
              setOutputs([]);
              setSaved(false);
              setRequestId(id);
            }}
          />
        </div>
        <div className="space-y-6">
          <JobProgress requestId={requestId} onComplete={handleComplete} />
          {saved ? (
            <p className="text-sm text-emerald-300">Saved to your media projects.</p>
          ) : null}
          <div className="rounded-2xl border border-white/10 bg-black/60 p-6">
            <OutputGallery
              items={outputs.map((url, index) => ({
                title: `Output ${index + 1}`,
                url,
                subtitle: campaignId
                  ? "Linked to campaign"
                  : "Generated in native ReplyGuy media studio",
              }))}
            />
          </div>
        </div>
      </div>
    </StudioPageShell>
  );
}
