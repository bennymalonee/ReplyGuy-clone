"use client";

import { useEffect, useState } from "react";

interface JobProgressProps {
  requestId: string | null;
  onComplete?: (outputs: string[]) => void;
}

export function JobProgress({ requestId, onComplete }: JobProgressProps) {
  const [status, setStatus] = useState("idle");
  const [outputs, setOutputs] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!requestId) return;

    let cancelled = false;
    setStatus("pending");
    setOutputs([]);
    setError(null);

    async function poll() {
      while (!cancelled) {
        try {
          const response = await fetch(`/api/media-studio/jobs/${requestId}`);
          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error ?? "Polling failed");
          }

          setStatus(data.status);
          if (Array.isArray(data.outputs) && data.outputs.length > 0) {
            setOutputs(data.outputs);
          }

          if (data.status === "completed") {
            onComplete?.(data.outputs ?? []);
            return;
          }

          if (data.status === "failed") {
            setError(data.error ?? "Generation failed");
            return;
          }
        } catch (err) {
          if (!cancelled) {
            setError(err instanceof Error ? err.message : "Polling failed");
          }
          return;
        }

        await new Promise((resolve) => setTimeout(resolve, 3000));
      }
    }

    poll();
    return () => {
      cancelled = true;
    };
  }, [onComplete, requestId]);

  if (!requestId) return null;

  return (
    <div className="rounded-xl border border-white/10 bg-zinc-950 p-6 text-white">
      <p className="text-xs uppercase tracking-[0.2em] text-white/50">Generation status</p>
      <p className="mt-2 text-2xl font-semibold capitalize">{status}</p>
      {error ? <p className="mt-2 text-sm text-red-400">{error}</p> : null}
      {outputs.length > 0 ? (
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {outputs.map((url, index) => (
            <div key={url + index} className="overflow-hidden rounded-md border border-white/10">
              {/\.(mp4|webm|mov)$/i.test(url) ? (
                <video src={url} controls className="w-full" />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={url} alt={`Output ${index + 1}`} className="w-full object-cover" />
              )}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
