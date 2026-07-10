"use client";

import { useState } from "react";
import { GenerationPanel } from "@/components/studio/GenerationPanel";
import { JobProgress } from "@/components/studio/JobProgress";
import { OutputGallery } from "@/components/studio/OutputGallery";

const IMAGE_MODELS = [
  { id: "flux-dev", label: "Flux Dev" },
  { id: "flux-schnell", label: "Flux Schnell" },
  { id: "hidream-fast", label: "HiDream Fast" },
  { id: "nano-banana-pro-edit", label: "Nano Banana Pro Edit" },
];

export default function ImageStudioPage() {
  const [requestId, setRequestId] = useState<string | null>(null);
  const [outputs, setOutputs] = useState<{ title: string; url: string }[]>([]);

  return (
    <div>
      <section className="studio-section-light py-16">
        <div className="mx-auto max-w-[1280px] px-6">
          <h1 className="studio-headline text-4xl">Image Studio</h1>
          <p className="mt-2 text-[var(--color-ash-mid)]">
            Generate and edit images with MuAPI models.
          </p>
        </div>
      </section>
      <section className="studio-section-dark py-16">
        <div className="mx-auto max-w-[1280px] px-6">
          <GenerationPanel
            type="image_generate"
            defaultModel="flux-dev"
            models={IMAGE_MODELS}
            onGenerated={setRequestId}
          />
          <div className="mt-8">
            <JobProgress
              requestId={requestId}
              onComplete={(urls) =>
                setOutputs(urls.map((url, i) => ({ title: `Image ${i + 1}`, url })))
              }
            />
          </div>
        </div>
      </section>
      <section className="studio-section-light py-16">
        <div className="mx-auto max-w-[1280px] px-6">
          <h2 className="text-2xl font-bold">Gallery</h2>
          <div className="mt-6">
            <OutputGallery items={outputs} />
          </div>
        </div>
      </section>
    </div>
  );
}
