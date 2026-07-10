"use client";

import { useState } from "react";
import { GenerationPanel } from "@/components/studio/GenerationPanel";
import { JobProgress } from "@/components/studio/JobProgress";

const VIDEO_MODELS = [
  { id: "kling-v3.0-pro", label: "Kling v3.0 Pro" },
  { id: "seedance-2-vip-image-to-video", label: "Seedance 2 VIP" },
  { id: "veo3.1-image-to-video", label: "Veo 3.1" },
];

export default function VideoStudioPage() {
  const [requestId, setRequestId] = useState<string | null>(null);

  return (
    <div>
      <section className="studio-section-light py-16">
        <div className="mx-auto max-w-[1280px] px-6">
          <h1 className="studio-headline text-4xl">Video Studio</h1>
          <p className="mt-2 text-[var(--color-ash-mid)]">
            Text-to-video generation for social and cinematic content.
          </p>
        </div>
      </section>
      <section className="studio-section-dark py-16">
        <div className="mx-auto max-w-[1280px] px-6">
          <GenerationPanel
            type="video_generate"
            defaultModel="kling-v3.0-pro"
            models={VIDEO_MODELS}
            onGenerated={setRequestId}
          />
          <div className="mt-8">
            <JobProgress requestId={requestId} />
          </div>
        </div>
      </section>
    </div>
  );
}
