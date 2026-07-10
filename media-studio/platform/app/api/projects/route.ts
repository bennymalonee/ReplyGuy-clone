import { NextRequest, NextResponse } from "next/server";
import type { Project } from "@ultimate-multimodal/shared";
import { generateId, getProjects, saveProject } from "@/lib/storage";

export async function GET() {
  const projects = await getProjects();
  return NextResponse.json({ projects });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const project: Project = {
      id: generateId(),
      name: body.name ?? "Untitled Project",
      workflow: body.workflow ?? "unknown",
      inputs: body.inputs ?? {},
      outputs: body.outputs ?? [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await saveProject(project);
    return NextResponse.json({ project });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Save failed" },
      { status: 500 }
    );
  }
}
