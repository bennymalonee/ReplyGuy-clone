"use client";

import { useState } from "react";
import { PrimaryCTA } from "./PrimaryCTA";

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
  const [aspectRatio, setAspectRatio] = useState(type === "video_generate" ? "9:16" : "1:1");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ type, params: { prompt, model, aspectRatio } }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Generation failed");
      onGenerated(data.requestId);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Generation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <textarea
        className="studio-input min-h-[120px]"
        placeholder="Describe what you want to create..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">Model</label>
          <select
            className="studio-input"
            value={model}
            onChange={(e) => setModel(e.target.value)}
          >
            {models.map((m) => (
              <option key={m.id} value={m.id}>
                {m.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Aspect Ratio</label>
          <select
            className="studio-input"
            value={aspectRatio}
            onChange={(e) => setAspectRatio(e.target.value)}
          >
            <option value="1:1">1:1</option>
            <option value="4:5">4:5</option>
            <option value="9:16">9:16</option>
            <option value="16:9">16:9</option>
          </select>
        </div>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <PrimaryCTA onClick={handleGenerate} disabled={loading || !prompt.trim()}>
        {loading ? "Generating..." : "Generate"}
      </PrimaryCTA>
    </div>
  );
}
