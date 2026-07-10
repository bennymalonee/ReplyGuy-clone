"use client";

import { useState } from "react";

import { PrimaryCta } from "@/components/media-studio/primary-cta";

interface GenerationPanelProps {
  type: "image_generate" | "video_generate";
  defaultModel: string;
  models: { id: string; label: string }[];
  onGenerated: (requestId: string) => void;
}

export function GenerationPanel({
  type,
  defaultModel,
  models,
  onGenerated,
}: GenerationPanelProps) {
  const [prompt, setPrompt] = useState("");
  const [model, setModel] = useState(defaultModel);
  const [aspectRatio, setAspectRatio] = useState(
    type === "video_generate" ? "9:16" : "1:1"
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate() {
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/media-studio/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ type, params: { prompt, model, aspectRatio } }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Generation failed");
      }

      onGenerated(data.requestId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <textarea
        className="studio-input min-h-[120px]"
        placeholder="Describe what you want to create..."
        value={prompt}
        onChange={(event) => setPrompt(event.target.value)}
      />
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">Model</label>
          <select
            className="studio-input"
            value={model}
            onChange={(event) => setModel(event.target.value)}
          >
            {models.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Aspect Ratio</label>
          <select
            className="studio-input"
            value={aspectRatio}
            onChange={(event) => setAspectRatio(event.target.value)}
          >
            <option value="1:1">1:1</option>
            <option value="4:5">4:5</option>
            <option value="9:16">9:16</option>
            <option value="16:9">16:9</option>
          </select>
        </div>
      </div>
      {error ? <p className="text-sm text-red-500">{error}</p> : null}
      <PrimaryCta onClick={handleGenerate} disabled={loading || !prompt.trim()}>
        {loading ? "Generating..." : "Generate"}
      </PrimaryCta>
    </div>
  );
}
