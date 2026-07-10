import { NextRequest, NextResponse } from "next/server";
import { predictStatus } from "@ultimate-multimodal/muapi-client";

import { requireMediaStudioUser } from "@/lib/media-studio-auth";
import {
  getMediaStudioApiKey,
  saveMediaStudioJob,
} from "@/lib/media-studio-storage";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireMediaStudioUser();
  if (auth.response) return auth.response;

  try {
    const { id } = await params;
    const apiKey = await getMediaStudioApiKey(auth.user.id);

    if (!apiKey) {
      return NextResponse.json({ error: "API key not configured" }, { status: 400 });
    }

    const result = await predictStatus(id, apiKey);
    const now = new Date().toISOString();

    await saveMediaStudioJob(auth.user.id, {
      id,
      type: "poll",
      model: "unknown",
      status: result.status,
      outputs: result.outputs,
      error: result.error,
      createdAt: now,
      updatedAt: now,
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Poll failed" },
      { status: 500 }
    );
  }
}
