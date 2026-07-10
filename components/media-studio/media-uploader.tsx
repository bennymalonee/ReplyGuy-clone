"use client";

import { useCallback, useState } from "react";

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

        const response = await fetch("/api/media-studio/upload", {
          method: "POST",
          body: form,
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error ?? "Upload failed");
        }

        onUploaded(data.url);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed");
      } finally {
        setUploading(false);
      }
    },
    [onUploaded]
  );

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium">{label}</label>
      <div
        className="rounded-md border border-dashed border-white/20 bg-white/5 p-6"
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          const file = event.dataTransfer.files[0];
          if (file) handleFile(file);
        }}
      >
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="Preview" className="max-h-40 rounded-md object-contain" />
        ) : (
          <p className="text-sm text-white/60">Drag and drop or select a file to upload.</p>
        )}
        <input
          type="file"
          accept={accept}
          className="mt-4 block text-sm"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
      </div>
      {uploading ? <p className="text-sm text-white/60">Uploading...</p> : null}
      {error ? <p className="text-sm text-red-400">{error}</p> : null}
    </div>
  );
}
