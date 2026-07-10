import { NextRequest, NextResponse } from "next/server";
import { executeGenerate, uploadFile } from "@ultimate-multimodal/muapi-client";
import type { GenerateAction } from "@ultimate-multimodal/shared";
import { getSettings, saveJob } from "@/lib/storage";

function resolveApiKey(settingsKey?: string): string {
  return settingsKey ?? process.env.MUAPI_API_KEY ?? "";
}

export async function POST(req: NextRequest) {
  try {
    const settings = await getSettings();
    const apiKey = resolveApiKey(settings.muapiApiKey);
    if (!apiKey) {
      return NextResponse.json(
        { error: "MUAPI_API_KEY not configured. Add it in Dashboard → Settings." },
        { status: 400 }
      );
    }

    const body = await req.json();
    const action = body as GenerateAction;

    const handle = await executeGenerate(action, apiKey);

    await saveJob({
      id: handle.requestId,
      type: action.type,
      model:
        "params" in action && action.params && "model" in action.params
          ? String(action.params.model)
          : "unknown",
      status: handle.status,
      outputs: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ requestId: handle.requestId, status: handle.status });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Generation failed" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const settings = await getSettings();
    const apiKey = resolveApiKey(settings.muapiApiKey);
    if (!apiKey) {
      return NextResponse.json({ error: "API key not configured" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const url = await uploadFile(buffer, file.name, file.type, apiKey);
    return NextResponse.json({ url });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Upload failed" },
      { status: 500 }
    );
  }
}
