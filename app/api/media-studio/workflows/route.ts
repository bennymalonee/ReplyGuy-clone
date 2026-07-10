import { NextResponse } from "next/server";
import { loadAllSkills } from "@ultimate-multimodal/workflow-engine/server";

import { requireMediaStudioUser } from "@/lib/media-studio-auth";

export async function GET() {
  const auth = await requireMediaStudioUser();
  if (auth.response) return auth.response;

  const skills = await loadAllSkills();
  return NextResponse.json({ skills });
}
