"use client";

import { useState } from "react";
import {
  buildDirectorPrompt,
  buildUgcVideoPrompt,
} from "@ultimate-multimodal/workflow-engine";
import { DarkSplitSection, FeatureChecklist } from "@/components/studio/FeatureChecklist";
import { JobProgress } from "@/components/studio/JobProgress";
import { MediaUploader } from "@/components/studio/MediaUploader";
import { PrimaryCTA } from "@/components/studio/PrimaryCTA";

const STEPS = [
  "Upload person & product",
  "Director prompt",
  "Hero image",
  "Approve hero",
  "Generate video",
];

const DEFAULT_SCRIPT =
  "Okay… first of all, ship happens. And this hat is honestly my favorite. It also comes in navy and black, so you can pick your vibe.";
const DEFAULT_ENV = "study room, laptop in front of it";

export default function UgcVideoFactoryPage() {
  const [personUrl, setPersonUrl] = useState("");
  const [productUrl, setProductUrl] = useState("");
  const [script, setScript] = useState(DEFAULT_SCRIPT);
  const [environment, setEnvironment] = useState(DEFAULT_ENV);
  const [heroUrl, setHeroUrl] = useState<string | null>(null);
  const [step, setStep] = useState(0);
  const [requestId, setRequestId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateHero = async () => {
    if (!personUrl || !productUrl) return;
    setLoading(true);
    setError(null);
    try {
      const prompt = buildDirectorPrompt("the person", "the product", environment);
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          type: "image_edit",
          params: {
            prompt,
            model: "nano-banana-pro-edit",
            imageUrls: [personUrl, productUrl],
            aspectRatio: "9:16",
            resolution: "1K",
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Hero generation failed");
      setRequestId(data.requestId);
      setStep(2);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  };

  const generateVideo = async () => {
    if (!heroUrl) return;
    setLoading(true);
    setError(null);
    try {
      const prompt = buildUgcVideoPrompt(script);
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          type: "video_from_image",
          params: {
            prompt,
            model: "seedance-2-vip-image-to-video",
            imageUrl: heroUrl,
            aspectRatio: "9:16",
            duration: 10,
            generateAudio: true,
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Video generation failed");
      setRequestId(data.requestId);
      setStep(4);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <section className="studio-section-light py-12">
        <div className="mx-auto max-w-[1280px] px-6">
          <h1 className="studio-headline text-4xl">UGC Video Factory</h1>
          <p className="mt-2 text-[var(--color-ash-mid)]">
            Person + product + script → 10s vertical UGC video ad
          </p>
        </div>
      </section>

      <DarkSplitSection headline="Build your UGC ad step by step">
        <FeatureChecklist items={STEPS} completed={step} />
      </DarkSplitSection>

      <section className="studio-section-light py-16">
        <div className="mx-auto max-w-[640px] space-y-6 px-6">
          <MediaUploader label="Person photo" onUploaded={(url) => { setPersonUrl(url); setStep(1); }} />
          <MediaUploader label="Product photo" onUploaded={setProductUrl} />
          <div>
            <label className="mb-1 block text-sm font-medium">Script</label>
            <textarea className="studio-input min-h-[80px]" value={script} onChange={(e) => setScript(e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Environment</label>
            <input className="studio-input" value={environment} onChange={(e) => setEnvironment(e.target.value)} />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          {!heroUrl && (
            <PrimaryCTA onClick={generateHero} disabled={loading || !personUrl || !productUrl}>
              {loading ? "Generating hero..." : "Generate Hero Image"}
            </PrimaryCTA>
          )}

          <JobProgress
            requestId={requestId && !heroUrl && step < 4 ? requestId : null}
            onComplete={(outputs) => {
              if (outputs[0]) {
                setHeroUrl(outputs[0]);
                setStep(3);
                setRequestId(null);
              }
            }}
          />

          {heroUrl && step < 4 && (
            <div className="space-y-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={heroUrl} alt="Hero" className="max-h-96 rounded" />
              <PrimaryCTA onClick={generateVideo} disabled={loading}>
                {loading ? "Generating video..." : "Approve & Generate Video"}
              </PrimaryCTA>
            </div>
          )}

          <JobProgress requestId={step >= 4 ? requestId : null} />
        </div>
      </section>
    </div>
  );
}
