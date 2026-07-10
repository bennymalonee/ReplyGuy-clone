"use client";

import { useState } from "react";
import { JobProgress } from "@/components/studio/JobProgress";
import { MediaUploader } from "@/components/studio/MediaUploader";
import { PrimaryCTA } from "@/components/studio/PrimaryCTA";

export default function UgcLifestyleTryOnPage() {
  const [productUrl, setProductUrl] = useState("");
  const [productName, setProductName] = useState("");
  const [modelDesc, setModelDesc] = useState("woman, 25-30 years old, natural look, diverse");
  const [setting, setSetting] = useState("casual lifestyle, natural lighting");
  const [platform, setPlatform] = useState("instagram");
  const [tryonUrl, setTryonUrl] = useState<string | null>(null);
  const [requestId, setRequestId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const aspectMap: Record<string, string> = {
    instagram: "4:5",
    tiktok: "9:16",
    pinterest: "2:3",
    amazon: "1:1",
  };

  const runTryOn = async () => {
    if (!productUrl || !productName) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          type: "image_edit",
          params: {
            prompt: `${modelDesc} wearing the product naturally in a ${setting} environment. Authentic UGC-style photo, candid pose, natural expression.`,
            model: "ai-dress-change",
            imageUrls: [productUrl],
            aspectRatio: aspectMap[platform] ?? "4:5",
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Try-on failed");
      setRequestId(data.requestId);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  };

  const runLifestyle = async () => {
    if (!tryonUrl) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          type: "image_edit",
          params: {
            prompt: `Make this look like authentic UGC content — add realistic environment context for ${setting}, adjust lighting to feel natural and unposed, subtle film grain, candid photography style. Keep product ${productName} clearly visible and well-lit.`,
            model: "gpt4o-edit",
            imageUrls: [tryonUrl],
            aspectRatio: aspectMap[platform] ?? "4:5",
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Lifestyle failed");
      setRequestId(data.requestId);
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
          <h1 className="studio-headline text-4xl">UGC Lifestyle Try-On</h1>

          <div>
            <label className="mb-1 block text-sm font-medium">Product name</label>
            <input className="studio-input" value={productName} onChange={(e) => setProductName(e.target.value)} />
          </div>
          <MediaUploader label="Product image" onUploaded={setProductUrl} />
          <div>
            <label className="mb-1 block text-sm font-medium">Model description</label>
            <input className="studio-input" value={modelDesc} onChange={(e) => setModelDesc(e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Setting</label>
            <input className="studio-input" value={setting} onChange={(e) => setSetting(e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Platform</label>
            <select className="studio-input" value={platform} onChange={(e) => setPlatform(e.target.value)}>
              <option value="instagram">Instagram (4:5)</option>
              <option value="tiktok">TikTok (9:16)</option>
              <option value="pinterest">Pinterest (2:3)</option>
              <option value="amazon">Amazon (1:1)</option>
            </select>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          {!tryonUrl && (
            <PrimaryCTA onClick={runTryOn} disabled={loading || !productUrl || !productName}>
              {loading ? "Generating try-on..." : "Generate Try-On"}
            </PrimaryCTA>
          )}

          <JobProgress
            requestId={requestId && !tryonUrl ? requestId : null}
            onComplete={(outputs) => {
              if (outputs[0]) {
                setTryonUrl(outputs[0]);
                setRequestId(null);
              }
            }}
          />

          {tryonUrl && (
            <div className="space-y-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={tryonUrl} alt="Try-on" className="max-h-96 rounded" />
              <PrimaryCTA onClick={runLifestyle} disabled={loading}>
                {loading ? "Generating lifestyle..." : "Generate Lifestyle Variant"}
              </PrimaryCTA>
              <JobProgress requestId={tryonUrl && requestId ? requestId : null} />
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
