"use client";

import { useState } from "react";

import { autoSaveStudioProject } from "@/components/media-studio/auto-save-project";
import { JobProgress } from "@/components/media-studio/job-progress";
import { MediaUploader } from "@/components/media-studio/media-uploader";
import { PrimaryCta } from "@/components/media-studio/primary-cta";
import { StudioPageShell } from "@/components/media-studio/studio-page-shell";
import { useStudioCampaign } from "@/components/media-studio/use-studio-hooks";

const aspectMap: Record<string, string> = {
  instagram: "4:5",
  tiktok: "9:16",
  pinterest: "2:3",
  amazon: "1:1",
};

export default function UgcLifestyleTryOnPage() {
  const { campaignId } = useStudioCampaign();
  const [productUrl, setProductUrl] = useState("");
  const [productName, setProductName] = useState("");
  const [modelDesc, setModelDesc] = useState("woman, 25-30 years old, natural look, diverse");
  const [setting, setSetting] = useState("casual lifestyle, natural lighting");
  const [platform, setPlatform] = useState("instagram");
  const [tryOnUrl, setTryOnUrl] = useState<string | null>(null);
  const [finalUrl, setFinalUrl] = useState<string | null>(null);
  const [requestId, setRequestId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  async function generateTryOn() {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/media-studio/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          type: "image_edit",
          params: {
            prompt: `${modelDesc} wearing ${productName} naturally in a ${setting} environment. Authentic UGC-style photo, candid pose, natural expression.`,
            model: "ai-dress-change",
            imageUrls: [productUrl],
            aspectRatio: aspectMap[platform] ?? "4:5",
          },
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Try-on generation failed");
      setRequestId(data.requestId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Try-on generation failed");
    } finally {
      setLoading(false);
    }
  }

  async function generateLifestyleVariant() {
    if (!tryOnUrl) return;

    setLoading(true);
    setError(null);
    setSaved(false);
    try {
      const response = await fetch("/api/media-studio/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          type: "image_edit",
          params: {
            prompt: `Make this look like authentic UGC content with realistic ${setting}, natural light, subtle grain, and the product ${productName} clearly visible.`,
            model: "gpt4o-edit",
            imageUrls: [tryOnUrl],
            aspectRatio: aspectMap[platform] ?? "4:5",
          },
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Lifestyle generation failed");
      setRequestId(data.requestId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lifestyle generation failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleLifestyleComplete(outputs: string[]) {
    const output = outputs[0] ?? tryOnUrl;
    if (output) setFinalUrl(output);

    const project = await autoSaveStudioProject({
      name: `${productName || "Product"} Lifestyle Try-On`,
      workflow: "ugc-lifestyle-try-on",
      campaignId,
      inputs: { productUrl, productName, modelDesc, setting, platform },
      outputs: [tryOnUrl, output].filter(Boolean) as string[],
    });
    setSaved(Boolean(project));
  }

  return (
    <StudioPageShell
      title="UGC lifestyle try-on"
      description="Turn a product shot into creator-style lifestyle imagery optimized for the platform you’re publishing to."
    >
      <div className="space-y-6 rounded-2xl border border-white/10 bg-zinc-950 p-6">
        <div>
          <label className="mb-2 block text-sm font-medium">Product name</label>
          <input
            className="studio-input"
            value={productName}
            onChange={(event) => setProductName(event.target.value)}
          />
        </div>
        <MediaUploader label="Product image" onUploaded={setProductUrl} />
        <div>
          <label className="mb-2 block text-sm font-medium">Model description</label>
          <input
            className="studio-input"
            value={modelDesc}
            onChange={(event) => setModelDesc(event.target.value)}
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium">Setting</label>
          <input
            className="studio-input"
            value={setting}
            onChange={(event) => setSetting(event.target.value)}
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium">Platform</label>
          <select
            className="studio-input"
            value={platform}
            onChange={(event) => setPlatform(event.target.value)}
          >
            <option value="instagram">Instagram</option>
            <option value="tiktok">TikTok</option>
            <option value="pinterest">Pinterest</option>
            <option value="amazon">Amazon</option>
          </select>
        </div>
        {error ? <p className="text-sm text-red-400">{error}</p> : null}
        {!tryOnUrl ? (
          <PrimaryCta
            onClick={generateTryOn}
            disabled={loading || !productUrl || !productName}
          >
            {loading ? "Generating..." : "Generate try-on image"}
          </PrimaryCta>
        ) : null}
        <JobProgress
          requestId={requestId && !tryOnUrl ? requestId : null}
          onComplete={(outputs) => {
            if (outputs[0]) {
              setTryOnUrl(outputs[0]);
              setRequestId(null);
            }
          }}
        />
        {tryOnUrl ? (
          <div className="space-y-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={finalUrl ?? tryOnUrl} alt="Try-on output" className="max-h-[480px] rounded-xl" />
            <PrimaryCta onClick={generateLifestyleVariant} disabled={loading}>
              {loading ? "Generating..." : "Generate lifestyle variant"}
            </PrimaryCta>
            <JobProgress
              requestId={tryOnUrl && requestId ? requestId : null}
              onComplete={handleLifestyleComplete}
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
