"use client";

import { useState } from "react";
import {
  buildDirectorPrompt,
  buildUgcVideoPrompt,
} from "@ultimate-multimodal/workflow-engine";

import { autoSaveStudioProject } from "@/components/media-studio/auto-save-project";
import { FeatureChecklist } from "@/components/media-studio/feature-checklist";
import { JobProgress } from "@/components/media-studio/job-progress";
import { MediaUploader } from "@/components/media-studio/media-uploader";
import { PrimaryCta } from "@/components/media-studio/primary-cta";
import { StudioPageShell } from "@/components/media-studio/studio-page-shell";
import { useStudioCampaign } from "@/components/media-studio/use-studio-hooks";

const steps = [
  "Upload person and product",
  "Generate hero image",
  "Approve hero frame",
  "Render vertical UGC clip",
];

export default function UgcVideoFactoryPage() {
  const { campaignId } = useStudioCampaign();
  const [personUrl, setPersonUrl] = useState("");
  const [productUrl, setProductUrl] = useState("");
  const [script, setScript] = useState(
    "Okay, ship happens. This is the one product I keep coming back to because it actually fits real life."
  );
  const [environment, setEnvironment] = useState("modern home office with soft daylight");
  const [heroUrl, setHeroUrl] = useState<string | null>(null);
  const [requestId, setRequestId] = useState<string | null>(null);
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  async function generateHero() {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/media-studio/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          type: "image_edit",
          params: {
            prompt: buildDirectorPrompt("the creator", "the product", environment),
            model: "nano-banana-pro-edit",
            imageUrls: [personUrl, productUrl],
            aspectRatio: "9:16",
            resolution: "1K",
          },
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Hero generation failed");
      setRequestId(data.requestId);
      setStep(1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Hero generation failed");
    } finally {
      setLoading(false);
    }
  }

  async function generateVideo() {
    if (!heroUrl) return;

    setLoading(true);
    setError(null);
    setSaved(false);
    try {
      const response = await fetch("/api/media-studio/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          type: "video_from_image",
          params: {
            prompt: buildUgcVideoPrompt(script),
            model: "seedance-2-vip-image-to-video",
            imageUrl: heroUrl,
            aspectRatio: "9:16",
            duration: 10,
            generateAudio: true,
          },
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Video generation failed");
      setRequestId(data.requestId);
      setStep(3);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Video generation failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleVideoComplete(outputs: string[]) {
    const allOutputs = [heroUrl, ...outputs].filter(Boolean) as string[];
    const project = await autoSaveStudioProject({
      name: "UGC Video Factory",
      workflow: "ugc-video-factory",
      campaignId,
      inputs: { personUrl, productUrl, script, environment },
      outputs: allOutputs,
    });
    setSaved(Boolean(project));
  }

  return (
    <StudioPageShell
      title="UGC video factory"
      description="Build a creator-style product ad from reference photos, a script, and a single native workflow."
    >
      <div className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
        <div className="rounded-2xl border border-white/10 bg-zinc-950 p-6">
          <FeatureChecklist items={steps} completed={step} />
        </div>
        <div className="space-y-6 rounded-2xl border border-white/10 bg-zinc-950 p-6">
          <MediaUploader label="Creator photo" onUploaded={(url) => setPersonUrl(url)} />
          <MediaUploader label="Product photo" onUploaded={(url) => setProductUrl(url)} />
          <div>
            <label className="mb-2 block text-sm font-medium">Script</label>
            <textarea
              className="studio-input min-h-[100px]"
              value={script}
              onChange={(event) => setScript(event.target.value)}
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Environment</label>
            <input
              className="studio-input"
              value={environment}
              onChange={(event) => setEnvironment(event.target.value)}
            />
          </div>
          {error ? <p className="text-sm text-red-400">{error}</p> : null}
          {!heroUrl ? (
            <PrimaryCta
              onClick={generateHero}
              disabled={loading || !personUrl || !productUrl}
            >
              {loading ? "Generating hero..." : "Generate hero image"}
            </PrimaryCta>
          ) : null}
          <JobProgress
            requestId={requestId && !heroUrl ? requestId : null}
            onComplete={(outputs) => {
              if (outputs[0]) {
                setHeroUrl(outputs[0]);
                setRequestId(null);
                setStep(2);
              }
            }}
          />
          {heroUrl ? (
            <div className="space-y-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={heroUrl} alt="Hero frame" className="max-h-[480px] rounded-xl" />
              <PrimaryCta onClick={generateVideo} disabled={loading}>
                {loading ? "Generating clip..." : "Approve and generate video"}
              </PrimaryCta>
              <JobProgress
                requestId={step === 3 ? requestId : null}
                onComplete={handleVideoComplete}
              />
              {saved ? (
                <p className="text-sm text-emerald-300">
                  Saved to{campaignId ? " campaign" : ""} media projects.
                </p>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </StudioPageShell>
  );
}
