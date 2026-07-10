import { NextRequest, NextResponse } from "next/server";
import { uploadFile } from "@ultimate-multimodal/muapi-client";

import { requireMediaStudioUser } from "@/lib/media-studio-auth";
import { getMediaStudioApiKey } from "@/lib/media-studio-storage";

export async function POST(req: NextRequest) {
  const auth = await requireMediaStudioUser();
  if (auth.response) return auth.response;

  try {
    const apiKey = await getMediaStudioApiKey(auth.user.id);

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
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed" },
      { status: 500 }
    );
  }
}
