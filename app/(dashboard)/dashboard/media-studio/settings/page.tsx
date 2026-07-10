"use client";

import { useEffect, useState } from "react";
import type { AppSettings } from "@ultimate-multimodal/shared";

import { PrimaryCta } from "@/components/media-studio/primary-cta";
import { StudioShell } from "@/components/media-studio/studio-shell";

export default function MediaStudioSettingsPage() {
  const [settings, setSettings] = useState<AppSettings>({
    defaultImageModel: "flux-dev",
    defaultVideoModel: "kling-v3.0-pro",
    outputDirectory: "media_outputs",
  });
  const [apiKey, setApiKey] = useState("");
  const [balance, setBalance] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/media-studio/settings")
      .then((response) => response.json())
      .then((data) => {
        if (data.settings) setSettings(data.settings);
        if (data.balance !== undefined) setBalance(data.balance);
      })
      .catch(() => undefined);
  }, []);

  async function handleSave() {
    setLoading(true);
    setSaved(false);

    try {
      const response = await fetch("/api/media-studio/settings", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...settings,
          muapiApiKey: apiKey || settings.muapiApiKey,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Save failed");
      setBalance(data.balance ?? null);
      setSaved(true);
      setApiKey("");
    } finally {
      setLoading(false);
    }
  }

  return (
    <StudioShell
      title="Studio settings"
      description="Configure the MuAPI credentials and default models used by the native media routes."
    >
      <div className="max-w-2xl space-y-6 rounded-2xl border border-white/10 bg-zinc-950 p-6">
        <div>
          <label className="mb-2 block text-sm font-medium">MuAPI API key</label>
          <input
            type="password"
            className="studio-input"
            placeholder={settings.muapiApiKey ? "•••••••• configured" : "Enter your API key"}
            value={apiKey}
            onChange={(event) => setApiKey(event.target.value)}
          />
        </div>
        {balance !== null ? (
          <div className="rounded-xl border border-emerald-300/20 bg-emerald-300/10 p-4">
            <p className="text-sm text-emerald-200">Credit balance</p>
            <p className="mt-1 text-2xl font-semibold">{balance}</p>
          </div>
        ) : null}
        <div>
          <label className="mb-2 block text-sm font-medium">Default image model</label>
          <input
            className="studio-input"
            value={settings.defaultImageModel}
            onChange={(event) =>
              setSettings({ ...settings, defaultImageModel: event.target.value })
            }
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium">Default video model</label>
          <input
            className="studio-input"
            value={settings.defaultVideoModel}
            onChange={(event) =>
              setSettings({ ...settings, defaultVideoModel: event.target.value })
            }
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium">Output directory</label>
          <input
            className="studio-input"
            value={settings.outputDirectory}
            onChange={(event) =>
              setSettings({ ...settings, outputDirectory: event.target.value })
            }
          />
        </div>
        <PrimaryCta onClick={handleSave} disabled={loading}>
          {loading ? "Saving..." : "Save settings"}
        </PrimaryCta>
        {saved ? <p className="text-sm text-emerald-300">Settings saved.</p> : null}
      </div>
    </StudioShell>
  );
}
