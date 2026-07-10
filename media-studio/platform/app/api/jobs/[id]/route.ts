import { NextRequest, NextResponse } from "next/server";
import { predictStatus } from "@ultimate-multimodal/muapi-client";
import { getSettings, saveJob } from "@/lib/storage";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const settings = await getSettings();
    const apiKey = settings.muapiApiKey ?? process.env.MUAPI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "API key not configured" }, { status: 400 });
    }

    const result = await predictStatus(id, apiKey);

    await saveJob({
      id,
      type: "poll",
      model: "—",
      status: result.status,
      outputs: result.outputs,
      error: result.error,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Poll failed" },
      { status: 500 }
    );
  }
}
