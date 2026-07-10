import { NextRequest, NextResponse } from "next/server";
import { getAccountBalance } from "@ultimate-multimodal/muapi-client";
import type { AppSettings } from "@ultimate-multimodal/shared";
import { getSettings, saveSettings } from "@/lib/storage";

export async function GET() {
  const settings = await getSettings();
  const apiKey = settings.muapiApiKey ?? process.env.MUAPI_API_KEY;
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
  try {
    const body = (await req.json()) as AppSettings & { muapiApiKey?: string };
    const current = await getSettings();

    const updated: AppSettings = {
      defaultImageModel: body.defaultImageModel ?? current.defaultImageModel,
      defaultVideoModel: body.defaultVideoModel ?? current.defaultVideoModel,
      outputDirectory: body.outputDirectory ?? current.outputDirectory,
      muapiApiKey:
        body.muapiApiKey && body.muapiApiKey !== "••••••••"
          ? body.muapiApiKey
          : current.muapiApiKey,
    };

    await saveSettings(updated);

    if (updated.muapiApiKey) {
      process.env.MUAPI_API_KEY = updated.muapiApiKey;
    }

    const balance = updated.muapiApiKey
      ? await getAccountBalance(updated.muapiApiKey)
      : null;

    return NextResponse.json({ ok: true, balance });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Save failed" },
      { status: 500 }
    );
  }
}
