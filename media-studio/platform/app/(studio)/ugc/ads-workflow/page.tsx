"use client";

import { useState } from "react";
import { buildUgcCompositePrompt } from "@ultimate-multimodal/workflow-engine";
import { JobProgress } from "@/components/studio/JobProgress";
import { MediaUploader } from "@/components/studio/MediaUploader";
import { PrimaryCTA } from "@/components/studio/PrimaryCTA";

export default function UgcAdsWorkflowPage() {
  const [humanUrl, setHumanUrl] = useState("");
  const [productUrl, setProductUrl] = useState("");
  const [productName, setProductName] = useState("");
  const [compositeUrl, setCompositeUrl] = useState<string | null>(null);
  const [compositeRequestId, setCompositeRequestId] = useState<string | null>(null);
  const [videoRequestId, setVideoRequestId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const combineImages = async () => {
    if (!humanUrl || !productUrl || !productName) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/generate", {
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
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Combine failed");
      setCompositeRequestId(data.requestId);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  };

  const animateVideo = async () => {
    if (!compositeUrl) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          type: "video_from_image",
          params: {
            prompt: `A UGC-style video. The influencer holds the ${productName}, smiling genuinely. Natural movements, talking to the camera, lifestyle vlog style.`,
            model: "veo3.1-image-to-video",
            imageUrl: compositeUrl,
            aspectRatio: "9:16",
            duration: 10,
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Video failed");
      setVideoRequestId(data.requestId);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <section className="studio-section-light py-12">
        <div className="mx-auto max-w-[640px] space-y-6 px-6">
          <h1 className="studio-headline text-4xl">UGC Ads Workflow</h1>
          <p className="text-[var(--color-ash-mid)]">
            Selfie + product → composite image → animated UGC video
          </p>

          <div>
            <label className="mb-1 block text-sm font-medium">Product name</label>
            <input
              className="studio-input"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="e.g. Blume SuperBalm in plum"
            />
          </div>

          <MediaUploader label="Selfie / influencer photo" onUploaded={setHumanUrl} />
          <MediaUploader label="Product photo" onUploaded={setProductUrl} />

          {error && <p className="text-sm text-red-600">{error}</p>}

          {!compositeUrl && (
            <PrimaryCTA onClick={combineImages} disabled={loading || !humanUrl || !productUrl || !productName}>
              {loading ? "Combining..." : "Combine Images"}
            </PrimaryCTA>
          )}

          <JobProgress
            requestId={compositeRequestId && !compositeUrl ? compositeRequestId : null}
            onComplete={(outputs) => {
              if (outputs[0]) {
                setCompositeUrl(outputs[0]);
                setCompositeRequestId(null);
              }
            }}
          />

          {compositeUrl && (
            <div className="space-y-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={compositeUrl} alt="Composite" className="max-h-96 rounded" />
              <PrimaryCTA onClick={animateVideo} disabled={loading}>
                {loading ? "Animating..." : "Animate to Video"}
              </PrimaryCTA>
              <JobProgress requestId={videoRequestId} />
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
