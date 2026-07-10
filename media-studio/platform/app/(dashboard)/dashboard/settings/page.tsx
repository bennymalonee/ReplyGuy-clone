"use client";

import { useEffect, useState } from "react";
import { PillButton } from "@/components/dashboard/PillButton";
import type { AppSettings } from "@ultimate-multimodal/shared";

export default function DashboardSettingsPage() {
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
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data.settings) setSettings(data.settings);
        if (data.balance !== undefined) setBalance(data.balance);
      })
      .catch(() => {});
  }, []);

  const handleSave = async () => {
    setLoading(true);
    setSaved(false);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...settings,
          muapiApiKey: apiKey || settings.muapiApiKey,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setBalance(data.balance ?? null);
      setSaved(true);
      setApiKey("");
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="dashboard-headline">API <em>settings</em></h1>
      <p className="mt-4 text-[var(--color-stone)]">
        Configure your MuAPI key and default models.
      </p>

      <div className="dashboard-card mt-8 max-w-xl space-y-6">
        <div>
          <label className="mb-2 block text-sm font-medium">MuAPI API Key</label>
          <input
            type="password"
            className="dashboard-input"
            placeholder={settings.muapiApiKey ? "•••••••• (configured)" : "Enter your API key"}
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
          <p className="mt-1 text-xs text-[var(--color-stone)]">
            Get your key at muapi.ai/dashboard
          </p>
        </div>

        {balance !== null && (
          <div className="rounded-2xl bg-[var(--color-lavender-mist)] p-4">
            <p className="text-sm font-medium">Credit balance</p>
            <p className="text-2xl font-bold text-[var(--color-ink-navy)]">{balance}</p>
          </div>
        )}

        <div>
          <label className="mb-2 block text-sm font-medium">Default image model</label>
          <input
            className="dashboard-input"
            value={settings.defaultImageModel}
            onChange={(e) =>
              setSettings({ ...settings, defaultImageModel: e.target.value })
            }
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Default video model</label>
          <input
            className="dashboard-input"
            value={settings.defaultVideoModel}
            onChange={(e) =>
              setSettings({ ...settings, defaultVideoModel: e.target.value })
            }
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Output directory</label>
          <input
            className="dashboard-input"
            value={settings.outputDirectory}
            onChange={(e) =>
              setSettings({ ...settings, outputDirectory: e.target.value })
            }
          />
        </div>

        <PillButton onClick={handleSave} disabled={loading}>
          {loading ? "Saving..." : "Save settings"}
        </PillButton>

        {saved && (
          <p className="text-sm text-green-600">Settings saved successfully.</p>
        )}
      </div>
    </div>
  );
}
