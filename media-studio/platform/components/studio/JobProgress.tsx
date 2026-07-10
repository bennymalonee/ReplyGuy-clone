"use client";

import { useEffect, useState } from "react";

interface JobProgressProps {
  requestId: string | null;
  onComplete?: (outputs: string[]) => void;
}

export function JobProgress({ requestId, onComplete }: JobProgressProps) {
  const [status, setStatus] = useState<string>("idle");
  const [outputs, setOutputs] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!requestId) return;

    let cancelled = false;
    setStatus("pending");
    setError(null);
    setOutputs([]);

    const poll = async () => {
      while (!cancelled) {
        try {
          const res = await fetch(`/api/jobs/${requestId}`);
          const data = await res.json();
          if (!res.ok) throw new Error(data.error ?? "Poll failed");

          setStatus(data.status);
          if (data.outputs?.length) setOutputs(data.outputs);

          if (data.status === "completed") {
            onComplete?.(data.outputs ?? []);
            return;
          }
          if (data.status === "failed") {
            setError(data.error ?? "Generation failed");
            return;
          }
        } catch (e) {
          if (!cancelled) setError(e instanceof Error ? e.message : "Poll error");
          return;
        }
        await new Promise((r) => setTimeout(r, 3000));
      }
    };

    poll();
    return () => {
      cancelled = true;
    };
  }, [requestId, onComplete]);

  if (!requestId) return null;

  return (
    <div className="rounded-lg bg-[var(--color-charcoal-surface)] p-6 text-[var(--color-pure-white)]">
      <p className="text-xs font-medium uppercase tracking-widest text-[var(--color-ash-mid)]">
        Generation Status
      </p>
      <p className="mt-2 text-2xl font-bold capitalize">{status}</p>
      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
      {outputs.length > 0 && (
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {outputs.map((url, i) => (
            <div key={i} className="overflow-hidden rounded">
              {url.match(/\.(mp4|webm|mov)/i) ? (
                <video src={url} controls className="w-full" />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={url} alt={`Output ${i + 1}`} className="w-full" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
