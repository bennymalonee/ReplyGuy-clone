import { NextRequest, NextResponse } from "next/server";
import { uploadFile } from "@ultimate-multimodal/muapi-client";
import { getSettings } from "@/lib/storage";

export async function POST(req: NextRequest) {
  try {
    const settings = await getSettings();
    const apiKey = settings.muapiApiKey ?? process.env.MUAPI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "API key not configured" }, { status: 400 });
    }

    const form = await req.formData();
    const file = form.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
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
