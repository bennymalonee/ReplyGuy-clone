import { NextRequest, NextResponse } from "next/server";
import type { Project } from "@ultimate-multimodal/shared";

import { requireMediaStudioUser } from "@/lib/media-studio-auth";
import {
  generateMediaStudioId,
  getMediaStudioProjects,
  saveMediaStudioProject,
} from "@/lib/media-studio-storage";

export async function GET(req: NextRequest) {
  const auth = await requireMediaStudioUser();
  if (auth.response) return auth.response;

  const campaignId = req.nextUrl.searchParams.get("campaignId") ?? undefined;
  const projects = await getMediaStudioProjects(auth.user.id, campaignId);

  return NextResponse.json({ projects });
}

export async function POST(req: NextRequest) {
  const auth = await requireMediaStudioUser();
  if (auth.response) return auth.response;

  try {
    const body = await req.json();
    const now = new Date().toISOString();
    const project: Project = {
      id: generateMediaStudioId(),
      name: body.name ?? "Untitled Project",
      workflow: body.workflow ?? "unknown",
      campaignId: body.campaignId,
      inputs: body.inputs ?? {},
      outputs: body.outputs ?? [],
      createdAt: now,
      updatedAt: now,
    };

    await saveMediaStudioProject(auth.user.id, project);
    return NextResponse.json({ project });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Save failed" },
      { status: 500 }
    );
  }
}
