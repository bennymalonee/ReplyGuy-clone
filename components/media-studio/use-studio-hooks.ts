"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import type { AppSettings } from "@ultimate-multimodal/shared";

const FALLBACK_IMAGE_MODELS = [
  { id: "flux-dev", label: "Flux Dev" },
  { id: "gpt-image-2-text-to-image", label: "GPT Image 2" },
  { id: "nano-banana-pro-edit", label: "Nano Banana Pro Edit" },
];

const FALLBACK_VIDEO_MODELS = [
  { id: "kling-v3.0-pro", label: "Kling v3 Pro" },
  { id: "veo3.1-image-to-video", label: "Veo 3.1" },
  { id: "seedance-2-vip-image-to-video", label: "Seedance 2 VIP" },
];

export function useStudioCampaign() {
  const searchParams = useSearchParams();
  const campaignId = searchParams.get("campaignId") ?? searchParams.get("id");

  return {
    campaignId: campaignId ?? undefined,
    withCampaignQuery: (href: string) => {
      if (!campaignId) return href;
      const separator = href.includes("?") ? "&" : "?";
      return `${href}${separator}campaignId=${campaignId}`;
    },
  };
}

export function useStudioSettings() {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/media-studio/settings")
      .then((response) => response.json())
      .then((data) => {
        if (data.settings) setSettings(data.settings);
        if (data.balance !== undefined) setBalance(data.balance);
      })
      .catch(() => undefined)
      .finally(() => setLoading(false));
  }, []);

  const imageModels = settings?.defaultImageModel
    ? [
        {
          id: settings.defaultImageModel,
          label: settings.defaultImageModel,
        },
        ...FALLBACK_IMAGE_MODELS.filter(
          (model) => model.id !== settings.defaultImageModel
        ),
      ]
    : FALLBACK_IMAGE_MODELS;

  const videoModels = settings?.defaultVideoModel
    ? [
        {
          id: settings.defaultVideoModel,
          label: settings.defaultVideoModel,
        },
        ...FALLBACK_VIDEO_MODELS.filter(
          (model) => model.id !== settings.defaultVideoModel
        ),
      ]
    : FALLBACK_VIDEO_MODELS;

  return {
    settings,
    balance,
    loading,
    imageModels,
    videoModels,
    defaultImageModel: settings?.defaultImageModel ?? FALLBACK_IMAGE_MODELS[0].id,
    defaultVideoModel: settings?.defaultVideoModel ?? FALLBACK_VIDEO_MODELS[0].id,
  };
}
