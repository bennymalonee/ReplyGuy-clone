import { NextRequest, NextResponse } from "next/server";
import { getAccountBalance } from "@ultimate-multimodal/muapi-client";
import type { AppSettings } from "@ultimate-multimodal/shared";

import { requireMediaStudioUser } from "@/lib/media-studio-auth";
import {
  getMediaStudioApiKey,
  getMediaStudioSettings,
  saveMediaStudioSettings,
} from "@/lib/media-studio-storage";

export async function GET() {
  const auth = await requireMediaStudioUser();
  if (auth.response) return auth.response;

  const settings = await getMediaStudioSettings(auth.user.id);
  const apiKey = await getMediaStudioApiKey(auth.user.id);
  let balance: number | null = null;

  if (apiKey) {
    balance = await getAccountBalance(apiKey);
  }

  return NextResponse.json({
    settings: {
      ...settings,
      muapiApiKey: settings.muapiApiKey ? "••••••••" : undefined,
    },
    balance,
  });
}

export async function POST(req: NextRequest) {
  const auth = await requireMediaStudioUser();
  if (auth.response) return auth.response;

  try {
    const body = (await req.json()) as AppSettings & { muapiApiKey?: string };
    const current = await getMediaStudioSettings(auth.user.id);
    const updated: AppSettings = {
      defaultImageModel: body.defaultImageModel ?? current.defaultImageModel,
      defaultVideoModel: body.defaultVideoModel ?? current.defaultVideoModel,
      outputDirectory: body.outputDirectory ?? current.outputDirectory,
      muapiApiKey:
        body.muapiApiKey && body.muapiApiKey !== "••••••••"
          ? body.muapiApiKey
          : current.muapiApiKey,
    };

    await saveMediaStudioSettings(auth.user.id, updated);

    const balance = updated.muapiApiKey
      ? await getAccountBalance(updated.muapiApiKey)
      : null;

    return NextResponse.json({ ok: true, balance });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Save failed" },
      { status: 500 }
    );
  }
}
