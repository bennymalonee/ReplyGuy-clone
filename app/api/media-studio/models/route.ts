import { NextRequest, NextResponse } from "next/server";
import { createMuapiClient } from "@ultimate-multimodal/muapi-client";

import { requireMediaStudioUser } from "@/lib/media-studio-auth";
import { getMediaStudioApiKey } from "@/lib/media-studio-storage";

export async function GET(req: NextRequest) {
  const auth = await requireMediaStudioUser();
  if (auth.response) return auth.response;

  try {
    const apiKey = await getMediaStudioApiKey(auth.user.id);
    const category = req.nextUrl.searchParams.get("category") ?? undefined;
    const client = createMuapiClient({ apiKey: apiKey || undefined });
    const models = client.listModels(category);

    return NextResponse.json({
      count: models.length,
      models: models.map((model) => ({
        name: model.name,
        category: model.category,
        endpoint: model.endpoint,
        description: model.description,
        required: model.required,
        properties: Object.keys(model.properties),
      })),
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to list models" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireMediaStudioUser();
  if (auth.response) return auth.response;

  try {
    const { model, params } = (await req.json()) as {
      model: string;
      params?: Record<string, unknown>;
    };

    if (!model) {
      return NextResponse.json({ error: "model is required" }, { status: 400 });
    }

    const apiKey = await getMediaStudioApiKey(auth.user.id);
    const client = createMuapiClient({ apiKey: apiKey || undefined });

    return NextResponse.json({
      model: client.getModel(model),
      validation: client.validate(model, params ?? {}),
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Validation failed" },
      { status: 400 }
    );
  }
}
