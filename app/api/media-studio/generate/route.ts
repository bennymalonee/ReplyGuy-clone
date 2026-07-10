import { NextRequest, NextResponse } from "next/server";
import { executeGenerate } from "@ultimate-multimodal/muapi-client";
import type { GenerateAction } from "@ultimate-multimodal/shared";

import { requireMediaStudioUser } from "@/lib/media-studio-auth";
import {
  getMediaStudioApiKey,
  saveMediaStudioJob,
} from "@/lib/media-studio-storage";

export async function POST(req: NextRequest) {
  const auth = await requireMediaStudioUser();
  if (auth.response) return auth.response;

  try {
    const apiKey = await getMediaStudioApiKey(auth.user.id);

    if (!apiKey) {
      return NextResponse.json(
        { error: "MuAPI key is not configured. Add it in Media Studio → Settings." },
        { status: 400 }
      );
    }

    const action = (await req.json()) as GenerateAction;
    const handle = await executeGenerate(action, apiKey);
    const now = new Date().toISOString();

    await saveMediaStudioJob(auth.user.id, {
      id: handle.requestId,
      type: action.type,
      model:
        "params" in action && action.params && "model" in action.params
          ? String(action.params.model)
          : "unknown",
      status: handle.status,
      outputs: [],
      createdAt: now,
      updatedAt: now,
    });

    return NextResponse.json({ requestId: handle.requestId, status: handle.status });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Generation failed" },
      { status: 500 }
    );
  }
}
