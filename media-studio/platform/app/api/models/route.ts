import { NextRequest, NextResponse } from "next/server";
import { createMuapiClient } from "@ultimate-multimodal/muapi-client";
import { getSettings } from "@/lib/storage";

function resolveKey(settingsKey?: string) {
  return settingsKey ?? process.env.MUAPI_API_KEY ?? "";
}

export async function GET(req: NextRequest) {
  try {
    const settings = await getSettings();
    const apiKey = resolveKey(settings.muapiApiKey);
    const category = req.nextUrl.searchParams.get("category") ?? undefined;

    const client = createMuapiClient({ apiKey: apiKey || undefined });
    const models = client.listModels(category);

    return NextResponse.json({
      count: models.length,
      models: models.map((m) => ({
        name: m.name,
        category: m.category,
        endpoint: m.endpoint,
        description: m.description,
        required: m.required,
        properties: Object.keys(m.properties),
      })),
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to list models" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { model, params } = body as { model: string; params?: Record<string, unknown> };
    if (!model) {
      return NextResponse.json({ error: "model is required" }, { status: 400 });
    }

    const client = createMuapiClient();
    const info = client.getModel(model);
    const validation = client.validate(model, params ?? {});

    return NextResponse.json({ model: info, validation });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Validation failed" },
      { status: 400 }
    );
  }
}
