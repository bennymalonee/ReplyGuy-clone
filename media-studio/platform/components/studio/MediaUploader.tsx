"use client";

import { useCallback, useState } from "react";
import { PrimaryCTA } from "./PrimaryCTA";

interface MediaUploaderProps {
  label: string;
  onUploaded: (url: string) => void;
  accept?: string;
}

export function MediaUploader({
  label,
  onUploaded,
  accept = "image/*",
}: MediaUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback(
    async (file: File) => {
      setUploading(true);
      setError(null);
      setPreview(URL.createObjectURL(file));

      try {
        const form = new FormData();
        form.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: form });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Upload failed");
        onUploaded(data.url);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Upload failed");
      } finally {
        setUploading(false);
      }
    },
    [onUploaded]
  );

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-[var(--color-deep-ink)]">
        {label}
      </label>
      <div
        className="flex min-h-[160px] cursor-pointer flex-col items-center justify-center rounded border border-dashed border-[var(--color-fog-border)] bg-[var(--color-pure-white)] p-6"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const file = e.dataTransfer.files[0];
          if (file) handleFile(file);
        }}
      >
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="Preview" className="max-h-32 object-contain" />
        ) : (
          <p className="text-sm text-[var(--color-ash-mid)]">
            Drag & drop or click to upload
          </p>
        )}
        <input
          type="file"
          accept={accept}
          className="mt-3 text-sm"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
      </div>
      {uploading && (
        <p className="text-sm text-[var(--color-ash-mid)]">Uploading...</p>
      )}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
