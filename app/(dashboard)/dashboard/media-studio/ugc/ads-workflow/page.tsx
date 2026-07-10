"use client";

import { useState } from "react";
import { buildUgcCompositePrompt } from "@ultimate-multimodal/workflow-engine";

import { autoSaveStudioProject } from "@/components/media-studio/auto-save-project";
import { JobProgress } from "@/components/media-studio/job-progress";
import { MediaUploader } from "@/components/media-studio/media-uploader";
import { PrimaryCta } from "@/components/media-studio/primary-cta";
import { StudioPageShell } from "@/components/media-studio/studio-page-shell";
import { useStudioCampaign } from "@/components/media-studio/use-studio-hooks";

export default function UgcAdsWorkflowPage() {
  const { campaignId } = useStudioCampaign();
  const [humanUrl, setHumanUrl] = useState("");
  const [productUrl, setProductUrl] = useState("");
  const [productName, setProductName] = useState("");
  const [compositeUrl, setCompositeUrl] = useState<string | null>(null);
  const [compositeRequestId, setCompositeRequestId] = useState<string | null>(null);
  const [videoRequestId, setVideoRequestId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  async function combineImages() {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/media-studio/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          type: "image_edit",
          params: {
            prompt: buildUgcCompositePrompt(productName),
            model: "gpt-image-2-text-to-image",
            imageUrls: [humanUrl, productUrl],
            aspectRatio: "9:16",
          },
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Image combine failed");
      setCompositeRequestId(data.requestId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Image combine failed");
    } finally {
      setLoading(false);
    }
  }

  async function animateVideo() {
    if (!compositeUrl) return;

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
            prompt: `A natural UGC-style video of the creator holding ${productName}, smiling, talking to camera, and moving casually in a vertical social ad frame.`,
            model: "veo3.1-image-to-video",
            imageUrl: compositeUrl,
            aspectRatio: "9:16",
            duration: 10,
          },
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Video generation failed");
      setVideoRequestId(data.requestId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Video generation failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleVideoComplete(outputs: string[]) {
    const allOutputs = [compositeUrl, ...outputs].filter(Boolean) as string[];
    const project = await autoSaveStudioProject({
      name: `${productName || "Product"} UGC Ad`,
      workflow: "ugc-ads-workflow",
      campaignId,
      inputs: { humanUrl, productUrl, productName },
      outputs: allOutputs,
    });
    setSaved(Boolean(project));
  }

  return (
    <StudioPageShell
      title="UGC ads workflow"
      description="Combine a creator selfie and a product shot into a social-ready composite, then animate it into a vertical clip."
    >
      <div className="space-y-6 rounded-2xl border border-white/10 bg-zinc-950 p-6">
        <div>
          <label className="mb-2 block text-sm font-medium">Product name</label>
          <input
            className="studio-input"
            value={productName}
            onChange={(event) => setProductName(event.target.value)}
            placeholder="Blume SuperBalm in plum"
          />
        </div>
        <MediaUploader label="Creator selfie" onUploaded={setHumanUrl} />
        <MediaUploader label="Product image" onUploaded={setProductUrl} />
        {error ? <p className="text-sm text-red-400">{error}</p> : null}
        {!compositeUrl ? (
          <PrimaryCta
            onClick={combineImages}
            disabled={loading || !humanUrl || !productUrl || !productName}
          >
            {loading ? "Combining..." : "Build composite image"}
          </PrimaryCta>
        ) : null}
        <JobProgress
          requestId={compositeRequestId && !compositeUrl ? compositeRequestId : null}
          onComplete={(outputs) => {
            if (outputs[0]) {
              setCompositeUrl(outputs[0]);
              setCompositeRequestId(null);
            }
          }}
        />
        {compositeUrl ? (
          <div className="space-y-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={compositeUrl} alt="Composite" className="max-h-[480px] rounded-xl" />
            <PrimaryCta onClick={animateVideo} disabled={loading}>
              {loading ? "Animating..." : "Animate to UGC video"}
            </PrimaryCta>
            <JobProgress
              requestId={videoRequestId}
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
    </StudioPageShell>
  );
}
